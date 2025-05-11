const Task = require('../Models/Task');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const verifyAndGetUser = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");
  return user;
};

exports.assignTask = async (req, res) => {
  try {
    const user = await verifyAndGetUser(req);
    if (user.role !== 'teacher') return res.status(403).json({ message: "Access denied" });

    const { title, description, studentId } = req.body;
    const task = new Task({ title, description, studentId, teacherId: user._id });
    await task.save();
    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentTasks = async (req, res) => {
  try {
    const user = await verifyAndGetUser(req);
    if (user.role !== 'student') return res.status(403).json({ message: "Access denied" });

    const tasks = await Task.find({ studentId: user._id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
