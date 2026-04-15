-- seed.sql - Test data for separated admin and student tables

-- ====== ADMINS ======
INSERT INTO admins (login_id, password_hash, name, role, email, permissions) VALUES
('ADMIN-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Main Administrator', 'main_admin', 'admin@funnova.com', '{"all": true}'::jsonb);

INSERT INTO admins (login_id, password_hash, name, role, email, permissions) VALUES
('ADMIN-002', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Sub Administrator', 'sub_admin', 'subadmin@funnova.com', '{"curriculum": true, "students": true}'::jsonb);

-- ====== STUDENTS ======
INSERT INTO students (login_id, password_hash, name, grade, section, streak_days) VALUES
('STU-001', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Alice Wonderland', 4, 'A', 7);

INSERT INTO students (login_id, password_hash, name, grade, section, streak_days) VALUES
('STU-002', '$2a$10$pgmLLlwa6/aAzvV.PDITg.y.K/JUJ4s7uSU/jOsjOSsS9hJveiWw.', 'Bob Smith', 5, 'B', 3);

-- ====== SUBJECTS ======
INSERT INTO subjects (grade, name, icon) VALUES
(4, 'Mathematics', '📐'),
(4, 'Science', '🔬'),
(4, 'English', '📚'),
(5, 'Mathematics', '📐'),
(5, 'Science', '🔬'),
(5, 'English', '📚');

-- ====== UNITS ======
INSERT INTO units (subject_id, title, unit_order) VALUES
(1, 'Fractions', 1),
(1, 'Decimals', 2),
(2, 'Life Science', 1),
(2, 'Physical Science', 2);

-- ====== LESSONS ======
INSERT INTO lessons (unit_id, title, description, lesson_order, video_url) VALUES
(1, 'Introduction to Fractions', 'Learn the basics of fractions', 1, 'https://example.com/fractions-intro'),
(1, 'Comparing Fractions', 'Learn how to compare different fractions', 2, 'https://example.com/fractions-compare'),
(2, 'Decimal Basics', 'Understanding decimals and their place values', 1, 'https://example.com/decimals-intro');

-- ====== SECTIONS ======
INSERT INTO sections (lesson_id, title, type, section_order) VALUES
(1, 'What are Fractions?', 'intro', 1),
(1, 'Fraction Parts', 'learning', 2),
(2, 'Comparing Methods', 'learning', 1),
(3, 'Place Values', 'intro', 1);

-- ====== QUESTIONS ======
INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(1, 'mcq', 'What is a fraction?', '{"A": "A part of a whole", "B": "A whole number", "C": "A decimal", "D": "None"}'::jsonb, 'A', 1);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(1, 'true_false', 'A fraction represents a part of a whole.', NULL, 'True', 2);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(1, 'fill_blank', 'The bottom number of a fraction is the ________.', NULL, 'Denominator', 3);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(2, 'mcq', 'Which fraction is larger: 1/2 or 1/3?', '{"A": "1/2", "B": "1/3", "C": "Equal", "D": "Cannot compare"}'::jsonb, 'A', 1);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(2, 'true_false', '3/4 is greater than 1/2.', NULL, 'True', 2);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(2, 'fill_blank', 'To compare fractions, you can use a common ________.', NULL, 'denominator', 3);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(4, 'mcq', 'What does the first digit after the decimal point represent?', '{"A": "Tens", "B": "Ones", "C": "Tenths", "D": "Hundredths"}'::jsonb, 'C', 1);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(4, 'true_false', '0.5 is equal to 1/2.', NULL, 'True', 2);

INSERT INTO questions (section_id, type, question_text, options, correct_answer, question_order) VALUES
(4, 'fill_blank', 'In the decimal 3.14, the digit 4 is in the ________ place.', NULL, 'hundredths', 3);
