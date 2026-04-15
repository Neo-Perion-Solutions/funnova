const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  let client;
  try {
    console.log('🔄 Connecting to database...\n');
    client = await pool.connect();
    console.log('✅ Connected\n');

    // Step 1: Drop all tables
    console.log('🗑️  Dropping all existing tables...');
    await client.query(`DROP TABLE IF EXISTS
      student_answers, lesson_completions, game_scores, games,
      questions, sections, lessons, units, subjects, students, admins
      CASCADE`);
    console.log('✅ Tables dropped\n');

    // Step 2: Create admins table
    console.log('🏗️ Creating admins table...');
    await client.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        login_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('main_admin', 'sub_admin')),
        email VARCHAR(100),
        avatar_url TEXT,
        permissions JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_admins_login ON admins(login_id);
    `);
    console.log('✅ Admins table created');

    // Step 3: Create students table
    console.log('🏗️ Creating students table...');
    await client.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        login_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        grade INTEGER NOT NULL CHECK (grade IN (3, 4, 5)),
        section VARCHAR(10),
        avatar_url TEXT,
        lessons_completed INTEGER DEFAULT 0,
        avg_score NUMERIC(5,2) DEFAULT 0.0,
        streak_days INTEGER DEFAULT 0,
        last_active_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_students_login ON students(login_id);
    `);
    console.log('✅ Students table created');

    // Step 4: Create subjects, units, lessons, etc.
    console.log('🏗️ Creating curriculum tables...');
    await client.query(`
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
        title VARCHAR(200) NOT NULL,
        description TEXT,
        lesson_order INTEGER NOT NULL,
        video_url TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(unit_id, lesson_order)
      );

      CREATE TABLE sections (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        section_order INTEGER NOT NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(lesson_id, section_order)
      );

      CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('mcq', 'fill_blank', 'true_false')),
        question_text TEXT NOT NULL,
        options JSONB,
        correct_answer VARCHAR(50) NOT NULL,
        question_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section_id, question_order)
      );

      CREATE TABLE games (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        game_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE game_scores (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
        total_score INTEGER DEFAULT 0,
        accuracy_pct INTEGER DEFAULT 0,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, game_id)
      );

      CREATE TABLE lesson_completions (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, lesson_id)
      );

      CREATE TABLE student_answers (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        answer_given TEXT,
        is_correct BOOLEAN,
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, question_id)
      );

      CREATE INDEX idx_units_subject ON units(subject_id);
      CREATE INDEX idx_lessons_unit ON lessons(unit_id);
      CREATE INDEX idx_sections_lesson ON sections(lesson_id);
      CREATE INDEX idx_questions_section ON questions(section_id);
      CREATE INDEX idx_lesson_completions_student ON lesson_completions(student_id);
      CREATE INDEX idx_student_answers_student ON student_answers(student_id);
      CREATE INDEX idx_student_answers_question ON student_answers(question_id);
    `);
    console.log('✅ Curriculum tables created');

    // Step 5: Seed data
    console.log('\n🌱 Seeding test data...');

    await client.query(`
      INSERT INTO admins (login_id, password_hash, name, role, email, permissions) VALUES
      ('ADMIN-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Main Administrator', 'main_admin', 'admin@funnova.com', '{"all": true}'::jsonb),
      ('ADMIN-002', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Sub Administrator', 'sub_admin', 'subadmin@funnova.com', '{"curriculum": true, "students": true}'::jsonb);
    `);
    console.log('  ✓ 2 admins');

    await client.query(`
      INSERT INTO students (login_id, password_hash, name, grade, section, streak_days) VALUES
      ('STU-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Alice Wonderland', 4, 'A', 7),
      ('STU-002', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Bob Smith', 5, 'B', 3);
    `);
    console.log('  ✓ 2 students');

    await client.query(`
      INSERT INTO subjects (grade, name, icon) VALUES
      (4, 'Mathematics', '📐'), (4, 'Science', '🔬'), (4, 'English', '📚'),
      (5, 'Mathematics', '📐'), (5, 'Science', '🔬'), (5, 'English', '📚');
    `);
    console.log('  ✓ 6 subjects');

    await client.query(`
      INSERT INTO units (subject_id, title, unit_order) VALUES
      (1, 'Fractions', 1), (1, 'Decimals', 2), (2, 'Life Science', 1), (2, 'Physical Science', 2);
    `);
    console.log('  ✓ 4 units');

    await client.query(`
      INSERT INTO lessons (unit_id, title, description, lesson_order, video_url) VALUES
      (1, 'Introduction to Fractions', 'Learn the basics', 1, 'https://example.com/intro'),
      (1, 'Comparing Fractions', 'Learn to compare', 2, 'https://example.com/compare'),
      (2, 'Decimal Basics', 'Understanding decimals', 1, 'https://example.com/decimals');
    `);
    console.log('  ✓ 3 lessons');

    await client.query(`
      INSERT INTO sections (lesson_id, title, type, section_order) VALUES
      (1, 'What are Fractions?', 'intro', 1),
      (1, 'Fraction Parts', 'learning', 2),
      (2, 'Comparing Methods', 'learning', 1),
      (3, 'Place Values', 'intro', 1);
    `);
    console.log('  ✓ 4 sections');

    await client.query(`
      INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
      (1, 'mcq', 'What is a fraction?', '{"A": "A part of a whole", "B": "A whole number", "C": "A decimal", "D": "None"}'::jsonb, 'A', 1),
      (1, 'true_false', 'A fraction represents a part of a whole.', NULL, 'True', 2),
      (1, 'fill_blank', 'The bottom number is called a ________.', NULL, 'Denominator', 3),
      (2, 'mcq', 'Which is larger: 1/2 or 1/3?', '{"A": "1/2", "B": "1/3", "C": "Equal", "D": "Cannot compare"}'::jsonb, 'A', 1),
      (2, 'true_false', '3/4 is greater than 1/2.', NULL, 'True', 2),
      (2, 'fill_blank', 'To compare fractions, use a common ________.', NULL, 'denominator', 3),
      (4, 'mcq', 'First digit after decimal represents?', '{"A": "Tens", "B": "Ones", "C": "Tenths", "D": "Hundredths"}'::jsonb, 'C', 1),
      (4, 'true_false', '0.5 equals 1/2.', NULL, 'True', 2),
      (4, 'fill_blank', 'In 3.14, digit 4 is in ________ place.', NULL, 'hundredths', 3);
    `);
    console.log('  ✓ 9 questions');

    console.log('\n✅ All data seeded\n');

    // Step 6: Verify
    console.log('✔️ Verification:');
    const adminCount = await client.query('SELECT COUNT(*) FROM admins');
    const studentCount = await client.query('SELECT COUNT(*) FROM students');
    const questionCount = await client.query('SELECT COUNT(*) FROM questions');

    console.log(`   Admins: ${adminCount.rows[0].count}`);
    console.log(`   Students: ${studentCount.rows[0].count}`);
    console.log(`   Questions: ${questionCount.rows[0].count}`);

    console.log('\n🔐 Test Credentials (password: password123):');
    console.log('   ┌────────────────────────────────┐');
    console.log('   │ ADMIN-001 (main_admin)         │');
    console.log('   │ ADMIN-002 (sub_admin)          │');
    console.log('   │ STU-001 (Grade 4)              │');
    console.log('   │ STU-002 (Grade 5)              │');
    console.log('   └────────────────────────────────┘\n');

    console.log('✅ MIGRATION COMPLETE!\n');

    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    if (client) client.release();
    await pool.end();
    process.exit(1);
  }
}

migrate();
