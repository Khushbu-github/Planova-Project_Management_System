const express = require('express');
const router = express.Router();
const { getProfile } = require('../Controllers/ProfileController');
const { verifyToken } = require('../Middlewares/AuthMiddleware');

router.get('/profile', verifyToken, getProfile);

module.exports = router;
