const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Logout = require("../Model/LogoutModel")
const authentication = require("../Middleware/authentication")
const Token = require("../Model/tokenModel")
const Bus  =  require("../Model/busModel")
userRouter.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, dob, phoneNo, age, profileType } = req.body;

    // Check if the phone number is already used
    const phoneNoCheck = await User.findOne({ phoneNo });
    if (phoneNoCheck) {
      return res
        .status(400)
        .json({ msg: "Phone Number already used", status: false });
    }

    // Check if the email is already used
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      phoneNo,
      dob,
      age,
      profileType, // Ensure profileType is included here
      password: hashedPassword,
    });

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

userRouter.post("/api/auth/login", async (req, res) => {
  try {
    const { phoneNo, password, grant_type } = req.body;

    if (grant_type !== 'password') {
      return res.status(400).json({ msg: "Invalid grant_type", status: false });
    }

    // Find the user by phone number
    const user = await User.findOne({ phoneNo });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials", status: false });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Invalid credentials", status: false });
    }

    // Generate an access token with a 1-day expiry (24 hours)
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Generate a refresh token with a 7-day expiry
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.RefreshToken,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login successfully",
      status: true,
      accessToken,
      refreshToken,
      profileType:user.profileType
      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});


userRouter.post("/api/auth/logout",authentication, async (req, res) => {
    console.log(req.body)
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ msg: "No token provided", status: false });
      }
  
      const blacklistedToken = new Logout({
        refreshToken: token,
        userId: req.body.userId  // Use req.userId from the authentication middleware
      });
  
      await blacklistedToken.save();
  
      return res.status(200).json({ msg: "You are logged out", status: true });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: "An error occurred", status: false });
    }
  });
// Define the API endpoint
userRouter.get("/api/get-bus/", authentication, async (req, res) => {
  try {
    // Fetch all buses from the database
    const buses = await Bus.find();

    if (!buses || buses.length === 0) {
      return res.status(404).json({ msg: "Buses not found", status: false });
    }

    // Construct the response object with an array of fetched buses
    const response = buses.map((bus) => ({
      id: bus._id,
      busName: bus.busName,
      driver_name: bus.driver_name,
      route: bus.route,
      time: bus.time,
      sourceRoute: bus.sourceRoute,
      destinationRoute: bus.destinationRoute,
      status: bus.status
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});



// userRouter.get('/api/auth/get',authentication,async(req,res)=>{
//     try {
//         res.send(req.body.userId)
//     } catch (error) {
//         console.log("error", error);
//     }
// })



userRouter.post("/",async(req,res)=>{
  try {
    const bus = new Bus(req.body)
    await bus.save()
    res.send("add")
  } catch (error) {
    
  }
})

module.exports = userRouter;