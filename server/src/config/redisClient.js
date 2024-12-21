// const redis = require('redis');
// require('dotenv').config(); // Đảm bảo rằng biến môi trường từ .env được nạp

// // Tạo client Redis từ URL trong biến môi trường
// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379',
// });

// // Kết nối tới Redis
// redisClient.on('connect', () => {
//   console.log('Đã kết nối tới Redis');
// });

// // Xử lý lỗi kết nối
// redisClient.on('error', (err) => {
//   console.log('Redis error: ', err);
// });

// // Kết nối Redis
// (async () => {
//   await redisClient.connect(); // Sử dụng kết nối bất đồng bộ
// })();

// module.exports = redisClient;
