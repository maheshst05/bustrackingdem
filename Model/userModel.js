const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    phoneNo: Number,
    email: String,
    password: String,
    licenceNo: String,
    profileType: {
      type: String,
      default: "User",
    },
    privateVehicle: {
      vehicleNo: String,
      status:{type: String, default:'STOP'},
      vehicletype: String,
      currentLocation: {
        latitude: Number,
        longitude: Number,
        latitudeDelta: Number,
        longitudeDelta: Number,
      },
    },
  //   favoriteBus:{
  // type:String,
  //      isFavorite:Boolean,
  //   },
 favoriteBus:String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
