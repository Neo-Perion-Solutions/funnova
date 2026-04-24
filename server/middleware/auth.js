/**
 * middleware/auth.js
 * Common authentication/authorization middleware functions
 * Exported as named exports for flexible use across routes
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and attach decoded user to req.user
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

/**
 * Verify user is admin (main_admin or sub_admin)
 * Must be used AFTER verifyToken
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'main_admin' && req.user.role !== 'sub_admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  next();
};

/**
 * Verify user is main_admin only
 * Must be used AFTER verifyToken
 */
const verifyMainAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ success: false, message: 'Main admin access required' });
  }

  next();
};

/**
 * Verify user is student
 * Must be used AFTER verifyToken
 */
const verifyStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.type !== 'student') {
    return res.status(403).json({ success: false, message: 'Student access required' });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyMainAdmin,
  verifyStudent,
};
