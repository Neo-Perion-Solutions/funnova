const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const curriculumData = require('./curriculumData');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  console.log('Starting seed...');
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  
  const fs = require('fs');
  const path = require('path');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schemaSql);
  console.log('Schema recreated.');

  const passHash = await bcrypt.hash('password123', 10);

  // Insert Users
  await pool.query(`INSERT INTO students (student_id, name, password, grade, section, avatar_url, role) VALUES 
    ('STU-001', 'Alice Wonderland', $1, 4, 'A', '👧', 'student'),
    ('STU-002', 'Bob Builder', $1, 5, 'B', '👦', 'student'),
    ('ADMIN-001', 'Teacher Tom', $1, 4, 'A', '👨‍🏫', 'admin')`, [passHash]);
  
  // Insert Subjects
  const subjectsMap = {
    'Math_4': (await pool.query(`INSERT INTO subjects (name, icon, grade) VALUES ('Mathematics', '➕', 4) RETURNING id`)).rows[0].id,
    'Sci_4': (await pool.query(`INSERT INTO subjects (name, icon, grade) VALUES ('Science', '🔬', 4) RETURNING id`)).rows[0].id,
    'Math_5': (await pool.query(`INSERT INTO subjects (name, icon, grade) VALUES ('Mathematics', '➕', 5) RETURNING id`)).rows[0].id,
    'Sci_5': (await pool.query(`INSERT INTO subjects (name, icon, grade) VALUES ('Science', '🔬', 5) RETURNING id`)).rows[0].id,
  };

  const getDifficulty = (lesson_order) => {
    if (lesson_order <= 3) return 'easy';
    if (lesson_order <= 7) return 'medium';
    return 'hard';
  };

  const insertLessonsAndQuestions = async (subjectKey) => {
    const subject_id = subjectsMap[subjectKey];
    const lessons = curriculumData[subjectKey];
    
    for (let i = 0; i < lessons.length; i++) {
      const lesson_order = i + 1;
      const lessonData = lessons[i];
      const { title, subtitle, difficulty, mcq, fill_blank: fb, true_false: tf } = lessonData;

      const lessonRes = await pool.query(
        `INSERT INTO lessons (subject_id, title, subtitle, difficulty, duration_minutes, lesson_order) 
         VALUES ($1, $2, $3, $4, 10, $5) RETURNING id`,
        [subject_id, title, subtitle, difficulty, lesson_order]
      );
      const lesson_id = lessonRes.rows[0].id;

      await pool.query(
        `INSERT INTO questions (lesson_id, type, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order)
         VALUES ($1, 'mcq', $2, $3, $4, $5, $6, $7, 1)`,
        [lesson_id, mcq.q, mcq.a, mcq.b, mcq.c, mcq.d, mcq.correct]
      );
      
      await pool.query(
        `INSERT INTO questions (lesson_id, type, question_text, correct_answer, question_order)
         VALUES ($1, 'fill_blank', $2, $3, 2)`,
        [lesson_id, fb.q, fb.correct]
      );

      await pool.query(
        `INSERT INTO questions (lesson_id, type, question_text, correct_answer, question_order)
         VALUES ($1, 'true_false', $2, $3, 3)`,
        [lesson_id, tf.q, tf.correct]
      );
    }
  };

  await insertLessonsAndQuestions('Math_4');
  await insertLessonsAndQuestions('Sci_4');
  await insertLessonsAndQuestions('Math_5');
  await insertLessonsAndQuestions('Sci_5');

  console.log('Seed completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
