const nodemailer = require('nodemailer');

// Cấu hình transporter cho nodemailer (ở đây dùng Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenduy7003@gmail.com', // Thay bằng email của bạn
    pass: 'tesf daab xvbr fyqo',  // Thay bằng mật khẩu email của bạn
  },
});

// Hàm gửi OTP qua email
const sendOTPVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: 'nguyenduy7003@gmail.com',
    to: email,
    subject: 'Xác nhận đăng ký - OTP',
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn trong 1 phút.`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPVerificationEmail };
