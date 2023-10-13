const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
  routeNo: String,
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
      name: String,
    },
  ],
  polyline: [
    {
      latitude: Number,
      longitude: Number,
      name: String,
    },
  ],
  address: {
    country: {
      _id: String,
      countryName: String,
      countryCode: String,
    },
    _id: String,
    city: String,
  },
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
