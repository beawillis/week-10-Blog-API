const mongoose = require('mongoose');

const connectDB = async () => {
    try {
    //connect to MongoDB
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${connect.connection.host}`); // Log successful connection
    } catch (error) {
        console.error('Database connection error:', error); // Log any connection errors
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;