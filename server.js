require('dotenv').config(); //load environment variables from .env file
const connectDB = require('./config/db'); // Import the database connection function
const app = require('./app'); // Import the Express application

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3000; 

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
