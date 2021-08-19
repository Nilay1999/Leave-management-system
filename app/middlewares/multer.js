const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/uploads/csv');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   console.log(file);
//   if (
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jfif' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/gif' ||
//     file.mimetype === 'image/jpe' ||
//     file.mimetype === 'image/jif' ||
//     file.mimetype === 'image/jfi' ||
//     file.mimetype.includes('csv')
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  // fileFilter: fileFilter,
});

module.exports = upload;
