const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../Controllers/userController');  // Fix the import statement
const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
