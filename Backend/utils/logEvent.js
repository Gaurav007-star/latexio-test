// utils/logger.js

const Log = require('../models/Log'); // Import the Log model

/**
 * Logs an event to the database.
 * @param {string} level - Log level ('info', 'warn', 'error', 'debug').
 * @param {string} action - The specific action identifier (e.g., 'USER_LOGIN_SUCCESS').
 * @param {string} message - Descriptive log message.
 * @param {object} [options={}] - Optional parameters.
 * @param {string|mongoose.Types.ObjectId} [options.userId=null] - The ID of the user involved.
 * @param {object} [options.details=null] - Additional contextual details (e.g., request info, error stack).
 * @param {object} [options.req=null] - The Express request object (to extract IP, user agent, etc.).
 */
const logEvent = async (level, action, message, options = {}) => {
    try {
        const { userId = null, details = null, req = null } = options;

        let logDetails = { ...details }; // Copy details to avoid modifying original object

        // Automatically add request details if req object is provided
        if (req) {
            logDetails.ipAddress = req.ip || req.connection?.remoteAddress;
            logDetails.userAgent = req.headers?.['user-agent'];
            logDetails.path = req.originalUrl;
            logDetails.method = req.method;
            // Avoid logging sensitive body parts like passwords
            if (req.body) {
                 // Clone body and remove sensitive fields
                 const bodyClone = JSON.parse(JSON.stringify(req.body));
                 delete bodyClone.password; // Remove password field
                 // Add other sensitive fields to remove if necessary
                 logDetails.requestBodySnippet = bodyClone;
            }
        }

        const logEntry = new Log({
            level,
            action,
            message,
            userId, // Will be null if not provided
            details: Object.keys(logDetails).length > 0 ? logDetails : null // Only save details if not empty
        });

        await logEntry.save();
        // console.log(`Log saved: [${level.toUpperCase()}] ${action} - ${message}`); // Optional: Also log to console

    } catch (error) {
        // Log the error about logging itself to the console
        console.error('!!! Failed to save log entry to database !!!');
        console.error('Original Log Data:', { level, action, message, options });
        console.error('Logging Error:', error.message);
        // Avoid crashing the app just because logging failed
    }
};

module.exports = logEvent;
// module.exports = logEvent; // Export the function for use in other files
// // Export the function for use in other files