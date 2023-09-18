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
      profileType,
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
    console.log(req.body);
    try {
      let token = req.params.token || null;

      if (!token) {
        return res
          .status(401)
          .json({ msg: "No token provided", status: false });
      }

      const blacklistedToken = new Logout({
        refreshToken: token,
        userId: req.body.userId, // Use req.userId from the authentication middleware
      });

      await blacklistedToken.save();

      return res.status(200).json({ msg: "You are logged out", status: true });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: "An error occurred", status: false });
    }
  }
);

// get all buses to end user if status Stop sho
// userRouter.get("/api/get-bus/:token?", authentication, async (req, res) => {
//   try {
//     const buses = await BusRoute.find();

//     if (!buses || buses.length === 0) {
//       return res.status(404).json({ msg: "Buses not found", status: false });
//     }

//     const response = buses.map((bus) => {
//       const commonFields = {
        // id: bus._id,
        // busName: bus.busName,
        // driver_name: bus.driverName,
        // route: bus.route,
        // time: bus.time,
        // sourceRoute: bus.sourceRoute,
        // destinationRoute: bus.destinationRoute,
        // status: bus.status,
        // stops: bus.stops,
        // polyline: bus.polyline,
//       };

//       if (bus.status === "STOP") {
//         return {
//           ...commonFields,
//           currentRouteLocation: bus.destinationRoute,
//         };
//       } else {
//         return {
//           ...commonFields,
//           currentRouteLocation: bus.currentRouteLocation,
//         };
//       }
//     });

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "An error occurred", status: false });
//   }
// });

userRouter.get("/api/get-bus/:token?", authentication, async (req, res) => {
  try {
    const busRoutes = await BusRoute.find({}, {
      _id: 1,
      bus_details: { busName: 1 },
      driver_details: { name: 1 },
      route_details: {
        route: 1,
        sourceRoute: 1,
        destinationRoute: 1,
        stops: 1,
        polyline: 1
      },
      time: 1,
      status: 1,
    });

    // Conditionally set currentRouteLocation based on the status field
    const modifiedBusRoutes = busRoutes.map((busRoute) => {
      if (busRoute.status !== 'STOP') {
        return {
          id: busRoute._id,
          busName: busRoute.bus_details.busName,
          driver_name: busRoute.driver_details.name,
          route: busRoute.route_details.route,
          time: busRoute.time,
          sourceRoute: busRoute.route_details.sourceRoute,
          destinationRoute: busRoute.route_details.destinationRoute,
          status: busRoute.status,
          stops: busRoute.route_details.stops,
          polyline: busRoute.route_details.polyline,
          currentRouteLocation: busRoute.route_details.destinationRoute,
        };
      } else {
        return {
          id: busRoute._id,
          busName: busRoute.bus_details.busName,
          driver_name: busRoute.driver_details.name,
          route: busRoute.route_details.route,
          time: busRoute.time,
          sourceRoute: busRoute.route_details.sourceRoute,
          destinationRoute: busRoute.route_details.destinationRoute,
          status: busRoute.status,
          stops: busRoute.route_details.stops,
          polyline: busRoute.route_details.polyline,
          currentRouteLocation: busRoute.route_details.sourceRoute,
        };
      }
    });

    res.json(modifiedBusRoutes);
  } catch (error) {
    console.error("Error retrieving bus routes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//get live buses
userRouter.get(
  "/api/get/buses/live/:token?/:id",
  authentication,
  async (req, res) => {
    const id = req.params.id;
    try {
      const buses = await BusRoute.find({ _id: { $ne: req.params.id } }).select(
        ["_id", "busName", "currentRouteLocation"]
      );
      return res.status(200).json(buses);
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = userRouter;
