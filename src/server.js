require('dotenv').config();
const { app, syncDatabase } = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access it at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();