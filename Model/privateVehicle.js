const mongoose = require('mongoose');
const PrivateVehicleSchema = new mongoose.Schema({
    V_No:String,
      V_DriverName:String,
      Status:String,
      phoneNo:Number,
      currentRouteLocation: {
        latitude: Number,
        longitude: Number,
        latitudeDelta: Number,
        longitudeDelta: Number,
      }
  })
  const PrivateVehicle = mongoose.model('Vehicle', PrivateVehicleSchema);
  module.exports = PrivateVehicle;
  