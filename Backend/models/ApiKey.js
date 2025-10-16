// models/ApiKey.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApiKeySchema = new Schema({
    key: { // The actual API key string
        type: String,
        required: true,
        unique: true, // Each API key must be unique
        index: true   // Index for faster lookups
    },
    userId: { // Reference to the User who owns this key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Links to the 'user' collection/model
        required: true
    },
    createdAt: { // Timestamp when the key was generated (login time)
        type: Date,
        default: Date.now,
        expires: '24h' // Optional: Automatically delete the key after 1 hour (like the JWT)
                      // Adjust or remove 'expires' based on your desired key lifetime
    },
    lastUsed: { // Timestamp of the last time the key was used (optional)
        type: Date,
        default: null // Initially set to null, can be updated when the key is used
    },
    isActive: { // Flag to indicate if the key is active or revoked (optional)
        type: Boolean,
        default: true // By default, the key is active
    },
    ipAddress: { // Optional: Store the IP address from which the key was generated (for security)
        type: String,
        default: null // Initially set to null, can be updated when the key is generated
    },
    userAgent: { // Optional: Store the user agent from which the key was generated (for security)
        type: String,
        default: null // Initially set to null, can be updated when the key is generated
    },
});

// Optional: If you don't use 'expires', you might want a TTL index
// ApiKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Example: Expires after 1 hour (3600 seconds)

module.exports = mongoose.model('apikey', ApiKeySchema);
