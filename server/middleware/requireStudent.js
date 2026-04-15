const requireStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: students only' });
};

module.exports = requireStudent;
