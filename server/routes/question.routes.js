const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const questionController = require('../controllers/question.controller');
const { body } = require('express-validator');

router.post('/', [
  verifyAdmin,
  body('lesson_id').isInt(),
  body('type').isIn(['mcq', 'fill_blank', 'true_false']),
  body('question_text').notEmpty(),
  body('correct_answer').notEmpty()
], questionController.createQuestion);

router.put('/:id', verifyAdmin, questionController.updateQuestion);
router.delete('/:id', verifyAdmin, questionController.deleteQuestion);

module.exports = router;
