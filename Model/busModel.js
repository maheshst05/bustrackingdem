const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: String,
  driverName:String,
  driverId: String,
  route: String,
  time: String,
  sourceRoute: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
  destinationRoute: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
  currentRouteLocation:{
    
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
    
  },
  status: String,
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
