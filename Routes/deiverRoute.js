const express = require("express");
const driverRouter = express.Router();
const bcrypt = require("bcrypt");
const authentication = require("../Middleware/authentication");
const jwt = require("jsonwebtoken");

const BusRoute = require("../Model/busRoute");

driverRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const { status, busName, route, sourceRoute, destinationRoute, stops } =
    req.body;

  try {
    const updateFields = {};
    if (status) {
      updateFields.status = status;
    }

    if (busName) {
      updateFields["bus_details.busName"] = busName;
    }

    if (route) {
      updateFields["route_details.route"] = route;
    }

    if (sourceRoute) {
      updateFields["route_details.sourceRoute"] = sourceRoute;
    }

    if (destinationRoute) {
      updateFields["route_details.destinationRoute"] = destinationRoute;
    }

    if (stops) {
      updateFields["route_details.stops"] = stops;
    }

    const updatedBus = await BusRoute.findOneAndUpdate(
      { _id: busId },
      { $set: updateFields },
      { new: true }
    );

    if (updatedBus) {
      return res
        .status(200)
        .json({ msg: "Updated successfully", bus: updatedBus });
    } else {
      return res.status(404).json({ msg: "Bus not found" });
    }
  } catch (error) {
    console.error("Error updating bus:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//get bus that driver assigned
driverRouter.get("/api/get/assigned/bus/:token", async (req, res) => {
  const id=req.id
  try {
  
  } catch (error) {}
});

module.exports = driverRouter;
