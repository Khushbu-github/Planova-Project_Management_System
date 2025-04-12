const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');

// Dashboard
router.get('/dashboard', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Student Dashboard data' });
});

// Project Status
router.get('/project-status', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, status: 'In Progress' });
});

router.post('/project-status/update', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Project status updated' });
});

// Documentation
router.get('/documentation', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, docs: [] });
});

router.post('/documentation/upload', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Documentation uploaded' });
});

// Discussions
router.get('/discussions', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, discussions: [] });
});

router.post('/discussions', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'New message added to discussion' });
});

// Funds
router.get('/funds', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, funds: [] });
});

router.post('/funds/apply', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Fund request submitted' });
});

// Profile
router.get('/profile', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/profile/update', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

module.exports = router;
