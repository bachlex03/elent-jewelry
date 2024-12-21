const express = require('express');
const router = express.Router();

// Import routes
const adminRoutes = require('./admin.route')
const userRoutes = require('./user.route'); // Thay đổi đường dẫn nếu cần
const authRoutes = require('./auth.route');
const categoriesRoutes = require('./category.route');
const products = require('./product.route');
const review = require('./review.route')
const discount = require('./discount.route');
const payment = require('./payment.route')
const vnpay = require('./vnpay.route')
const invoice = require('./invoice.route')
// Đăng ký các routes
router.use('/users', userRoutes); // Đảm bảo sử dụng router cho users
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products' , products);
router.use('/reviews' , review);
router.use('/discounts' , discount);
router.use('/payment' , payment)
router.use('/vnpay',vnpay);
router.use('/invoices',invoice)
module.exports = router;
