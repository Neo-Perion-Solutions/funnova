const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const lessonController = require('../controllers/lesson.controller');
const { body } = require('express-validator');

router.get('/', verifyToken, lessonController.getLessons);
router.post('/', [
  verifyAdmin,
  body('subject_id').isInt(),
  body('title').notEmpty()
], lessonController.createLesson);

router.post('/bulk', verifyAdmin, lessonController.createLessonBulk);

router.get('/:id', verifyToken, lessonController.getLessonDetails);
router.put('/:id', verifyAdmin, lessonController.updateLesson);
router.delete('/:id', verifyAdmin, lessonController.deleteLesson);

module.exports = router;
