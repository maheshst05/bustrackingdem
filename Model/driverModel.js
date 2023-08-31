
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  email:String,
  age: Number,
  dob:Date,
  phoneNo: Number,
  
  licenseNumber: String,
  password: String,
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
