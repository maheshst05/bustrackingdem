const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Logout = require("../Model/LogoutModel");
const authentication = require("../Middleware/authentication");
const BusRoute = require("../Model/busRoute");

userRouter.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, dob, phoneNo, age, profileType, licenceNo } =
      req.body;

    const phoneNoCheck = await User.findOne({ phoneNo });
    if (phoneNoCheck) {
      return res
        .status(400)
        .json({ msg: "Phone Number already used", status: false });
    }

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
      profileType,
      licenceNo,
      password: hashedPassword,
    });

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

userRouter.post("/api/auth/login/:token?", async (req, res) => {
  try {
    const { phoneNo, password, grant_type } = req.body;

    let accessToken = req.params.token || null;

    // Check if the grant_type is "password" or if the token is expired
    if (grant_type === "password" || accessToken === null) {
      // Generate a new token for the same user
      const user = await User.findOne({ phoneNo });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "Invalid credentials", status: false });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ msg: "Invalid credentials", status: false });
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, user: user },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        msg: "Login successfully",
        status: true,
        accessToken: newAccessToken,
        user,
      });
    } else if (grant_type == "refresh_token") {
      const Logouttoken = await Logout.findOne({
        refreshToken: accessToken,
      });

      if (Logouttoken) {
        return res
          .status(401)
          .json({ msg: "You are logged out. Please log in again." });
      }

      // Verify the token and handle accordingly...
      jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
          const user = await User.findOne({ phoneNo });
          if (!user) {
            return res
              .status(401)
              .json({ msg: "Invalid credentials", status: false });
          }

          const newAccessToken = jwt.sign(
            { userId: user._id, user: user },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );

          return res.status(200).json({
            msg: "Login successfully",
            status: true,
            accessToken: newAccessToken,
            user,
          });
        }

        return res.status(200).json({
          msg: "Login successfully",
          status: true,
          accessToken: accessToken, // You can also return the same token if it's still valid
          user: decode.user,
        });
      });
    } else {
      return res.status(500).json({ msg: "Invalid grant_type", status: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", status: false });
  }
});

userRouter.post(
  "/api/auth/logout/:token?",
  authentication,
  async (req, res) => {
    // console.log(req.body);
    try {
      let token = req.params.token || null;

      if (!token) {
        return res
          .status(401)
          .json({ msg: "No token provided", status: false });
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
  }
);

//get all buses

userRouter.get("/api/get-bus/:token?", async (req, res) => {
  const { search } = req.query || {};
  const profiletype = req.ProfileType;
  console.log(profiletype);
  try {
    let filter = {};

    if (profiletype == "User") {
      if (!search) {
        return res.status(200).json([]);
      }

      filter = {
        $or: [
          { "bus_details.busName": { $regex: search, $options: "i" } },
          { "route_details.route": { $regex: search, $options: "i" } },
        ],
      };
    } else {
      if (search) {
        filter = {
          $or: [
            { "bus_details.busName": { $regex: search, $options: "i" } },
            { "route_details.route": { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    const projection = {
      _id: 1,
      "bus_details.busName": 1,
      "bus_details.busNo": 1,
      "driver_details.name": 1,
      "route_details.route": 1,
      "route_details.sourceRoute": 1,
      "route_details.destinationRoute": 1,
      "route_details.stops": 1,
      "route_details.polyline": 1,
      time: 1,
      status: 1,
      currentRouteLocation: {
        $cond: {
          if: { $eq: ["$status", "STOP"] },
          then: "$route_details.sourceRoute",
          else: "$currentRouteLocation",
        },
      },
    };

    const busRoutes = await BusRoute.find(filter, projection);

    if (busRoutes.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    res.json(busRoutes);
  } catch (error) {
    console.error("Error retrieving bus routes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get(
  "/api/get/buses/live/:token?/:id",
  authentication,
  async (req, res) => {
    try {
      const excludedBusId = req.params.id;
      const buses = await BusRoute.find({
        _id: { $ne: excludedBusId },
        status: "START",
      });

      if (!buses || buses.length === 0) {
        return res.status(404).json({ message: "Buses not found" });
      }

      const simplifiedBuses = [];
      for (const bus of buses) {
        const busResponse = {
          _id: bus._id,
          currentRouteLocation: bus.currentRouteLocation,
          busName: bus.bus_details.busName,
        };

        simplifiedBuses.push(busResponse);
      }

      res.status(200).json(simplifiedBuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Get user's favorite bus
userRouter.get("/api/get/fev/bus/:token", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const getUserFev = await BusRoute.findOne({ _id: user.favoriteBus }).select(
      {
        _id: 1,
        "bus_details.busName": 1,
        "bus_details.busNo": 1,
        "driver_details.name": 1,
        "route_details.route": 1,
        "route_details.sourceRoute": 1,
        "route_details.destinationRoute": 1,
        "route_details.stops": 1,
        "route_details.polyline": 1,
        time: 1,
        status: 1,
        currentRouteLocation: 1,
      }
    );

    if (!getUserFev) {
      return res.status(404).json({ message: "No favorite bus found" });
    }

    // res.send(getUserFev);
    res.send({...getUserFev.toObject(),isFevorite:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});









//update fevorate
userRouter.put(
  "/api/like/unlike/route/:token",
  authentication,
  async (req, res) => {
    try {
      const likeUnlike = await User.findByIdAndUpdate(
        { _id: req.id },
        req.body
      );
      return res.status(200).json({ message: "fevrate route updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

//search Route
const { ObjectId } = require("mongoose").Types;

userRouter.get("/api/route/:token?", authentication, async (req, res) => {
  const { searchroute } = req.query;
  const favoriteBusId = req.favoriteBusId;
  console.log(favoriteBusId);

  try {
    const regexPattern =
      typeof searchroute === "string" ? searchroute : String(searchroute);
    const search = await BusRoute.findOne({
      "bus_details.busName": { $regex: regexPattern, $options: "i" },
    }).select({
      _id: 1,
      "bus_details.busName": 1,
      "bus_details.busNo": 1,
      "driver_details.name": 1,
      "route_details.route": 1,
      "route_details.sourceRoute": 1,
      "route_details.destinationRoute": 1,
      "route_details.stops": 1,
      "route_details.polyline": 1,
      time: 1,
      status: 1,
      currentRouteLocation: 1,
    });

    if (!search) {
      return res.status(404).json({ message: "Route not found" });
    }
    if (search._id.toString() === favoriteBusId) {
      return res.status(200).json({ ...search.toObject(), isFavorite: true });
    }
    return res.status(200).json({ ...search.toObject(), isFavorite: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = userRouter;
