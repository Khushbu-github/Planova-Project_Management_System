// Update teacher routes
const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');
const { getTeacherTeams } = require('../Controllers/TeamController');

// Existing routes
// Dashboard
router.get('/dashboard', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, message: 'Teacher Dashboard data' });
});

// Project Status
router.get('/project-status', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, status: 'Reviewing projects' });
});

router.post('/project-status/update', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, message: 'Project status updated' });
});

// Documentation
router.get('/documentation', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, docs: [] });
});

router.post('/documentation/upload', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, message: 'Documentation uploaded' });
});

// Points
router.get('/funds', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, points: [] });
});

router.post('/funds/assign', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, message: 'Points assigned' });
});

// Profile
router.get('/profile', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/profile/update', verifyToken, verifyRole('teacher'), (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

// New team-related routes
router.get('/teams', verifyToken, verifyRole('teacher'), getTeacherTeams);

module.exports = router;