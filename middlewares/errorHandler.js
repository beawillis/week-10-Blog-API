const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error' // Send the error message or a default message
    });
};

module.exports = errorHandler; // Export the error handler middleware