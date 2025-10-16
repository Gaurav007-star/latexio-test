const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logEvent = require('../utils/logEvent');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  // don't exit here — let requests fail with meaningful errors if JWT is required
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer: storage + file filter
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const idPart = (req.params && req.params.id) ? String(req.params.id) : crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `${idPart}_${Date.now()}${ext}`);
  }
});
const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type. Allowed: jpeg, jpg, png, webp'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// Wrapper that accepts any file field (no Unexpected field errors) and returns friendly JSON on errors
const multerAnyMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(400).json({ success: false, error: err.message || 'File upload error' });
    }
    next();
  });
};

// ROUTE 1: Register a new user
router.post('/createuser', async (req, res) => {
  let success = false;
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success, error: 'Please provide name, email, and password' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success, error: 'Please enter a valid email address' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success, error: 'Sorry, a user with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    const savedUser = await user.save();
    if (!savedUser) {
      return res.status(500).json({ success, error: 'Failed to create user' });
    }
    const payload = {
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name
      }
    };
    const authToken = JWT_SECRET ? jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }) : null;
    success = true;
    return res.status(201).json({ success, message: 'User created successfully', authToken });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: 'Validation Failed', details: error.errors });
    }
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 2: Authenticate user
router.post('/login', async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  let user;
  try {
    if (!email || !password) {
      return res.status(400).json({ success, message: 'Please provide email and password' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success, message: 'Please enter a valid email address' });
    }
    user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success, message: 'Login failed! Invalid credentials.' });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      logEvent('error', 'USER_LOGIN_ERROR', 'Login failed! Invalid credentials.', { userId: user.id, req });
      return res.status(400).json({ success, message: 'Login failed! Invalid credentials.' });
    }
    const payload = { user: { id: user.id } };
    const authToken = JWT_SECRET ? jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' }) : null;

    const apiKey = crypto.randomBytes(20).toString('hex');
    const newApiKey = new ApiKey({
      key: apiKey,
      userId: user.id,
      ipAddress: req.ip,
      lastUsed: new Date(),
      userAgent: req.headers['user-agent']
    });
    await newApiKey.save();

    success = true;
    logEvent('info', 'USER_LOGIN_SUCCESS', 'User logged in successfully.', { userId: user.id, req });
    return res.json({ success, message: 'Login successful!', authToken, apiKey });
  } catch (error) {
    logEvent('error', 'USER_LOGIN_ERROR', 'Server error during login process.', {
      userId: user ? user.id : null,
      details: { email, error: error.message },
      req
    });
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error during login.' });
  }
});

// ROUTE 3: Get Logged-in User Details
router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, error: 'User associated with token/key not found.' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Get User Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error while fetching user data.' });
  }
});

// ROUTE 4: Get All Users List
router.get('/allusers', fetchuser, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    if (!users || users.length === 0) return res.status(404).json({ success: false, error: 'No users found.' });
    return res.json({ success: true, users });
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error while fetching all users.' });
  }
});

// ROUTE 5: Get User's Details by sending id
router.get('/user/:id', fetchuser, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format.' });
    }
    const user = await User.findOne({ _id: userId }).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Get User by ID Error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error while fetching user data.' });
  }
});

// ROUTE 6: Update user's details
router.put('/updateuser/:id', fetchuser, async (req, res) => {
  try {
    const userId = req.params.id;
    if (String(req.user.id) !== String(userId)) {
      return res.status(403).json({ success: false, error: "You are not authorized to update this user's details." });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, error: 'At least one field must be provided for update.' });
    }

    const forbidden = ['password', '_id', '__v', 'createdAt', 'updatedAt'];
    const schemaFields = Object.keys(User.schema.paths);
    const allowedFields = schemaFields.filter((f) => !forbidden.includes(f));
    const incomingKeys = Object.keys(req.body);
    const keysToUpdate = incomingKeys.filter((k) => allowedFields.includes(k));
    if (keysToUpdate.length === 0) {
      return res.status(400).json({ success: false, error: 'No updatable fields provided or fields are not allowed.' });
    }

    if (req.body.email) {
      const existing = await User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: userId } });
      if (existing) return res.status(400).json({ success: false, error: 'Email is already used by another account.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
    const deepMerge = (target, source) => {
      for (const k of Object.keys(source)) {
        const srcVal = source[k];
        if (isPlainObject(srcVal) && isPlainObject(target[k])) deepMerge(target[k], srcVal);
        else target[k] = srcVal;
      }
    };

    for (const key of keysToUpdate) {
      const val = req.body[key];
      if (isPlainObject(val) && isPlainObject(user[key])) deepMerge(user[key], val);
      else user[key] = val;
    }

    await user.validate();
    const saved = await user.save();
    const userObj = saved.toObject();
    delete userObj.password;
    return res.json({ success: true, message: 'User details updated successfully.', user: userObj });
  } catch (error) {
    console.error('Update User Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error while updating user data.' });
  }
});

// ROUTE 7: Upload / Set User's Profile Picture
// Strict server-side expects multipart form field name 'profilePicture' for file uploads.
// This route will create the profilePicture field if it doesn't exist.
// Modes supported:
//  - JSON { image_location: "https://..." }  => store external reference, DO NOT delete any files
//  - multipart/form-data with file field 'profilePicture' => store file under /uploads and replace previous local file
router.post('/uploadprofilepicture/:id', fetchuser, multerAnyMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure the request is from the user themself (fetchuser should set req.user)
    if (!req.user || String(req.user.id) !== String(userId)) {
      // cleanup any uploaded files
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(f => { try { fs.unlinkSync(path.join(uploadsDir, f.filename)); } catch (e) { } });
      }
      return res.status(403).json({ success: false, error: "You are not authorized to update this user's profile picture." });
    }

    const user = await User.findById(userId);
    if (!user) {
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(f => { try { fs.unlinkSync(path.join(uploadsDir, f.filename)); } catch (e) { } });
      }
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Mode A: External image reference provided in JSON body
    if (req.body && req.body.image_location) {
      // Do NOT delete any files in this mode (per your requirement)
      user.profilePicture = req.body.image_location;
      await user.save();
      const out = user.toObject();
      delete out.password;
      return res.status(200).json({ success: true, data: out });
    }

    // Mode B: File upload - we accepted any field; multer puts files into req.files array
    let fileObj = null;
    if (Array.isArray(req.files) && req.files.length > 0) {
      // pick the first uploaded file
      fileObj = req.files[0];
    }

    if (!fileObj) {
      return res.status(400).json({
        success: false,
        error: "No image_location provided and no file uploaded. Use JSON { image_location } or send multipart/form-data with a file (form key can be any name)."
      });
    }

    // If previous profilePicture points to a local uploads file (not an external URL), delete it
    if (user.profilePicture && typeof user.profilePicture === 'string' && !/^https?:\/\//i.test(user.profilePicture)) {
      try {
        const prevFilename = path.basename(user.profilePicture);
        const prevPath = path.join(uploadsDir, prevFilename);
        if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
      } catch (err) {
        console.warn('Failed to remove previous local profile picture:', err.message);
      }
    }

    // Create or update profilePicture field
    user.profilePicture = `/uploads/${fileObj.filename}`;
    await user.save();

    const out = user.toObject(
        // Only return updated profilePicture field to minimize response size
        { transform: (doc, ret) => ({ profilePicture: ret.profilePicture }) }
    );
    delete out.password;
    return res.status(200).json({ success: true, data: out });
  } catch (err) {
    console.error('Upload Profile Picture Error:', err);

    // cleanup any uploaded files
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(f => { try { fs.unlinkSync(path.join(uploadsDir, f.filename)); } catch (e) { } });
    }

    if (err instanceof multer.MulterError) return res.status(400).json({ success: false, error: err.message });
    if (err && err.message && err.message.startsWith('Unsupported file type')) return res.status(400).json({ success: false, error: err.message });

    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;