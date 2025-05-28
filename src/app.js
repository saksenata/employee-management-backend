const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const { connectDB, sequelize } = require('./config/database');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Employee Management API Running');
});

app.use(errorHandler);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = { app, syncDatabase };