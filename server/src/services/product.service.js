// // services/productService.js
// const Product = require("../models/product.model");
// const ProductDetail = require("../models/productDetail.model");
// const Image = require("../models/image.model");
// const Category = require("../models/category.model");
// const cloudinaryService = require('../cloudinary/cloudinary.service');
// const mongoose = require('mongoose')

// const validateCategory = async (categoryId) => {
//   // Kiểm tra nếu categoryId là một ObjectId hợp lệ
//   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//     throw new Error(`Danh mục với ID "${categoryId}" không hợp lệ.`);
//   }

//   // Kiểm tra sự tồn tại của danh mục
//   const categoryExists = await Category.findById(categoryId);
//   if (!categoryExists) {
//     throw new Error(`Danh mục với ID "${categoryId}" không tồn tại.`);
//   }

//   return categoryId;
// };
// const createProductDetail = async (productDetails, imageUrls) => {
//   if (!productDetails) return null;
//   if (typeof productDetails === 'string') {
//     try {
//       productDetails = JSON.parse(productDetails);
//     } catch (error) {
//       throw new Error('productDetails không phải là một chuỗi JSON hợp lệ');
//     }
//   }
//   // Lưu các hình ảnh vào database và lấy ObjectId của chúng
//   const imageIds = await Promise.all(
//     imageUrls.map(async (img) => {
//       const newImage = new Image({
//         asset_id: img.asset_id,
//         public_id: img.public_id,
//         format: img.format,
//         resource_type: img.resource_type,
//         secure_url: img.url,
//         original_filename: img.original_filename,
//       });
//       const savedImage = await newImage.save();
//       return savedImage._id; // Trả về ID của hình ảnh đã lưu
//     })
//   );
//   const newProductDetail = new ProductDetail({
//     material: productDetails.material, // "Vàng 24k"
//     color: productDetails.color,       // "Vàng"
//     length: productDetails.length,     // "40cm + 5cm"
//     care_instructions: productDetails.care_instructions, // "Tránh tiếp xúc với hóa chất"
//     stone_size: productDetails.stone_size, // "5mm"
//     stone_type: productDetails.stone_type, // "Đá quý tự nhiên"
//     design_style: productDetails.design_style, // "Cổ điển"
//     product_images: imageIds, // Lưu ObjectId của hình ảnh
//   });
//   const savedProductDetail = await newProductDetail.save();
//   return savedProductDetail._id; // Trả về ID của ProductDetail đã lưu
// };
// const createProduct = async (productData) => {
//   try {

//     const { product_details, productImages, product_category } = productData;
//     // Kiểm tra sự tồn tại của tất cả các danh mục trong mảng
//     const product_category_test = await validateCategory(product_category)

//     // Upload ảnh lên Cloudinary
//     const imageUrls = productImages ? await cloudinaryService.uploadToCloudinary(productImages) : [];

//     // Tạo ProductDetail
//     const productDetailId = await createProductDetail(product_details, imageUrls);

//     // Tạo sản phẩm mới với ProductDetail và các danh mục đã chọn
//     const newProduct = new Product({
//       ...productData,
//       product_details: productDetailId,
//       product_category: product_category_test,
//     });

//     const savedProduct = await newProduct.save();
//     return savedProduct;
//   } catch (error) {
//     console.log(error)
//     throw new Error(error.message);
//   }
// };

// //delete product
// const deleteProductById = async (productId) => {
//   // Tìm sản phẩm theo ID
//   const product = await Product.findById(productId).populate('product_details');

//   if (!product) {
//     throw new Error("Sản phẩm không tồn tại");
//   }

//   // Lấy chi tiết sản phẩm và hình ảnh
//   const productDetail = await ProductDetail.findById(product.product_details).populate('product_images');

//   if (productDetail && productDetail.product_images) {
//     // Xóa các hình ảnh liên quan trên Cloudinary và cơ sở dữ liệu
//     await Promise.all(productDetail.product_images.map(async (imgId) => {
//       const image = await Image.findById(imgId);
//       if (image) {
//         // Xóa ảnh trên Cloudinary
//         await cloudinaryService.deleteFromCloudinary(image.public_id);
//         // Xóa ảnh từ MongoDB
//         await image.deleteOne();
//       }
//     }));

//     // Xóa ProductDetail
//     await productDetail.deleteOne();
//   }

//   // Xóa sản phẩm
//   const deletedProduct = await Product.findByIdAndDelete(productId);
//   return deletedProduct;
// };

// //update product
// const updateProduct = async (productId, updatedProductData) => {
//   try {
//     const { product_details, productImages, product_category } = updatedProductData;
//     // Tìm sản phẩm và chi tiết sản phẩm hiện tại
//     const product = await Product.findById(productId).populate('product_details');
//     if (!product) {
//       throw new Error('Sản phẩm không tồn tại');
//     }
//     // Tìm ProductDetail hiện tại và hình ảnh hiện tại nếu có
//     const productDetail = await ProductDetail.findById(product.product_details).populate('product_images');

//     // Xóa ảnh cũ trên Cloudinary và cập nhật ảnh mới (nếu có)
//     if (productDetail && productImages) {
//       const currentImages = productDetail.product_images;

//       // Xóa các ảnh cũ trên Cloudinary
//       await Promise.all(currentImages.map(async (imgId) => {
//         const image = await Image.findById(imgId);
//         if (image) {
//           // Xóa ảnh cũ trên Cloudinary
//           await cloudinaryService.deleteFromCloudinary(image.public_id);
//           await Image.findByIdAndDelete(imgId);
//         }
//       }));

//       // Upload ảnh mới lên Cloudinary và lưu vào database
//       const newImageUrls = await cloudinaryService.uploadToCloudinary(productImages);
//       const newImageIds = await Promise.all(newImageUrls.map(async (img) => {
//         const newImage = new Image({
//           asset_id: img.asset_id,
//           public_id: img.public_id,
//           format: img.format,
//           resource_type: img.resource_type,
//           secure_url: img.url,
//           original_filename: img.original_filename,
//         });
//         const savedImage = await newImage.save();
//         return savedImage._id; // Trả về ID của hình ảnh đã lưu
//       }));

//       // Cập nhật hình ảnh trong ProductDetail
//       productDetail.product_images = newImageIds; // Cập nhật mảng hình ảnh mới
//     }

//     // Cập nhật các chi tiết khác của sản phẩm (nếu có)
//     if (productDetail) {
//       productDetail.material = product_details.material || productDetail.material;
//       productDetail.color = product_details.color || productDetail.color;
//       productDetail.length = product_details.length || productDetail.length;
//       productDetail.care_instructions = product_details.care_instructions || productDetail.care_instructions;
//       productDetail.stone_size = product_details.stone_size || productDetail.stone_size;
//       productDetail.stone_type = product_details.stone_type || productDetail.stone_type;
//       productDetail.design_style = product_details.design_style || productDetail.design_style;

//       await productDetail.save(); // Lưu lại chi tiết sản phẩm
//     }

//     // Cập nhật thông tin category cho sản phẩm nếu có
//     if (product_category) {
//       const product_category_test = await validateCategory(product_category);
//       product.product_category = product_category_test; // Cập nhật category mới
//     }
//     // Cập nhật các thông tin khác của sản phẩm
//     product.product_name = updatedProductData.product_name || product.product_name;
//     product.product_price = updatedProductData.product_price || product.product_price;
//     product.product_sale_price = updatedProductData.product_sale_price || product.product_sale_price;
//     product.product_isAvailable = updatedProductData.product_isAvailable || product.product_isAvailable;
//     product.product_short_description = updatedProductData.product_short_description || product.product_short_description;

//     // Lưu lại sản phẩm đã cập nhật
//     const updatedProduct = await product.save();
//     return updatedProduct;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Cập nhật sản phẩm thất bại');
//   }
// };

// // Hàm mới để lấy tất cả sản phẩm
// const getAllProducts = async (page = 1, limit = 16) => {
//   const skip = (page - 1) * limit;

//   // Lấy sản phẩm với product_isAvailable = true, và populate chỉ những thông tin cần thiết từ hình ảnh
//   const products = await Product.find({ product_isAvailable: true })
//     .skip(skip)
//     .limit(limit)
//     .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chỉ chọn các trường cần thiết từ sản phẩm
//     .populate({
//       path: 'product_details', // Populate chi tiết sản phẩm
//       select: 'product_images', // Chỉ chọn mảng hình ảnh
//       populate: {
//         path: 'product_images', // Populate hình ảnh của sản phẩm
//         select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
//         model: 'Image',
//       },
//     });

//   const totalProducts = await Product.countDocuments({ product_isAvailable: true });

//   return {
//     products, // Danh sách sản phẩm theo trang
//     totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
//     currentPage: page, // Trang hiện tại
//     totalProducts, // Tổng số sản phẩm
//   };
// };

// const getSaleProducts = async (page = 1, limit = 16) => {
//   const skip = (page - 1) * limit;

//   // Lấy sản phẩm với product_isAvailable = true và product_sale_price khác null
//   const products = await Product.find({
//       product_isAvailable: true,
//       product_sale_price: { $ne: null } // Điều kiện sale price khác null
//     })
//     .skip(skip)
//     .limit(limit)
//     .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description')
//     .populate({
//       path: 'product_details',
//       select: 'product_images',
//       populate: {
//         path: 'product_images',
//         select: 'secure_url public_id asset_id',
//         model: 'Image',
//       },
//     });

//   const totalProducts = await Product.countDocuments({
//       product_isAvailable: true,
//       product_sale_price: { $ne: null }
//     });

//   return {
//     products,
//     totalPages: Math.ceil(totalProducts / limit),
//     currentPage: page,
//     totalProducts,
//   };
// };

// const getProductDetailsById = async (productId) => {
//   try {
//     // Tìm sản phẩm theo ID và populate các thông tin cần thiết
//     const product = await Product.findById(productId)
//       .populate({
//         path: 'product_details', // Populate chi tiết sản phẩm
//         populate: {
//           path: 'product_images', // Populate hình ảnh của sản phẩm
//           select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
//           model: 'Image',
//         },
//       });

//     // Kiểm tra xem sản phẩm có tồn tại không
//     if (!product) {
//       return null; // Trả về null nếu không tìm thấy sản phẩm
//     }

//     return product; // Trả về sản phẩm nếu tìm thấy
//   } catch (error) {
//     throw new Error("Có lỗi xảy ra khi truy vấn sản phẩm."); // Ném lỗi nếu có lỗi xảy ra
//   }
// };

// const getProductsByCategory = async (categoryId, page = 1, limit = 16) => {
//   const skip = (page - 1) * limit;

//   try {
//     // Lấy sản phẩm dựa trên categoryId và product_isAvailable = true
//     const products = await Product.find({
//       product_category: categoryId,
//       product_isAvailable: true
//     })
//       .skip(skip)
//       .limit(limit)
//       .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chỉ chọn các trường cần thiết từ sản phẩm
//       .populate({
//         path: 'product_details', // Populate chi tiết sản phẩm
//         select: 'product_images', // Chỉ chọn mảng hình ảnh
//         populate: {
//           path: 'product_images', // Populate hình ảnh của sản phẩm
//           select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
//           model: 'Image',
//         },
//       });

//     // Tính tổng số sản phẩm thuộc danh mục
//     const totalProducts = await Product.countDocuments({
//       product_category: categoryId,
//       product_isAvailable: true
//     });

//     return {
//       products, // Danh sách sản phẩm theo trang
//       totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
//       currentPage: page, // Trang hiện tại
//       totalProducts, // Tổng số sản phẩm
//     };
//   } catch (error) {
//     throw new Error("Có lỗi xảy ra khi truy vấn sản phẩm theo danh mục."); // Ném lỗi nếu có lỗi xảy ra
//   }
// };

// // Tìm kiếm sản phẩm theo từ khóa
// const searchProducts = async (keyword, page, limit) => {
//   try {
//     const skip = (page - 1) * limit;
//     const regex = new RegExp(keyword, 'i'); // Tạo biểu thức chính quy để tìm kiếm không phân biệt hoa thường

//     // Tìm các sản phẩm dựa trên từ khóa và phân trang
//     const products = await Product.find({ product_name: regex })
//       .skip(skip)
//       .limit(limit)
//       .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chọn các trường cần thiết
//       .populate({
//         path: 'product_details', // Populate chi tiết sản phẩm
//         select: 'product_images', // Chọn mảng hình ảnh
//         populate: {
//           path: 'product_images', // Populate hình ảnh của sản phẩm
//           select: 'secure_url public_id asset_id', // Chọn các trường cần thiết từ hình ảnh
//           model: 'Image',
//         },
//       });

//     // Đếm tổng số sản phẩm khớp với từ khóa
//     const totalProducts = await Product.countDocuments({ product_name: regex });

//     return {
//       totalItems: totalProducts,
//       totalPages: Math.ceil(totalProducts / limit),
//       currentPage: page,
//       products,
//     };
//   } catch (error) {
//     throw new Error("Lỗi khi tìm kiếm sản phẩm: " + error.message);
//   }
// };

// const filterProducts = async (priceRanges, materials, sizes, idcategory, Page, Limit) => {
//   try {
//     const skip = (Page - 1) * Limit;
//     const orConditions = [];

//     // Thêm điều kiện khoảng giá
//     if (priceRanges && priceRanges.length > 0) {
//       const priceConditions = priceRanges.map(range => {
//         if (range === "Dưới 500k") {
//           return { product_price: { $lt: 500000 } };
//         } else if (range === "500k - 2 triệu") {
//           return { product_price: { $gte: 500000, $lte: 2000000 } };
//         } else if (range === "2 triệu - 3 triệu") {
//           return { product_price: { $gte: 2000000, $lte: 3000000 } };
//         } else if (range === "5 triệu - 10 triệu") {
//           return { product_price: { $gte: 5000000, $lte: 10000000 } };
//         }
//         return null; // Trả về null nếu không thỏa mãn điều kiện
//       }).filter(condition => condition !== null); // Lọc để chỉ giữ lại các điều kiện hợp lệ

//       if (priceConditions.length > 0) {
//         orConditions.push({ $or: priceConditions });
//       }
//     }

//     // Tạo điều kiện lọc cho `materials` và `sizes` trong bảng ProductDetail
//     const matchConditions = {};

//     // Lọc theo chất liệu
//     if (materials && materials.length > 0) {
//       matchConditions["product_details.material"] = { $in: materials };
//     }

//     // Lọc theo kích thước
//     if (sizes && sizes.length > 0) {
//       matchConditions["product_details.length"] = { $in: sizes };
//     }

//     // Lọc theo idcategory nếu được cung cấp
//     if (idcategory) {
//       matchConditions["product_category"] = new mongoose.Types.ObjectId(idcategory);
//     }

//     // Truy vấn sản phẩm với điều kiện lọc và phân trang
//     const products = await Product.aggregate([
//       {
//         $lookup: {
//           from: "ProductDetails", // Tên collection của ProductDetail
//           localField: "product_details",
//           foreignField: "_id",
//           as: "product_details",
//         },
//       },
//       { $unwind: "$product_details" },
//       { $match: { $and: [...orConditions, matchConditions] } },
//       { $skip: skip },
//       { $limit: Limit },
//       {
//         $lookup: {
//           from: "Images", // Tên collection của hình ảnh
//           localField: "product_details.product_images",
//           foreignField: "_id",
//           as: "product_details.product_images",
//         },
//       },
//     ]);

//     // Đếm tổng số sản phẩm phù hợp
//     const totalProducts = await Product.aggregate([
//       {
//         $lookup: {
//           from: "ProductDetails",
//           localField: "product_details",
//           foreignField: "_id",
//           as: "product_details",
//         },
//       },
//       { $unwind: "$product_details" },
//       { $match: { $and: [...orConditions, matchConditions] } },
//       { $count: "total" },
//     ]);

//     return {
//       totalItems: totalProducts[0]?.total || 0,
//       totalPages: Math.ceil((totalProducts[0]?.total || 0) / Limit),
//       currentPage: Page,
//       products,
//     };
//   } catch (error) {
//     throw new Error("Lỗi khi lọc sản phẩm: " + error.message);
//   }
// };

// module.exports = {
//   createProduct,
//   deleteProductById,
//   updateProduct,
//   getAllProducts, // Xuất hàm getAllProducts
//   getProductDetailsById,
//   getProductsByCategory,
//   searchProducts,
//   filterProducts,
//   getSaleProducts,
// };

// services/productService.js
const Product = require("../models/product.model");
const ProductDetail = require("../models/productDetail.model");
const Image = require("../models/image.model");
const Category = require("../models/category.model");
const cloudinaryService = require('../cloudinary/cloudinary.service');
const mongoose = require('mongoose')

const validateCategory = async (categoryId) => {
  // Kiểm tra nếu categoryId là một ObjectId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error(`Danh mục với ID "${categoryId}" không hợp lệ.`);
  }

  // Kiểm tra sự tồn tại của danh mục
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    throw new Error(`Danh mục với ID "${categoryId}" không tồn tại.`);
  }

  return categoryId;
};
const createProductDetail = async (productDetails, imageUrls) => {
  if (!productDetails) return null;
  if (typeof productDetails === 'string') {
    try {
      productDetails = JSON.parse(productDetails);
    } catch (error) {
      throw new Error('productDetails không phải là một chuỗi JSON hợp lệ');
    }
  }
  // Lưu các hình ảnh vào database và lấy ObjectId của chúng
  const imageIds = await Promise.all(
    imageUrls.map(async (img) => {
      const newImage = new Image({
        asset_id: img.asset_id,
        public_id: img.public_id,
        format: img.format,
        resource_type: img.resource_type,
        secure_url: img.url,
        original_filename: img.original_filename,
      });
      const savedImage = await newImage.save();
      return savedImage._id; // Trả về ID của hình ảnh đã lưu
    })
  );
  const newProductDetail = new ProductDetail({
    material: productDetails.material, // "Vàng 24k"
    color: productDetails.color,       // "Vàng"
    length: productDetails.length,     // "40cm + 5cm"
    care_instructions: productDetails.care_instructions, // "Tránh tiếp xúc với hóa chất"
    stone_size: productDetails.stone_size, // "5mm"
    stone_type: productDetails.stone_type, // "Đá quý tự nhiên"
    design_style: productDetails.design_style, // "Cổ điển"
    product_images: imageIds, // Lưu ObjectId của hình ảnh
  });
  const savedProductDetail = await newProductDetail.save();
  return savedProductDetail._id; // Trả về ID của ProductDetail đã lưu
};
const createProduct = async (productData) => {
  try {

    const { product_details, productImages, product_category } = productData;
    // Kiểm tra sự tồn tại của tất cả các danh mục trong mảng
    const product_category_test = await validateCategory(product_category)

    // Upload ảnh lên Cloudinary
    const imageUrls = productImages ? await cloudinaryService.uploadToCloudinary(productImages) : [];

    // Tạo ProductDetail
    const productDetailId = await createProductDetail(product_details, imageUrls);

    // Tạo sản phẩm mới với ProductDetail và các danh mục đã chọn
    const newProduct = new Product({
      ...productData,
      product_details: productDetailId,
      product_category: product_category_test,
    });

    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    console.log(error)
    throw new Error(error.message);
  }
};

//delete product
const deleteProductById = async (productId) => {
  // Tìm sản phẩm theo ID
  const product = await Product.findById(productId).populate('product_details');

  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  // Lấy chi tiết sản phẩm và hình ảnh
  const productDetail = await ProductDetail.findById(product.product_details).populate('product_images');

  if (productDetail && productDetail.product_images) {
    // Xóa các hình ảnh liên quan trên Cloudinary và cơ sở dữ liệu
    await Promise.all(productDetail.product_images.map(async (imgId) => {
      const image = await Image.findById(imgId);
      if (image) {
        // Xóa ảnh trên Cloudinary
        await cloudinaryService.deleteFromCloudinary(image.public_id);
        // Xóa ảnh từ MongoDB
        await image.deleteOne();
      }
    }));

    // Xóa ProductDetail
    await productDetail.deleteOne();
  }

  // Xóa sản phẩm
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return deletedProduct;
};

//update product
const updateProduct = async (productId, updatedProductData) => {
  try {
    let { product_details, productImages, product_category } = updatedProductData;
    product_details = JSON.parse(product_details);
    console.log("product_details",product_details)
    const product = await Product.findById(productId).populate('product_details');
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    // Tìm ProductDetail hiện tại và hình ảnh hiện tại nếu có
    const productDetail = await ProductDetail.findById(product.product_details).populate('product_images');
 
    // Xóa ảnh cũ trên Cloudinary và cập nhật ảnh mới (nếu có)
    if (productDetail && productImages) {
      const currentImages = productDetail.product_images;

      // Xóa các ảnh cũ trên Cloudinary
      await Promise.all(currentImages.map(async (imgId) => {
        const image = await Image.findById(imgId);
        if (image) {
          // Xóa ảnh cũ trên Cloudinary
          await cloudinaryService.deleteFromCloudinary(image.public_id);
          await Image.findByIdAndDelete(imgId);
        }
      }));

      // Upload ảnh mới lên Cloudinary và lưu vào database
      const newImageUrls = await cloudinaryService.uploadToCloudinary(productImages);
      const newImageIds = await Promise.all(newImageUrls.map(async (img) => {
        const newImage = new Image({
          asset_id: img.asset_id,
          public_id: img.public_id,
          format: img.format,
          resource_type: img.resource_type,
          secure_url: img.url,
          original_filename: img.original_filename,
        });
        const savedImage = await newImage.save();
        return savedImage._id; // Trả về ID của hình ảnh đã lưu
      }));

      // Cập nhật hình ảnh trong ProductDetail
      productDetail.product_images = newImageIds; // Cập nhật mảng hình ảnh mới
    }
    console.log("productDetail",productDetail)
    // Cập nhật các chi tiết khác của sản phẩm (nếu có)
    if (productDetail) {
      productDetail.material = product_details.material ;
      productDetail.color = product_details.color ;
      productDetail.length = product_details.length ;
      productDetail.care_instructions = product_details.care_instructions ;
      productDetail.stone_size = product_details.stone_size ;
      productDetail.stone_type = product_details.stone_type ;
      productDetail.design_style = product_details.design_style ;
      console.log("productDetail",productDetail)
      await productDetail.save(); // Lưu lại chi tiết sản phẩm
    }

    // Cập nhật thông tin category cho sản phẩm nếu có
    if (product_category) {
      const product_category_test = await validateCategory(product_category);
      product.product_category = product_category_test; // Cập nhật category mới
    }
    // Cập nhật các thông tin khác của sản phẩm
    product.product_name = updatedProductData.product_name ;
    product.product_price = updatedProductData.product_price ;
    product.product_sale_price = updatedProductData.product_sale_price ;
    product.product_isAvailable = updatedProductData.product_isAvailable ;
    product.product_short_description = updatedProductData.product_short_description ;

    // Lưu lại sản phẩm đã cập nhật
    const updatedProduct = await product.save();
    console.log("updatedProduct",updatedProduct)
    return updatedProduct;
  } catch (error) {
    console.error(error);
    throw new Error('Cập nhật sản phẩm thất bại');
  }
};

// Hàm mới để lấy tất cả sản phẩm
const getAllProducts = async (page = 1, limit = 16) => {
  const skip = (page - 1) * limit;

  // Lấy sản phẩm với product_isAvailable = true, và populate chỉ những thông tin cần thiết từ hình ảnh
  const products = await Product.find({ product_isAvailable: true })
    .skip(skip)
    .limit(limit)
    .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chỉ chọn các trường cần thiết từ sản phẩm
    .populate({
      path: 'product_details', // Populate chi tiết sản phẩm
      select: 'product_images', // Chỉ chọn mảng hình ảnh
      populate: {
        path: 'product_images', // Populate hình ảnh của sản phẩm
        select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
        model: 'Image',
      },
    });

  const totalProducts = await Product.countDocuments({ product_isAvailable: true });

  return {
    products, // Danh sách sản phẩm theo trang
    totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
    currentPage: page, // Trang hiện tại
    totalProducts, // Tổng số sản phẩm
  };
};

const getSaleProducts = async (page = 1, limit = 16) => {
  const skip = (page - 1) * limit;

  // Lấy sản phẩm với product_isAvailable = true và product_sale_price khác null
  const products = await Product.find({
      product_isAvailable: true,
      product_sale_price: { $ne: null } // Điều kiện sale price khác null
    })
    .skip(skip)
    .limit(limit)
    .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description')
    .populate({
      path: 'product_details',
      select: 'product_images',
      populate: {
        path: 'product_images',
        select: 'secure_url public_id asset_id',
        model: 'Image',
      },
    });

  const totalProducts = await Product.countDocuments({
      product_isAvailable: true,
      product_sale_price: { $ne: null }
    });

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
    totalProducts,
  };
};

const getProductDetailsById = async (productId) => {
  try {
    // Tìm sản phẩm theo ID và populate các thông tin cần thiết
    const product = await Product.findById(productId)
      .populate({
        path: 'product_details', // Populate chi tiết sản phẩm
        populate: {
          path: 'product_images', // Populate hình ảnh của sản phẩm
          select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
          model: 'Image',
        },
      });

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return null; // Trả về null nếu không tìm thấy sản phẩm
    }

    return product; // Trả về sản phẩm nếu tìm thấy
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi truy vấn sản phẩm."); // Ném lỗi nếu có lỗi xảy ra
  }
};

const getProductsByCategory = async (categoryId, page = 1, limit = 16) => {
  const skip = (page - 1) * limit;

  try {
    // Lấy sản phẩm dựa trên categoryId và product_isAvailable = true
    
    const products = await Product.find({
      product_category: categoryId,
      //product_isAvailable: true,
    })
      .skip(skip)
      .limit(limit)
      .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chỉ chọn các trường cần thiết từ sản phẩm
      .populate({
        path: 'product_details', // Populate chi tiết sản phẩm
        select: 'product_images', // Chỉ chọn mảng hình ảnh
        populate: {
          path: 'product_images', // Populate hình ảnh của sản phẩm
          select: 'secure_url public_id asset_id', // Chỉ chọn các trường cần thiết từ hình ảnh
          model: 'Image',
        },
      });
      console.log(products);

    // Tính tổng số sản phẩm thuộc danh mục
    const totalProducts = await Product.countDocuments({
      product_category: categoryId,
      product_isAvailable: true
    });

    return {
      products, // Danh sách sản phẩm theo trang
      totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
      currentPage: page, // Trang hiện tại
      totalProducts, // Tổng số sản phẩm
    };
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi truy vấn sản phẩm theo danh mục."); // Ném lỗi nếu có lỗi xảy ra
  }
};

// Tìm kiếm sản phẩm theo từ khóa
const searchProducts = async (keyword, page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const regex = new RegExp(keyword, 'i'); // Tạo biểu thức chính quy để tìm kiếm không phân biệt hoa thường

    // Tìm các sản phẩm dựa trên từ khóa và phân trang
    const products = await Product.find({ product_name: regex })
      .skip(skip)
      .limit(limit)
      .select('product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description') // Chọn các trường cần thiết
      .populate({
        path: 'product_details', // Populate chi tiết sản phẩm
        select: 'product_images', // Chọn mảng hình ảnh
        populate: {
          path: 'product_images', // Populate hình ảnh của sản phẩm
          select: 'secure_url public_id asset_id', // Chọn các trường cần thiết từ hình ảnh
          model: 'Image',
        },
      });

    // Đếm tổng số sản phẩm khớp với từ khóa
    const totalProducts = await Product.countDocuments({ product_name: regex });

    return {
      totalItems: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    };
  } catch (error) {
    throw new Error("Lỗi khi tìm kiếm sản phẩm: " + error.message);
  }
};

const filterProducts = async (priceRanges, materials, sizes, idcategory, Page, Limit) => {
  try {
    const skip = (Page - 1) * Limit;
    const orConditions = [];

    // Thêm điều kiện khoảng giá
    if (priceRanges && priceRanges.length > 0) {
      const priceConditions = priceRanges.map(range => {
        if (range === "Dưới 500k") {
          return { product_price: { $lt: 500000 } };
        } else if (range === "500k - 2 triệu") {
          return { product_price: { $gte: 500000, $lte: 2000000 } };
        } else if (range === "2 triệu - 3 triệu") {
          return { product_price: { $gte: 2000000, $lte: 3000000 } };
        } else if (range === "5 triệu - 10 triệu") {
          return { product_price: { $gte: 5000000, $lte: 10000000 } };
        }
        return null; // Trả về null nếu không thỏa mãn điều kiện
      }).filter(condition => condition !== null); // Lọc để chỉ giữ lại các điều kiện hợp lệ

      if (priceConditions.length > 0) {
        orConditions.push({ $or: priceConditions });
      }
    }

    // Tạo điều kiện lọc cho materials và sizes trong bảng ProductDetail
    const matchConditions = {};

    // Lọc theo chất liệu
    if (materials && materials.length > 0) {
      matchConditions["product_details.material"] = { $in: materials };
    }

    // Lọc theo kích thước
    if (sizes && sizes.length > 0) {
      matchConditions["product_details.length"] = { $in: sizes };
    }

    // Lọc theo idcategory nếu được cung cấp
    if (idcategory) {
      matchConditions["product_category"] = new mongoose.Types.ObjectId(idcategory);
    }

    // Truy vấn sản phẩm với điều kiện lọc và phân trang
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "ProductDetails", // Tên collection của ProductDetail
          localField: "product_details",
          foreignField: "_id",
          as: "product_details",
        },
      },
      { $unwind: "$product_details" },
      { $match: { $and: [...orConditions, matchConditions] } },
      { $skip: skip },
      { $limit: Limit },
      {
        $lookup: {
          from: "Images", // Tên collection của hình ảnh
          localField: "product_details.product_images",
          foreignField: "_id",
          as: "product_details.product_images",
        },
      },
    ]);

    // Đếm tổng số sản phẩm phù hợp
    const totalProducts = await Product.aggregate([
      {
        $lookup: {
          from: "ProductDetails",
          localField: "product_details",
          foreignField: "_id",
          as: "product_details",
        },
      },
      { $unwind: "$product_details" },
      { $match: { $and: [...orConditions, matchConditions] } },
      { $count: "total" },
    ]);

    return {
      totalItems: totalProducts[0]?.total || 0,
      totalPages: Math.ceil((totalProducts[0]?.total || 0) / Limit),
      currentPage: Page,
      products,
    };
  } catch (error) {
    throw new Error("Lỗi khi lọc sản phẩm: " + error.message);
  }
};

module.exports = {
  createProduct,
  deleteProductById,
  updateProduct,
  getAllProducts, // Xuất hàm getAllProducts
  getProductDetailsById,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  getSaleProducts,
};