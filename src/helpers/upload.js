const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/public/assets/media/images/'),
  filename: (req, file, cb) => {
    const dotIndex = file.originalname.lastIndexOf('.');
    const fileExtension = file.originalname.substring(dotIndex + 1);
    cb(null, `${Math.round(Math.random() * 11111)}.${fileExtension}`);
  }
});
const limits = { fileSize: 1024 * 1024 * 10 };
const upload = multer({ storage, limits });

module.exports = { upload };
