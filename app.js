const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes'); // Import authentication routes
const articleRoutes = require('./routes/article.routes'); // Import article routes
const app = express();// Create an Express application
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger'); 

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log HTTP requests in development mode
app.use(helmet()); // Set security-related HTTP headers
app.use(express.json()); // Parse incoming JSON requests
app.use(logger); // Use the custom logger middleware

// Route setup
app.use('/auth', authRoutes); // Use authentication routes
app.use('/articles', articleRoutes); // Use article routes


app.use(errorHandler);

module.exports = app;