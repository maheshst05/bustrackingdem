const mongoose = require('mongoose');

const countryWithcity = new mongoose.Schema({
country:{
    _id:String,
    countryName: String,
    countryCode:String,
},
city: String
})


const City = mongoose.model("city", countryWithcity);

module.exports = City;
