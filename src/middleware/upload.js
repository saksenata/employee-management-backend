const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/photos';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'employee-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const supportedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (supportedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `Tipe file tidak didukung. Hanya ${supportedFileTypes.join(', ')} yang diperbolehkan.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: fileFilter
});

const uploadEmployeePhoto = (fieldName = 'photo') => (req, res, next) => {
  const singleUpload = upload.single(fieldName);
  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      let message = err.message;
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = `Ukuran file terlalu besar. Maksimal ${maxFileSize / (1024 * 1024)}MB.`;
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = err.field;
      }
      return res.status(400).json({ errors: { [fieldName]: message } });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ errors: { [fieldName]: 'Terjadi kesalahan saat mengunggah file.' } });
    }
    next();
  });
};

module.exports = { upload, uploadEmployeePhoto };