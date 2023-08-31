const mongoose = require('mongoose');

const logoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  logoutDate: {
    type: Date,
    default: Date.now
  },
  refreshToken: String,
}, { timestamps: true });

const Logout = mongoose.model('Logout', logoutSchema);

module.exports = Logout;
