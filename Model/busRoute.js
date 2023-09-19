const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema({
  time: String,
  status: { type: String, default: "STOP" },
  bus_details: {
    _id: String,
    busName: String,
    busNo: String,
  },
  route_details: {
    _id: String,
    route: String,
    sourceRoute: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
      name: String,
    },
    destinationRoute: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
      name: String,
    },
    stops: [
      {
        latitude: Number,
        longitude: Number,
        title: String,
      },
    ],
    polyline: [
      {
        latitude: Number,
        longitude: Number,
      },
    ],
  },
  driver_details: {
    _id: String,
    name: String,
    db: String,
    licenceNo: String,
    phoneNo: Number,
    email: String,
  },
  currentRouteLocation: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
  heading: Number,
});

const BusRoute = mongoose.model("BusRoute", busRouteSchema);

module.exports = BusRoute;
