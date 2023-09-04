const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  phoneNo: Number,
  email: String,
  password: String,
  profileType: {
    type: String,
    enum: ['Driver', 'Admin', 'User'], // Restrict values to these options
    default: 'User', // Set the default value to 'User'
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
