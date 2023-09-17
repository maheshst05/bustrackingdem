const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  phoneNo: Number,
  email: String,
  password: String,
  licenceNo:String,
  profileType: {
    type: String,
    default: 'User', 
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
