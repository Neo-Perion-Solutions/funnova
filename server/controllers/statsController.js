/**
 * statsController.js
 * Platform-wide statistics for the admin dashboard.
 * All queries use actual schema tables only.
 */
const { pool } = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const stats = {};

    // 1. Total students
    const studentCount = await pool.query(
      `SELECT COUNT(*) FROM students`
    );
    stats.total_students = parseInt(studentCount.rows[0].count);

    // 2. Students by grade
    const studentsByGrade = await pool.query(
      `SELECT grade, COUNT(*) FROM students GROUP BY grade`
    );
    stats.students_by_grade = { 3: 0, 4: 0, 5: 0 };
    studentsByGrade.rows.forEach((r) => {
      if (r.grade) stats.students_by_grade[r.grade] = parseInt(r.count);
    });

    // 3. Lesson counts
    const lessonCount = await pool.query(
      `SELECT COUNT(*) FROM lessons WHERE is_deleted = false`
    );
    stats.total_lessons = parseInt(lessonCount.rows[0].count);

    // Lessons that have at least one question (questions → section → lesson)
    const withQuestionsRes = await pool.query(`
      SELECT COUNT(DISTINCT l.id) AS with_questions
      FROM lessons l
      JOIN sections s ON s.lesson_id = l.id
      JOIN questions q ON q.section_id = s.id
      WHERE l.is_deleted = false
    `);
    const withQuestions = parseInt(withQuestionsRes.rows[0].with_questions);
    stats.lessons_with_questions = withQuestions;
    stats.lessons_without_questions = stats.total_lessons - withQuestions;

    // 4. Total sections & questions
    const sectionCount = await pool.query(
      `SELECT COUNT(*) FROM sections WHERE is_deleted = false`
    );
    stats.total_sections = parseInt(sectionCount.rows[0].count);

    const questionCount = await pool.query(`SELECT COUNT(*) FROM questions`);
    stats.total_questions = parseInt(questionCount.rows[0].count);

    // 5. Games
    const totalGames = await pool.query(`SELECT COUNT(*) FROM games`);
    const activeGames = await pool.query(`SELECT COUNT(*) FROM games WHERE is_active = true`);
    stats.total_games = parseInt(totalGames.rows[0].count);
    stats.active_games = parseInt(activeGames.rows[0].count);

    // 6. Total lesson completions (from lesson_completions table)
    const completions = await pool.query(`SELECT COUNT(*) FROM lesson_completions`);
    stats.total_completions = parseInt(completions.rows[0].count);

    // 7. Total answer submissions
    const answers = await pool.query(`SELECT COUNT(*) FROM student_answers`);
    const correctAnswers = await pool.query(
      `SELECT COUNT(*) FROM student_answers WHERE is_correct = true`
    );
    stats.total_answers_submitted = parseInt(answers.rows[0].count);
    stats.total_correct_answers = parseInt(correctAnswers.rows[0].count);
    stats.platform_accuracy_pct =
      stats.total_answers_submitted > 0
        ? Math.round((stats.total_correct_answers / stats.total_answers_submitted) * 100)
        : 0;

    // 8. Average student score (from students table)
    const avgScore = await pool.query(
      `SELECT ROUND(AVG(avg_score), 2) AS avg FROM students WHERE avg_score > 0`
    );
    stats.avg_score_pct = parseFloat(avgScore.rows[0].avg) || 0;

    // 9. Top 5 students by avg_score then lessons completed
    const topStudents = await pool.query(`
      SELECT id, name, grade, section, lessons_completed, avg_score
      FROM students
      ORDER BY avg_score DESC, lessons_completed DESC
      LIMIT 5
    `);
    stats.top_performing_students = topStudents.rows;

    // 10. Most completed lessons (via lesson_completions)
    const mostCompleted = await pool.query(`
      SELECT l.id, l.title, COUNT(lc.id) AS completion_count
      FROM lessons l
      JOIN lesson_completions lc ON lc.lesson_id = l.id
      WHERE l.is_deleted = false
      GROUP BY l.id, l.title
      ORDER BY completion_count DESC
      LIMIT 5
    `);
    stats.most_completed_lessons = mostCompleted.rows;

    return res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
