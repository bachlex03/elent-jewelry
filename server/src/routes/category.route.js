const express = require('express');
const router = express.Router();
const  categoryController  = require('../controllers/category.controller');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Các endpoint liên quan đến Categories
 */

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Tạo danh mục
 *     description: Tạo danh mục mới có thể là cha, con hoặc cháu
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: Tên danh mục
 *                 example: Dây chuyền
 *               category_slug:
 *                 type: string
 *                 description: Đường dẫn thân thiện
 *                 example: day-chuyen
 *               category_type:
 *                 type: string
 *                 enum: [chất liệu, đối tượng, loại, hình]
 *                 description: Loại danh mục
 *                 example: loại
 *     responses:
 *       201:
 *         description: Danh mục đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Danh mục đã được tạo 
 *                 categoryId:
 *                   type: string
 *                   example: 60a65b67f97a3a6e8c8b4567
 *       500:
 *         description: Lỗi máy chủ
 */

router.post('/create', categoryController.createCategory);

/**
 * @swagger
 * /categories/parents:
 *   get:
 *     summary: Lấy các danh mục cha
 *     description: Lấy tất cả các danh mục cha (có category_parentId = null)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách các danh mục cha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60a65b67f97a3a6e8c8b4567
 *                   category_name:
 *                     type: string
 *                     example: Dây chuyền
 *                   category_slug:
 *                     type: string
 *                     example: day-chuyen
 *                   category_type:
 *                     type: string
 *                     example: loại
 *                   category_parentId:
 *                     type: string
 *                     example: null
 *       500:
 *         description: Lỗi máy chủ
 */

router.get('/parents', categoryController.getParentCategories);

/**
 * @swagger
 * /categories/{parentId}:
 *   get:
 *     summary: Lấy các danh mục con theo ID cha
 *     description: Lấy tất cả các danh mục có category_parentId là ID của danh mục cha
 *     tags: [Categories]
 *     parameters:
 *       - name: parentId
 *         in: path
 *         required: true
 *         description: ID của danh mục cha
 *         schema:
 *           type: string
 *           example: 
 *     responses:
 *       200:
 *         description: Danh sách các danh mục con
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 
 *                   category_name:
 *                     type: string
 *                     example: Nhẫn
 *                   category_slug:
 *                     type: string
 *                     example: nhan
 *                   category_type:
 *                     type: string
 *                     example: loại
 *                   category_parentId:
 *                     type: string
 *                     example: 60a65b67f97a3a6e8c8b4567
 *       404:
 *         description: Không tìm thấy danh mục cha
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:parentId', categoryController.getChildCategoriesByParentId);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     description: Cập nhật thông tin danh mục bằng ID, kiểm tra các điều kiện về ID parent và slug. Nếu slug trùng với danh mục cha, gán parent mới và cập nhật slug bằng tên danh mục.
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của danh mục cần cập nhật
 *         schema:
 *           type: string
 *           example: 60a65b67f97a3a6e8c8b4567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: Tên danh mục
 *                 example: Nhẫn vàng
 *               category_slug:
 *                 type: string
 *                 description: Đường dẫn thân thiện
 *                 example: nhan-vang
 *               category_type:
 *                 type: string
 *                 enum: [chất liệu, đối tượng, loại, hình]
 *                 description: Loại danh mục
 *                 example: loại
 *     responses:
 *       200:
 *         description: Danh mục đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Danh mục đã được cập nhật
 *                 category:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60a65b67f97a3a6e8c8b4567
 *                     category_name:
 *                       type: string
 *                       example: Nhẫn vàng
 *                     category_slug:
 *                       type: string
 *                       example: nhan-vang
 *                     category_type:
 *                       type: string
 *                       example: loại
 *       404:
 *         description: Không tìm thấy danh mục để cập nhật
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     description: Xóa danh mục theo ID, nếu là danh mục cha thì xóa luôn cả các danh mục con liên quan.
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của danh mục cần xóa
 *         schema:
 *           type: string
 *           example: 60a65b67f97a3a6e8c8b4567
 *     responses:
 *       200:
 *         description: Danh mục đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Danh mục đã được xóa thành công
 *       404:
 *         description: Không tìm thấy danh mục để xóa
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', categoryController.deleteCategory);


module.exports = router;
