const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tokenType: {
    type: String,
    required: true
  },
  tokenValue: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
