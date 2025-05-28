const { MulterError } = require('multer');
const { ValidationError } = require('yup'); // yup is used for validation
const { BaseError: SequelizeBaseError, ValidationError: SequelizeValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error("ERROR LOG:", new Date().toISOString());
  console.error("Request Path:", req.path);
  console.error("Request Body:", req.body);
  console.error("Error Stack:", err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server.';
  let errors = null;

  if (err instanceof MulterError) {
    statusCode = 400;
    message = 'Kesalahan unggah file.';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `Ukuran file terlalu besar. Maksimal ${err.field ? err.field.fileSizeLimit / (1024 * 1024) : 'N/A'}MB.`;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Tipe file tidak didukung.';
    }
    errors = { [err.field || 'file']: message };
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Data tidak valid.';
    errors = err.inner.reduce((acc, currentError) => {
      acc[currentError.path] = currentError.message;
      return acc;
    }, {});
  } else if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    message = 'Data tidak valid.';
    errors = err.errors.reduce((acc, currentError) => {
      acc[currentError.path] = currentError.message;
      return acc;
    }, {});
  } else if (err instanceof SequelizeBaseError) {
    statusCode = 500;
    message = 'Terjadi kesalahan pada database.';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Akses tidak sah.';
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV === 'development' && !errors) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;