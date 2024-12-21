const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Các endpoint liên quan đến Login , register
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công và gửi OTP qua email
 *       400:
 *         description: Lỗi khi tạo tài khoản
 */
router.post('/register', authController.register); // Đăng ký tài khoản và gửi OTP


/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực OTP khi đăng ký
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: JWT chứa email để xác thực
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *       400:
 *         description: Lỗi xác thực OTP
 */
router.post('/verify-otp', authController.verifyOTP); // Xác thực OTP

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       400:
 *         description: Thông tin đăng nhập không hợp lệ
 *       401:
 *         description: Sai mật khẩu hoặc email
 */
router.post('/login', authController.login); // Đăng nhập tài khoản

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi OTP đến email để đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Địa chỉ email của người dùng"
 *     responses:
 *       200:
 *         description: "OTP đã được gửi qua email"
 *       400:
 *         description: "Lỗi khi gửi OTP; ví dụ: email không tồn tại"
 */
router.post('/send-otp', authController.sendOTP); // Yêu cầu đặt lại mật khẩu


/**
 * @swagger
 * /auth/reset-password:
 *   put:
 *     tags: [Auth]
 *     summary: Xác nhận OTP và đặt lại mật khẩu
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: JWT chứa thông tin email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: "OTP được gửi đến email"
 *               newPassword:
 *                 type: string
 *                 description: "Mật khẩu mới mà người dùng muốn đặt"
 *               confirmPassword:
 *                 type: string
 *                 description: "Xác nhận lại mật khẩu"
 *     responses:
 *       200:
 *         description: "Đặt lại mật khẩu thành công"
 *       400:
 *         description: "Lỗi khi xác nhận đặt lại mật khẩu; ví dụ: OTP không chính xác, mật khẩu không trùng khớp hoặc đã hết hạn"
 */

router.put('/reset-password', authController.confirmOTPAndResetPassword); // Xác nhận đặt lại mật khẩu

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Đăng nhập bằng Google
 *     description: Chuyển hướng người dùng đến trang đăng nhập Google.
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang đăng nhập Google.
 */
router.get('/google', authController.googleLogin); // Chuyển hướng đến Google login
router.get(
    '/google/callback',
    (req, res, next) => {
      console.log('Google callback middleware triggered');
      next();
    },
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);


// Route làm mới Access Token
router.post('/refresh-token', authController.refreshAccessToken); 

module.exports = router;
