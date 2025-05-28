const employeeRepository = require('../repositories/employeeRepository');
const fs = require('fs');
const path = require('path');

class EmployeeService {
  async createEmployee(employeeData, file) {
    // NIK, Username, Email uniqueness checks (if these fields exist in your DB schema and are required to be unique)
    if (employeeData.nik) { // Assuming NIK might be added to DB
        const existingByNik = await employeeRepository.findByNik(employeeData.nik);
        if (existingByNik) {
            throw { statusCode: 409, message: 'NIK sudah terdaftar.', errors: { nik: 'NIK sudah terdaftar.' } };
        }
    }
    if (employeeData.username) { // Assuming Username might be added to DB
        const existingByUsername = await employeeRepository.findByUsername(employeeData.username);
        if (existingByUsername) {
            throw { statusCode: 409, message: 'Username sudah terdaftar.', errors: { username: 'Username sudah terdaftar.' } };
        }
    }
    const existingByEmail = await employeeRepository.findByEmail(employeeData.email);
    if (existingByEmail) {
      throw { statusCode: 409, message: 'Email sudah terdaftar.', errors: { email: 'Email sudah terdaftar.' } };
    }

    if (file) {
      employeeData.photoPath = path.join('photos', file.filename).replace(/\\/g, "/");
    }

    return employeeRepository.create(employeeData);
  }

  async getAllEmployees(options) {
    return employeeRepository.findAll(options);
  }

  async getEmployeeById(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw { statusCode: 404, message: 'Karyawan tidak ditemukan.' };
    }
    return employee;
  }

  async updateEmployee(id, employeeData, file) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw { statusCode: 404, message: 'Karyawan tidak ditemukan.' };
    }

    if (employeeData.nik && employeeData.nik !== employee.nik) {
      const existingByNik = await employeeRepository.findByNik(employeeData.nik);
      if (existingByNik) {
        throw { statusCode: 409, message: 'NIK sudah terdaftar.', errors: { nik: 'NIK sudah terdaftar.' } };
      }
    }
    if (employeeData.username && employeeData.username !== employee.username) {
      const existingByUsername = await employeeRepository.findByUsername(employeeData.username);
      if (existingByUsername) {
        throw { statusCode: 409, message: 'Username sudah terdaftar.', errors: { username: 'Username sudah terdaftar.' } };
      }
    }
    if (employeeData.email && employeeData.email !== employee.email) {
      const existingByEmail = await employeeRepository.findByEmail(employeeData.email);
      if (existingByEmail) {
        throw { statusCode: 409, message: 'Email sudah terdaftar.', errors: { email: 'Email sudah terdaftar.' } };
      }
    }

    let oldPhotoPath = employee.photoPath;

    if (file) {
      employeeData.photoPath = path.join('photos', file.filename).replace(/\\/g, "/");
    } else if (employeeData.photoPath === null || employeeData.photoPath === '') {
      employeeData.photoPath = null;
    }

    const updatedEmployee = await employeeRepository.update(id, employeeData);

    if (oldPhotoPath && (file || employeeData.photoPath === null)) {
        const fullOldPath = path.join(__dirname, '../../uploads', oldPhotoPath);
        fs.unlink(fullOldPath, (err) => {
            if (err) {
                console.error(`Failed to delete old photo: ${fullOldPath}`, err);
            } else {
                console.log(`Successfully deleted old photo: ${fullOldPath}`);
            }
        });
    }

    return updatedEmployee;
  }

  async deleteEmployee(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw { statusCode: 404, message: 'Karyawan tidak ditemukan.' };
    }

    const photoPathToDelete = employee.photoPath;
    const result = await employeeRepository.delete(id);

    if (result && photoPathToDelete) {
      const fullPhotoPath = path.join(__dirname, '../../uploads', photoPathToDelete);
      fs.unlink(fullPhotoPath, (err) => {
        if (err) {
          console.error(`Failed to delete photo for employee ${id}: ${fullPhotoPath}`, err);
        } else {
          console.log(`Successfully deleted photo for employee ${id}: ${fullPhotoPath}`);
        }
      });
    }
    return result;
  }
}

module.exports = new EmployeeService();