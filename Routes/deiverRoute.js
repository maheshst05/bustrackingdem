const express = require("express");
const driverRouter = express.Router();
const bcrypt = require("bcrypt");
const authentication = require("../Middleware/authentication");
const jwt = require("jsonwebtoken");

const BusRoute = require("../Model/busRoute");


//update bus status by driver...
driverRouter.put(
  "/api/update/bus/:token/:id",
  authentication,
  async (req, res) => {
    const id = req.id;
    const busId = req.params.id;
    const { status, busName, route, sourceRoute, destinationRoute, stops, heading } =
      req.body;
    try {
      
        const updateFields = {};
        if (status) {
          updateFields.status = status;


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

        // Corrected the update query and added 'heading'
        const updatedBus = await BusRoute.findOneAndUpdate(
          { _id: busId },
          { $set: { ...updateFields, heading } }, // Corrected this line
          { new: true }
        );

        if (updatedBus) {
          return res
            .status(200)
            .json({ msg: "Updated successfully", bus: updatedBus });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);












//get bus that driver assigned
driverRouter.get(
  "/api/get/assigned/bus/:token",
  authentication,
  async (req, res) => {
    const id = req.id;
    try {
      const buses = await BusRoute.find({ "driver_details._id": id });

      if (!buses || buses.length === 0) {
        return res
          .status(404)
          .json({ error: "No assigned buses found for this driver" });
      }

      const response = buses.map((bus) => ({
        bus_details: {
          busName: bus.bus_details.busName,
          busNo:bus.bus_details.busNo,
        },
        route_details: {
          sourceRoute: bus.route_details.sourceRoute,
          destinationRoute: bus.route_details.destinationRoute,
          routeNo: bus.route_details.routeNo,
          route: bus.route_details.route,
          stops: bus.route_details.stops,
          polyline: bus.route_details.polyline,
          distance: bus.route.distance,
          time: bus.route.time
      },
        driver_details: {
          name: bus.driver_details.name,
          
        },
        currentRouteLocation: bus.currentRouteLocation,
        _id: bus._id,
        time: bus.time,
        status: bus.status,
      }));

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = driverRouter;
