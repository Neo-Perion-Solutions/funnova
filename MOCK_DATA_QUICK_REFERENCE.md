# 🎯 Quick Reference Guide - Mock Data

## 📋 Quick Facts

- **Seeder File:** `server/seed-comprehensive.js`
- **Documentation:** `MOCK_DATA_DOCUMENTATION.md`
- **5 Students:** 3 Grade 3, 2 Grade 4
- **Default Password:** `password123`
- **Total Questions:** 45 (15 MCQ, 15 T/F, 15 Fill Blank)

---

## 🔑 Student Credentials

### Grade 3 Students
```
STU-G3-001 | Aarav Singh    | Section A | pwd: password123
STU-G3-002 | Priya Sharma   | Section B | pwd: password123
STU-G3-003 | Rajesh Kumar   | Section A | pwd: password123
```

### Grade 4 Students
```
STU-G4-001 | Maya Gupta     | Section C | pwd: password123
STU-G4-002 | Arjun Patel    | Section B | pwd: password123
```

---

## 🗂️ Curriculum Structure

### Grade 3
- **Mathematics (📐)** → 2 Units → 3 Lessons → 12 Questions
  - Unit 1: Fractions Fundamentals (2 lessons)
  - Unit 2: Multiplication Basics (1 lesson)
- **Science (🔬)** → 2 Units → 3 Lessons → 9 Questions
  - Unit 1: Life Science Basics (2 lessons)
  - Unit 2: Physical Science Basics (1 lesson)

### Grade 4
- **Mathematics (📐)** → 2 Units → 3 Lessons → 9 Questions
  - Unit 1: Fractions & Equivalent Fractions (2 lessons)
  - Unit 2: Decimals & Percentages (1 lesson)
- **Science (🔬)** → 2 Units → 2 Lessons → 9 Questions
  - Unit 1: Earth & Space Science (2 lessons)
  - Unit 2: Life Science Exploration (1 lesson)

---

## 📊 SQL Query Examples

### Get All Grade 3 Subjects
```sql
SELECT id, name, icon FROM subjects WHERE grade = 3;
```
**Expected Result:**
```
ID  Name         Icon
1   Mathematics  📐
2   Science      🔬
```

### Get Fractions Unit Lessons (Grade 3)
```sql
SELECT l.id, l.title, l.description, l.lesson_order
FROM lessons l
JOIN units u ON l.unit_id = u.id
JOIN subjects s ON u.subject_id = s.id
WHERE s.grade = 3 
  AND s.name = 'Mathematics'
  AND u.title = 'Fractions Fundamentals'
ORDER BY l.lesson_order;
```

### Get All Questions for a Lesson (by lesson_id = 1)
```sql
SELECT 
  q.id, q.question_text, q.type, q.correct_answer,
  s.title as section_title, s.section_order
FROM questions q
JOIN sections s ON q.section_id = s.id
JOIN lessons l ON s.lesson_id = l.id
WHERE l.id = 1
ORDER BY s.section_order, q.question_order;
```

### Get Student Progress (by student_id = 1)
```sql
SELECT 
  l.title, l.id,
  CASE WHEN lc.id IS NOT NULL THEN 'Completed' ELSE 'Not Started' END as status
FROM lessons l
LEFT JOIN lesson_completions lc ON l.id = lc.lesson_id AND lc.student_id = 1
WHERE l.unit_id IN (
  SELECT u.id FROM units u
  JOIN subjects s ON u.subject_id = s.id
  WHERE s.grade = 3
)
ORDER BY l.unit_id, l.lesson_order;
```

### Get All MCQ Questions for Grade 4 Mathematics
```sql
SELECT 
  q.id, q.question_text, q.options, q.correct_answer,
  l.title as lesson_title
FROM questions q
JOIN sections s ON q.section_id = s.id
JOIN lessons l ON s.lesson_id = l.id
JOIN units u ON l.unit_id = u.id
JOIN subjects subj ON u.subject_id = subj.id
WHERE subj.grade = 4 
  AND subj.name = 'Mathematics'
  AND q.type = 'mcq'
ORDER BY l.lesson_order, s.section_order, q.question_order;
```

### Count Questions by Type
```sql
SELECT 
  type, COUNT(*) as count
FROM questions
GROUP BY type;
```
**Expected Result:**
```
Type        Count
mcq         15
true_false  15
fill_blank  15
```

---

## 🧪 Testing Scenarios

### Scenario 1: Student Dashboard View
1. Login as `STU-G3-001` (password: `password123`)
2. Expected: Dashboard shows Grade 3, 2 subjects (Mathematics, Science)
3. Verify: Subject cards show lesson count and progress

### Scenario 2: Complete a Lesson
1. Login as `STU-G3-001`
2. Navigate to Mathematics → Unit 1: Fractions → Lesson 1
3. Complete all 3 questions in sections
4. Expected: Lesson marked as completed, progress updated

### Scenario 3: View Completed Progress
1. Login as `STU-G3-001` (has pre-recorded completions)
2. Expected: Some lessons show "Completed" status
3. Verify: Dashboard shows updated progress percentages

### Scenario 4: Filter by Grade Level
1. Login as `STU-G4-002` (Grade 4 student)
2. Expected: Only Grade 4 subjects visible (not Grade 3)
3. Verify: Subject names and icons match Grade 4 curriculum

---

## 🔄 Data Relationships Diagram

```
Student (5 total)
├── Grade [3 or 4]
├── Section [A, B, C]
└── → Subjects for that grade (2 per grade)
    └── → Units (2 per subject)
        └── → Lessons (2-3 per unit)
            └── → Sections (1-2 per lesson)
                └── → Questions (3 per section)
```

---

## 🛠️ Common Debugging Queries

### Verify All Students Created
```sql
SELECT id, login_id, name, grade, section FROM students ORDER BY grade;
```

### Find Questions by Search Term
```sql
SELECT id, question_text, type, correct_answer 
FROM questions 
WHERE question_text ILIKE '%fractions%';
```

### Check Student Completion Rate
```sql
SELECT 
  s.id, s.name, s.grade,
  COUNT(lc.id) as completed_lessons,
  COUNT(l.id) as total_lessons,
  ROUND(100 * COUNT(lc.id)::float / COUNT(l.id), 2) as percentage
FROM students s
LEFT JOIN lesson_completions lc ON s.id = lc.student_id
LEFT JOIN lessons l ON l.unit_id IN (
  SELECT u.id FROM units u
  JOIN subjects subj ON u.subject_id = subj.id
  WHERE subj.grade = s.grade
) AND l.id = lc.lesson_id
GROUP BY s.id, s.name, s.grade;
```

### List All Content for a Grade
```sql
SELECT 
  subj.name as subject,
  u.unit_order,
  u.title as unit,
  l.lesson_order,
  l.title as lesson,
  COUNT(DISTINCT s.id) as section_count,
  COUNT(DISTINCT q.id) as question_count
FROM subjects subj
LEFT JOIN units u ON subj.id = u.subject_id
LEFT JOIN lessons l ON u.id = l.unit_id
LEFT JOIN sections s ON l.id = s.lesson_id
LEFT JOIN questions q ON s.id = q.section_id
WHERE subj.grade = 3
GROUP BY subj.id, subj.name, u.id, u.unit_order, u.title, l.id, l.lesson_order, l.title
ORDER BY subj.name, u.unit_order, l.lesson_order;
```

---

## ⚡ API Endpoints to Test

### Get Student Home Data
```
GET /student/home
Auth: Bearer [student_token]
Response: { subjects, progress, stats }
```

### Get Subject Units
```
GET /student/subjects/1/units
Response: { units: [{ id, title, lesson_count, ... }] }
```

### Get Lesson Content
```
GET /student/lessons/1
Response: { lesson, sections, questions }
```

### Submit Lesson (Mark as Complete)
```
POST /student/lessons/1/complete
Body: { lessonId: 1 }
Response: { success, message }
```

---

## 📈 Post-Seed Setup

After running `seed-comprehensive.js`:

1. **Verify in DB:**
   ```bash
   psql $(DATABASE_URL | grep -oP 'postgresql://\K.*') -c "\dt"
   ```

2. **Check Student Count:**
   ```bash
   psql $(DATABASE_URL) -c "SELECT COUNT(*) FROM students;"
   # Expected: 5
   ```

3. **Check Subject Count:**
   ```bash
   psql $(DATABASE_URL) -c "SELECT COUNT(*) FROM subjects;"
   # Expected: 4
   ```

4. **Test API:**
   ```bash
   curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"login_id":"STU-G3-001","password":"password123"}'
   ```

---

## 🔐 Database Reset (if needed)

To completely reset and reseed:

```bash
cd server
# Option 1: Reset everything
node seed-comprehensive.js

# Option 2: Just reinitialize DB schema
node init-db.js
node seed-comprehensive.js
```

---

## 📚 Content Areas Covered

### Mathematics Topics
- **Grade 3:** Fractions (basic, parts, comparing), Multiplication (skip counting, facts)
- **Grade 4:** Fractions (equivalent, adding), Decimals (place values, operations)

### Science Topics
- **Grade 3:** Plants & Habitats (Life), States of Matter (Physical)
- **Grade 4:** Solar System & Rocks (Earth), Food Chains (Life)

### Question Types
- **MCQ:** 15 questions (multiple choice A-D)
- **True/False:** 15 questions
- **Fill in Blank:** 15 questions

---

## 💡 Tips for Testing

1. **Use Different Students:** Test as Grade 3 and Grade 4 students to verify grade filtering
2. **Mark Lessons Complete:** Test completion flow by answering questions
3. **Check Cascading Deletes:** Verify that deleting a unit removes all related lessons/sections/questions
4. **Test Uniqueness Constraints:** Units and lessons have subject_id/unit_id + order constraints
5. **Monitor Performance:** With 45 questions, test query performance with EXPLAIN ANALYZE

---

