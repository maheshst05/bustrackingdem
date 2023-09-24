const express = require("express");
const PrivateRouter = express.Router();
const User = require("../Model/userModel");
const authentication = require("../Middleware/authentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//get all PrivateVehicles
PrivateRouter.get("/api/getvehicle/:token", authentication, async (req, res) => {
  try {
    // Find all users with profileType "P_Vehicle"
    const vehicles = await User.find({ profileType: "Private" });

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ error: "No private vehicles found" });
    }

    // Assuming you want to return data for all found vehicles
    const vehicleData = vehicles.map((vehicle) => ({
      name: vehicle.name,
      email: vehicle.email,
      licenceNo:vehicle.licenceNo,
      phoneNo:vehicle.phoneNo,
      dob:vehicle.dob,
      profileType: vehicle.profileType,
      vehicleNo: vehicle.privateVehicle.vehicleNo,
      status: vehicle.privateVehicle.status,
      vehicletype: vehicle.privateVehicle.vehicletype,
      currentLocation: vehicle.privateVehicle.currentLocation
    }));

    return res.status(200).json(vehicleData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//post private vehicle
PrivateRouter.post("/api/register/privatevehicle/:token", async (req, res) => {
  try {
    const {
      name,
      dob,
      phoneNo,
      profileType,
      email,
      licenceNo,
      privateVehicle: { vehicleNo, vehicletype, status },
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      dob,
      phoneNo,
      email,
      password: hashedPassword, // Save the hashed password
      licenceNo,
      profileType,
      privateVehicle: {
        vehicleNo,
        status,
        vehicletype,
      },
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" },);
  } catch (error) {
    // Handle registration errors
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

//update vehicle information
PrivateRouter.put("/api/updatevehicle/:token/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicleNo,
      vehicletype,
      status,
      currentLocation: { latitude, longitude, latitudeDelta, longitudeDelta },
    } = req.body;
    const user = await User.findOne({ _id: id, profileType: "P_Vehicle" });

    if (!user) {
      return res.status(404).json({ error: "Private vehicle not found" });
    }

    // Update the private vehicle's information
    user.privateVehicle.vehicleNo = vehicleNo;
    user.privateVehicle.vehicletype = vehicletype;
    user.privateVehicle.status = status;
    user.privateVehicle.currentLocation.latitude = latitude;
    user.privateVehicle.currentLocation.longitude = longitude;
    user.privateVehicle.currentLocation.latitudeDelta = latitudeDelta;
    user.privateVehicle.currentLocation.longitudeDelta = longitudeDelta;

    // Save the updated user to the database
    await user.save();

    return res
      .status(200)
      .json({ message: "Private vehicle updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//delete vehicle
PrivateRouter.delete("/api/deletevehicle/:token/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user with the given ID and ensure it has the profileType "P_Vehicle"
    const user = await User.findByIdAndDelete({
      _id: id,
      profileType: "P_Vehicle",
    });

    if (!user) {
      return res.status(404).json({ error: "Private vehicle not found" });
    }

    return res
      .status(200)
      .json({ message: "Private vehicle deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get a privatevehicle Live Location
PrivateRouter.get("/get/live/location/:token/:id", async (req, res) => {
  try {
    const vehicle = await User.findById(req.params.id);
    return res
      .status(200)
      .send({
        driverName: vehicle.name,
        vehicleNo: vehicle.privateVehicle.vehicleNo,
        status: vehicle.privateVehicle.status,
        vehicletype: vehicle.privateVehicle.vehicletype,
        currentLocation: vehicle.privateVehicle.currentLocation
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = PrivateRouter;
