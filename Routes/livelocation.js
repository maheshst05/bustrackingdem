const express = require('express')
const liveRouter = express.Router()
const Bus =  require("../Model/busModel")


liveRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const { sourceRoute, destinationRoute, busName, currentRouteLocation } = req.body;

  try {
    const updatedBus = await Bus.findOneAndUpdate(
      { _id: busId },
      {
        $set: {
          sourceRoute: sourceRoute,
          destinationRoute: destinationRoute,
          busName: busName,
          currentRouteLocation: currentRouteLocation
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


  module.exports = liveRouter