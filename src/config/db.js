const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoUri);
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;