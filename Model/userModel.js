const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    phoneNo: Number,
    calling : {
      callingCode :String,
      countryCode : String
      },
    email: String,
    password: String,
    licenceNo: String,
    profileType: {
      type: String,
      default: "User",
    },
    whoisUpdate:{
      type: "string", 
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
    favoriteRoute: {
      RouteId: String,
        isFavorite: Boolean,
      },
      address:{country:{
        _id:String,
        countryName: String,
        countryCode:String,
    },
    _id:String,
    city: String
    }
    
},

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;



