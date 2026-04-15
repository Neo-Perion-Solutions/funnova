/**
 * adminController.js
 * Admin CRUD endpoints — schema-accurate, no email column, no stale tables.
 *
 * Endpoints served via /api/admin:
 *   Students : GET /students, POST /students, PUT /students/:id, DELETE /students/:id
 *              GET /students/:id/progress
 *   Subjects : GET /subjects, POST /subjects, PUT /subjects/:id
 *   Units    : GET /units, POST /units, PUT /units/:id, DELETE /units/:id
 *   Lessons  : GET /lessons, POST /lessons, PUT /lessons/:id, DELETE /lessons/:id
 *              PUT /lessons/reorder
 *   Sections : GET /sections/:lessonId, POST /sections, PUT /sections/:id, DELETE /sections/:id
 *   Questions: GET /questions/:lessonId, POST /questions, PUT /questions/:lessonId,
 *              DELETE /questions/:questionId
 *   Games    : GET /games, POST /games, PUT /games/:id, PUT /games/:id/toggle,
 *              DELETE /games/:id
 *   Stats    : GET /stats (see statsController.js)
 */

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// =================== STUDENTS ===================

exports.getStudents = async (req, res, next) => {
  try {
    const { grade, section, search } = req.query;
    let query = `
      SELECT id, name, login_id, grade, section, avatar_url,
             lessons_completed, avg_score, created_at
      FROM students`;
    const values = [];
    let p = 1;
    let hasWhere = false;

    if (grade) {
      query += ` WHERE grade = $${p++}`;
      values.push(grade);
      hasWhere = true;
    }
    if (section) {
      query += hasWhere ? ` AND` : ` WHERE`;
      query += ` section = $${p++}`;
      values.push(section);
      hasWhere = true;
    }
    if (search) {
      query += hasWhere ? ` AND` : ` WHERE`;
      query += ` (name ILIKE $${p} OR login_id ILIKE $${p})`;
      values.push(`%${search}%`);
    }
    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const { name, login_id, password, grade, section, avatar_url } = req.body;
    if (!name || !login_id || !password || !grade) {
      return res.status(400).json({ success: false, message: 'name, login_id, password and grade are required' });
    }

    const dup = await pool.query('SELECT id FROM students WHERE login_id = $1', [login_id]);
    if (dup.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'login_id already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO students (name, login_id, password_hash, role, grade, section, avatar_url)
       VALUES ($1, $2, $3, 'student', $4, $5, $6)
       RETURNING id, name, login_id, grade, section, avatar_url`,
      [name, login_id, hash, grade, section || null, avatar_url || null]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, login_id, password, grade, section, avatar_url } = req.body;

    if (login_id) {
      const dup = await pool.query('SELECT id FROM students WHERE login_id = $1 AND id != $2', [login_id, id]);
      if (dup.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'login_id already in use' });
      }
    }

    // Build dynamic SET clause
    const fields = ['name', 'login_id', 'grade', 'section', 'avatar_url'];
    const vals = [name, login_id, grade, section, avatar_url];
    let setClauses = fields.map((f, i) => `${f} = COALESCE($${i + 1}, ${f})`);
    const params = [...vals];

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      setClauses.push(`password_hash = $${params.length + 1}`);
      params.push(hash);
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE students SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, name, login_id, grade, section, avatar_url`,
      params
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await pool.query('SELECT role FROM students WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    if (check.rows[0].role !== 'student') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin accounts' });
    }
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getStudentProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lessons completed
    const completions = await pool.query(
      `SELECT lc.completed_at, l.title AS lesson_title,
              u.title AS unit_title, s.name AS subject_name
       FROM lesson_completions lc
       JOIN lessons l ON l.id = lc.lesson_id
       JOIN units u ON u.id = l.unit_id
       JOIN subjects s ON s.id = u.subject_id
       WHERE lc.student_id = $1
       ORDER BY lc.completed_at DESC`,
      [id]
    );

    // Answers (correct / wrong breakdown)
    const answers = await pool.query(
      `SELECT sa.question_id, sa.answer_given, sa.is_correct, sa.answered_at,
              q.question_text, q.type
       FROM student_answers sa
       JOIN questions q ON q.id = sa.question_id
       WHERE sa.student_id = $1
       ORDER BY sa.answered_at DESC`,
      [id]
    );

    // Game scores
    const games = await pool.query(
      `SELECT gs.total_score, gs.accuracy_pct, gs.played_at, g.title AS game_title
       FROM game_scores gs
       JOIN games g ON g.id = gs.game_id
       WHERE gs.student_id = $1
       ORDER BY gs.played_at DESC`,
      [id]
    );

    const totalAnswers = answers.rows.length;
    const correctAnswers = answers.rows.filter((a) => a.is_correct).length;

    return res.json({
      success: true,
      data: {
        summary: {
          lessons_completed: completions.rows.length,
          total_answers: totalAnswers,
          correct_answers: correctAnswers,
          accuracy_pct: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
        },
        completions: completions.rows,
        answers: answers.rows,
        game_scores: games.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =================== SUBJECTS ===================

exports.getSubjects = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT s.*, COUNT(DISTINCT u.id) AS unit_count,
             COUNT(DISTINCT l.id) FILTER (WHERE l.is_deleted = false) AS lesson_count
      FROM subjects s
      LEFT JOIN units u ON u.subject_id = s.id
      LEFT JOIN lessons l ON l.unit_id = u.id
      GROUP BY s.id
      ORDER BY s.grade ASC, s.id ASC`);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const { name, icon, grade } = req.body;
    if (!name || !grade) {
      return res.status(400).json({ success: false, message: 'name and grade are required' });
    }
    const result = await pool.query(
      `INSERT INTO subjects (name, icon, grade) VALUES ($1, $2, $3) RETURNING *`,
      [name, icon || null, grade]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const result = await pool.query(
      `UPDATE subjects SET
         name = COALESCE($1, name),
         icon = COALESCE($2, icon)
       WHERE id = $3 RETURNING *`,
      [name, icon, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// =================== UNITS ===================

exports.getUnits = async (req, res, next) => {
  try {
    const { subject_id } = req.query;
    let query = `SELECT u.*, COUNT(l.id) FILTER (WHERE l.is_deleted = false) AS lesson_count
                 FROM units u LEFT JOIN lessons l ON l.unit_id = u.id`;
    const values = [];
    if (subject_id) { query += ` WHERE u.subject_id = $1`; values.push(subject_id); }
    query += ` GROUP BY u.id ORDER BY u.subject_id ASC, u.unit_order ASC`;
    const result = await pool.query(query, values);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createUnit = async (req, res, next) => {
  try {
    const { subject_id, title } = req.body;
    if (!subject_id || !title) {
      return res.status(400).json({ success: false, message: 'subject_id and title are required' });
    }
    const maxRes = await pool.query(
      `SELECT COALESCE(MAX(unit_order), 0) AS max_order FROM units WHERE subject_id = $1`,
      [subject_id]
    );
    const unit_order = maxRes.rows[0].max_order + 1;
    const result = await pool.query(
      `INSERT INTO units (subject_id, title, unit_order) VALUES ($1, $2, $3) RETURNING *`,
      [subject_id, title, unit_order]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const result = await pool.query(
      `UPDATE units SET title = COALESCE($1, title) WHERE id = $2 RETURNING *`,
      [title, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM units WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Unit deleted' });
  } catch (err) {
    next(err);
  }
};

// =================== LESSONS ===================

exports.getLessons = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject_id, unit_id } = req.query;

    // If specific ID provided in URL path, fetch single lesson
    if (id) {
      const result = await pool.query(`
        SELECT l.*, u.title AS unit_title, u.unit_order,
               s.name AS subject_name,
               (SELECT COUNT(id) FROM sections WHERE lesson_id = l.id AND is_deleted = false) AS section_count,
               (SELECT COUNT(q.id) FROM questions q
                JOIN sections sec ON sec.id = q.section_id
                WHERE sec.lesson_id = l.id) AS question_count
        FROM lessons l
        JOIN units u ON u.id = l.unit_id
        JOIN subjects s ON s.id = u.subject_id
        WHERE l.id = $1 AND l.is_deleted = false`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Lesson not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    }

    // Otherwise fetch list with filters
    let query = `
      SELECT l.*, u.title AS unit_title, u.unit_order,
             s.name AS subject_name,
             (SELECT COUNT(id) FROM sections WHERE lesson_id = l.id AND is_deleted = false) AS section_count,
             (SELECT COUNT(q.id) FROM questions q
              JOIN sections sec ON sec.id = q.section_id
              WHERE sec.lesson_id = l.id) AS question_count
      FROM lessons l
      JOIN units u ON u.id = l.unit_id
      JOIN subjects s ON s.id = u.subject_id
      WHERE l.is_deleted = false`;
    const values = [];
    let p = 1;
    if (unit_id)    { query += ` AND l.unit_id = $${p++}`;    values.push(unit_id); }
    if (subject_id) { query += ` AND u.subject_id = $${p++}`; values.push(subject_id); }
    query += ` ORDER BY u.unit_order ASC, l.lesson_order ASC`;

    const result = await pool.query(query, values);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createLesson = async (req, res, next) => {
  try {
    const { unit_id, title, description, video_url } = req.body;
    if (!unit_id || !title) {
      return res.status(400).json({ success: false, message: 'unit_id and title are required' });
    }
    const maxRes = await pool.query(
      `SELECT COALESCE(MAX(lesson_order), 0) AS max_order FROM lessons WHERE unit_id = $1 AND is_deleted = false`,
      [unit_id]
    );
    const lesson_order = maxRes.rows[0].max_order + 1;
    const result = await pool.query(
      `INSERT INTO lessons (unit_id, title, description, video_url, lesson_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [unit_id, title, description || null, video_url || null, lesson_order]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, video_url } = req.body;
    const result = await pool.query(
      `UPDATE lessons
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           video_url   = COALESCE($3, video_url)
       WHERE id = $4 AND is_deleted = false RETURNING *`,
      [title, description, video_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE lessons SET is_deleted = true WHERE id = $1`, [id]);
    return res.json({ success: true, message: 'Lesson soft deleted' });
  } catch (err) {
    next(err);
  }
};

exports.reorderLessons = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { unit_id, ordered_lesson_ids } = req.body;
    // ordered_lesson_ids: array of lesson IDs in the desired order
    if (!unit_id || !Array.isArray(ordered_lesson_ids) || ordered_lesson_ids.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'unit_id and ordered_lesson_ids array are required' });
    }
    for (let i = 0; i < ordered_lesson_ids.length; i++) {
      await client.query(
        `UPDATE lessons SET lesson_order = $1 WHERE id = $2 AND unit_id = $3`,
        [i + 1, ordered_lesson_ids[i], unit_id]
      );
    }
    await client.query('COMMIT');
    return res.json({ success: true, message: 'Lessons reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// =================== SECTIONS ===================

exports.getSections = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      `SELECT * FROM sections WHERE lesson_id = $1 AND is_deleted = false ORDER BY section_order ASC`,
      [lessonId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createSection = async (req, res, next) => {
  try {
    const { lesson_id, title, type } = req.body;
    if (!lesson_id || !title) {
      return res.status(400).json({ success: false, message: 'lesson_id and title are required' });
    }
    const maxRes = await pool.query(
      `SELECT COALESCE(MAX(section_order), 0) AS max_order FROM sections WHERE lesson_id = $1 AND is_deleted = false`,
      [lesson_id]
    );
    const section_order = maxRes.rows[0].max_order + 1;
    const result = await pool.query(
      `INSERT INTO sections (lesson_id, title, type, section_order) VALUES ($1, $2, $3, $4) RETURNING *`,
      [lesson_id, title, type || null, section_order]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type } = req.body;
    const result = await pool.query(
      `UPDATE sections SET title = COALESCE($1, title), type = COALESCE($2, type)
       WHERE id = $3 AND is_deleted = false RETURNING *`,
      [title, type, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE sections SET is_deleted = true WHERE id = $1`, [id]);
    return res.json({ success: true, message: 'Section soft deleted' });
  } catch (err) {
    next(err);
  }
};

// =================== QUESTIONS ===================

exports.getQuestions = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      `SELECT q.* FROM questions q
       JOIN sections s ON s.id = q.section_id
       WHERE s.lesson_id = $1
       ORDER BY q.section_id ASC, q.question_order ASC`,
      [lessonId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createQuestions = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { lesson_id, questions } = req.body;
    if (!lesson_id || !Array.isArray(questions) || questions.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'lesson_id and questions array are required' });
    }

    // Verify lesson exists and is not deleted
    const lessonCheck = await client.query(
      `SELECT id FROM lessons WHERE id = $1 AND is_deleted = false`, [lesson_id]
    );
    if (lessonCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const inserted = [];
    for (const q of questions) {
      if (!q.section_id || !q.type || !q.question_text || !q.correct_answer || !q.question_order) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Each question needs section_id, type, question_text, correct_answer, question_order',
        });
      }
      const r = await client.query(
        `INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [q.section_id, q.type, q.question_text, q.options ? JSON.stringify(q.options) : null, q.correct_answer, q.question_order]
      );
      inserted.push(r.rows[0]);
    }
    await client.query('COMMIT');
    return res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

exports.updateQuestions = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { lessonId } = req.params;
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'questions array is required' });
    }

    // Delete all existing questions for this lesson then re-insert
    await client.query(
      `DELETE FROM questions WHERE section_id IN
         (SELECT id FROM sections WHERE lesson_id = $1)`,
      [lessonId]
    );

    const inserted = [];
    for (const q of questions) {
      const r = await client.query(
        `INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [q.section_id, q.type, q.question_text, q.options ? JSON.stringify(q.options) : null, q.correct_answer, q.question_order]
      );
      inserted.push(r.rows[0]);
    }
    await client.query('COMMIT');
    return res.json({ success: true, data: inserted });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    await pool.query(`DELETE FROM questions WHERE id = $1`, [questionId]);
    return res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
};

// =================== GAMES ===================

exports.getGames = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT g.*, l.title AS lesson_title, s.name AS subject_name
      FROM games g
      JOIN lessons l ON g.lesson_id = l.id
      JOIN units u ON u.id = l.unit_id
      JOIN subjects s ON s.id = u.subject_id
      ORDER BY g.id ASC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

exports.createGame = async (req, res, next) => {
  try {
    const { lesson_id, title, game_url } = req.body;
    if (!lesson_id || !title) {
      return res.status(400).json({ success: false, message: 'lesson_id and title are required' });
    }
    const result = await pool.query(
      `INSERT INTO games (lesson_id, title, game_url) VALUES ($1, $2, $3) RETURNING *`,
      [lesson_id, title, game_url || null]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lesson_id, title, game_url } = req.body;
    const result = await pool.query(
      `UPDATE games SET
         lesson_id = COALESCE($1, lesson_id),
         title     = COALESCE($2, title),
         game_url  = COALESCE($3, game_url)
       WHERE id = $4 RETURNING *`,
      [lesson_id, title, game_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.toggleGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    if (is_active === undefined) {
      return res.status(400).json({ success: false, message: 'is_active is required' });
    }
    const result = await pool.query(
      `UPDATE games SET is_active = $1 WHERE id = $2 RETURNING id, title, is_active`,
      [is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM games WHERE id = $1`, [id]);
    return res.json({ success: true, message: 'Game deleted' });
  } catch (err) {
    next(err);
  }
};
