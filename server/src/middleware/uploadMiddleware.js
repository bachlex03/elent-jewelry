// // Middleware upload.js
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2; 
// const streamifier = require('streamifier');
// const path = require('path');

// // Sử dụng memoryStorage của multer để lưu file dưới dạng buffer trong bộ nhớ
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Hàm xử lý upload file lên Cloudinary
// const uploadToCloudinary = (req, res, next) => {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).send('No files uploaded.');
//     }
  
//     const uploadPromises = req.files.map(file => {
//       return new Promise((resolve, reject) => {
//         const ext = path.extname(file.originalname).toLowerCase().substring(1);
//         const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  
//         if (!validExtensions.includes(ext)) {
//           return reject('Invalid file format for ' + file.originalname);
//         }
  
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: 'Jewelry_img',
//             public_id: file.originalname.split('.')[0],
//             format: ext,
//           },
//           (error, result) => {
//             if (error) {
//               console.error('Upload to Cloudinary failed:', error);
//               return reject('Upload to Cloudinary failed for ' + file.originalname);
//             }
//             file.cloudinaryUrl = result.secure_url; 
//             resolve();
//           }
//         );

//         streamifier.createReadStream(file.buffer).pipe(uploadStream);
//       });
//     });
  
//     Promise.all(uploadPromises)
//       .then(() => next())
//       .catch(err => res.status(400).send(err));
// };

// // Xuất middleware
// module.exports = { upload, uploadToCloudinary };
// upload.js
const { uploadPath } = require("../../public");
const multer = require("multer");
const path = require("path");

var storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Providing absolute path
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
