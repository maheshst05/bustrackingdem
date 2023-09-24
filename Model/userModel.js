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
      status: String,
      vehicletype: String,
      currentLocation: {
        latitude: Number,
        longitude: Number,
        latitudeDelta: Number,
        longitudeDelta: Number,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
