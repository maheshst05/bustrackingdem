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
    
    let accessToken = req.params.token || null;

    // Check if the grant_type is "password" or if the token is expired
    if (grant_type === "password" || accessToken === null) {
      // Generate a new token for the same user
      const user = await Driver.findOne({ phoneNo });
      if (!user) {
        return res.status(401).json({ msg: "Invalid credentials", status: false });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ msg: "Invalid credentials", status: false });
      }

      const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d", 
      });

      return res.status(200).json({
        msg: "Login successfully",
        status: true,
        accessToken: newAccessToken,
        profileType: user.profileType,
      });
    }

    else if(grant_type=='refresh_token'){
    const Logouttoken = await Logout.findOne({
      refreshToken: accessToken,
    });

    if (Logouttoken) {
      return res.status(401).json({ msg: "You are logged out. Please log in again." });
    }

    // Verify the token and handle accordingly...
    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        const user = await Driver.findOne({ phoneNo });
        if (!user) {
          return res.status(401).json({ msg: "Invalid credentials", status: false });
        }
  
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d", 
        });
  
        return res.status(200).json({
          msg: "Login successfully",
          status: true,
          accessToken: newAccessToken,
          profileType: user.profileType,
        });
      }

      return res.status(200).json({
        msg: "Login successfully",
        status: true,
        accessToken: accessToken, // You can also return the same token if it's still valid
        profileType: decode.userId.profileType, // Extract the profile type from the token payload
      });
    });
  }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});




driverRouter.post("/api/auth/logout:token?", authentication, async (req, res) => {
   console.log(req.body)
  try {

    let token = req.params.token || null;

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

driverRouter.get("/api/get/bus/:token?",authentication,async(req,res)=>{
    //const driverID = req.body.userId;
    try {
      // consle.log(req.body.userId)
    //console.log(req.body.userId)
        // Fetch the bus information from the database using the provided busId
        const bus = await Bus.find();
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
