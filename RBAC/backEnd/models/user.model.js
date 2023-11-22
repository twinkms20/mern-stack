const mongoose = require('mongoose');
const roles = require('../utils/constant');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.admin, roles.client],
    default: roles.client,
  },
});

module.exports = mongoose.model('User', userSchema);
