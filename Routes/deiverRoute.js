const express = require("express");
const driverRouter = express.Router();
const bcrypt = require("bcrypt");
const authentication = require("../Middleware/authentication");
const jwt = require("jsonwebtoken");

const BusRoute = require("../Model/busRoute")
// driverRouter.get("/api/get/bus/:token?",authentication,async(req,res)=>{

//     try {
//         const bus = await Bus.find();
//     return res.send(bus)
//         if (!bus) {
//           return res.status(404).json({ msg: "No bus assigend you", status: false });
//         }
//       const response = {
//           driver_name: bus.driver_name,
//           route: bus.route,
//           time: bus.time,
//           sourceRoute: bus.sourceRoute,
//           destinationRoute: bus.destinationRoute,
//           status: bus.status
//         };
    
//         return res.status(200).json(response);
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ msg: "An error occurred", status: false });
//       }
// })

// driverRouter.put("/api/update/bus/:id", async (req, res) => {
//   const busId = req.params.id;
//   const { status, busName, route, sourceRoute, destinationRoute ,stops} = req.body; 
//   try {
//     const updatedBus = await Bus.findOneAndUpdate(
//       { _id: busId },
//       {
//         $set: {
//           status: status,
//           busName: busName,
//           route: route,
//           sourceRoute: sourceRoute,
//           destinationRoute: destinationRoute,
//           stops:stops
//         }
//       },
//       { new: true } 
//     );

//     if (updatedBus) {
//       return res.status(200).json({ "msg": "Updated successfully", "bus": updatedBus });
//     } else {
//       return res.status(404).json({ "msg": "Bus not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ "msg": "Internal server error" });
//   }
// });
driverRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const {
    status,
    busName,
    route,
    sourceRoute,
    destinationRoute,
    stops
  } = req.body;

  try {
    const updateFields = {};

    // Check which fields are provided in the request and add them to the update object
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
      return res.status(200).json({ "msg": "Updated successfully", "bus": updatedBus });
    } else {
      return res.status(404).json({ "msg": "Bus not found" });
    }
  } catch (error) {
    console.error("Error updating bus:", error);
    return res.status(500).json({ "msg": "Internal server error" });
  }
});





module.exports = driverRouter;
