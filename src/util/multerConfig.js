const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.filename + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const filterImage = function (req, file, cb) {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cd(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const upload = multer({
  multerStorage: multerStorage,
  filterImage: filterImage,
});

module.exports = upload;
