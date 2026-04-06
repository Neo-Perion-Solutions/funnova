const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const subjectController = require('../controllers/subject.controller');

router.get('/', verifyToken, subjectController.getSubjects);
router.post('/', verifyAdmin, subjectController.createSubject);

module.exports = router;
