/**
 * routes/student.api.routes.js
 *
 * Registered endpoints:
 *   GET  /api/student/home                          — dashboard summary
 *   GET  /api/student/subjects/:subjectId/units     — units + lessons w/ unlock status
 *   GET  /api/student/lessons/:lessonId             — lesson content (locked gate)
 *   POST /api/student/lessons/:lessonId/submit      — submit answers, score, unlock next
 *   POST /api/student/games/:gameId/score           — submit game score
 *   GET  /api/student/profile                       — streak, completions, badges
 */

const express = require('express');
const router = express.Router();
const authMw = require('../middleware/authMw');
const requireStudent = require('../middleware/requireStudent');
const studentController = require('../controllers/studentController');

// All student routes require a valid JWT + student role
router.use(authMw);
router.use(requireStudent);

// Dashboard home
router.get('/home', studentController.getHome);

// Subjects → units with lesson unlock status
router.get('/subjects/:subjectId/units', studentController.getSubjectUnits);

// Lesson content (server-side lock check)
router.get('/lessons/:lessonId', studentController.getLessonContent);

// Submit quiz answers → score + unlock next lesson
router.post('/lessons/:lessonId/submit', studentController.submitLesson);

// Submit game score
router.post('/games/:gameId/score', studentController.submitGameScore);

// Student profile (streak, badges, completions)
router.get('/profile', studentController.getProfile);

module.exports = router;
