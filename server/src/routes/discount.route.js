const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discount.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     DiscountCode:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của mã giảm giá
 *           example: 610b9b9b1f4b2a0015f5c3c9
 *         name:
 *           type: string
 *           description: Tên mã giảm giá
 *           example: SUMMER2024
 *         condition:
 *           type: number
 *           description: Điều kiện áp dụng
 *           example: 1000
 *         startDate:
 *           type: string
 *           format: date
 *           description: Ngày bắt đầu áp dụng mã giảm giá
 *           example: 2024-01-01
 *         endDate:
 *           type: string
 *           format: date
 *           description: Ngày kết thúc mã giảm giá
 *           example: 2024-12-31
 *         discountAmount:
 *           type: number
 *           description: Số tiền hoặc phần trăm giảm giá
 *           example: 20
 *         discountType:
 *           type: string
 *           enum: ['percent', 'fixed']
 *           description: Kiểu giảm giá (phần trăm hoặc cố định)
 *           example: percent
 */


/**
 * @swagger
 * tags:
 *   - name: Discounts
 *     description: CRUD Discounts
 */

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Tạo mới một mã giảm giá
 *     description: API này cho phép tạo một mã giảm giá mới.
 *     tags:
 *       - Discounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: SUMMER2024
 *                 description: Tên của mã giảm giá
 *               condition:
 *                 type: number
 *                 example: 1000
 *                 description: Điều kiện áp dụng mã giảm giá
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-01
 *                 description: Ngày bắt đầu áp dụng mã giảm giá
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-31
 *                 description: Ngày kết thúc mã giảm giá
 *               discountAmount:
 *                 type: number
 *                 example: 20
 *                 description: Số tiền hoặc phần trăm giảm giá
 *               discountType:
 *                 type: string
 *                 enum: ['percent', 'fixed']
 *                 example: percent
 *                 description: Kiểu giảm giá (phần trăm hoặc số tiền cố định)
 *     responses:
 *       201:
 *         description: Mã giảm giá được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount created successfully
 *                 discount:
 *                   $ref: '#/components/schemas/DiscountCode'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

// Route để tạo mã giảm giá mới, liên kết với controller
router.post('/', discountController.createDiscount);

/**
 * @swagger
 * /discounts/all:
 *   get:
 *     summary: Lấy tất cả mã giảm giá
 *     description: API này trả về danh sách tất cả các mã giảm giá.
 *     tags:
 *       - Discounts
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountCode'
 *       500:
 *         description: Lỗi máy chủ
 */

// Route để lấy tất cả mã giảm giá
router.get('/all', discountController.getAllDiscounts);


/**
 * @swagger
 * /discounts/{id}:
 *   patch:
 *     summary: Cập nhật mã giảm giá theo id
 *     description: API này cho phép cập nhật thông tin mã giảm giá dựa trên ID.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               condition:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               discountAmount:
 *                 type: number
 *               discountType:
 *                 type: string
 *                 enum: ['percent', 'fixed']
 *     responses:
 *       200:
 *         description: Mã giảm giá được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount updated successfully
 *                 discount:
 *                   $ref: '#/components/schemas/DiscountCode'
 *       404:
 *         description: Không tìm thấy mã giảm giá
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
// Route để cập nhật mã giảm giá theo id
router.patch('/:id', discountController.updateDiscountById);


/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Xóa một mã giảm giá theo ID
 *     description: API này cho phép xóa một mã giảm giá bằng ID.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của mã giảm giá cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa mã giảm giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discount deleted successfully
 *       404:
 *         description: Không tìm thấy mã giảm giá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', discountController.deleteDiscount);

/**
 * @swagger
 * /discounts/validate-total:
 *   get:
 *     summary: Lấy các mã giảm giá thỏa mãn tổng giá tiền
 *     description: API này trả về tất cả các mã giảm giá nếu tổng giá tiền lớn hơn hoặc bằng `condition`.
 *     tags:
 *       - Discounts
 *     parameters:
 *       - in: query
 *         name: totalPrice
 *         required: true
 *         schema:
 *           type: number
 *           example: 1500
 *           description: Tổng giá trị đơn hàng
 *     responses:
 *       200:
 *         description: Trả về danh sách các mã giảm giá phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiscountCode'
 *       400:
 *         description: Không có mã giảm giá phù hợp
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/validate-total', discountController.getDiscountsByTotalPrice);

module.exports = router;
