const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token verification

module.exports = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization; // Get the Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({error: 'No token provided'});

        }

        const token = authHeader.split(' ')[1]; // Extract the token from the header
       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        req.user = { _id: decoded.userId, userId: decoded.userId };

        next(); 
    } catch (error) {
        return res.status(401).json({error: 'Invalid token'});
    }
};