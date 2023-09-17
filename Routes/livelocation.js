const express = require('express')
const liveRouter = express.Router()
const BusRoute =  require("../Model/busRoute")

//live update
liveRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const { sourceRoute, destinationRoute, busName, currentRouteLocation, heading } = req.body;

  try {
    const updatedBus = await BusRoute.findOneAndUpdate(
      { _id: busId },
      {
        $set: {
          sourceRoute: {
            latitude: sourceRoute.latitude,
            longitude: sourceRoute.longitude,
            latitudeDelta: sourceRoute.latitudeDelta,
            longitudeDelta: sourceRoute.longitudeDelta
          },
          destinationRoute: {
            latitude: destinationRoute.latitude,
            longitude: destinationRoute.longitude,
            latitudeDelta: destinationRoute.latitudeDelta,
            longitudeDelta: destinationRoute.longitudeDelta
          },
          busName: busName,
          currentRouteLocation: {
            latitude: currentRouteLocation.latitude,
            longitude: currentRouteLocation.longitude,
            latitudeDelta: currentRouteLocation.latitudeDelta,
            longitudeDelta: currentRouteLocation.longitudeDelta
          },
          heading: heading 
        }
      },
      { new: true }
    );

    if (updatedBus) {
      return res.status(200).json({ "msg": "Updated successfully", "bus": updatedBus });
    } else {
      return res.status(404).json({ "msg": "Bus not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "msg": "Internal server error" });
  }
});


liveRouter.get('/api/live-location/bus/:id', async (req, res) => {
  const id = req.params.id;
try {
    const liveLocation = await BusRoute.findById(id); 

    if (!liveLocation) {
      return res.status(404).json({ "msg": "Bus not found" });
    }

    const response = {
      driverId:liveLocation.driverId,
      busName: liveLocation.busName,
      sourceRoute: liveLocation.sourceRoute,
      destinationRoute: liveLocation.destinationRoute,
      currentRouteLocation: liveLocation.currentRouteLocation,
      status: liveLocation.status
    };

    return res.status(200).json({ "Bus": response });

  } catch (error) {
    return res.status(500).json({ "msg": "Internal server error" });
  }
});

  module.exports = liveRouter