const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { lesson_id, type, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order } = req.body;
  
  try {
    const result = await db.query(
      `INSERT INTO questions (lesson_id, type, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [lesson_id, type, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  const { question_text, option_a, option_b, option_c, option_d, correct_answer, question_order } = req.body;
  try {
    const result = await db.query(
      `UPDATE questions SET question_text = COALESCE($1, question_text), option_a = COALESCE($2, option_a), 
       option_b = COALESCE($3, option_b), option_c = COALESCE($4, option_c), option_d = COALESCE($5, option_d), 
       correct_answer = COALESCE($6, correct_answer), question_order = COALESCE($7, question_order) 
       WHERE id = $8 RETURNING *`,
      [question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await db.query('DELETE FROM questions WHERE id = $1', [req.params.id]);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
};
