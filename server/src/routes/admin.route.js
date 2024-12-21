const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Các endpoint liên quan đến User
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Lấy thông tin của tất cả người dùng
 *     description: API này sẽ trả về danh sách tất cả người dùng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID của người dùng
 *                       firstName:
 *                         type: string
 *                         description: Tên của người dùng
 *                       lastName:
 *                         type: string
 *                         description: Họ của người dùng
 *                       email:
 *                         type: string
 *                         description: Email của người dùng
 *                       phoneNumber:
 *                         type: string
 *                         description: Số điện thoại của người dùng
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Ngày tạo tài khoản
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Ngày cập nhật tài khoản
 *       500:
 *         description: Lỗi server
 */
router.get('/users', adminController.getAllUsers);


/**
 * @swagger
 * /admin/getAllInvoices:
 *   get:
 *     summary: Lấy tất cả hóa đơn
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Danh sách tất cả hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   orderCode:
 *                     type: string
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                   paymentMethod:
 *                     type: string
 *                   amountToPay:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Lỗi server
 */
router.get('/getAllInvoices', adminController.getAllInvoices); 


/**
 * @swagger
 * /admin/getAllProducts:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_code:
 *                     type: string
 *                     description: Mã sản phẩm
 *                   product_name:
 *                     type: string
 *                     description: Tên sản phẩm
 *                   product_price:
 *                     type: number
 *                     description: Giá sản phẩm
 *                   product_sale_price:
 *                     type: number
 *                     description: Giá giảm giá
 *                   product_category:
 *                     type: string
 *                     description: Danh mục sản phẩm
 *                   product_isAvailable:
 *                     type: boolean
 *                     description: Trạng thái sản phẩm
 *                   product_short_description:
 *                     type: string
 *                     description: Mô tả ngắn
 *                   product_details:
 *                     type: object
 *                     properties:
 *                       product_images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             secure_url:
 *                               type: string
 *                               description: URL ảnh
 *                             public_id:
 *                               type: string
 *                               description: ID ảnh công khai
 *                             asset_id:
 *                               type: string
 *                               description: ID tài sản
 *       500:
 *         description: Lỗi server
 */
router.get('/getAllProducts', adminController.getAllProducts);

/**
 * @swagger
 * /admin/getAllDiscounts:
 *   get:
 *     summary: Lấy danh sách mã giảm giá
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Tên mã giảm giá
 *                   condition:
 *                     type: string
 *                     description: Điều kiện áp dụng
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     description: Ngày bắt đầu
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     description: Ngày kết thúc
 *                   discountAmount:
 *                     type: number
 *                     description: Số tiền giảm giá
 *       500:
 *         description: Lỗi server
 */
router.get('/getAllDiscounts', adminController.getAllDiscounts);

/**
 * @swagger
 * /admin/getAllCategories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Danh sách tất cả danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_name:
 *                     type: string
 *                     description: Tên danh mục
 *                   category_slug:
 *                     type: string
 *                     description: Slug của danh mục
 *                   category_type:
 *                     type: string
 *                     description: Loại danh mục
 *                   category_parentId:
 *                     type: string
 *                     description: ID danh mục cha (nếu có)
 *       500:
 *         description: Lỗi server
 */
router.get('/getAllCategories', adminController.getAllCategories);

module.exports = router;