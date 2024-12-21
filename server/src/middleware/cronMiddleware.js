// middleware/cronMiddleware.js
const cron = require('node-cron');
const User = require('../models/user.model'); // Đường dẫn tới model User

// Tạo middleware để chạy cron job
const cronMiddleware = () => {
  // Chạy cron job 10 ngày để kiểm tra người dùng chưa xác thực
  cron.schedule('0 0 */10 * *', async () => {
    const expiredUsers = await User.find({
      verified: false,
      otpExpires: { $lt: Date.now() }, // Tìm người dùng có otpExpires nhỏ hơn hiện tại (đã hết hạn)
    });
    if (expiredUsers.length > 0) {
      await User.deleteMany({
        _id: { $in: expiredUsers.map(user => user._id) }, // Xóa những người dùng chưa xác thực
      });
      console.log(`${expiredUsers.length} người dùng đã bị xóa do không xác thực sau 5 phút.`);
    }
  });
};

module.exports = cronMiddleware;
