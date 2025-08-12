const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin','employee'], default: 'user' },
  avatar: {
    type: String, 
    default: 'https://via.placeholder.com/100', 
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
