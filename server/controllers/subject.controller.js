const db = require('../config/db');

exports.getSubjects = async (req, res, next) => {
  const { grade } = req.query;
  try {
    let query = `
      SELECT s.*, CAST(COUNT(l.id) AS INTEGER) AS lesson_count 
      FROM subjects s 
      LEFT JOIN lessons l ON s.id = l.subject_id 
    `;
    const params = [];
    if (grade) {
      query += ' WHERE s.grade = $1';
      params.push(grade);
    }
    query += ' GROUP BY s.id ORDER BY s.name';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createSubject = async (req, res, next) => {
  const { name, icon, grade } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO subjects (name, icon, grade) VALUES ($1, $2, $3) RETURNING *',
      [name, icon, grade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
