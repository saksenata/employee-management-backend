const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { uploadEmployeePhoto } = require('../middleware/upload');
const { dummyAuthMiddleware } = require('../middleware/auth'); // Using dummyAuthMiddleware
const {
  validateRequest,
  createEmployeeSchema,
  updateEmployeeSchema,
  validateFile
} = require('../utils/validation');

const photoFieldName = 'photo';

router.post(
  '/employees',
  dummyAuthMiddleware,
  uploadEmployeePhoto(photoFieldName),
  validateFile(photoFieldName),
  validateRequest(createEmployeeSchema),
  employeeController.createEmployee
);

router.get(
  '/employees',
  dummyAuthMiddleware,
  employeeController.getAllEmployees
);

router.get(
  '/employees/:id',
  dummyAuthMiddleware,
  employeeController.getEmployeeById
);

router.put(
  '/employees/:id',
  dummyAuthMiddleware,
  uploadEmployeePhoto(photoFieldName),
  validateFile(photoFieldName),
  validateRequest(updateEmployeeSchema),
  employeeController.updateEmployee
);

router.delete(
  '/employees/:id',
  dummyAuthMiddleware,
  employeeController.deleteEmployee
);

module.exports = router;