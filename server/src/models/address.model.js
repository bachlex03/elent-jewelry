const mongoose = require('mongoose');

// Định nghĩa mô hình Address
const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: false,
    default: ""
  },
  city: {
    type: String,
    required: false,
     default: ""
  },
  district: {
    type: String,
    required: false,
     default: ""
  },
  addressLine: {
    type: String,
    required: false,
     default: ""
  }
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
