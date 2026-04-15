/**
 * impersonationMw.js
 * Middleware to handle admin impersonation of students
 * When an admin is impersonating a student, this middleware:
 * 1. Detects impersonation tokens
 * 2. Routes requests to student endpoints with the impersonated student's context
 * 3. Ensures impersonating admins have access to student data
 */

// Middleware to check if request is from an impersonating admin
// If yes, treat subsequent middleware/routes as if the impersonated student made the request
const handleImpersonation = (req, res, next) => {
  if (req.user && req.user.isImpersonating && req.user.impersonatingStudentId) {
    // Mark this request as impersonated
    req.isImpersonating = true;
    req.impersonatedStudentId = req.user.impersonatingStudentId;
    req.originalAdminId = req.user.id;
    req.impersonatedStudentGrade = req.user.impersonatingStudentGrade;
    req.impersonatedStudentName = req.user.impersonatingStudentName;
  }
  next();
};

module.exports = handleImpersonation;
