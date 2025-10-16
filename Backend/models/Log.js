// models/Log.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    level: { // e.g., 'info', 'warn', 'error', 'debug'
        type: String,
        required: true,
        enum: ['info', 'warn', 'error', 'debug'], // Enforce specific levels
        default: 'info'
    },
    action: { // Specific action being logged, e.g., 'USER_LOGIN', 'NOTE_CREATED'
        type: String,
        required: true,
        index: true // Index for faster querying by action
    },
    userId: { // ID of the user performing the action (if applicable)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true // Index for faster querying by user
        // Not required, as some actions might be pre-authentication
    },
    message: { // Descriptive message
        type: String,
        required: true
    },
    details: { // Optional object for additional context (IP, request body snippet, error stack, etc.)
        type: Schema.Types.Mixed,
        default: null
    }
});

// Optional: Create a TTL index to automatically delete old logs after a certain period
// LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // Example: delete logs older than 30 days (30 * 24 * 60 * 60 seconds)

module.exports = mongoose.model('log', LogSchema);
