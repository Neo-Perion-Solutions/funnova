const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const progressController = require('../controllers/progress.controller');
const { body } = require('express-validator');

router.post('/', [
  verifyToken,
  body('student_id').isInt(),
  body('question_id').isInt(),
  body('answer_given').notEmpty()
], progressController.submitProgress);

// Get progress summary for the current authenticated student
router.get('/summary', verifyToken, progressController.getProgressSummary);

// Get progress for specific student
router.get('/:student_id', verifyToken, progressController.getProgressSummary);

// Get scores for specific student
router.get('/:student_id/scores', verifyToken, progressController.getStudentScores);

module.exports = router;
