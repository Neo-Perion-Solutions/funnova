/**
 * studentController.js
 * Student-facing API handlers — all unlock logic enforced server-side.
 *
 * Endpoints served:
 *   GET  /api/student/home
 *   GET  /api/student/subjects/:subjectId/units
 *   GET  /api/student/lessons/:lessonId
 *   POST /api/student/lessons/:lessonId/submit
 *   GET  /api/student/profile
 */

const { pool } = require('../config/db');

// ---------------------------------------------------------------------------
// Helper: compute unlock status for a sorted list of lessons
// Rule: lesson[0] is always unlocked; lesson[N] requires lesson[N-1] completed
// ---------------------------------------------------------------------------
function computeUnlockStatus(lessons, completedSet) {
  return lessons.map((lesson, idx) => {
    let is_unlocked = false;
    if (idx === 0) {
      is_unlocked = true; // first lesson always open
    } else {
      const prevLesson = lessons[idx - 1];
      is_unlocked = completedSet.has(prevLesson.id);
    }
    const is_completed = completedSet.has(lesson.id);
    return {
      ...lesson,
      is_unlocked,
      is_completed,
      status: is_completed ? 'completed' : is_unlocked ? 'unlocked' : 'locked',
    };
  });
}

// ---------------------------------------------------------------------------
// Score feedback message
// ---------------------------------------------------------------------------
function getScoreMessage(score, total) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct === 100) return 'Perfect Score! Amazing! You got everything right! 🌟';
  if (pct >= 66) return 'Great Job! You got most of them right! Keep it up! 👍';
  if (pct >= 33) return 'Keep Going! Review the lesson and try again! 💪';
  return "Don't Give Up! Review the lesson carefully and try again! 📖";
}

// ---------------------------------------------------------------------------
// Badge computation — purely derived, no separate badges table needed
// ---------------------------------------------------------------------------
function computeBadges(lessonsCompleted, streakDays, avgScore) {
  const badges = [];

  if (lessonsCompleted >= 1) badges.push({ id: 'first_step', label: 'First Step', icon: '🎯' });
  if (lessonsCompleted >= 5) badges.push({ id: 'five_lessons', label: 'Quick Learner', icon: '📚' });
  if (lessonsCompleted >= 10) badges.push({ id: 'ten_lessons', label: 'Scholar', icon: '🎓' });
  if (lessonsCompleted >= 25) badges.push({ id: 'twenty_five', label: 'Expert', icon: '🏆' });

  if (streakDays >= 3) badges.push({ id: 'streak_3', label: '3-Day Streak', icon: '🔥' });
  if (streakDays >= 7) badges.push({ id: 'streak_7', label: 'Week Warrior', icon: '⚡' });
  if (streakDays >= 30) badges.push({ id: 'streak_30', label: 'Monthly Legend', icon: '💫' });

  if (avgScore >= 80) badges.push({ id: 'high_scorer', label: 'High Scorer', icon: '⭐' });
  if (avgScore === 100) badges.push({ id: 'perfect', label: 'Perfectionist', icon: '💎' });

  return badges;
}

// ===========================================================================
// GET /api/student/home
// Returns: student info + subjects for their grade with overall progress
// ===========================================================================
exports.getHome = async (req, res, next) => {
  const studentId = req.user.id;
  const client = await pool.connect();

  try {
    // 1. Student basic info
    const studentRes = await client.query(
      `SELECT id, name, login_id, grade, section, avatar_url,
              lessons_completed, avg_score, created_at
       FROM students WHERE id = $1`,
      [studentId]
    );
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const student = studentRes.rows[0];

    // 2. Combined query: Get subjects, lesson counts, and completion counts in ONE query
    const subjectsRes = await client.query(
      `SELECT 
         s.id, s.name, s.icon,
         COUNT(DISTINCT l.id) FILTER (WHERE l.is_deleted = false) AS total_lessons,
         COUNT(DISTINCT lc.lesson_id) AS completed_count
       FROM subjects s
       LEFT JOIN units u ON u.subject_id = s.id
       LEFT JOIN lessons l ON l.unit_id = u.id AND l.is_deleted = false
       LEFT JOIN lesson_completions lc ON lc.lesson_id = l.id AND lc.student_id = $1
       WHERE s.grade = $2
       GROUP BY s.id, s.name, s.icon
       ORDER BY s.id ASC`,
      [studentId, student.grade]
    );

    const subjects = subjectsRes.rows.map((s) => {
      const total = parseInt(s.total_lessons) || 0;
      const completed = parseInt(s.completed_count) || 0;
      return {
        id: s.id,
        name: s.name,
        icon: s.icon,
        total_lessons: total,
        completed_lessons: completed,
        progress_pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });

    // 3. Get all completed lesson IDs and dates in a single query
    const completedLessonsRes = await client.query(
      `SELECT lc.lesson_id, lc.completed_at, l.title AS lesson_title,
              u.subject_id, s.name AS subject_name, DATE(lc.completed_at) AS completion_date
       FROM lesson_completions lc
       JOIN lessons l ON l.id = lc.lesson_id
       JOIN units u ON u.id = l.unit_id
       JOIN subjects s ON s.id = u.subject_id
       WHERE lc.student_id = $1
       ORDER BY lc.completed_at DESC`,
      [studentId]
    );

    const completedSet = new Set(completedLessonsRes.rows.map(r => r.lesson_id));
    const recentRes = completedLessonsRes.rows.slice(0, 5);

    // 4. Compute streak more efficiently from already-fetched data
    const streakDays = computeStreakFromData(completedLessonsRes.rows);

    // 5. Get all lessons for this grade to find "last active lesson"
    const allLessonsRes = await client.query(
      `SELECT l.id, l.title AS lesson_title, l.lesson_order,
              u.unit_order, u.subject_id,
              s.name AS subject_name, s.icon AS subject_icon
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       JOIN subjects s ON s.id = u.subject_id
       WHERE s.grade = $1 AND l.is_deleted = false
       ORDER BY s.id ASC, u.unit_order ASC, l.lesson_order ASC`,
      [student.grade]
    );

    let lastActiveLesson = null;
    if (allLessonsRes.rows.length > 0) {
      const subjectLessons = {};
      allLessonsRes.rows.forEach((l) => {
        if (!subjectLessons[l.subject_id]) subjectLessons[l.subject_id] = [];
        subjectLessons[l.subject_id].push(l);
      });

      let bestCandidate = null;
      for (const subjectId of Object.keys(subjectLessons)) {
        const lessons = subjectLessons[subjectId];
        const withStatus = computeUnlockStatus(lessons, completedSet);
        const hasActivity = withStatus.some((l) => l.is_completed);
        const nextLesson = withStatus.find((l) => l.is_unlocked && !l.is_completed);
        if (nextLesson) {
          const subjectData = subjects.find((s) => s.id === parseInt(subjectId));
          const totalLessonsInSubject = lessons.length;
          const completedInSubject = withStatus.filter((l) => l.is_completed).length;
          const candidate = {
            lesson_id: nextLesson.id,
            lesson_title: nextLesson.lesson_title,
            subject_name: nextLesson.subject_name || subjectData?.name,
            subject_icon: nextLesson.subject_icon || subjectData?.icon,
            lesson_number: withStatus.indexOf(nextLesson) + 1,
            total_lessons: totalLessonsInSubject,
            completed_pct: totalLessonsInSubject > 0
              ? Math.round((completedInSubject / totalLessonsInSubject) * 100)
              : 0,
          };
          if (hasActivity) {
            bestCandidate = candidate;
            break;
          }
          if (!bestCandidate) bestCandidate = candidate;
        }
      }
      lastActiveLesson = bestCandidate;
    }

    // 6. Compute badges and daily missions
    const lessonsCompleted = parseInt(student.lessons_completed) || 0;
    const avgScore = parseFloat(student.avg_score) || 0;
    const badges = computeBadges(lessonsCompleted, streakDays, avgScore);

    // Get today's stats in a single query
    const todayStatsRes = await client.query(
      `SELECT 
         COUNT(DISTINCT CASE WHEN lc.lesson_id IS NOT NULL THEN lc.lesson_id END) AS lessons_today,
         COUNT(DISTINCT CASE WHEN gs.id IS NOT NULL THEN gs.id END) AS games_today,
         COUNT(DISTINCT CASE WHEN sa.id IS NOT NULL THEN sa.id END) AS answers_total,
         SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS answers_correct
       FROM (SELECT 1) AS dummy
       LEFT JOIN lesson_completions lc ON lc.student_id = $1 AND DATE(lc.completed_at) = CURRENT_DATE
       LEFT JOIN game_scores gs ON gs.student_id = $1 AND DATE(gs.played_at) = CURRENT_DATE
       LEFT JOIN student_answers sa ON sa.student_id = $1 AND DATE(sa.answered_at) = CURRENT_DATE`,
      [studentId]
    );

    const todayStats = todayStatsRes.rows[0] || {};
    const todayLessons = parseInt(todayStats.lessons_today) || 0;
    const todayGames = parseInt(todayStats.games_today) || 0;
    const todayTotal = parseInt(todayStats.answers_total) || 0;
    const todayCorrect = parseInt(todayStats.answers_correct) || 0;
    const todayAccuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;

    const dailyMissions = [
      { id: 1, label: 'Complete 1 lesson', stars: 10, completed: todayLessons >= 1 },
      { id: 2, label: 'Play 1 game', stars: 10, completed: todayGames >= 1 },
      { id: 3, label: 'Get 80% accuracy', stars: 15, completed: todayTotal > 0 && todayAccuracy >= 80 },
    ];

    // 7. Get stars total (lessons * 10 + game scores)
    const gameStarsRes = await client.query(
      `SELECT COALESCE(SUM(total_score), 0) AS game_stars FROM game_scores WHERE student_id = $1`,
      [studentId]
    );
    const starsTotal = lessonsCompleted * 10 + (parseInt(gameStarsRes.rows[0]?.game_stars) || 0);

    return res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          grade: student.grade,
          section: student.section,
          avatar_url: student.avatar_url,
          lessons_completed: lessonsCompleted,
          avg_score: avgScore,
        },
        streak_days: streakDays,
        subjects,
        recent_completions: recentRes,
        last_active_lesson: lastActiveLesson,
        daily_missions: dailyMissions,
        stars_total: starsTotal,
        badges,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ---------------------------------------------------------------------------
// Helper: compute streak from completion data (optimized version)
// ---------------------------------------------------------------------------
function computeStreakFromData(completedRows) {
  if (completedRows.length === 0) return 0;

  // Get unique dates from completion_date field
  const dateSet = new Set();
  completedRows.forEach(r => {
    if (r.completion_date) dateSet.add(r.completion_date);
  });
  const days = Array.from(dateSet).sort().reverse();

  if (days.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // streak only counts if student completed something today or yesterday
  if (days[0] !== today && days[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ---------------------------------------------------------------------------
// Helper: get completed lesson IDs for a student
// ---------------------------------------------------------------------------
async function getCompletedLessonIds(client, studentId) {
  const res = await client.query(
    'SELECT lesson_id FROM lesson_completions WHERE student_id = $1',
    [studentId]
  );
  return new Set(res.rows.map(r => r.lesson_id));
}

// ---------------------------------------------------------------------------
// Helper: compute streak from db
// ---------------------------------------------------------------------------
async function computeStreak(client, studentId) {
  const res = await client.query(
    `SELECT DATE(completed_at) AS completion_date
     FROM lesson_completions
     WHERE student_id = $1
     ORDER BY completed_at DESC`,
    [studentId]
  );
  return computeStreakFromData(res.rows);
}


// ===========================================================================
// GET /api/student/subjects/:subjectId/units
// Returns: units with lessons, each lesson annotated with unlock status
// ===========================================================================
exports.getSubjectUnits = async (req, res, next) => {
  const studentId = req.user.id;
  const { subjectId } = req.params;
  const client = await pool.connect();

  try {
    // Verify subject belongs to student's grade
    const studentRes = await client.query(
      'SELECT grade FROM students WHERE id = $1',
      [studentId]
    );
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const { grade } = studentRes.rows[0];

    const subjectRes = await client.query(
      'SELECT * FROM subjects WHERE id = $1 AND grade = $2',
      [subjectId, grade]
    );
    if (subjectRes.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Subject not found or does not belong to your grade',
      });
    }
    const subject = subjectRes.rows[0];

    // Units for this subject
    const unitsRes = await client.query(
      'SELECT * FROM units WHERE subject_id = $1 ORDER BY unit_order ASC',
      [subjectId]
    );

    // All lessons for this subject (non-deleted), ordered per-unit
    const lessonsRes = await client.query(
      `SELECT l.*, u.title AS unit_title
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       WHERE u.subject_id = $1 AND l.is_deleted = false
       ORDER BY u.unit_order ASC, l.lesson_order ASC`,
      [subjectId]
    );

    // Completed lesson IDs for this student
    const completedSet = await getCompletedLessonIds(client, studentId);

    // Build unlock status — sequential ACROSS the entire subject
    // (lesson 1 of unit 2 requires last lesson of unit 1 to be done)
    const allLessonsWithStatus = computeUnlockStatus(lessonsRes.rows, completedSet);

    // Group back by unit
    const lessonsByUnit = {};
    allLessonsWithStatus.forEach((l) => {
      if (!lessonsByUnit[l.unit_id]) lessonsByUnit[l.unit_id] = [];
      lessonsByUnit[l.unit_id].push(l);
    });

    const units = unitsRes.rows.map((unit) => ({
      id: unit.id,
      title: unit.title,
      unit_order: unit.unit_order,
      lessons: lessonsByUnit[unit.id] || [],
    }));

    return res.json({
      success: true,
      data: { subject, units },
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// GET /api/student/lessons/:lessonId
// Returns lesson + sections + questions; 403 if lesson is locked
// ===========================================================================
exports.getLessonContent = async (req, res, next) => {
  const studentId = req.user.id;
  const lessonId = parseInt(req.params.lessonId, 10);
  const client = await pool.connect();

  try {
    // Fetch the lesson (must not be deleted)
    const lessonRes = await client.query(
      `SELECT l.*, u.subject_id, u.unit_order, u.title AS unit_title
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       WHERE l.id = $1 AND l.is_deleted = false`,
      [lessonId]
    );
    if (lessonRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    const lesson = lessonRes.rows[0];

    // Verify subject is for this student's grade
    const studentRes = await client.query(
      'SELECT grade FROM students WHERE id = $1',
      [studentId]
    );
    const { grade } = studentRes.rows[0];
    const subjectGradeRes = await client.query(
      'SELECT grade FROM subjects WHERE id = $1',
      [lesson.subject_id]
    );
    if (
      subjectGradeRes.rows.length === 0 ||
      subjectGradeRes.rows[0].grade !== grade
    ) {
      return res.status(403).json({
        success: false,
        message: 'This lesson does not belong to your grade',
      });
    }

    // --------------- SERVER-SIDE UNLOCK GATE ---------------
    // Get all lessons in this subject ordered globally
    const allLessonsRes = await client.query(
      `SELECT l.id, l.lesson_order, u.unit_order
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       WHERE u.subject_id = $1 AND l.is_deleted = false
       ORDER BY u.unit_order ASC, l.lesson_order ASC`,
      [lesson.subject_id]
    );
    const allLessons = allLessonsRes.rows;
    const completedSet = await getCompletedLessonIds(client, studentId);
    const withStatus = computeUnlockStatus(allLessons, completedSet);
    const thisLesson = withStatus.find((l) => l.id === lessonId);

    if (!thisLesson || !thisLesson.is_unlocked) {
      return res.status(403).json({
        success: false,
        message: 'This lesson is locked. Complete the previous lesson first.',
      });
    }
    // --------------------------------------------------------

    // Sections
    const sectionsRes = await client.query(
      `SELECT * FROM sections WHERE lesson_id = $1 AND is_deleted = false ORDER BY section_order ASC`,
      [lessonId]
    );

    // Questions per section
    const questionsRes = await client.query(
      `SELECT q.* FROM questions q
       JOIN sections s ON s.id = q.section_id
       WHERE s.lesson_id = $1
       ORDER BY q.section_id ASC, q.question_order ASC`,
      [lessonId]
    );

    // Student's prior answers for this lesson (if any)
    const answersRes = await client.query(
      `SELECT sa.question_id, sa.answer_given, sa.is_correct
       FROM student_answers sa
       JOIN questions q ON q.id = sa.question_id
       JOIN sections s ON s.id = q.section_id
       WHERE sa.student_id = $1 AND s.lesson_id = $2`,
      [studentId, lessonId]
    );
    const priorAnswersMap = {};
    answersRes.rows.forEach((a) => {
      priorAnswersMap[a.question_id] = { answer_given: a.answer_given, is_correct: a.is_correct };
    });

    // Build sections with their questions
    const sectionMap = {};
    sectionsRes.rows.forEach((sec) => {
      sectionMap[sec.id] = { ...sec, questions: [] };
    });
    questionsRes.rows.forEach((q) => {
      if (sectionMap[q.section_id]) {
        sectionMap[q.section_id].questions.push({
          id: q.id,
          type: q.type,
          question_text: q.question_text,
          options: q.options,
          question_order: q.question_order,
          // Include prior answer if already answered
          prior_answer: priorAnswersMap[q.id] || null,
        });
      }
    });

    // Games attached to this lesson
    const gamesRes = await client.query(
      `SELECT id, title, game_url, is_active FROM games WHERE lesson_id = $1 AND is_active = true`,
      [lessonId]
    );

    // Is this lesson already completed?
    const is_completed = completedSet.has(lessonId);

    return res.json({
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          video_url: lesson.video_url,
          unit_title: lesson.unit_title,
          is_completed,
        },
        sections: Object.values(sectionMap),
        games: gamesRes.rows,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// POST /api/student/lessons/:lessonId/submit
// Body: { answers: [{ question_id, answer_given }] }
// Returns: score, feedback, next_lesson_id, unlocked_next
// ===========================================================================
exports.submitLesson = async (req, res, next) => {
  const studentId = req.user.id;
  const lessonId = parseInt(req.params.lessonId, 10);
  const { answers } = req.body;

  // Validate input
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'answers array is required and must not be empty',
    });
  }
  for (const a of answers) {
    if (!a.question_id || a.answer_given === undefined || a.answer_given === null) {
      return res.status(400).json({
        success: false,
        message: 'Each answer must have question_id and answer_given',
      });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify lesson exists and is not deleted
    const lessonRes = await client.query(
      `SELECT l.*, u.subject_id
       FROM lessons l JOIN units u ON u.id = l.unit_id
       WHERE l.id = $1 AND l.is_deleted = false`,
      [lessonId]
    );
    if (lessonRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    const lesson = lessonRes.rows[0];

    // 2. Server-side unlock gate — re-verify before accepting submission
    const allLessonsRes = await client.query(
      `SELECT l.id, l.lesson_order, u.unit_order
       FROM lessons l
       JOIN units u ON u.id = l.unit_id
       WHERE u.subject_id = $1 AND l.is_deleted = false
       ORDER BY u.unit_order ASC, l.lesson_order ASC`,
      [lesson.subject_id]
    );
    const completedSet = await getCompletedLessonIds(client, studentId);
    const withStatus = computeUnlockStatus(allLessonsRes.rows, completedSet);
    const thisLesson = withStatus.find((l) => l.id === lessonId);
    if (!thisLesson || !thisLesson.is_unlocked) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Cannot submit: lesson is locked',
      });
    }

    // 3. Validate all submitted question_ids belong to this lesson's sections
    const questionIds = answers.map((a) => a.question_id);
    const qRes = await client.query(
      `SELECT q.id, q.correct_answer, q.section_id
       FROM questions q
       JOIN sections s ON s.id = q.section_id
       WHERE q.id = ANY($1::int[]) AND s.lesson_id = $2`,
      [questionIds, lessonId]
    );
    if (qRes.rows.length !== questionIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'One or more question_ids are invalid or do not belong to this lesson',
      });
    }

    // 4. Score answers and upsert into student_answers
    const correctMap = {};
    qRes.rows.forEach((q) => {
      correctMap[q.id] = q.correct_answer;
    });

    let correctCount = 0;
    const results = [];

    for (const a of answers) {
      const is_correct =
        String(a.answer_given).trim().toLowerCase() ===
        String(correctMap[a.question_id]).trim().toLowerCase();
      if (is_correct) correctCount++;

      await client.query(
        `INSERT INTO student_answers (student_id, question_id, answer_given, is_correct)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, question_id)
         DO UPDATE SET answer_given = EXCLUDED.answer_given,
                       is_correct   = EXCLUDED.is_correct,
                       answered_at  = NOW()`,
        [studentId, a.question_id, String(a.answer_given), is_correct]
      );
      results.push({ question_id: a.question_id, is_correct });
    }

    const totalQuestions = questionIds.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    // 5. Mark lesson as completed (upsert)
    const alreadyDone = completedSet.has(lessonId);
    if (!alreadyDone) {
      await client.query(
        `INSERT INTO lesson_completions (student_id, lesson_id)
         VALUES ($1, $2)
         ON CONFLICT (student_id, lesson_id) DO NOTHING`,
        [studentId, lessonId]
      );

      // Increment lessons_completed on student record
      await client.query(
        `UPDATE students SET lessons_completed = lessons_completed + 1 WHERE id = $1`,
        [studentId]
      );
    }

    // 6. Recalculate avg_score across ALL student_answers for this student
    const avgRes = await client.query(
      `SELECT ROUND(AVG(CASE WHEN is_correct THEN 100.0 ELSE 0.0 END), 2) AS avg_score
       FROM student_answers WHERE student_id = $1`,
      [studentId]
    );
    const newAvgScore = parseFloat(avgRes.rows[0].avg_score) || 0;
    await client.query(
      `UPDATE students SET avg_score = $1 WHERE id = $2`,
      [newAvgScore, studentId]
    );

    // 7. Find the next lesson (sequential, same subject)
    const refreshedCompleted = new Set([...completedSet, lessonId]);
    const refreshedStatus = computeUnlockStatus(allLessonsRes.rows, refreshedCompleted);
    const currentIdx = refreshedStatus.findIndex((l) => l.id === lessonId);
    let nextLesson = null;
    if (currentIdx !== -1 && currentIdx + 1 < refreshedStatus.length) {
      const candidate = refreshedStatus[currentIdx + 1];
      nextLesson = { id: candidate.id, is_unlocked: candidate.is_unlocked };
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      data: {
        score: correctCount,
        total: totalQuestions,
        score_pct: scorePct,
        message: getScoreMessage(correctCount, totalQuestions),
        answer_results: results,
        lesson_completed: true,
        next_lesson: nextLesson,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// POST /api/student/games/:gameId/score
// Body: { score, accuracy }
// Upserts into game_scores for the authenticated student
// ===========================================================================
exports.submitGameScore = async (req, res, next) => {
  const studentId = req.user.id;
  const gameId = parseInt(req.params.gameId, 10);
  const { score, accuracy } = req.body;

  if (!score && score !== 0) {
    return res.status(400).json({ success: false, message: 'score is required' });
  }
  if (!accuracy && accuracy !== 0) {
    return res.status(400).json({ success: false, message: 'accuracy is required' });
  }

  const client = await pool.connect();
  try {
    // Verify game exists and is active
    const gameRes = await client.query(
      `SELECT g.id, g.lesson_id FROM games g WHERE g.id = $1 AND g.is_active = true`,
      [gameId]
    );
    if (gameRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Game not found or inactive' });
    }

    // Upsert game score — update if student replays
    const result = await client.query(
      `INSERT INTO game_scores (student_id, game_id, total_score, accuracy_pct)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, game_id)
       DO UPDATE SET total_score  = GREATEST(game_scores.total_score, EXCLUDED.total_score),
                     accuracy_pct = GREATEST(game_scores.accuracy_pct, EXCLUDED.accuracy_pct),
                     played_at    = NOW()
       RETURNING *`,
      [studentId, gameId, Math.round(score), Math.round(accuracy)]
    );

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// GET /api/student/profile
// Returns: full profile with streak, completions by subject, badges
// ===========================================================================
exports.getProfile = async (req, res, next) => {
  const studentId = req.user.id;
  const client = await pool.connect();

  try {
    // Basic student info
    const studentRes = await client.query(
      `SELECT id, name, login_id, grade, section, avatar_url,
              lessons_completed, avg_score, created_at
       FROM students WHERE id = $1`,
      [studentId]
    );
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const student = studentRes.rows[0];

    // Streak
    const streakDays = await computeStreak(client, studentId);

    // Completion breakdown per subject
    const subjectBreakdownRes = await client.query(
      `SELECT s.id, s.name, s.icon,
              COUNT(DISTINCT l.id) FILTER (WHERE l.is_deleted = false) AS total_lessons,
              COUNT(DISTINCT lc.lesson_id) AS completed_lessons
       FROM subjects s
       LEFT JOIN units u ON u.subject_id = s.id
       LEFT JOIN lessons l ON l.unit_id = u.id
       LEFT JOIN lesson_completions lc ON lc.lesson_id = l.id AND lc.student_id = $1
       WHERE s.grade = $2
       GROUP BY s.id
       ORDER BY s.id ASC`,
      [studentId, student.grade]
    );
    const subjectStats = subjectBreakdownRes.rows.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      total_lessons: parseInt(s.total_lessons) || 0,
      completed_lessons: parseInt(s.completed_lessons) || 0,
      progress_pct:
        parseInt(s.total_lessons) > 0
          ? Math.round((parseInt(s.completed_lessons) / parseInt(s.total_lessons)) * 100)
          : 0,
    }));

    // Score stats per subject (from student_answers)
    const scoreStatsRes = await client.query(
      `SELECT s.id AS subject_id, s.name AS subject_name,
              COUNT(sa.id) AS total_answered,
              SUM(CASE WHEN sa.is_correct THEN 1 ELSE 0 END) AS correct_count
       FROM student_answers sa
       JOIN questions q ON q.id = sa.question_id
       JOIN sections sec ON sec.id = q.section_id
       JOIN lessons l ON l.id = sec.lesson_id
       JOIN units u ON u.id = l.unit_id
       JOIN subjects s ON s.id = u.subject_id
       WHERE sa.student_id = $1
       GROUP BY s.id, s.name`,
      [studentId]
    );
    const scoreBySubject = scoreStatsRes.rows.map((r) => ({
      subject_id: r.subject_id,
      subject_name: r.subject_name,
      total_answered: parseInt(r.total_answered),
      correct_count: parseInt(r.correct_count),
      accuracy_pct:
        parseInt(r.total_answered) > 0
          ? Math.round((parseInt(r.correct_count) / parseInt(r.total_answered)) * 100)
          : 0,
    }));

    // Recent completions (last 10)
    const recentRes = await client.query(
      `SELECT lc.completed_at, l.title AS lesson_title,
              s.name AS subject_name, s.icon AS subject_icon
       FROM lesson_completions lc
       JOIN lessons l ON l.id = lc.lesson_id
       JOIN units u ON u.id = l.unit_id
       JOIN subjects s ON s.id = u.subject_id
       WHERE lc.student_id = $1
       ORDER BY lc.completed_at DESC
       LIMIT 10`,
      [studentId]
    );

    // Badges
    const lessonsCompleted = parseInt(student.lessons_completed) || 0;
    const avgScore = parseFloat(student.avg_score) || 0;
    const badges = computeBadges(lessonsCompleted, streakDays, avgScore);

    // Game scores summary
    const gameRes = await client.query(
      `SELECT gs.total_score, gs.accuracy_pct, gs.played_at,
              g.title AS game_title
       FROM game_scores gs
       JOIN games g ON g.id = gs.game_id
       WHERE gs.student_id = $1
       ORDER BY gs.played_at DESC
       LIMIT 5`,
      [studentId]
    );

    return res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          login_id: student.login_id,
          grade: student.grade,
          section: student.section,
          avatar_url: student.avatar_url,
          lessons_completed: lessonsCompleted,
          avg_score: avgScore,
          member_since: student.created_at,
        },
        streak_days: streakDays,
        badges,
        subject_stats: subjectStats,
        score_by_subject: scoreBySubject,
        recent_completions: recentRes.rows,
        recent_game_scores: gameRes.rows,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// GET /api/student/lessons/:lessonId/progress
// Returns section-level unlock status for the 4-section roadmap
// ===========================================================================
exports.getLessonProgress = async (req, res, next) => {
  const studentId = req.user.id;
  const lessonId = parseInt(req.params.lessonId, 10);
  const client = await pool.connect();

  try {
    // Count questions per section type for this lesson
    const countQuery = await client.query(
      `SELECT q.type AS section_type, COUNT(q.id) AS total
       FROM sections s
       JOIN questions q ON q.section_id = s.id
       WHERE s.lesson_id = $1 AND s.is_deleted = false
       GROUP BY q.type`,
      [lessonId]
    );
    const counts = {};
    countQuery.rows.forEach((r) => {
      if (r.section_type) counts[r.section_type] = parseInt(r.total);
    });

    // Get completed sections for this student + lesson
    const completedQuery = await client.query(
      `SELECT section_type, score, total FROM student_section_progress
       WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
    const completed = {};
    completedQuery.rows.forEach((r) => {
      completed[r.section_type] = { score: r.score, total: r.total };
    });

    // Check if games exist for this lesson
    const gamesQuery = await client.query(
      `SELECT COUNT(*) AS cnt FROM games WHERE lesson_id = $1 AND is_active = true`,
      [lessonId]
    );
    const hasGames = parseInt(gamesQuery.rows[0].cnt) > 0;

    // Build progress response with unlock logic
    const SECTIONS = ['mcq', 'fill_blank', 'true_false', 'game'];
    const result = {};
    let prevDone = true;

    for (const type of SECTIONS) {
      const isDone = completed[type] !== undefined;
      const sectionTotal = type === 'game' ? null : (counts[type] || 0);

      result[type] = {
        status: isDone ? 'completed' : prevDone ? 'unlocked' : 'locked',
        score: isDone ? completed[type].score : null,
        total: sectionTotal,
      };

      // For game section, if no games exist, keep it but mark total as 0
      if (type === 'game' && !hasGames) {
        result[type].total = 0;
      }

      prevDone = isDone;
    }

    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};

// ===========================================================================
// POST /api/student/lessons/:lessonId/section/:type/complete
// Body: { answers: [{ question_id, answer_given }] } — for quiz sections
// Body: { score, total } — for game section
// Grades answers, saves to student_answers, records section progress
// ===========================================================================
exports.completeSectionQuiz = async (req, res, next) => {
  const studentId = req.user.id;
  const lessonId = parseInt(req.params.lessonId, 10);
  const sectionType = req.params.type;
  const { answers, score: gameScore, total: gameTotal } = req.body;

  const validTypes = ['mcq', 'fill_blank', 'true_false', 'game'];
  if (!validTypes.includes(sectionType)) {
    return res.status(400).json({ success: false, message: 'Invalid section type' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let finalScore = 0;
    let finalTotal = 0;

    if (sectionType === 'game') {
      // Game section — score provided directly
      finalScore = gameScore || 0;
      finalTotal = gameTotal || 100;
    } else {
      // Quiz section — grade the answers
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'answers array is required for quiz sections',
        });
      }

      // Get questions for this section type in this lesson
      const questionIds = answers.map((a) => a.question_id);
      
      const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(', ');
      const queryParams = [...questionIds, lessonId, sectionType];

      const qRes = await client.query(
        `SELECT q.id, q.correct_answer, q.section_id
         FROM questions q
         JOIN sections s ON s.id = q.section_id
         WHERE q.id IN (${placeholders}) 
           AND s.lesson_id = $${questionIds.length + 1} 
           AND q.type = $${questionIds.length + 2}`,
        queryParams
      );

      if (qRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'No valid questions found for this section type',
        });
      }

      const correctMap = {};
      qRes.rows.forEach((q) => {
        correctMap[q.id] = q.correct_answer;
      });

      // Score and save answers
      for (const a of answers) {
        if (!correctMap[a.question_id]) continue;

        const is_correct =
          String(a.answer_given).trim().toLowerCase() ===
          String(correctMap[a.question_id]).trim().toLowerCase();
        if (is_correct) finalScore++;

        await client.query(
          `INSERT INTO student_answers (student_id, question_id, answer_given, is_correct)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (student_id, question_id)
           DO UPDATE SET answer_given = EXCLUDED.answer_given,
                         is_correct   = EXCLUDED.is_correct,
                         answered_at  = NOW()`,
          [studentId, a.question_id, String(a.answer_given), is_correct]
        );
      }

      finalTotal = qRes.rows.length;
    }

    // Upsert section progress
    await client.query(
      `INSERT INTO student_section_progress (student_id, lesson_id, section_type, score, total, completed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (student_id, lesson_id, section_type)
       DO UPDATE SET score = $4, total = $5, completed_at = NOW()`,
      [studentId, lessonId, sectionType, finalScore, finalTotal]
    );

    // Calculate XP earned (based on score percentage)
    const xpEarned = finalTotal > 0 ? Math.round((finalScore / finalTotal) * 20) : 5;

    // Check if ALL 4 sections are now completed — if so, mark lesson as complete
    const allProgressRes = await client.query(
      `SELECT section_type FROM student_section_progress
       WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
    const completedTypes = new Set(allProgressRes.rows.map((r) => r.section_type));

    // Check if at least the quiz sections are done (game is optional if no games exist)
    const gamesExist = await client.query(
      `SELECT COUNT(*) AS cnt FROM games WHERE lesson_id = $1 AND is_active = true`,
      [lessonId]
    );
    const hasGames = parseInt(gamesExist.rows[0].cnt) > 0;

    const requiredSections = ['mcq', 'fill_blank', 'true_false'];
    if (hasGames) requiredSections.push('game');

    const allDone = requiredSections.every((t) => completedTypes.has(t));

    if (allDone) {
      // Mark lesson as completed
      await client.query(
        `INSERT INTO lesson_completions (student_id, lesson_id)
         VALUES ($1, $2)
         ON CONFLICT (student_id, lesson_id) DO NOTHING`,
        [studentId, lessonId]
      );
      // Increment lessons_completed on student record (only if first time)
      await client.query(
        `UPDATE students SET lessons_completed = lessons_completed + 1
         WHERE id = $1 AND NOT EXISTS (
           SELECT 1 FROM lesson_completions WHERE student_id = $1 AND lesson_id = $2
         )`,
        [studentId, lessonId]
      );
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      data: {
        score: finalScore,
        total: finalTotal,
        xpEarned,
        lessonCompleted: allDone,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
