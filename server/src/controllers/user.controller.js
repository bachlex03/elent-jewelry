const profileService = require('../services/user.service');

// API lấy thông tin chi tiết của người dùng dựa trên email
const getProfileByEmail = async (req, res) => {
  console.log(req.params)
  const { email } = req.params; // Lấy email từ URL
  console.log(email)
  try {
    // Gọi service để lấy profile
    const user = await profileService.getProfileByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    // Kiểm tra xem userProfile có tồn tại không
    if (!user.user_profile) {
      return res.status(404).json({ message: 'Không tìm thấy profile của người dùng' });
    }
    // Trả về thông tin chi tiết của người dùng
    res.status(200).json({
      firstName: user.user_profile.firstName,
      lastName: user.user_profile.lastName,
      email: user.email,  // Email được lấy từ mô hình User
      phoneNumber: user.user_profile.phoneNumber,
      addresses: user.user_profile.profile_addresses[0], // Trả về thông tin địa chỉ đã populate
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// cập nhật thông tin người dùng qua email params
const updateProfileByEmail = async (req, res) => {
  const { email } = req.params; // Lấy email từ URL
  const updatedData = req.body; // Lấy dữ liệu cập nhật từ body
  try {
    // Gọi service để cập nhật thông tin người dùng
    const updatedUser = await profileService.updateProfileByEmail(email, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    // Trả về thông tin chi tiết của người dùng đã cập nhật
    res.status(200).json({
      message: 'Cập nhật thông tin người dùng thành công',
      updatedUser: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};
// thay đổi mật khẩu người dùng qua email params
const changePasswordByEmail = async (req, res) => {
  const { email } = req.params; // Lấy email từ URL
  const data = req.body;
  try {
    // Gọi service để lấy profile

    const changPass = await profileService.changePasswordByEmail(email, data);

    if (!changPass) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Trả về thông tin chi tiết của người dùng
    res.status(200).json({
      message: "Mật khẩu đã được thay đổi",
      changPass
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// tạo địa chỉ mới của người dùng thông qua email params
const createAddressByEmail = async (req, res) => {
  const { email } = req.params; // Lấy email từ URL
  const data = req.body;
  try {
    // Gọi service để lấy profile

    const newAddress = await profileService.createAddressByEmail(email, data);

    if (!newAddress) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Trả về thông tin chi tiết của người dùng
    res.status(200).json({
      message: "Địa chỉ mới đã được thêm vào",
      newAddress
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAddressById = async (req, res) => {
  const idAddress = req.params.ObjectId; // Lấy ObjectId từ URL
  const data = req.body;
  console.log( idAddress)
  try {
    // Gọi service để lấy profile

    const updatedAddress  = await profileService.updateAddressById(idAddress, data);

    if (!updatedAddress ) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    // Trả về thông tin chi tiết của người dùng
    res.status(200).json({
      message: "Địa chỉ đã được thay đổi",
      updatedAddress 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getAddressesByEmail = async (req, res) => {
  const { email } = req.params;
  try {
      // Gọi hàm từ service để lấy địa chỉ
      const addresses = await profileService.getAddressesByEmail(email);
      // Trả về danh sách địa chỉ
      return res.status(200).json(addresses);
  } catch (error) {
      console.error(error); // Ghi lại lỗi vào console
      return res.status(404).json({ message: error.message }); // Trả về thông báo lỗi
  }
};
const deleteAddressById = async (req, res) => {
  const { ObjectId } = req.params; // Lấy ObjectId từ params

  try {
    // Gọi hàm service để xóa địa chỉ
    const result = await profileService.deleteAddressById(ObjectId);

    if (result) {
      return res.status(200).json({ message: 'Địa chỉ đã được xóa thành công' });
    } else {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa địa chỉ' });
  }
};
module.exports = { getProfileByEmail, changePasswordByEmail, updateProfileByEmail, createAddressByEmail, 
  updateAddressById ,getAddressesByEmail,deleteAddressById,}