const jwt = require("jsonwebtoken");
const Logout = require("../Model/LogoutModel");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.params.token;

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

      req.id = decode.userId;
      req.ProfileType = decode.user.profileType;
      req.favoriteBusId  = decode.user.favoriteBus;

      next();
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred.", error: error.message });
  }
};

module.exports = authentication;
//asdasdhakjdhj
