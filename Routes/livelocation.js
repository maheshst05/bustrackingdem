const express = require("express");
const liveRouter = express.Router();
const BusRoute = require("../Model/busRoute");

liveRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const {
    sourceRoute,
    destinationRoute,
    busName,
    currentRouteLocation,
    heading,
  } = req.body;

  try {
    const updatedBus = await BusRoute.findByAndUpdate(
      { _id: busId },
      {
        $set: {
          "route_details.sourceRoute": sourceRoute,
          "route_details.destinationRoute": destinationRoute,
          "bus_details.busName": busName,
          currentRouteLocation: currentRouteLocation,
          heading,
        },
      },
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
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


//get location bus by id
liveRouter.get("/api/live-location/bus/:id", async (req, res) => {
  const id = req.params.id;

  try {
    
    // const liveLocation = await BusRoute.findById(id);

const liveLocation = await BusRoute.find()

if (!liveLocation) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    const response = {
      driverId: liveLocation.driver_details._id,
      busName: liveLocation.bus_details.busName,
      sourceRoute: liveLocation.route_details.sourceRoute,
      destinationRoute: liveLocation.route_details.destinationRoute,
      currentRouteLocation: liveLocation.currentRouteLocation,
      status: liveLocation.status,
    };

    return res.status(200).json({ Bus: response });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = liveRouter;
