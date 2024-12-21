// // services/cloudinaryService.js
// const cloudinary = require('../config/cloudinary');
// const streamifier = require('streamifier');

// // Function to upload images to Cloudinary
// const uploadImages = async (files) => {
//   const imageUrls = [];

//   for (const file of files) {
//     console.log(file); // Kiểm tra thông tin file

//     // Tạo một Promise để xử lý upload
//     const uploadPromise = new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'Jewelry_img', // Thư mục trên Cloudinary
//           public_id: file.originalname.split('.')[0], // Sử dụng tên file làm public_id
//           format: file.originalname.split('.').pop(), // Lấy định dạng từ tên file
//         },
//         (error, result) => {
//           if (error) {
//             console.error('Upload to Cloudinary failed:', error);
//             return reject('Upload to Cloudinary failed for ' + file.originalname);
//           }
//           // Đẩy thông tin vào mảng imageUrls
//           imageUrls.push({
//             public_id: result.public_id,
//             url: result.secure_url,
//           });
//           resolve();
//         }
//       );

//       // Pipe stream từ buffer vào upload stream
//       streamifier.createReadStream(file.buffer).pipe(uploadStream);
//     });

//     await uploadPromise; // Chờ cho upload hoàn tất
//   }

//   return imageUrls;
// };

// module.exports = {
//   uploadImages,
// };

// cloudinaryService.js
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');
require('dotenv').config({ path: '.env.development' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên cloud của bạn
  api_key: process.env.CLOUDINARY_API_KEY,       // API key của bạn
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret của bạn
});

const uploadToCloudinary = async (files) => {
  const imageUrls = [];
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

      if (!validExtensions.includes(ext)) {
        return reject('Invalid file format for ' + file.originalname);
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'Jewelry_img',
          public_id: file.originalname.split('.')[0],
          format: ext,
        },  
        (error, result) => {
          if (error) {
            console.error('Upload to Cloudinary failed:', error);
            return reject('Upload to Cloudinary failed for ' + file.originalname);
          }
          //   Đẩy thông tin vào mảng imageUrls
          imageUrls.push({
            asset_id: result.asset_id,
            public_id: result.public_id,
            url: result.secure_url,

          });
          resolve(result.secure_url); // Trả về URL sau khi upload thành công
        }
      );

      // Kiểm tra buffer hợp lệ trước khi tạo stream
      if (file.buffer) {
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      } else {
        return reject('File buffer is missing for ' + file.originalname);
      }
    });
  });

  await Promise.all(uploadPromises); // Chờ tất cả ảnh được upload
  return imageUrls;
};

const deleteFromCloudinary = async (publicId) => {
  try {
    // Sử dụng cloudinary.uploader.destroy để xóa ảnh dựa vào public_id
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error(`Xóa ảnh thất bại: ${publicId}`);
    }
    return result;
  } catch (error) {
    console.error('Lỗi khi xóa ảnh trên Cloudinary:', error);
    throw new Error('Lỗi khi xóa ảnh trên Cloudinary');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
