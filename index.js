const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require('cors');
const { Connection } = require("./db");
const liveRouter = require("./Routes/livelocation");
const driverRouter = require("./Routes/deiverRoute");
const userRouter = require('./Routes/userRoute');
const roteRouter = require('./Routes/routeRoute');

app.use(express.json());
app.use(cors());

// Load environment variables from a .env file
require("dotenv").config();

// Middleware for user authentication using JWT
const authentication = require("./Middleware/authentication");

// Define your routes
app.use("/driver", driverRouter);
app.use("/user", userRouter);
app.use("/live", liveRouter);
app.use("/route", roteRouter);

// Refresh JWT token route
app.post("/refreshtoken", async (req, res) => {
  try {
    const refreshToken = req.headers.authorization.split(' ')[2] || ' '
    // Verify the refreshToken
    const decoded = jwt.verify(refreshToken, process.env.RefreshToken);

    // If verification is successful, generate a new accessToken
    if (decoded) {
      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      return res.status(200).json({ msg: "Refresh successful", status: true, accessToken });
    } else {
      res.status(401).json({ msg: "Invalid refresh token, please login again", status: false });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Invalid refresh token, please login again", status: false });
  }
});

// Start the server
app.listen(process.env.PORT, async () => {
  await Connection;
  console.log("Connection established");
  console.log("Listening on port", process.env.PORT);
});
