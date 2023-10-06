const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName:{type: 'string', unique:true},
	busNo:String,
  fuelType:String,
  fuelCapacity:String
})
const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;
