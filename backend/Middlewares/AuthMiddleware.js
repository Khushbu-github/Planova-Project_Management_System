const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

exports.verifyRole = (role) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== role) {
      return res.status(403).json({ message: `Access denied: ${role} only` });
    }
    next();
  };
};
