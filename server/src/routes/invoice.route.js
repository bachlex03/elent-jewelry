const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

/**
 * @swagger
 * tags:
 *   - name: Invoice
 *     description: Các endpoint liên quan đến Invoice
 */

/**
 * @swagger
 * /invoices/getAll:
 *   get:
 *     summary: Lấy tất cả hóa đơn của người dùng theo ID
 *     tags: [Invoice]
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách hóa đơn của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy hóa đơn
 *       500:
 *         description: Lỗi server
 */

// Chỉnh sửa route để lấy userId từ query parameters
router.get('/getAll', invoiceController.getAllInvoiceByUser);


/**
 * @swagger
 * /invoices/getInvoiceDetail:
 *   get:
 *     summary: Lấy thông tin chi tiết của một hóa đơn theo ID
 *     tags: [Invoice]
 *     parameters:
 *       - name: invoiceId
 *         in: query
 *         required: true
 *         description: ID của hóa đơn
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của hóa đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 orderCode:
 *                   type: string
 *                 purchaseDate:
 *                   type: string
 *                   format: date-time
 *                 paymentMethod:
 *                   type: string
 *                 amountToPay:
 *                   type: number
 *                 status:
 *                   type: string
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy hóa đơn
 *       500:
 *         description: Lỗi server
 */

router.get('/getInvoiceDetail', invoiceController.getInvoiceDetailsById);
/**
 * @swagger
 * /invoices/updateInvoice:
 *   put:
 *     summary: Cập nhật thông tin của một hóa đơn theo ID
 *     tags: [Admin]
 *     parameters:
 *       - name: invoiceId
 *         in: query
 *         required: true
 *         description: ID của hóa đơn cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Trạng thái đơn hàng mới
 *     responses:
 *       200:
 *         description: Cập nhật hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hóa đơn đã được cập nhật thành công"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy hóa đơn
 *       500:
 *         description: Lỗi server
 */

router.put('/updateInvoice', invoiceController.updateInvoiceById);


/**
 * @swagger
 * /invoices/retryPayment:
 *   post:
 *     summary: Thực hiện thanh toán lại cho hóa đơn
 *     tags: [Invoice]
 *     parameters:
 *       - name: invoiceId
 *         in: query
 *         required: true
 *         description: ID của hóa đơn cần thanh toán lại
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL thanh toán đã được tạo thành công để thanh toán lại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   description: URL để thanh toán lại qua VNPay
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy hóa đơn
 *       500:
 *         description: Lỗi server
 */

router.post('/retryPayment', invoiceController.retryPayment);

module.exports = router;
