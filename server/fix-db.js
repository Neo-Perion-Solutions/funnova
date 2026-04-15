const { pool } = require('./config/db');
require('dotenv').config();

async function fixDatabase() {
  let client;
  try {
    console.log('🔧 Fixing database schema...\n');

    client = await pool.connect();

    // Drop all tables to start fresh
    console.log('1️⃣ Clearing old tables...');
    await client.query(`
      DROP TABLE IF EXISTS
        student_answers,
        lesson_completions,
        game_scores,
        games,
        questions,
        sections,
        lessons,
        units,
        subjects,
        students
      CASCADE
    `);
    console.log('   ✅ Old tables dropped\n');

    // Create schema with LOGIN_ID (not email)
    console.log('2️⃣ Creating new schema with correct columns...');
    const schema = `
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        login_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('main_admin', 'sub_admin', 'student')),
        grade INTEGER CHECK (grade IN (3, 4, 5) OR grade IS NULL),
        section VARCHAR(10),
        avatar_url TEXT,
        lessons_completed INTEGER DEFAULT 0,
        avg_score NUMERIC(5,2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE subjects (
        id SERIAL PRIMARY KEY,
        grade INTEGER NOT NULL CHECK (grade IN (3, 4, 5)),
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(grade, name)
      );

      CREATE TABLE units (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        unit_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject_id, unit_order)
      );

      CREATE TABLE lessons (
        id SERIAL PRIMARY KEY,
        unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        lesson_order INTEGER NOT NULL,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(unit_id, lesson_order)
      );

      CREATE TABLE sections (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        type VARCHAR(20) DEFAULT 'quiz',
        section_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(lesson_id, section_order)
      );

      CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'true_false', 'fill_blank')),
        question_text TEXT NOT NULL,
        options JSONB,
        correct_answer TEXT NOT NULL,
        question_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section_id, question_order)
      );

      CREATE TABLE student_answers (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        answer_given TEXT NOT NULL,
        is_correct BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, question_id)
      );

      CREATE TABLE lesson_completions (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, lesson_id)
      );

      CREATE TABLE game_scores (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        game_id INTEGER,
        score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE games (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const statements = schema.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await client.query(stmt);
      }
    }
    console.log('   ✅ Schema created\n');

    // Seed test data
    console.log('3️⃣ Seeding test data...');

    // Admin user
    await client.query(`
      INSERT INTO students (login_id, password_hash, name, role, grade, section) VALUES
      ('ADMIN-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Main Administrator', 'main_admin', NULL, NULL)
    `);

    // Student user
    await client.query(`
      INSERT INTO students (login_id, password_hash, name, role, grade, section) VALUES
      ('STU-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Alice Wonderland', 'student', 4, 'A')
    `);

    // Subjects
    await client.query(`
      INSERT INTO subjects (grade, name, icon) VALUES
      (4, 'Mathematics', '➕'),
      (4, 'Science', '🔬')
    `);

    // Units
    await client.query(`
      INSERT INTO units (subject_id, title, unit_order) VALUES
      (1, 'Fractions', 1),
      (2, 'Solar System', 1)
    `);

    // Lessons
    await client.query(`
      INSERT INTO lessons (unit_id, title, description, lesson_order, is_deleted) VALUES
      (1, 'Introduction to Fractions', 'Learn what fractions are through an exciting journey.', 1, false),
      (1, 'Adding Fractions', 'Discover how to add fractions with the same denominator.', 2, false),
      (2, 'The Planets', 'Explore all 8 planets in our majestic solar system.', 1, false)
    `);

    // Sections
    await client.query(`
      INSERT INTO sections (lesson_id, title, type, section_order) VALUES
      (1, 'Lesson 1 Quiz', 'quiz', 1),
      (2, 'Lesson 2 Quiz', 'quiz', 1),
      (3, 'Lesson 3 Quiz', 'quiz', 1)
    `);

    // Questions
    await client.query(`
      INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
      (1, 'mcq', 'What is the top number of a fraction called?', '{"A": "Numerator", "B": "Denominator", "C": "Quotient", "D": "Remainder"}'::jsonb, 'A', 1),
      (1, 'true_false', 'A fraction represents a part of a whole.', NULL, 'True', 2),
      (1, 'fill_blank', 'The bottom number of a fraction is the ________.', NULL, 'Denominator', 3),
      (2, 'mcq', '1/4 + 2/4 = ?', '{"A": "1/4", "B": "2/4", "C": "3/4", "D": "4/4"}'::jsonb, 'C', 1),
      (2, 'true_false', 'You cannot add fractions if they have the same denominator.', NULL, 'False', 2),
      (2, 'fill_blank', 'When adding fractions with the same denominator, you only add the ________.', NULL, 'Numerators', 3),
      (3, 'mcq', 'Which planet is closest to the Sun?', '{"A": "Earth", "B": "Mars", "C": "Venus", "D": "Mercury"}'::jsonb, 'D', 1),
      (3, 'true_false', 'Jupiter is the largest planet in our solar system.', NULL, 'True', 2),
      (3, 'fill_blank', 'Earth is the ________ planet from the Sun.', NULL, 'Third', 3)
    `);

    console.log('   ✅ Test data seeded\n');

    // Verify
    console.log('✔️ Verifying setup...');
    const users = await client.query('SELECT COUNT(*) FROM students');
    const lessons = await client.query('SELECT COUNT(*) FROM lessons');

    console.log(`\n✅ DATABASE FIXED AND READY!\n`);
    console.log(`📊 Database Summary:`);
    console.log(`   ✓ Students: ${users.rows[0].count}`);
    console.log(`   ✓ Lessons: ${lessons.rows[0].count}`);
    console.log(`\n🔐 Test Credentials:`);
    console.log(`   Admin:   ADMIN-001 / password123`);
    console.log(`   Student: STU-001 / password123`);
    console.log(`\n✨ Ready to start the app!\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

fixDatabase();
