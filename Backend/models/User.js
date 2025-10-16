// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'] // Added custom error message
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensure emails are unique
        lowercase: true, // Store emails in lowercase for consistency
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Basic email format validation
    },
    designation: {
        type: String,
        required: false // Optional field
    },
    organization: {
        type: String,
        required: false // Optional field
    },
    bio: {
        type: String,
        required: false // Optional field
    },
    socialLinks: {
        type: [String],
        required: false // Optional field
    },
    address: {
        type: String,
        required: false // Optional field
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [5, 'Password must be at least 5 characters long'] // Enforce minimum length
    },
    date: { // Timestamp for when the user was created
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        required: false // Optional field for profile picture URL
    }
    // Note: The apiKey field is NOT stored here anymore.
});

// Create and export the User model
const User = mongoose.model('user', UserSchema);
module.exports = User;
    