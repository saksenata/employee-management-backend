const Employee = require('../models/Employee');
const { Op } = require('sequelize');

class EmployeeRepository {
  async create(employeeData) {
    return Employee.create(employeeData);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, status, search } = options;
    const offset = (page - 1) * limit;

    const queryOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      where: {},
      order: [['createdAt', 'DESC']],
    };

    if (status) {
      queryOptions.where.status = status;
    }

    if (search) {
      queryOptions.where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { nik: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { employeeType: { [Op.iLike]: `%${search}%` } },
      ];
    }
    queryOptions.attributes = { exclude: ['password'] };

    const { count, rows } = await Employee.findAndCountAll(queryOptions);
    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      employees: rows,
    };
  }

  async findById(id) {
    return Employee.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async findByUsername(username) {
    return Employee.findOne({ where: { username } });
  }

  async findByEmail(email) {
    return Employee.findOne({ where: { email } });
  }

  async findByNik(nik) {
    return Employee.findOne({ where: { nik } });
  }

  async update(id, employeeData) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return null;
    }
    return employee.update(employeeData);
  }

  async delete(id) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return null;
    }
    await employee.destroy();
    return { message: 'Employee deleted successfully' };
  }
}

module.exports = new EmployeeRepository();