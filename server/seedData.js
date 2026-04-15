const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const pool = require('./config/db').pool;

async function main() {
  console.log('Starting seed...');
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  
  const fs = require('fs');
  const path = require('path');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  console.log('Executing schema.sql...');
  await pool.query(schemaSql);
  console.log('Schema recreated.');

  const adminPassHash = await bcrypt.hash('Admin@123', 10);
  const studentPassHash = await bcrypt.hash('password123', 10); // Optional default student for demo

  // 1. Insert Users & Admin
  await pool.query(`INSERT INTO students (name, email, password_hash, role, grade, section, avatar_url) VALUES 
    ('Admin User', 'admin@funnova.com', $1, 'admin', null, null, '👨‍🏫'),
    ('Alice Wonderland', 'alice@funnova.com', $2, 'student', 4, 'A', '👧'),
    ('Bob Builder', 'bob@funnova.com', $2, 'student', 5, 'B', '👦')`, 
    [adminPassHash, studentPassHash]
  );
  console.log('Users inserted.');
  
  // 2. Insert Subjects
  const subjectsQuery = `
    INSERT INTO subjects (name, icon, grade) VALUES 
      ('Mathematics', '➕', 3),
      ('Science', '🔬', 3),
      ('Mathematics', '➕', 4),
      ('Science', '🔬', 4),
      ('Mathematics', '➕', 5),
      ('Science', '🔬', 5)
    RETURNING id, name, grade;
  `;
  const subjectsRes = await pool.query(subjectsQuery);
  const subjects = subjectsRes.rows;
  console.log('Subjects inserted.');

  // 3. Insert Lesson Shells (10 per subject per grade)
  let lessonInserts = [];
  let subjectIds = subjects.map(s => s.id);
  
  for (let subj of subjects) {
    for (let i = 1; i <= 10; i++) {
        lessonInserts.push(
            pool.query(`
                INSERT INTO lessons (subject_id, grade, title, description, seq_order, has_game, is_deleted)
                VALUES ($1, $2, $3, $4, $5, false, false)
            `, [subj.id, subj.grade, `Lesson ${i} - ${subj.name} Grade ${subj.grade}`, 'Placeholder description', i])
        );
    }
  }

  await Promise.all(lessonInserts);
  console.log('Lesson shells inserted.');

  console.log('Seed completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
