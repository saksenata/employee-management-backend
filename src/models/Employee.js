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
    field: 'name', // Maps to the 'name' column in the database
  },
  nik: {
    type: DataTypes.STRING,
    // allowNull: false, // This column is not in the user's provided DB schema
    // unique: true,     // This column is not in the user's provided DB schema
    field: 'nik',     // Assuming it might be added later
  },
  gender: {
    type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    // allowNull: false, // This column is not in the user's provided DB schema
    field: 'gender',  // Assuming it might be added later
  },
  birthPlace: {
    type: DataTypes.STRING,
    field: 'birth_place', // This column is not in the user's provided DB schema
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    field: 'birth_date', // This column is not in the user's provided DB schema
  },
  phoneNumber: {
    type: DataTypes.STRING,
    // allowNull: false, // User's schema has phone VARCHAR(20) NOT NULL
    field: 'phone', // Maps to the 'phone' column
  },
  // Granular address fields removed to match user's schema (single 'address' TEXT field)
  addressDetail: {
    type: DataTypes.TEXT,
    // allowNull: false, // User's schema has address TEXT NOT NULL
    field: 'address', // Maps to the 'address' column
  },
  username: {
    type: DataTypes.STRING,
    // allowNull: false, // This column is not in the user's provided DB schema
    // unique: true,     // This column is not in the user's provided DB schema
    field: 'username',// Assuming it might be added later
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
    // allowNull: false, // User's schema has role VARCHAR(50) NOT NULL
    field: 'role', // Maps to the 'role' column
  },
  contractStartDate: {
    type: DataTypes.DATEONLY,
    field: 'contract_start_date', // This column is not in the user's provided DB schema
  },
  contractEndDate: {
    type: DataTypes.DATEONLY,
    field: 'contract_end_date', // This column is not in the user's provided DB schema
  },
  maritalStatus: {
    type: DataTypes.STRING,
    field: 'marital_status', // This column is not in the user's provided DB schema
  },
  bpjsDoctorCode: {
    type: DataTypes.STRING,
    field: 'bpjs_doctor_code', // This column is not in the user's provided DB schema
  },
  photoPath: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'document_path', // Maps to the 'document_path' column
  },
  status: {
    type: DataTypes.STRING, // User's schema has status VARCHAR(20)
    allowNull: false,
    defaultValue: 'active', // User's schema has DEFAULT 'active'
    field: 'status',
  },
  // Sequelize automatically handles createdAt and updatedAt if timestamps: true
  // and the columns are named created_at and updated_at (which they are in user's schema)
}, {
  tableName: 'employees',
  timestamps: true, // This will use 'created_at' and 'updated_at' column names by default
  underscored: true, // Ensures Sequelize maps camelCase fields to snake_case columns if not specified by 'field'
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