const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name',
  },
  nik: {
    type: DataTypes.STRING,
    field: 'nik',
  },
  gender: {
    type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    field: 'gender',
  },
  birthPlace: {
    type: DataTypes.STRING,
    field: 'birth_place',
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    field: 'birth_date',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    field: 'phone', // Maps to the 'phone' column
  },
  addressDetail: {
    type: DataTypes.TEXT,
    field: 'address', // Maps to the 'address' column
  },
  username: {
    type: DataTypes.STRING,
    field: 'username',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    field: 'email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password',
  },
  employeeType: {
    type: DataTypes.STRING,
    field: 'role', // Maps to the 'role' column
  },
  contractStartDate: {
    type: DataTypes.DATEONLY,
    field: 'contract_start_date',
  },
  contractEndDate: {
    type: DataTypes.DATEONLY,
    field: 'contract_end_date',
  },
  maritalStatus: {
    type: DataTypes.STRING,
    field: 'marital_status',
  },
  bpjsDoctorCode: {
    type: DataTypes.STRING,
    field: 'bpjs_doctor_code',
  },
  photoPath: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'document_path',
  },
  status: {
    type: DataTypes.STRING, // User's schema has status VARCHAR(20)
    allowNull: false,
    defaultValue: 'active',
    field: 'status',
  },
}, {
  tableName: 'employees',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (employee) => {
      if (employee.password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
      }
    },
    beforeUpdate: async (employee) => {
      if (employee.changed('password') && employee.password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
      }
    },
  },
});

Employee.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = Employee;