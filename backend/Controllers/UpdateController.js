const Update = require('../Models/Update');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

// Helper to verify token and get user
const verifyAndGetUser = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");
  return user;
};

// Get all updates (for teachers)
exports.getAllUpdates = async (req, res) => {
  try {
    const user = await verifyAndGetUser(req);
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = await Update.find()
      .populate('studentId', 'name') // Populate only 'name' from User
      .sort({ createdAt: -1 });

    // Filter out updates where studentId is null
    const filtered = updates.filter(update => update.studentId !== null);

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
