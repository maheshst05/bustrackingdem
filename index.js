const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const  Connection  = require("./db");
const liveRouter = require("./Routes/livelocation")
const cors = require('cors')
app.use(cors())
const driverRouter = require("./Routes/deiverRoute")
const userRouter = require('./Routes/userRoute')
app.use("/driver",driverRouter)
app.use("/user",userRouter)
app.use("/live",liveRouter)

app.listen(process.env.port, async () => {
  await Connection;
  console.log("Connection established");
  console.log("listening on", process.env.port);
});
