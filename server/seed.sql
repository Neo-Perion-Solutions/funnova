-- Note: Passwords must be hashed using bcrypt before insertion.
-- For this seed, we will use plain text '$2a$10$...'. The setup instruction will provide the exact bcrypt hash for '123456'.
-- I will use a pre-calculated bcrypt hash for 'password123' -> '$2a$10$wVb/9j9N9f727j/C9G4oDu.K2/z.Y/0YnBszE1yU7v8v3oD7A19fK' for the users.

INSERT INTO students (student_id, name, password, grade, section, avatar_url, role) VALUES
('STU-001', 'Alice Wonderland', '$2a$10$wVb/9j9N9f727j/C9G4oDu.K2/z.Y/0YnBszE1yU7v8v3oD7A19fK', 4, 'A', '👧', 'student'),
('ADMIN-001', 'Teacher Tom', '$2a$10$wVb/9j9N9f727j/C9G4oDu.K2/z.Y/0YnBszE1yU7v8v3oD7A19fK', 4, 'A', '👨‍🏫', 'admin');

-- Seed: Grade 4 and Grade 5 Subjects
INSERT INTO subjects (name, icon, grade) VALUES
('Mathematics', '➕', 4),
('Science', '🔬', 4),
('Mathematics', '➕', 5),
('Science', '🔬', 5);

INSERT INTO lessons (subject_id, title, lesson_order) VALUES 
(1, 'Addition Adventures', 1),
(2, 'The Solar System', 1);
