const express = require('express');
const router = express.Router();
const {
  submitProject,
  getMySubmissions,
  getAllSubmissions
} = require('../Controllers/ProjectController');
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');

// Student routes
router.post('/submit', verifyToken, verifyRole('student'), submitProject);
router.get('/my-submissions', verifyToken, verifyRole('student'), getMySubmissions);

// Teacher route
router.get('/all', verifyToken, verifyRole('teacher'), getAllSubmissions);

module.exports = router;
