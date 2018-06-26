const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/public/assets/media/images/'),
  filename: (req, file, cb) => {
    const dotIndex = file.originalname.lastIndexOf('.');
    const fileExtension = file.originalname.substring(dotIndex + 1);
    if(req.params.idBook) return cb(null, `${req.params.idBook}.${fileExtension}`);
    cb(null, `${Math.round(Math.random() * 10000)}.${fileExtension}`);
  }
});
const limits = { fileSize: 1024 * 1024 * 10 };
const upload = multer({ storage, limits });

module.exports = { upload };
