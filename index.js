const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const jwt = require("jsonwebtoken");
const  Connection  = require("./db");
const liveRouter = require("./Routes/livelocation")
const cors = require('cors')
app.use(cors())
const driverRouter = require("./Routes/deiverRoute")
const userRouter = require('./Routes/userRoute')
const roteRouter = require('./Routes/routeRoute')
app.use("/driver",driverRouter)
app.use("/user",userRouter)
app.use("/live",liveRouter)
app.use("/route",roteRouter)


//const authentication = require("./Middleware/authentication")
// app.post("/refreshtoken", async (req, res) => {
//   try {
//     const refreshToken = req.headers.authorization;
    
//     try {
//       const decoded = jwt.verify(refreshToken, process.env.RefreshToken);
      
//       if (decoded) {
//         const accessToken = jwt.sign({ userID: decoded.userID }, process.env.JWT_SECRET, {
//           expiresIn: '1d'
//         });
        
//         return res.status(200).json({ msg: "Refresh successful", status: true, accessToken });
//       } else {
//         res.status(401).json({ msg: "Invalid refresh token, please login again", status: false });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ msg: "Invalid refresh token, please login again", status: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "An error occurred", status: false });
//   }
// });



app.listen(process.env.port, async () => {
  await Connection;
  console.log("Connection established");
  console.log("listening on", process.env.port);
});
