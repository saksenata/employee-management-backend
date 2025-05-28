require('dotenv').config();
const { app, syncDatabase } = require('../app');

let isSynced = false;

module.exports = async (req, res) => {
  try {
    if (!isSynced) {
      await syncDatabase();
      isSynced = true;
    }

    app(req, res);
  } catch (error) {
    console.error('Error in serverless handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
