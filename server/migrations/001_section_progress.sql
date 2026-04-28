-- Migration: student_section_progress
-- Tracks per-section completion status for the assessment roadmap.
-- This is separate from lesson_completions (which tracks whole-lesson completion).

CREATE TABLE IF NOT EXISTS student_section_progress (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  section_type VARCHAR(20) CHECK (section_type IN ('mcq', 'fill_blank', 'true_false', 'game')),
  score INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, lesson_id, section_type)
);

CREATE INDEX IF NOT EXISTS idx_section_progress_student
  ON student_section_progress(student_id, lesson_id);
