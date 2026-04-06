const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAllStudents = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, student_id, name, grade, section, avatar_url, role, created_at FROM students');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, student_id, name, grade, section, avatar_url, role FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { student_id, name, password, grade, section, avatar_url, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO students (student_id, name, password, grade, section, avatar_url, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, student_id, name, grade`,
      [student_id, name, hashedPassword, grade, section, avatar_url, role || 'student']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  const { name, grade, section, avatar_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE students SET name = COALESCE($1, name), grade = COALESCE($2, grade), 
       section = COALESCE($3, section), avatar_url = COALESCE($4, avatar_url) 
       WHERE id = $5 RETURNING id, name, grade`,
      [name, grade, section, avatar_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    await db.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
};
