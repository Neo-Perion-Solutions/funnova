/**
 * routes/admin.routes.js
 *
 * All routes require: valid JWT (authMw) + admin role (main_admin | sub_admin).
 * Sub-admin access is further restricted server-side per endpoint where needed.
 *
 * Endpoints:
 *   -- STUDENT MANAGEMENT (sub_admin allowed) --
 *   GET    /api/admin/students
 *   POST   /api/admin/students
 *   PUT    /api/admin/students/:id
 *   DELETE /api/admin/students/:id
 *   GET    /api/admin/students/:id/progress
 *
 *   -- SUBJECT MANAGEMENT (main_admin only) --
 *   GET    /api/admin/subjects
 *   POST   /api/admin/subjects
 *   PUT    /api/admin/subjects/:id
 *
 *   -- UNIT MANAGEMENT (main_admin only) --
 *   GET    /api/admin/units
 *   POST   /api/admin/units
 *   PUT    /api/admin/units/:id
 *   DELETE /api/admin/units/:id
 *
 *   -- LESSON MANAGEMENT (main_admin only) --
 *   GET    /api/admin/lessons
 *   POST   /api/admin/lessons
 *   PUT    /api/admin/lessons/reorder
 *   PUT    /api/admin/lessons/:id
 *   DELETE /api/admin/lessons/:id
 *
 *   -- SECTION MANAGEMENT (main_admin only) --
 *   GET    /api/admin/sections/:lessonId
 *   POST   /api/admin/sections
 *   PUT    /api/admin/sections/:id
 *   DELETE /api/admin/sections/:id
 *
 *   -- QUESTION MANAGEMENT (sub_admin allowed) --
 *   GET    /api/admin/questions/:lessonId
 *   POST   /api/admin/questions
 *   PUT    /api/admin/questions/:lessonId
 *   DELETE /api/admin/questions/:questionId
 *
 *   -- GAME MANAGEMENT (main_admin only) --
 *   GET    /api/admin/games
 *   POST   /api/admin/games
 *   PUT    /api/admin/games/:id
 *   PUT    /api/admin/games/:id/toggle
 *   DELETE /api/admin/games/:id
 *
 *   -- PLATFORM STATS --
 *   GET    /api/admin/stats
 */

const express = require('express');
const router = express.Router();
const authMw = require('../middleware/authMw');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');
const adminUsersController = require('../controllers/adminUsersController');
const statsController = require('../controllers/statsController');

// Middleware: require valid JWT + admin role
router.use(authMw);
router.use(requireAdmin);

// Inline guard: main_admin only
const mainAdminOnly = (req, res, next) => {
  if (req.user.role === 'main_admin') return next();
  return res.status(403).json({ success: false, message: 'main_admin access required' });
};

// -- STUDENT MANAGEMENT (sub_admin allowed) --
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);
router.get('/students/:id/progress', adminController.getStudentProgress);

// -- SUBJECT MANAGEMENT (main_admin only) --
router.get('/subjects', adminController.getSubjects);
router.post('/subjects', mainAdminOnly, adminController.createSubject);
router.put('/subjects/:id', mainAdminOnly, adminController.updateSubject);

// -- UNIT MANAGEMENT (main_admin only) --
router.get('/units', adminController.getUnits);
router.post('/units', mainAdminOnly, adminController.createUnit);
router.put('/units/:id', mainAdminOnly, adminController.updateUnit);
router.delete('/units/:id', mainAdminOnly, adminController.deleteUnit);

// -- LESSON MANAGEMENT (main_admin only) --
router.get('/lessons', adminController.getLessons);
router.put('/lessons/reorder', mainAdminOnly, adminController.reorderLessons);
router.post('/lessons', mainAdminOnly, adminController.createLesson);
router.get('/lessons/:id', adminController.getLessons); // Get single lesson by ID
router.put('/lessons/:id', mainAdminOnly, adminController.updateLesson);
router.delete('/lessons/:id', mainAdminOnly, adminController.deleteLesson);

// -- SECTION MANAGEMENT (main_admin only) --
router.get('/sections/:lessonId', adminController.getSections);
router.post('/sections', mainAdminOnly, adminController.createSection);
router.put('/sections/:id', mainAdminOnly, adminController.updateSection);
router.delete('/sections/:id', mainAdminOnly, adminController.deleteSection);

// -- QUESTION MANAGEMENT (sub_admin allowed) --
router.get('/questions/:lessonId', adminController.getQuestions);
router.post('/questions', adminController.createQuestions);
router.put('/questions/:lessonId', adminController.updateQuestions);
router.delete('/questions/:questionId', adminController.deleteQuestion);

// -- GAME MANAGEMENT (main_admin only) --
router.get('/games', adminController.getGames);
router.post('/games', mainAdminOnly, adminController.createGame);
router.put('/games/:id', mainAdminOnly, adminController.updateGame);
router.put('/games/:id/toggle', mainAdminOnly, adminController.toggleGame);
router.delete('/games/:id', mainAdminOnly, adminController.deleteGame);

// -- ADMIN USER MANAGEMENT (main_admin only) --
router.get('/admin-users', mainAdminOnly, adminUsersController.getAdmins);
router.post('/admin-users', mainAdminOnly, adminUsersController.createAdmin);
router.get('/admin-users/:id', mainAdminOnly, adminUsersController.getAdmin);
router.put('/admin-users/:id', mainAdminOnly, adminUsersController.updateAdmin);
router.delete('/admin-users/:id', mainAdminOnly, adminUsersController.deleteAdmin);

// -- ADMIN IMPERSONATION (main_admin only) --
router.post('/impersonate/:studentId', mainAdminOnly, adminUsersController.impersonateStudent);

// -- PLATFORM STATS --
router.get('/stats', statsController.getStats);

module.exports = router;
