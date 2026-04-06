const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.submitProgress = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { student_id, lesson_id, answers } = req.body;
  
  if (req.user.role !== 'admin' && req.user.id !== student_id) {
    return res.status(403).json({ message: 'Not authorized to submit progress for this student' });
  }

  if (!answers || !Array.isArray(answers) || answers.length !== 3) {
    return res.status(400).json({ message: 'Exactly 3 answers are required for submission' });
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // 1. Verify all questions belong to the lesson and get correct answers
    const questionIds = answers.map(a => a.question_id);
    const qResult = await client.query(
      `SELECT q.id, q.correct_answer, l.subject_id 
       FROM questions q 
       JOIN lessons l ON q.lesson_id = l.id 
       WHERE q.id = ANY($1) AND q.lesson_id = $2`, 
      [questionIds, lesson_id]
    );
    
    if (qResult.rows.length !== 3) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid question IDs for this lesson' });
    }
    
    const subject_id = qResult.rows[0].subject_id;
    let correctCount = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const dbQ = qResult.rows.find(q => q.id === answer.question_id);
      const is_correct = (answer.answer_given.trim().toLowerCase() === dbQ.correct_answer.trim().toLowerCase());
      if (is_correct) correctCount++;

      // Insert into student_progress
      const pRes = await client.query(
        `INSERT INTO student_progress (student_id, lesson_id, question_id, answer_given, is_correct) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (student_id, question_id) 
         DO UPDATE SET answer_given = EXCLUDED.answer_given, is_correct = EXCLUDED.is_correct, answered_at = NOW()
         RETURNING *`,
        [student_id, lesson_id, answer.question_id, answer.answer_given, is_correct]
      );
      processedAnswers.push(pRes.rows[0]);
    }

    // 2. Upsert Student Score (Atomic increment/set)
    // Blueprint Rule S-6: A submitted score can NEVER be altered by re-submission (UNIQUE constraint prevents it)
    // Actually, the ON CONFLICT above allows updates if they retry. 
    // But the blueprint says "ON CONFLICT DO NOTHING" in the text but "DO UPDATE" in some places. 
    // Let's stick to recalculation or a careful increment. 
    // Since we support retries (DO UPDATE), recalculation is safer to avoid double-counting.
    
    const correctCountRes = await client.query(
      `SELECT COUNT(*) AS score
       FROM student_progress sp
       JOIN lessons l ON sp.lesson_id = l.id
       WHERE sp.student_id = $1 AND l.subject_id = $2 AND sp.is_correct = true`,
      [student_id, subject_id]
    );
    const totalQuestionsRes = await client.query(
      `SELECT COUNT(DISTINCT question_id) AS total
       FROM student_progress sp
       JOIN lessons l ON sp.lesson_id = l.id
       WHERE sp.student_id = $1 AND l.subject_id = $2`,
      [student_id, subject_id]
    );

    const total_score = parseInt(correctCountRes.rows[0].score);
    const total_attempted = parseInt(totalQuestionsRes.rows[0].total);

    await client.query(
      `INSERT INTO student_scores (student_id, subject_id, score, total)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, subject_id)
       DO UPDATE SET score = EXCLUDED.score, total = EXCLUDED.total, updated_at = NOW()`,
      [student_id, subject_id, total_score, total_attempted]
    );

    // 3. Find next lesson ID
    const currentLessonRes = await client.query('SELECT lesson_order FROM lessons WHERE id = $1', [lesson_id]);
    const nextLessonRes = await client.query(
      'SELECT id FROM lessons WHERE subject_id = $1 AND lesson_order > $2 ORDER BY lesson_order ASC LIMIT 1',
      [subject_id, currentLessonRes.rows[0].lesson_order]
    );
    const nextLessonId = nextLessonRes.rows.length > 0 ? nextLessonRes.rows[0].id : null;

    await client.query('COMMIT');

    res.json({ 
      score: correctCount, 
      total: 3, 
      nextLessonId,
      message: getScoreMessage(correctCount)
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

function getScoreMessage(score) {
  if (score === 3) return "Perfect Score! Amazing! You got everything right! You're a superstar!";
  if (score === 2) return "Great Job! Well done! You got 2 out of 3. You're almost there!";
  if (score === 1) return "Keep Going! Good try! You got 1 out of 3. Watch the video again and you'll do better!";
  return "Don't Give Up! You scored 0 this time. That's okay! Review the lesson and try again next time.";
}

exports.getProgressSummary = async (req, res, next) => {
  const { student_id } = req.params;
  try {
    const totalAns = await db.query('SELECT COUNT(*) FROM student_progress WHERE student_id = $1', [student_id]);
    const correctAns = await db.query('SELECT COUNT(*) FROM student_progress WHERE student_id = $1 AND is_correct = true', [student_id]);
    const lessonsCompleted = await db.query('SELECT COUNT(DISTINCT lesson_id) FROM student_progress WHERE student_id = $1', [student_id]);
    
    const count = parseInt(totalAns.rows[0].count);
    const correctCount = parseInt(correctAns.rows[0].count);
    
    res.json({
      totalQuestionsAnswered: count,
      correctAnswers: correctCount,
      wrongAnswers: count - correctCount,
      lessonsCompleted: parseInt(lessonsCompleted.rows[0].count)
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudentScores = async (req, res, next) => {
  const { student_id } = req.params;
  try {
    const result = await db.query(
      `SELECT ss.score, ss.total, sub.name, sub.icon 
       FROM student_scores ss
       JOIN subjects sub ON ss.subject_id = sub.id
       WHERE ss.student_id = $1`,
      [student_id]
    );

    // If they haven't started, they might not have rows.
    // Fetch all subjects for their grade and default to 0 if missing.
    const studentInfo = await db.query('SELECT grade FROM students WHERE id = $1', [student_id]);
    const grade = studentInfo.rows[0]?.grade;

    if (!grade) {
         return res.json([]);
    }

    const allSubjects = await db.query('SELECT * FROM subjects WHERE grade = $1', [grade]);
    
    const scores = allSubjects.rows.map(sub => {
      const existing = result.rows.find(r => r.name === sub.name);
      if (existing) {
        return {
          subject_name: sub.name,
          icon: sub.icon,
          score: existing.score,
          total: existing.total,
          percentage: existing.total > 0 ? Math.round((existing.score / existing.total) * 100) : 0
        };
      }
      return {
        subject_name: sub.name,
        icon: sub.icon,
        score: 0,
        total: 0,
        percentage: 0
      };
    });

    res.json(scores);
  } catch (err) {
    next(err);
  }
};
