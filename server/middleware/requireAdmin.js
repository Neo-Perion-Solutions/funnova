/**
 * requireAdmin.js
 * Allows main_admin and sub_admin; blocks students.
 * Role is read from the verified JWT (req.user), never from the request body.
 */
const requireAdmin = (req, res, next) => {
  const role = req.user && req.user.role;
  if (role === 'main_admin' || role === 'sub_admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: admin role required' });
};

module.exports = requireAdmin;
