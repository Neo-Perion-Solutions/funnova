const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/login', [
  body('student_id').notEmpty().withMessage('Student ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
