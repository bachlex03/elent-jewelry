const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const UserProfile = require('../models/profile.model.js');
const Addresses = require('../models/address.model.js')
const otpGenerator = require('otp-generator'); // Thêm dòng này để yêu cầu module otp-generator
const { sendOTPVerificationEmail } = require('../mailler/mailOtp.js');
const jwt = require('jsonwebtoken');

const registerUser = async ({ firstName, lastName, email, phoneNumber, password }) => {
  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email đã tồn tại');
  }
  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);
  // Tạo OTP (6 số)
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  // Tạo địa chỉ mới
  const address = new Addresses();
  await address.save(); // Lưu địa chỉ
  // Tạo thông tin hồ sơ người dùng
  const userProfile = new UserProfile({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    profile_addresses: [address._id], // Gắn địa chỉ vào profile
  });
  console.log(userProfile)
  // Lưu hồ sơ người dùng
  await userProfile.save(); 
  // Tạo người dùng mới
  const newUser = new User({
    email: email,
    password: hashedPassword,
    verified: false,
    role: 'user',
    otp: otp,  // Lưu OTP vào User model
    user_profile: userProfile._id, // Gắn hồ sơ vào người dùng
  });

  // Tạo JWT chứa email, hết hạn sau 5 phút
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

  // Tạo URL xác thực OTP
  const verifyUrl = `/verify-email?q=${token}`;

  // Lưu người dùng vào database
  await newUser.save();

  // Gửi email OTP đến người dùng
  await sendOTPVerificationEmail(email, otp);

  // Trả về message và URL xác thực
  return {
    message: 'OTP đã được gửi, vui lòng kiểm tra email',
    verifyUrl
  };
};


// Xác thực OTP và lưu vào database
const verifyOTP = async (q, otp) => {
  // Giải mã JWT từ tham số 'q'
  let decoded;
  try {
    decoded = jwt.verify(q, process.env.JWT_SECRET); // JWT_SECRET là khóa bí mật
  } catch (error) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }
  // Tìm người dùng theo email
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }
  // So sánh OTP người dùng nhập vào với OTP đã lưu trong database
  if (user.otp !== otp) {
    throw new Error('OTP không đúng');
  }

  // Nếu OTP hợp lệ, cập nhật trạng thái xác minh và xóa OTP
  user.verified = true;
  user.otp = undefined; // Xóa OTP sau khi xác thực
  await user.save();

  return { message: 'Tài khoản đã được xác nhận thành công' };
};

// login  check verify
const loginUser = async (email, password) => {

  // Tìm người dùng bằng email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email không tồn tại');
  }
  if (user.verified == true) {
    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Sai mật khẩu');
    }
    // Tạo Access Token (thời hạn ngắn)
    const accessToken = jwt.sign(
      {userid: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Secret key để mã hóa Access Token
      { expiresIn: '1h' } // Thời gian hết hạn của Access Token
    );

    // Tạo Refresh Token (thời hạn dài hơn)
    const refreshToken = jwt.sign(
      {userid: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET, // Secret key khác để mã hóa Refresh Token
      { expiresIn: '7d' } // Thời gian hết hạn của Refresh Token (ví dụ: 7 ngày)
    );

    // Trả về cả Access Token và Refresh Token
    return {
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken
    };
  }
  else {
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    // Tạo URL xác thực OTP
    // const verifyUrl = `https://yourdomain.com/verify-email?q=${token}`;
    const verifyUrl = `http://localhost:3001/otp?q=${token}`;
    user.otp = otp
    await user.save();
    await sendOTPVerificationEmail(email, otp);
    return {
      message: ' Tài khoản của bạn chưa được xác thực ,OTP đã được gửi, vui lòng kiểm tra email',
      verifyUrl, 
      token,
    };
  }
};
// Yêu cầu đặt lại mật khẩu
const sendOTP = async (email) => {
  // Kiểm tra xem email có tồn tại không
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  // Tạo OTP (6 số) cho quá trình đặt lại mật khẩu
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

  // Tạo mã OTP với thời hạn
  const otpExpires = Date.now() + 10 * 60 * 1000; // OTP có hiệu lực trong 10 phút

  // Cập nhật OTP và thời gian hết hạn trong người dùng
  user.otp = otp;
  user.otpExpires = otpExpires;

  // Tạo JWT chứa email
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

  // Tạo URL xác thực OTP (URL chứa JWT)
  const verifyUrl = `/verify-email?q=${token}`;

  // Gửi email OTP đến người dùng
  await sendOTPVerificationEmail(email, otp);

  // Lưu người dùng với OTP mới
  await user.save();

  // Trả về URL chứa token
  return verifyUrl;
};

// Xác nhận OTP và đặt lại mật khẩu
const confirmOTPAndResetPassword = async (email, otp, newPassword, confirmPassword) => {
  // Lấy dữ liệu người dùng
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  // Kiểm tra thời gian hết hạn của OTP
  if (user.otpExpires < Date.now()) {
    throw new Error('OTP đã hết hạn');
  }

  // So sánh OTP
  if (user.otp !== otp) {
    throw new Error('OTP không chính xác');
  }

  // So sánh 2 mật khẩu
  if (newPassword !== confirmPassword) {
    throw new Error('2 mật khẩu không trùng khớp');
  }

  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu người dùng trong database
  await User.updateOne(
    { email },
    {
      password: hashedPassword, // Cập nhật mật khẩu mới
      $unset: { otp: "", otpExpires: "" } // Xóa hẳn trường OTP và thời gian hết hạn
    }
  );

  return 'Đặt lại mật khẩu thành công';
};

const findOrCreateUser = async (profile) => {
  const { id, displayName, emails } = profile;

  // Kiểm tra xem email đã tồn tại trong database chưa
  let user = await User.findOne({ email: emails[0].value });

  if (!user) {
    // Tạo địa chỉ mới
    const address = new Addresses();
    await address.save();
    console.log(displayName)
    // Tạo thông tin hồ sơ người dùng mới
    const userProfile = new UserProfile({
      firstName: displayName.split(' ')[0] || '',
      lastName: displayName.split(' ')[1] || '',
      phoneNumber : '',
      profile_addresses: [address._id], // Gắn địa chỉ vào profile
    });
    await userProfile.save();

    // Tạo người dùng mới
    user = new User({
      email: emails[0].value,
      verified: true, // Người dùng qua Google thường đã xác minh
      role: 'user',
      __id: id, // Lưu Google ID để tham chiếu
      user_profile: userProfile._id, // Gắn hồ sơ vào người dùng
    });
    console.log(123)
    // Lưu người dùng mới vào database
    await user.save();
  }

  return user;
};

const generateJWT = (user) => {
  // Chuẩn bị payload cho JWT, bao gồm id, email và role của người dùng
  const payload = {
    userid: user._id,
    email: user.email,
    role: user.role,
  };

  // Tạo JWT với secret key và thời gian hết hạn (ví dụ: 1 giờ)
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};
module.exports = { registerUser, verifyOTP, loginUser, sendOTP, confirmOTPAndResetPassword ,findOrCreateUser,generateJWT};