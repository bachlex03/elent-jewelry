// Trong product.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { upload } = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Các endpoint liên quan đến Products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của sản phẩm
 *         product_code:
 *           type: string
 *           description: Mã sản phẩm
 *         product_name:
 *           type: string
 *           description: Tên sản phẩm
 *         product_price:
 *           type: number
 *           description: Giá sản phẩm
 *         product_sale_price:
 *           type: number
 *           description: Giá khuyến mãi (nếu có)
 *         product_category:
 *           type: string
 *           description: ID của danh mục sản phẩm
 *         product_details:
 *           type: object
 *           description: Chi tiết sản phẩm
 *           properties:
 *             material:
 *               type: string
 *               description: Chất liệu sản phẩm
 *             color:
 *               type: string
 *               description: Màu sắc sản phẩm
 *             length:
 *               type: string
 *               description: Chiều dài sản phẩm
 *             care_instructions:
 *               type: string
 *               description: Hướng dẫn bảo quản
 *             stone_size:
 *               type: string
 *               description: Kích thước của đá (nếu có)
 *             stone_type:
 *               type: string
 *               description: Loại đá được sử dụng trong sản phẩm
 *             design_style:
 *               type: string
 *               description: Phong cách thiết kế của sản phẩm
 *         product_images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               secure_url:
 *                 type: string
 *                 description: URL an toàn của ảnh
 *               public_id:
 *                 type: string
 *                 description: ID công khai của ảnh
 *               asset_id:
 *                 type: string
 *                 description: ID tài sản của ảnh
 *         product_isAvailable:
 *           type: boolean
 *           description: Trạng thái sản phẩm (còn hàng hay không)
 *         product_short_description:
 *           type: string
 *           description: Mô tả ngắn gọn về sản phẩm
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tạo một sản phẩm mới kèm chi tiết và hình ảnh
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: Mã sản phẩm
 *                 example: "P001"
 *               product_name:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Vòng cổ vàng"
 *               product_price:
 *                 type: number
 *                 description: Giá sản phẩm
 *                 example: 1500
 *               product_sale_price:
 *                 type: number
 *                 description: Giá khuyến mãi (nếu có)
 *                 example: 1200
 *               product_category:
 *                 type: string
 *                 description: Danh sách ID của các danh mục sản phẩm
 *                 example: 
 *               product_details:
 *                 type: object
 *                 description: Chi tiết sản phẩm
 *                 properties:
 *                   material:
 *                     type: string
 *                     description: Chất liệu sản phẩm
 *                     example: "Vàng 24k"
 *                   color:
 *                     type: string
 *                     description: Màu sắc sản phẩm
 *                     example: "Vàng"
 *                   length:
 *                     type: string
 *                     description: Chiều dài của sản phẩm
 *                     example: "40cm + 5cm"
 *                   care_instructions:
 *                     type: string
 *                     description: Hướng dẫn bảo quản
 *                     example: "Tránh tiếp xúc với hóa chất"
 *                   stone_size:
 *                     type: string
 *                     description: Kích thước của đá (nếu có)
 *                     example: "5mm"
 *                   stone_type:
 *                     type: string
 *                     description: Loại đá được sử dụng trong sản phẩm
 *                     example: "Đá quý tự nhiên"
 *                   design_style:
 *                     type: string
 *                     description: Phong cách thiết kế của sản phẩm
 *                     example: "Cổ điển"
 *               product_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Mảng các file ảnh sản phẩm (upload trực tiếp)
 *               product_isAvailable:
 *                 type: boolean
 *                 description: Trạng thái sản phẩm (còn hàng hay không)
 *                 example: true
 *               product_short_description:
 *                 type: string
 *                 description: Mô tả ngắn gọn về sản phẩm
 *                 example: "Vòng cổ vàng, thiết kế tinh tế"
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm đã được tạo thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu không hợp lệ"
 */
router.post('/', upload.array('product_images', 10), productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm đã được xóa thành công"
 *       404:
 *         description: Sản phẩm không được tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm không được tìm thấy"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID sản phẩm không hợp lệ"
 */
router.delete('/:id', productController.deleteProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: Mã sản phẩm
 *                 example: "P001"
 *               product_name:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Vòng cổ bạc"
 *               product_price:
 *                 type: number
 *                 description: Giá sản phẩm
 *                 example: 2000
 *               product_sale_price:
 *                 type: number
 *                 description: Giá khuyến mãi (nếu có)
 *                 example: 1800
 *               product_category:
 *                 type: string
 *                 description: ID của danh mục sản phẩm
 *                 example: "64dbfbb8250b6b2a8f75f8e1"
 *               product_details:
 *                 type: object
 *                 description: Chi tiết sản phẩm
 *                 properties:
 *                   material:
 *                     type: string
 *                     description: Chất liệu sản phẩm
 *                     example: "Bạc nguyên chất"
 *                   color:
 *                     type: string
 *                     description: Màu sắc sản phẩm
 *                     example: "Bạc"
 *                   length:
 *                     type: string
 *                     description: Chiều dài sản phẩm
 *                     example: "45cm"
 *                   care_instructions:
 *                     type: string
 *                     description: Hướng dẫn bảo quản
 *                     example: "Tránh tiếp xúc với nước biển"
 *                   stone_size:
 *                     type: string
 *                     description: Kích thước của đá (nếu có)
 *                     example: "3mm"
 *                   stone_type:
 *                     type: string
 *                     description: Loại đá
 *                     example: "Đá Cubic Zirconia"
 *                   design_style:
 *                     type: string
 *                     description: Phong cách thiết kế
 *                     example: "Hiện đại"
 *               product_images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Mảng file ảnh sản phẩm mới (nếu có)
 *               product_isAvailable:
 *                 type: boolean
 *                 description: Trạng thái sản phẩm
 *                 example: true
 *               product_short_description:
 *                 type: string
 *                 description: Mô tả ngắn gọn về sản phẩm
 *                 example: "Vòng cổ bạc tinh tế, thích hợp cho mọi sự kiện"
 *     responses:
 *       200:
 *         description: Sản phẩm đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm đã được cập nhật thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Sản phẩm không được tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sản phẩm không được tìm thấy"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID sản phẩm không hợp lệ"
 */

router.put('/:id', upload.array('product_images', 10), productController.updateProduct);

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trả về
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại của kết quả
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Tổng số lượng sản phẩm
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                 currentPage:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu không hợp lệ"
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy sản phẩm"
 */
router.get('/all', productController.getAllProducts);

/**
 * @swagger
 * /products/detail/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm thông qua ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ProductDetails cần lấy thông tin
 *         example: 671536a0ad4403241eaae445
 *     responses:
 *       200:
 *         description: Lấy thông tin chi tiết sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin chi tiết sản phẩm thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID của ProductDetail
 *                     material:
 *                       type: string
 *                       description: Chất liệu của sản phẩm
 *                       example: "Gold"
 *                     color:
 *                       type: string
 *                       description: Màu sắc của sản phẩm
 *                       example: "Yellow"
 *                     length:
 *                       type: string
 *                       description: Chiều dài của sản phẩm
 *                       example: "50cm"
 *                     care_instructions:
 *                       type: string
 *                       description: Hướng dẫn bảo quản
 *                       example: "Avoid exposure to chemicals"
 *                     stone_size:
 *                       type: string
 *                       description: Kích thước đá
 *                       example: "5mm"
 *                     stone_type:
 *                       type: string
 *                       description: Loại đá
 *                       example: "Natural Gemstone"
 *                     design_style:
 *                       type: string
 *                       description: Phong cách thiết kế
 *                       example: "Classic"
 *                     product_images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           secure_url:
 *                             type: string
 *                             example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *                           public_id:
 *                             type: string
 *                             example: "sample_public_id"
 *                           asset_id:
 *                             type: string
 *                             example: "sample_asset_id"
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu không hợp lệ"
 *       404:
 *         description: Không tìm thấy thông tin chi tiết sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy thông tin chi tiết sản phẩm"
 */
router.get('/detail/:id', productController.getProductDetailsById);

/**
 * @swagger
 * /products/category/{idCategory}:
 *   get:
 *     summary: Lấy danh sách sản phẩm theo ID danh mục, có hỗ trợ phân trang
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: idCategory
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của danh mục sản phẩm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Số trang (mặc định là 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 16
 *         required: false
 *         description: Số lượng sản phẩm mỗi trang (mặc định là 16)
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm theo ID danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin sản phẩm thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalProducts:
 *                       type: integer
 *                       example: 160
 *       404:
 *         description: Không tìm thấy danh mục hoặc sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy sản phẩm theo danh mục này"
 */
router.get('/category/:idCategory', productController.getProductsByCategory);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo từ khóa
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm sản phẩm
 *         example: "giày"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trả về
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại của kết quả
 *         example: 1
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Tổng số sản phẩm phù hợp
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                 currentPage:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu không hợp lệ"
 *       404:
 *         description: Không tìm thấy sản phẩm phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm"
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Lọc sản phẩm theo tiêu chí
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: priceRanges
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Các khoảng giá cần lọc
 *         example: ["2 triệu - 3 triệu", "5 triệu - 10 triệu"]
 *       - in: query
 *         name: materials
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Các chất liệu cần lọc
 *         example: ["Bạc Ý 925", "Ngọc Trai"]
 *       - in: query
 *         name: sizes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Các kích thước cần lọc
 *         example: ["Nhỏ", "Trung"]
 *       - in: query
 *         name: idcategory
 *         schema:
 *           type: string
 *         description: ID của danh mục sản phẩm cần lọc (có thể bỏ trống)
 *         example: "64a57df22b8a3c987ef0d1d3"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trên mỗi trang
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *         example: 1
 *     responses:
 *       200:
 *         description: Lọc sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Tổng số sản phẩm phù hợp
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                 currentPage:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu không hợp lệ"
 */

router.get('/filter', productController.filterProducts);

/**
 * @swagger
 * /products/sales:
 *   get:
 *     summary: Lấy danh sách sản phẩm đang sale
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng sản phẩm trả về
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại của kết quả
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Tổng số lượng sản phẩm
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *                 currentPage:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu không hợp lệ"
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy sản phẩm"
 */
router.get('/sales', productController.getSaleProducts);

module.exports = router;