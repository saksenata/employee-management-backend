const employeeService = require('../services/employeeService');

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body, req.file);
    res.status(201).json({ success: true, message: 'Karyawan berhasil ditambahkan.', data: employee });
  } catch (err) {
    next(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      status,
      search,
    };
    const result = await employeeService.getAllEmployees(options);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, message: 'Data karyawan berhasil diperbarui.', data: employee });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    res.status(200).json({ success: true, message: result.message || 'Karyawan berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};