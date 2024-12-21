const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Các endpoint Payment
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     tags: [Payment]
 *     summary: Xử lý thanh toán
 *     description: Nhận thông tin thanh toán từ người dùng và trả về thông tin thanh toán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailtoken:
 *                 type: string
 *                 description: Token email của người dùng (nếu cần)
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       description: ID của sản phẩm
 *                     quantity:
 *                       type: integer
 *                       description: Số lượng của sản phẩm
 *               discount_id:
 *                 type: string
 *                 description: ID của mã giảm giá
 *     responses:
 *       200:
 *         description: Thông tin thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thanh toán thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAmount:
 *                       type: number
 *                       example: 100000
 *                     discountApplied:
 *                       type: number
 *                       example: 10000
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi server
 */

router.post("/", paymentController.confirmInforPayment);

/**
 * @swagger
 * /payment/create:
 *   post:
 *     tags: [Payment]
 *     summary: Xử lý thanh toán
 *     description: Nhận thông tin thanh toán từ người dùng và trả về thông tin thanh toán
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               address:
 *                 type: string
 *                 description: ID của địa chỉ có sẵn (được chọn từ danh sách địa chỉ của người dùng)
 *               otherAddress:
 *                 type: object
 *                 description: Địa chỉ khác nếu có (tạo mới)
 *                 properties:
 *                   country:
 *                     type: string
 *                     description: Quốc gia
 *                     example: "Vietnam"
 *                   city:
 *                     type: string
 *                     description: Thành phố
 *                     example: "Hanoi"
 *                   district:
 *                     type: string
 *                     description: Quận/Huyện
 *                     example: "Hoan Kiem"
 *                   addressLine:
 *                     type: string
 *                     description: Địa chỉ chi tiết
 *                     example: "123 Đường ABC"
 *               paymentMethod:
 *                 type: string
 *                 description: Phương thức thanh toán
 *                 enum: [vnpay, cod, momo]
 *               items:
 *                 type: array
 *                 description: Danh sách sản phẩm và số lượng
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       description: ID của sản phẩm
 *                     quantity:
 *                       type: integer
 *                       description: Số lượng của sản phẩm
 *               discount_id:
 *                 type: string
 *                 description: ID của mã giảm giá
 *               totalAmount:
 *                 type: number
 *                 description: Tổng giá tiền trước khi giảm
 *     responses:
 *       200:
 *         description: Thông tin thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thanh toán thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     phoneNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     address:
 *                       type: object
 *                       properties:
 *                         country:
 *                           type: string
 *                           example: "Vietnam"
 *                         city:
 *                           type: string
 *                           example: "Hanoi"
 *                         district:
 *                           type: string
 *                           example: "Hoan Kiem"
 *                         addressLine:
 *                           type: string
 *                           example: "123 Đường ABC"
 *                     paymentMethod:
 *                       type: string
 *                       example: "vnpay"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: string
 *                             example: "60c72b1f9b1e8a001c5e5b3c"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                     discount_id:
 *                       type: string
 *                       example: "5f6e8b8e0e7b0f001cc6e5d2"
 *                     totalAmount:
 *                       type: number
 *                       example: 100000
 *                     discountApplied:
 *                       type: number
 *                       example: 10000
 *                     finalAmount:
 *                       type: number
 *                       example: 90000
 *       400:
 *         description: Thông tin không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/create", paymentController.createPayment);

module.exports = router;
