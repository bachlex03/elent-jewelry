const authService = require('../services/auth.service');
const passport = require('passport');

// đăng kí
const register = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const result = await authService.registerUser({ firstName, lastName, email, phoneNumber, password });
    res.status(201).json({ user: result });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};
// Controller xác thực OTP
const verifyOTP = async (req, res) => {

  const { q } = req.query; // JWT từ query
  const {otp } = req.body; // Email và OTP từ body
  try {
    // Gọi hàm verifyOTP trong controller và truyền vào các tham số
    const result = await authService.verifyOTP(q, otp);
    res.status(200).json(result); // Trả về thông báo thành công nếu OTP đúng
  } catch (error) {
    res.status(400).json({ error: error.message }); // Trả về lỗi nếu OTP không đúng
  }
};
// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Gọi dịch vụ đăng nhập
    const result = await authService.loginUser(email, password);
    
    if (result.accessToken) {
      // Nếu có accessToken, có nghĩa là đăng nhập thành công
      return res.status(200).json(result); // Gửi phản hồi với token
    } else if (result.verifyUrl) {
      // Nếu chưa xác thực và cần OTP
      return res.status(200).json(result); // Gửi phản hồi với URL xác thực OTP
    }

  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
// Hàm làm mới Access Token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh Token không hợp lệ' });
  }

  try {
    // Kiểm tra và xác thực Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Tạo Access Token mới
    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// Gửi OTP qua email
const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const message = await authService.sendOTP(email);
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// Xác nhận OTP và đặt lại mật khẩu
const confirmOTPAndResetPassword = async (req, res) => {
  const {q} = req.query
  const { otp, newPassword , confirmPassword} = req.body; // Lấy email, OTP và mật khẩu mới từ body
  try {
    const message = await authService.confirmOTPAndResetPassword(q, otp, newPassword,confirmPassword);
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Redirects user to Google for authentication
const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
const googleCallback = (req, res) => {
  try {
    // Lấy user đã xác thực từ req.user sau khi qua middleware
    const user = req.user;
    console.log('user' ,user)
    // Tạo JWT token
    const token = authService.generateJWT(user);
    console.log('Token:', token);

    // Trả về token và thông tin người dùng
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Token generation failed:', error);
    res.status(500).json({ message: 'Token generation failed' });
  }
};

// Export các controller
module.exports = { login, register, verifyOTP, refreshAccessToken, sendOTP, confirmOTPAndResetPassword ,googleLogin,googleCallback};