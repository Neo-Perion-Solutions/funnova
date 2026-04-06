const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const studentController = require('../controllers/student.controller');
const { body } = require('express-validator');

router.get('/', verifyToken, studentController.getAllStudents);
router.post('/', [
  verifyAdmin,
  body('student_id').notEmpty(),
  body('name').notEmpty(),
  body('password').notEmpty(),
  body('grade').isIn([4, 5]),
  body('section').notEmpty()
], studentController.createStudent);

router.get('/:id', verifyToken, studentController.getStudentById);
router.put('/:id', verifyAdmin, studentController.updateStudent);
router.delete('/:id', verifyAdmin, studentController.deleteStudent);

module.exports = router;
