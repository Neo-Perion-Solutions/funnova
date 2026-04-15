-- schema.sql - Separate Admin and Student Tables
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
  students,
  admins
CASCADE;

-- 1. Admins (Main_admin, Sub_admin - separate from students)
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

-- 2. Students (Students only - no admin roles)
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

-- 3. Subjects
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  grade INTEGER NOT NULL CHECK (grade IN (3, 4, 5)),
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(grade, name)
);

-- 4. Units
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  unit_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, unit_order)
);

-- 5. Lessons
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

-- 6. Sections
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

-- 7. Questions
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

-- 8. Games
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  game_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Game Scores
CREATE TABLE game_scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  accuracy_pct INTEGER DEFAULT 0,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, game_id)
);

-- 10. Lesson Completions (Progression unlock logic relies on this)
CREATE TABLE lesson_completions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, lesson_id)
);

-- 11. Student Answers (Individual tracking for the 3-question quiz model)
CREATE TABLE student_answers (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  answer_given TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, question_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_admins_login ON admins(login_id);
CREATE INDEX idx_students_login ON students(login_id);
CREATE INDEX idx_units_subject ON units(subject_id);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_sections_lesson ON sections(lesson_id);
CREATE INDEX idx_questions_section ON questions(section_id);
CREATE INDEX idx_lesson_completions_student ON lesson_completions(student_id);
CREATE INDEX idx_student_answers_student ON student_answers(student_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);
