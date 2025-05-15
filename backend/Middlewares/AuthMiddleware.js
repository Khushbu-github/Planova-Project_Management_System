const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
    
  // Extract the token from the Bearer format
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Token not provided" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Store user info in request for use in subsequent middleware/controllers
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
    
    // Add the semester to the req.user object if the user is a student
    if (user.role === 'student' && user.semester) {
      req.user.semester = user.semester;
    }
    
    next();
  };
};