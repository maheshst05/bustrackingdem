const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName:String,
	busNo:String
})
const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;
