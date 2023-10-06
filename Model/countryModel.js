const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    countryName: String,
  }   
);

const Country = mongoose.model("country", countrySchema);

module.exports = Country;