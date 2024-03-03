const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/userController');

router.get('/profile', UserController.getUserProfile);

module.exports = router;
