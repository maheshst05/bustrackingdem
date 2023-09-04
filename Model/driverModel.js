
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  email:String,
  age: Number,
  dob:Date,
  phoneNo: Number,
  profileType: {
    type: String,
   default: 'Driver', // Set the default value to 'User'
  },
  licenseNumber: String,
  password: String,
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
