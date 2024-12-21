const mongoose = require('mongoose');
const Profile = require('./profile.model');

// Định nghĩa mô hình User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user', // Vai trò mặc định là 'user'
    enum: ['user', 'admin'], // Danh sách các vai trò hợp lệ
  },
  otp: {
    type: String, // Lưu mã OTP
  },
  user_profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Profile,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
