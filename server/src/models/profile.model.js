const mongoose = require('mongoose');
const Address = require('./address.model'); // Kết nối với mô hình Address

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  profile_addresses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: Address, // Liên kết với mô hình Address
  },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
