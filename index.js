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


// Start the server
app.listen(process.env.PORT, async () => {
  await Connection;
  console.log("Connection established");
  console.log("Listening on port", process.env.PORT);
});
