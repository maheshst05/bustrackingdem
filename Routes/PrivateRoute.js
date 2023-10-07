const express = require("express");
const PrivateRouter = express.Router();
const User = require("../Model/userModel");
const authentication = require("../Middleware/authentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



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
      address
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
      address
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle registration errors
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});
// const bcrypt = require('bcrypt'); // Import the bcrypt library

PrivateRouter.put(
  "/api/updatevehicle/:token/:id",
  authentication,
  async (req, res) => {
    try {
      const { id } = req.params;
      if (req.body.password) {
        // Hash the new password
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const user = await User.findByIdAndUpdate({ _id: id }, req.body);

      if (!user) {
        return res.status(404).json({ error: "Private vehicle not found" });
      }

      return res
        .status(200)
        .json({ message: "Private vehicle updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

//delete vehicle
PrivateRouter.delete(
  "/api/deletevehicle/:token/:id",
  authentication,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find the user with the given ID and ensure it has the profileType "P_Vehicle"
      const user = await User.findByIdAndDelete({
        _id: id,
        profileType: "Private",
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
  }
);

//get a privatevehicle Live Location
PrivateRouter.get("/get/live/location/:token/:id", async (req, res) => {
  try {
    const vehicle = await User.findById(req.params.id);
    return res.status(200).send({
      driverName: vehicle.name,
      vehicleNo: vehicle.privateVehicle.vehicleNo,
      status: vehicle.privateVehicle.status,
      vehicletype: vehicle.privateVehicle.vehicletype,
      currentLocation: vehicle.privateVehicle.currentLocation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//update private vehicle currentlocation
PrivateRouter.put(
  "/api/update/live/location/:token/:id",
  authentication,
  async (req, res) => {
    const { currentLocation, vehicleNo } = req.body;
    const { id } = req.params;
    try {
      const vehicle = await User.findById(id);

      if (!vehicle) {
        return res.status(404).json({ msg: "Vehicle not found" });
      }

      // Update the vehicle's live location and status

      vehicle.privateVehicle.currentLocation = currentLocation;
      vehicle.privateVehicle.vehicleNo = vehicleNo;
      // Save the updated vehicle information
      await vehicle.save();

      return res
        .status(200)
        .json({ msg: "Live location updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

//get all live private vehicles (only live vehicles)
PrivateRouter.get(
  "/api/live_vehicles/:token",
  authentication,
  async (req, res) => {
    try {
      const live_vehicles = await User.find({
        "privateVehicle.status": "START",
      });
     // const live_vehicles = await User.find({profileType:"Private"});
      
      res.status(200).json(live_vehicles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

//update current Location by private vehicle driver (start or stop)
PrivateRouter.put("/api/update/location/:token/:id", async (req, res) => {
  const id = req.params.id;
  const { vehicletype, currentLocation, vehicleNo, status } = req.body;

  try {
    const updatedVehicle = await User.findByIdAndUpdate(
      id,
      {
        "privateVehicle.vehicletype": vehicletype,
        "privateVehicle.currentLocation": currentLocation,
        "privateVehicle.vehicleNo": vehicleNo,
        "privateVehicle.status": status,
      },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ msg: "vehicle not found" });
    }
    return res.status(200).json({ msg: "location updated", updatedVehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//search private and get all
PrivateRouter.get(
  "/api/getvehicle/:token",
  authentication,
  async (req, res) => {
    try {
      const { search } = req.query;

      // Find private vehicles based on search criteria if provided
      if (search) {
        const vehicles = await User.find({
          profileType: "Private",
          "privateVehicle.vehicletype": { $regex: search, $options: "i" },
        });

        if (vehicles.length === 0) {
          return res.status(404).json({ error: "No results found" });
        }

        const vehicleData = vehicles.map(mapUserToVehicleData);
        return res.status(200).json(vehicleData);
      }

      const id = req.id;

      // Find a specific private vehicle by ID
      if (id) {
        const vehicle = await User.findOne({ _id: id, profileType: "Private" });

        if (vehicle) {
          const vehicleData = mapUserToVehicleData(vehicle);
          return res.status(200).json([vehicleData]);
        }
      }

      // If no search criteria or ID provided, return all private vehicles
      const vehicles = await User.find({ profileType: "Private" });

      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ error: "No private vehicles found" });
      }

      const vehicleData = vehicles.map(mapUserToVehicleData);
      return res.status(200).json(vehicleData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// Helper function to map User data to vehicleData format
function mapUserToVehicleData(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    licenceNo: user.licenceNo,
    phoneNo: user.phoneNo,
    dob: user.dob,
    profileType: user.profileType,
    vehicleNo: user.privateVehicle.vehicleNo,
    status: user.privateVehicle.status,
    vehicletype: user.privateVehicle.vehicletype,
    currentLocation: user.privateVehicle.currentLocation,
  };
}

module.exports = PrivateRouter;
