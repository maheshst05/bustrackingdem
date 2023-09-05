const jwt = require("jsonwebtoken");
const Logout = require("../Model/LogoutModel");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization.split(' ')[2] || ' '
    const accessToken = req.headers.authorization.split(' ')[1] || ' '
    
    if (!accessToken) {
      return res.status(401).json({ msg: "Please log in to continue." });
    }

    const blacklistedToken = await Logout.findOne({
      refreshToken: accessToken,
    });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ msg: "You are logged out. Please log in again." });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ msg: "Your session has expired, please login" });
      }

      // Store the userId in the req object

      req.body.userId = decode.userId
      console.log(decode)
      next();
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred.", error: error.message });
  }
};

module.exports = authentication;
//asdasdhakjdhj