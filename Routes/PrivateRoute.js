const express = require("express");
const PrivateRouter = express.Router();
const PrivateVehicle = require("../Model/privateVehicle");
const authentication = require("../Middleware/authentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//get all PrivateVehicle
PrivateRouter.get("/api/getvehicle/:token",authentication, async (req, res) => {
  try {
    const privateVehicle = await PrivateVehicle.find();

    return res.status(200).json({ privateVehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//post private vehicle
PrivateRouter.post("/api/register/privateVehicle/:token", async (req, res) => {
  try {
    const Vehicle = new PrivateVehicle(req.body);
    
    await Vehicle.save();
    return res
      .status(200)
      .json({ message: "Vehicle added successfully", Vehicle });
    Ï;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



PrivateRouter.put("/api/update/vehicle/:token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const vehicle = await PrivateVehicle.findOneAndUpdate(
      { _id: id },
      req.body
    );
    return res
      .status(200)
      .json({ message: "Vehicle Updated successfully", vehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//delete vehicle
PrivateRouter.delete("/api/delete/vehicle/:token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const vehicle = await PrivateVehicle.findOneAndDelete({ _id: id });
    return res
      .status(200)
      .json({ message: "Vehicle Delete successfully", vehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update vehicle Live Location
PrivateRouter.get("/get/live/location/:token/:id", async (req, res) => {
  try {
    const vehicle = await PrivateVehicle.findById(req.params.id);
    return res.status(200).json({ vehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = PrivateRouter;
