const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.getLessons = async (req, res, next) => {
  const { subject_id, student_id } = req.query;
  const targetStudentId = student_id || (req.user && req.user.id);
  
  try {
    let query = 'SELECT * FROM lessons';
    const params = [];
    if (subject_id) {
      query += ' WHERE subject_id = $1';
      params.push(subject_id);
    }
    query += ' ORDER BY lesson_order';
    const result = await db.query(query, params);
    let lessons = result.rows;

    if (targetStudentId) {
      const progressRes = await db.query(`
        SELECT lesson_id, COUNT(question_id) as ans_count
        FROM student_progress 
        WHERE student_id = $1
        GROUP BY lesson_id
      `, [targetStudentId]);

      const completedLessonIds = new Set(
        progressRes.rows
          .filter(row => parseInt(row.ans_count) === 3)
          .map(row => row.lesson_id)
      );

      let previousDone = true; 
      lessons = lessons.map((lesson, index) => {
        let status = 'locked';
        if (completedLessonIds.has(lesson.id)) {
          status = 'done';
          previousDone = true;
        } else if (previousDone || index === 0) {
          status = 'active';
          previousDone = false; 
        } else {
          previousDone = false;
        }
        return { ...lesson, status };
      });
    }

    res.json(lessons);
  } catch (err) {
    next(err);
  }
};

exports.getLessonDetails = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    
    // Get lesson info
    const lessonRes = await db.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (lessonRes.rows.length === 0) return res.status(404).json({ message: 'Lesson not found' });
    const lesson = lessonRes.rows[0];

    // Get questions
    const qRes = await db.query('SELECT * FROM questions WHERE lesson_id = $1 ORDER BY question_order', [lessonId]);
    
    // Get games
    // Students only see visible games. Admin sees all.
    let gameQuery = 'SELECT * FROM games WHERE lesson_id = $1';
    if (req.user.role !== 'admin') {
      gameQuery += ' AND is_hidden = false';
    }
    gameQuery += ' ORDER BY game_order';
    
    const gRes = await db.query(gameQuery, [lessonId]);

    res.json({
      ...lesson,
      questions: qRes.rows,
      games: gRes.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.createLesson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { subject_id, title, lesson_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO lessons (subject_id, title, lesson_order) VALUES ($1, $2, $3) RETURNING *',
      [subject_id, title, lesson_order || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateLesson = async (req, res, next) => {
  const { title, lesson_order } = req.body;
  try {
    const result = await db.query(
      `UPDATE lessons SET title = COALESCE($1, title), lesson_order = COALESCE($2, lesson_order) 
       WHERE id = $3 RETURNING *`,
      [title, lesson_order, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    await db.query('DELETE FROM lessons WHERE id = $1', [req.params.id]);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    next(err);
  }
};

exports.createLessonBulk = async (req, res, next) => {
  const { lesson, mcq, fill_blank, true_false } = req.body;
  
  try {
    await db.query('BEGIN');

    // Create Lesson
    const lessonRes = await db.query(
      `INSERT INTO lessons (subject_id, title, subtitle, difficulty, lesson_order) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [lesson.subject_id, lesson.title, lesson.subtitle, lesson.difficulty, lesson.lesson_order || 1]
    );
    const lessonId = lessonRes.rows[0].id;

    // Create MCQ
    await db.query(
      `INSERT INTO questions (lesson_id, type, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order)
       VALUES ($1, 'mcq', $2, $3, $4, $5, $6, $7, 1)`,
      [lessonId, mcq.question_text, mcq.option_a, mcq.option_b, mcq.option_c, mcq.option_d, mcq.correct_answer]
    );

    // Create Fill in the Blank
    await db.query(
      `INSERT INTO questions (lesson_id, type, question_text, correct_answer, question_order)
       VALUES ($1, 'fill_blank', $2, $3, 2)`,
      [lessonId, fill_blank.question_text, fill_blank.correct_answer]
    );

    // Create True/False
    await db.query(
      `INSERT INTO questions (lesson_id, type, question_text, correct_answer, question_order)
       VALUES ($1, 'true_false', $2, $3, 3)`,
      [lessonId, true_false.question_text, true_false.correct_answer]
    );

    await db.query('COMMIT');
    res.status(201).json(lessonRes.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    next(err);
  }
};
