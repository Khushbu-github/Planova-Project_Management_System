const express = require('express');
const router = express.Router();
const Update = require('../Models/Update');
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');


// Student sends update
router.post('/submit', verifyToken, verifyRole('student'), async (req, res) => {
  const { title, message } = req.body;
  try {
    const update = new Update({ studentId: req.user.id, title, message });
    await update.save();
    res.json({ message: 'Update submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit update', err });
  }
});

// Teacher views all student updates
router.get('/all', verifyToken, verifyRole('teacher'), async (req, res) => {
  try {
    const updates = await Update.find().populate('studentId', 'name');
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching updates', err });
  }
});

module.exports = router;
