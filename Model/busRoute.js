const mongoose = require("mongoose");

const busRouteSchema = new mongoose.Schema({
  status: { type: String, default: "STOP" },
  bus_details: {
    _id: String,
    busName: String,
    busNo: String,
    fuelType:String,
    fuelCapacity:String
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
        name: String,
      },
    ],
    polyline: [
      {
        latitude: Number,
        longitude: Number,
        name:String
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
  country_details: {
    
      countryName: String,
      countryCode:String,
    
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
