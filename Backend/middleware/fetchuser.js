// middleware/fetchuser.js

const jwt = require('jsonwebtoken');

// It's highly recommended to store your JWT secret in environment variables
// For example: process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get the token from the request header (commonly named 'auth-token')
    const token = req.header('auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, error: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key
        const decodedPayload = jwt.verify(token, JWT_SECRET);

        // Attach the user information (specifically the ID) from the token payload to the request object
        // The payload structure depends on what you put into it during login
        // Assuming you stored { user: { id: userId } }
        req.user = decodedPayload.user;

        // Call the next middleware or route handler
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        // Handle specific JWT errors if needed (e.g., TokenExpiredError)
        if (error.name === 'JsonWebTokenError') {
             return res.status(401).json({ success: false, error: "Invalid token." });
        }
         if (error.name === 'TokenExpiredError') {
             // Handle token expiration error
            return res.status(401).json({ success: false, error: "Token has expired." });
        }
        // Generic error for other issues
        res.status(401).json({ success: false, error: "Authentication failed. Please authenticate using a valid token." });
    }
};

module.exports = fetchuser;