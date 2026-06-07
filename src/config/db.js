const mongoose = require('mongoose');
const config = require('./env');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 5, delayMs = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await mongoose.connect(config.mongoUri);
      console.log(`Database connected: ${connection.connection.host}`);
      return;
    } catch (error) {
      console.error(`Database connection error (attempt ${attempt} of ${retries}):`, error);

      if (attempt < retries) {
        console.log(`Retrying in ${Math.round(delayMs / 1000)}s...`);
        await wait(delayMs);
      } else {
        console.error('All retries exhausted. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;