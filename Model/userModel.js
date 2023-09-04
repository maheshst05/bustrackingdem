const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  phoneNo: Number,
  email: String,
  phoneNo: Number,
  password: String,
  profileType:String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
