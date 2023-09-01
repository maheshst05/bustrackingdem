const express = require("express");
const driverRouter = express.Router();
const Driver = require("../Model/driverModel");
const Token = require("../Model/tokenModel");
const bcrypt = require("bcrypt");
const authentication = require("../Middleware/authentication");
const jwt = require("jsonwebtoken");
const Bus = require("../Model/busModel") 

driverRouter.post("/api/driver/reg", async (req, res) => {
  try {
    const { name, email, password, dob, phoneNo, licenseNumber, age } =
      req.body;

    // Check if the phone number is already used
    const usernameCheck = await Driver.findOne({ phoneNo });
    if (usernameCheck) {
      return res
        .status(400)
        .json({ msg: "Phone Number already used", status: false });
    }

    // Check if the email is already used
    const emailCheck = await Driver.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = await Driver.create({
      email,
      name,
      age,
      licenseNumber,
      phoneNo,
      dob,
      password: hashedPassword,
    });

    return res.status(201).json({ status: true, driver });
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error" });
  }
});

driverRouter.post("/api/driver/login", async (req, res) => {
  try {
    const { phoneNo, password, grant_type } = req.body;

    if (grant_type !== "password") {
      return res.status(400).json({ msg: "Invalid grant_type", status: false });
    }

    // Find the user by phone number
    const user = await Driver.findOne({ phoneNo });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials", status: false });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Invalid credentials", status: false });
    }

    // Generate an access token with a 7-hour expiry
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7h", // 7 hours
    });

    // Store the access token if needed (optional)
    const accessTokenstore = new Token({
      userId: user._id,
      tokenType: "access_token",
      tokenValue: accessToken,
    });
    await accessTokenstore.save();

    // Generate a refresh token with a 7-day expiry
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.RefreshToken,
      { expiresIn: "7d" } // 7 days
    );

    return res.status(200).json({
      msg: "Login successfully",
      status: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

driverRouter.post("/api/auth/logout", authentication, async (req, res) => {
   console.log(req.body)
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided", status: false });
    }

    const blacklistedToken = new Logout({
      refreshToken: token,
      userId: req.body.userId, 
    });

    await blacklistedToken.save();

    return res.status(200).json({ msg: "You are logged out", status: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

driverRouter.get("/api/get/bus/",authentication,async(req,res)=>{
    const driverID = req.body.userId;
    try {
      // consle.log(req.body.userId)
    console.log(req.body.userId)
        // Fetch the bus information from the database using the provided busId
        const bus = await Bus.find({driverId:driverID});
    return res.send(bus)
        if (!bus) {
          return res.status(404).json({ msg: "No bus assigend you", status: false });
        }
    
        // Construct the response object with the fetched bus information
        const response = {
          driver_name: bus.driver_name,
          route: bus.route,
          time: bus.time,
          sourceRoute: bus.sourceRoute,
          destinationRoute: bus.destinationRoute,
          status: bus.status
        };
    
        return res.status(200).json(response);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "An error occurred", status: false });
      }
})

driverRouter.put("/api/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const { status, busName, route, sourceRoute, destinationRoute } = req.body; // Extract fields from req.body

  try {
    const updatedBus = await Bus.findOneAndUpdate(
      { _id: busId },
      {
        $set: {
          status: status,
          busName: busName,
          route: route,
          sourceRoute: sourceRoute,
          destinationRoute: destinationRoute
        }
      },
      { new: true } // Return the updated document
    );

    if (updatedBus) {
      return res.status(200).json({ "msg": "Updated successfully", "bus": updatedBus });
    } else {
      return res.status(404).json({ "msg": "Bus not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "msg": "Internal server error" });
  }
});


module.exports = driverRouter;
