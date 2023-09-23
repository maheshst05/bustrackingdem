const express = require("express");
const driverRouter = express.Router();
const bcrypt = require("bcrypt");
const authentication = require("../Middleware/authentication");
const jwt = require("jsonwebtoken");

const BusRoute = require("../Model/busRoute");
//update bus (Start stop)

// driverRouter.put("/api/update/bus/:id", async (req, res) => {
//   const busId = req.params.id;
//   const { status, busName, route, sourceRoute, destinationRoute, stops } =
//     req.body;

//   try {
    // const updateFields = {};
    // if (status) {
    //   updateFields.status = status;
    // }

    // if (busName) {
    //   updateFields["bus_details.busName"] = busName;
    // }

    // if (route) {
    //   updateFields["route_details.route"] = route;
    // }

    // if (sourceRoute) {
    //   updateFields["route_details.sourceRoute"] = sourceRoute;
    // }

    // if (destinationRoute) {
    //   updateFields["route_details.destinationRoute"] = destinationRoute;
    // }

    // if (stops) {
    //   updateFields["route_details.stops"] = stops;
    // }

    // const updatedBus = await BusRoute.findOneAndUpdate(
    //   { _id: busId },
    //   { $set: updateFields },
    //   { new: true }
    // );

    // if (updatedBus) {
    //   return res
    //     .status(200)
    //     .json({ msg: "Updated successfully", bus: updatedBus });
    // } else {
//       return res.status(404).json({ msg: "Bus not found" });
//     }
//   } catch (error) {
//     console.error("Error updating bus:", error);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// });



//update bus status by driver...
driverRouter.put("/api/update/bus/:token/:id", authentication, async (req, res) => {
  const id = req.id;
  const busId =req.params.id;
    const { status, busName, route, sourceRoute, destinationRoute, stops } =
    req.body;
  try {
    const buses = await BusRoute.find({ "driver_details._id": id });

    if (!buses || buses.length === 0) {
      return res.status(404).json({ error: 'No assigned buses found for this driver' });
    }

    // Check if any bus has a status of "START"
    const hasStartStatus = buses.some(bus => bus.status === 'START');

    if (hasStartStatus) {
      // If at least one bus has a status of "START", print the message
      return res.status(404).json({ error: "One bus is currently in the START status, and you shouldn't start this bus." });
    } else {
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
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



//get bus that driver assigned
driverRouter.get("/api/get/assigned/bus/:token", authentication, async (req, res) => {
  const id = req.id;
  try {
    // Assuming driver_details[0]._id is the field in the BusRoute model that holds the driver's ID
    const buses = await BusRoute.find({ "driver_details._id": id });

    if (!buses || buses.length === 0) {
      return res.status(404).json({ error: 'No assigned buses found for this driver' });
    }

    // Create an array of bus objects with the desired properties
    const response = buses.map(bus => ({
      bus_details: {
        busName: bus.bus_details.busName
      },
      route_details: {
        sourceRoute: bus.route_details.sourceRoute,
        destinationRoute: bus.route_details.destinationRoute,
        route: bus.route_details.route,
        stops: bus.route_details.stops,
        polyline: bus.route_details.polyline
      },
      driver_details: {
        name: bus.driver_details.name
      },
      currentRouteLocation: bus.currentRouteLocation,
      _id: bus._id,
      time: bus.time,
      status: bus.status
    }));

    res.json(response);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = driverRouter;