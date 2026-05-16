const logger = (req, res, next) => {

    const time = new Date().toISOString(); // Get the current timestamp in ISO format

    console.log(`[${time}] ${req.method} ${req.originalUrl}`); // Log the HTTP method and URL

    next(); 
};

module.exports = logger;