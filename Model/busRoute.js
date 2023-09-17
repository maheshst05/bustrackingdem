const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  time: String,
  status: {type: String,default:'STOP'},
  bus_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
  },
  route_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
  driver_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  currentRouteLocation: {
        latitude: Number,
        longitude: Number,
        latitudeDelta:Number,
        longitudeDelta:Number
      }
      ,heading: Number
});

const BusRoute = mongoose.model('BusRoute', busRouteSchema);

module.exports = BusRoute;
