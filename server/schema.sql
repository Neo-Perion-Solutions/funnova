-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  grade INTEGER NOT NULL CHECK (grade IN (4, 5)),
  section VARCHAR(10) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(10) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  grade INTEGER NOT NULL CHECK (grade IN (4, 5))
);

-- Lessons table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  difficulty  VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_minutes INTEGER,
  lesson_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'fill_blank', 'true_false')),
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer VARCHAR(50) NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  game_url TEXT NOT NULL,
  icon VARCHAR(10),
  is_hidden BOOLEAN DEFAULT FALSE,
  game_order INTEGER NOT NULL DEFAULT 1
);

-- Student Progress table
CREATE TABLE student_progress (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  answer_given TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, question_id)
);

-- Student Scores table
CREATE TABLE student_scores (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id)
);
