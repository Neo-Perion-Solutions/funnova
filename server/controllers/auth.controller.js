const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { student_id, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM students WHERE student_id = $1', [student_id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid Student ID or Password ❌' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Student ID or Password ❌' });
    }

    const payload = {
      id: user.id,
      student_id: user.student_id,
      name: user.name,
      grade: user.grade,
      section: user.section,
      role: user.role,
      avatar_url: user.avatar_url
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  // In a stateless JWT approach, client clears the token
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, student_id, name, grade, section, avatar_url, role FROM students WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
