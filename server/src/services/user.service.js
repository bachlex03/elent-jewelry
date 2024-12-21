const { use } = require('passport');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Address = require('../models/address.model');
const Profile = require('../models/profile.model')
const getProfileByEmail = async (email) => {
  try {
    // Tìm người dùng dựa trên email và populate thông tin từ bảng Profile và Address
    const user = await User.findOne({ email }).populate({
      path: 'user_profile',       // Populate profile dựa trên ObjectId trong userProfile
      model: 'Profile',
      populate: {
        path: 'profile_addresses',       // Tiếp tục populate địa chỉ trong Profile
        model: 'Address'         // Liên kết đến model Address
      }
    });
    // Nếu không tìm thấy người dùng
    if (!user) {
      return null;
    }
    return user
  } catch (error) {
    throw new Error('Lỗi khi lấy thông tin người dùng');
  }
};

const updateProfileByEmail = async (email, updatedData) => {
  try {
    const user = await User.findOne({ email }).populate({
      path: 'user_profile',       // Populate profile dựa trên ObjectId trong userProfile
      model: 'Profile',
    });
    console.log(updatedData)

    user.user_profile.firstName = updatedData.firstName

    user.user_profile.lastName = updatedData.lastName

    user.user_profile.phoneNumber = updatedData.phoneNumber

    const newProfile = user.user_profile

    const aaaaa = await newProfile.save();

    return aaaaa;
  } catch (error) {
    console.log(error)
    throw new Error('Lỗi khi lấy thông tin người dùng', error.message);
  }
};

const changePasswordByEmail = async (email, data) => {
  try {
    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    // Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Mật khẩu cũ không chính xác');
    }

    // Kiểm tra nếu mật khẩu cũ và mật khẩu mới trùng nhau
    if (data.oldPassword === data.newPassword) {
      throw new Error('Mật khẩu cũ và mật khẩu mới không được trùng nhau');
    }

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu mới không giống nhau
    if (data.confirmNewPassword !== data.newPassword) {
      throw new Error('Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau');
    }

    // Hash mật khẩu mới và cập nhật vào người dùng
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashedPassword;

    // Lưu người dùng với mật khẩu mới
    await user.save();

    return user;
  } catch (error) {
    throw new Error('Lỗi khi thay đổi mật khẩu: ' + error.message);
  }
};
const createAddressByEmail = async (email, data) => {
  try {
    // Tìm người dùng dựa trên email và populate thông tin từ bảng Profile và Address
    const user = await User.findOne({ email }).populate({
      path: 'user_profile',
      model: 'Profile',
      populate: {
        path: 'profile_addresses',
        model: 'Address'
      }
    });

    // Nếu không tìm thấy người dùng
    if (!user) {
      return null;
    }

    let updated = false;

    // Kiểm tra nếu có địa chỉ ban đầu và các trường đều là ""
    if (user.user_profile.profile_addresses.length > 0) {
      const currentAddress = user.user_profile.profile_addresses[0];
      // Debug: kiểm tra giá trị hiện tại của địa chỉ
      console.log('Current Address:', currentAddress);
      if ((currentAddress.country === "" || !currentAddress.country) &&
        (currentAddress.city === "" || !currentAddress.city) &&
        (currentAddress.district === "" || !currentAddress.district) &&
        (currentAddress.addressLine === "" || !currentAddress.addressLine)) {
        // Update địa chỉ đầu tiên nếu các giá trị đều là chuỗi rỗng hoặc null/undefined
        currentAddress.country = data.country;
        currentAddress.city = data.city;
        currentAddress.district = data.district;
        currentAddress.addressLine = data.addressLine;

        // Lưu địa chỉ cập nhật
        await currentAddress.save();
        updated = true; // Đánh dấu là đã cập nhật

        console.log('Updated Address:', currentAddress); // Debug: in ra sau khi cập nhật
      }
    }

    if (!updated) {
      // Tạo một địa chỉ mới nếu không có cập nhật
      const newAddress = new Address({
        country: data.country,
        city: data.city,
        district: data.district,
        addressLine: data.addressLine,
      });

      // Thêm địa chỉ mới vào mảng profile_addresses của người dùng
      user.user_profile.profile_addresses.push(newAddress);

      // Lưu địa chỉ mới vào database
      await newAddress.save();
      console.log('New Address Added:', newAddress); // Debug: in ra địa chỉ mới
    }

    // Lưu profile với địa chỉ mới hoặc đã được cập nhật
    await user.user_profile.save();

    // Trả về tất cả các địa chỉ kèm _id
    const addresses = user.user_profile.profile_addresses.map(address => ({
      _id: address._id,
      country: address.country,
      city: address.city,
      district: address.district,
      addressLine: address.addressLine
    }));

    return addresses;
  } catch (error) {
    console.error(error);
    throw new Error('Lỗi khi thêm địa chỉ cho người dùng');
  }
};
const updateAddressById = async (idAddress, data) => {
  try {
    // Tìm địa chỉ dựa trên ID
    console.log(idAddress)
    const address = await Address.findOne({'_id': idAddress});

    console.log(address)
    if (!address) {
      return null; // Nếu không tìm thấy địa chỉ
    }

    // Cập nhật các trường cần thiết
    address.country = data.country;
    address.city = data.city;
    address.district = data.district;
    address.addressLine = data.addressLine;

    // Lưu địa chỉ đã cập nhật
    await address.save();

    return address; // Trả về địa chỉ đã được cập nhật
  } catch (error) {
    console.log(error)
    throw new Error('Lỗi khi cập nhật địa chỉ');
  }
};
const getAddressesByEmail = async (email) => {
  try {
    // Truy vấn cơ sở dữ liệu để lấy địa chỉ dựa trên email
    const user = await User.findOne({ email }).populate({
      path: 'user_profile',
      model: 'Profile',
      populate: {
        path: 'profile_addresses',
        model: 'Address'
      }
    });
    const addresses = user.user_profile.profile_addresses.map(address => ({
      _id: address._id,
      country: address.country,
      city: address.city,
      district: address.district,
      addressLine: address.addressLine
    }));

    return addresses;
  } catch (error) {
    throw new Error(error.message); // Ném lỗi để controller xử lý
  }
}
const deleteAddressById = async (addressId) => {
  try {
    // Bước 1: Xóa địa chỉ từ bảng Address
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return false; // Không tìm thấy địa chỉ để xóa
    }

    // Bước 2: Tìm tất cả profile có chứa addressId trong mảng profile_addresses
    const updatedProfiles = await Profile.updateMany(
      { profile_addresses: addressId }, // Tìm các profile có chứa addressId
      { $pull: { profile_addresses: addressId } } // Loại bỏ addressId khỏi profile_addresses
    );

    // Kiểm tra nếu có profile nào được cập nhật
    if (updatedProfiles.matchedCount === 0) {
      console.log('Không tìm thấy profile nào chứa địa chỉ này');
    }
    return true; // Thành công
  } catch (error) {
    console.error(error);
    throw new Error('Lỗi khi xóa địa chỉ');
  }
};
module.exports = {
  getProfileByEmail,
  updateProfileByEmail,
  changePasswordByEmail,
  createAddressByEmail,
  updateAddressById,
  getAddressesByEmail,
  deleteAddressById,
};
