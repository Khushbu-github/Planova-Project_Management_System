// Update student routes
const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');
const { 
  createTeam, 
  getStudentTeams, 
  getAvailableStudents, 
  getAvailableTeachers 
} = require('../Controllers/TeamController');

// Existing routes
// Dashboard
router.get('/dashboard', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Student Dashboard data', semester: req.user.semester });
});

// Project Status
router.get('/project-status', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, status: 'In Progress', semester: req.user.semester });
});

router.post('/project-status/update', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Project status updated' });
});

// Documentation
router.get('/documentation', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, docs: [], semester: req.user.semester });
});

router.post('/documentation/upload', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Documentation uploaded' });
});

// Discussions
router.get('/discussions', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, discussions: [], semester: req.user.semester });
});

router.post('/discussions', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'New message added to discussion' });
});

// Funds
router.get('/funds', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, funds: [], semester: req.user.semester });
});

router.post('/funds/apply', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, message: 'Fund request submitted' });
});

// Profile
router.get('/profile', verifyToken, verifyRole('student'), (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/profile/update', verifyToken, verifyRole('student'), (req, res) => {
  // Handle potential semester update for students
  if (req.body.semester && req.user.semester !== req.body.semester) {
    // You would update the semester in the database here
    // This is a simplified example - actual implementation would involve updating the User model
    req.user.semester = req.body.semester;
  }
  
  res.json({ success: true, message: 'Profile updated', user: req.user });
});

// New team-related routes
router.post('/team/create', verifyToken, verifyRole('student'), createTeam);
router.get('/team', verifyToken, verifyRole('student'), getStudentTeams);
router.get('/available-students', verifyToken, verifyRole('student'), getAvailableStudents);
router.get('/available-teachers', verifyToken, verifyRole('student'), getAvailableTeachers);

module.exports = router;