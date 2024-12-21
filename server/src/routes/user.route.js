const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Các endpoint liên quan đến User
 */

/**
 * @swagger
 * /users/profiles/{email}:
 *   get:
 *     tags: 
 *       - User 
 *     summary: Lấy thông tin chi tiết của người dùng dựa trên email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email của người dùng cần lấy thông tin
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 age:
 *                   type: number
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/profiles/:email', userController.getProfileByEmail);

/**
 * @swagger
 * /users/profiles/{email}:
 *   put:
 *     tags: 
 *       - User
 *     summary: Cập nhật thông tin cá nhân dựa trên email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email của người dùng cần cập nhật   
 *         schema:
 *           type: string
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
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */

router.put('/profiles/:email', userController.updateProfileByEmail);


/**
 * @swagger
 * /users/change-password/{email}:
 *   put:
 *     tags: 
 *       - User
 *     summary: Đổi mật khẩu của người dùng dựa trên email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email của người dùng cần đổi mật khẩu
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu cũ của người dùng
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới của người dùng
 *               confirmNewPassword:
 *                 type: string
 *                 description: Nhập lại mật khẩu mới để xác nhận
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đổi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc mật khẩu mới không khớp
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.put('/change-password/:email', userController.changePasswordByEmail);

/**
 * @swagger
 * /users/addresses/{email}:
 *   post:
 *     tags: 
 *       - User
 *     summary: Thêm địa chỉ mới cho người dùng dựa trên email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email của người dùng cần thêm địa chỉ mới
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: Quốc gia của địa chỉ
 *                 example: "Vietnam"
 *               city:
 *                 type: string
 *                 description: Thành phố của địa chỉ
 *                 example: "Hồ Chí Minh"
 *               district:
 *                 type: string
 *                 description: Quận của địa chỉ
 *                 example: "Quận 1"
 *               addressLine:
 *                 type: string
 *                 description: Địa chỉ cụ thể (số nhà, tên đường, ...)
 *                 example: "123 Nguyễn Huệ"
 *     responses:
 *       201:
 *         description: Địa chỉ đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Địa chỉ mới đã được thêm"
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */

router.post('/addresses/:email', userController.createAddressByEmail);

/**
 * @swagger
 * /users/addresses/{ObjectId}:
 *   put:
 *     tags:
 *       - User
 *     summary: Cập nhật địa chỉ của người dùng dựa trên ID địa chỉ
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         description: ID của địa chỉ cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: Quốc gia
 *               city:
 *                 type: string
 *                 description: Thành phố
 *               district:
 *                 type: string
 *                 description: Quận/Huyện
 *               addressLine:
 *                 type: string
 *                 description: Địa chỉ chi tiết
 *     responses:
 *       200:
 *         description: Địa chỉ đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật địa chỉ thành công"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy địa chỉ
 *       500:
 *         description: Lỗi server
 */
router.put('/addresses/:ObjectId', userController.updateAddressById);

/**
 * @swagger
 * /users/addresses/{email}:
 *   get:
 *     tags: 
 *       - User
 *     summary: Lấy tất cả địa chỉ của người dùng dựa trên email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email của người dùng cần lấy địa chỉ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách địa chỉ của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   district:
 *                     type: string
 *                   addressLine:
 *                     type: string
 *       404:
 *         description: Không tìm thấy người dùng hoặc địa chỉ
 *       500:
 *         description: Lỗi server
 */
router.get('/addresses/:email', userController.getAddressesByEmail);

/**
 * @swagger
 * /users/addresses/{ObjectId}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Xóa địa chỉ của người dùng dựa trên ID địa chỉ
 *     parameters:
 *       - in: path
 *         name: ObjectId
 *         required: true
 *         description: ID của địa chỉ cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Địa chỉ đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Địa chỉ đã được xóa thành công"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy địa chỉ
 *       500:
 *         description: Lỗi server
 */
router.delete('/addresses/:ObjectId', userController.deleteAddressById);

module.exports = router;
