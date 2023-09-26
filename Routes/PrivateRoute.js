const express = require("express");
const PrivateRouter = express.Router();
const User = require("../Model/userModel");
const authentication = require("../Middleware/authentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//get all PrivateVehicles
// PrivateRouter.get(
//   "/api/getvehicle/:token",
//   authentication,
//   async (req, res) => {
//     try {
//       const id = req.id;

//       const vehicles = await User.find({ profileType: "Private" });

//       if (!vehicles || vehicles.length === 0) {
//         return res.status(404).json({ error: "No private vehicles found" });
//       }

//       // Assuming you want to return data for all found vehicles
//       const vehicleData = vehicles.map((vehicle) => ({
//         id: vehicle.id,
//         name: vehicle.name,
//         email: vehicle.email,
//         licenceNo: vehicle.licenceNo,
//         phoneNo: vehicle.phoneNo,
//         dob: vehicle.dob,
//         profileType: vehicle.profileType,
//         vehicleNo: vehicle.privateVehicle.vehicleNo,
//         status: vehicle.privateVehicle.status,
//         vehicletype: vehicle.privateVehicle.vehicletype,
//         currentLocation: vehicle.privateVehicle.currentLocation,
//       }));

//       return res.status(200).json(vehicleData);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ msg: "Internal server error" });
//     }
//   }
// );

//get all private vehicles

PrivateRouter.get(
  "/api/getvehicle/:token",
  authentication,
  async (req, res) => {
    try {
      const id = req.id;
      const v = await User.findOne({ _id: id, profileType: "Private" });

      if (v) {
        const vehicleData = {
          id: v.id,
          name: v.name,
          email: v.email,
          licenceNo: v.licenceNo,
          phoneNo: v.phoneNo,
          dob: v.dob,
          profileType: v.profileType,
          vehicleNo: v.privateVehicle.vehicleNo,
          status: v.privateVehicle.status,
          vehicletype: v.privateVehicle.vehicletype,
          currentLocation: v.privateVehicle.currentLocation,
        };

        return res.status(200).json([vehicleData]);
      }

      const vehicles = await User.find({ profileType: "Private" });

      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({ error: "No private vehicles found" });
      }

      // Assuming you want to return data for all found vehicles
      const vehicleData = vehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        email: vehicle.email,
        licenceNo: vehicle.licenceNo,
        phoneNo: vehicle.phoneNo,
        dob: vehicle.dob,
        profileType: vehicle.profileType,
        vehicleNo: vehicle.privateVehicle.vehicleNo,
        status: vehicle.privateVehicle.status,
        vehicletype: vehicle.privateVehicle.vehicletype,
        currentLocation: vehicle.privateVehicle.currentLocation,
      }));

      return res.status(200).json(vehicleData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

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

PrivateRouter.put(
  "/api/update/live/location/:token/:id",
  authentication,
  async (req, res) => {
    const { status, currentLocation, vehicleNo } = req.body;
    const { id } = req.params;

    try {
      const vehicle = await User.findById(id);

      if (!vehicle) {
        return res.status(404).json({ msg: "Vehicle not found" });
      }

      // Update the vehicle's live location and status
      vehicle.privateVehicle.status = status;
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
      res.status(200).json(live_vehicles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

//currentLocation vtype vno
//update current Location by private vehicle driver
PrivateRouter.put("/api/update/location/:token/:id",authentication, async (req, res) => {
  const id = req.params.id;
  const { vehicletype, currentLocation, vehicleNo } = req.body;

  try {
    
    const updatedVehicle = await User.findByIdAndUpdate(
      id,
      {
        "privateVehicle.vehicletype": vehicletype,
        "privateVehicle.currentLocation": currentLocation,
        "privateVehicle.vehicleNo": vehicleNo,
      },
      { new: true } 
    );

    if (!updatedVehicle) {
      
      return res.status(404).json({ msg: "vehicle not found" });
    }
  return res.status(200).json({"msg":"location updated",updatedVehicle});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = PrivateRouter;
