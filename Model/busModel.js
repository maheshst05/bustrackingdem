const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNo: String,
  fuelType: String,
  fuelCapacity: String,
  address: {
    country: {
      _id: String,
      countryName: String,
      countryCode: String,
    },
    _id: String,
    city: String
  }
});

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;
