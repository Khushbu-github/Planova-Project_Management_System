const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const User = require('../Models/User');
const { verifyToken, verifyRole } = require('../Middlewares/AuthMiddleware');

const verifyTeacher = verifyRole('teacher');
const verifyStudent = verifyRole('student');

// Assign task (only teacher)
router.post('/assign', verifyToken, verifyTeacher, async (req, res) => {
  const { studentId, title, description } = req.body;

  try {
    const task = new Task({
      studentId,
      teacherId: req.user.id, // from the token
      title,
      description
    });

    await task.save();
    res.json({ message: 'Task assigned', task });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: 'Error assigning task', error: err.message });
  }
});


// Get all students (only for teacher)
router.get('/students', verifyToken, verifyTeacher, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', err });
  }
});

router.get('/student', verifyToken, verifyStudent, async (req, res) => {
  const tasks = await Task.find({ studentId: req.user.id });
  res.json(tasks);
});


module.exports = router;
