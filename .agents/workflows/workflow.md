---
description: Rebuild educational platform: Grade→Subject→Unit→Lesson→Sections→Questions. New DB schema, JWT auth with login_id, role-based permissions (main_admin/sub_admin/student), admin curriculum manager, lesson studio, and student unlock flow.
---

# Educational Platform Rebuild — Agent Workflow

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Express.js + Node.js
- Database: PostgreSQL
- Auth: JWT with bcrypt (login_id + password, NO email)

## Hierarchy
Grade → Subject → Unit → Lesson → Sections (MCQ / True-False / Fill-Blank / Game Link) → Questions

## Roles
- `main_admin` — full access to everything
- `sub_admin` — only Students + Questions
- `student` — only learning APIs, admin-created login, no self-register

## Database Tables (build exactly these)

```sql
users(id, login_id, name, password_hash, role, grade_id, section, avatar_url, streak_count, last_active_at)
grades(id, grade_number, name, is_active)
subjects(id, grade_id, name, icon, subject_order)
units(id, grade_id, subject_id, title, unit_order, is_active)
lessons(id, unit_id, title, description, lesson_order, video_url, is_active, is_deleted)
lesson_sections(id, lesson_id, type ENUM(mcq,true_false,fill_blank,game_link), title, section_order)
questions(id, lesson_id, section_id, type, question_text, options JSONB, correct_answer, question_order)
game_links(id, lesson_id, title, url, description, is_active)
lesson_completions(id, student_id, lesson_id, score, total_questions, completed_at)
question_attempts(id, student_id, question_id, answer_given, is_correct, answered_at)
```

## Build Order — Follow This Exactly

### Phase 1 — Database
- Write schema.sql with all tables, foreign keys, indexes, constraints
- Write seed.sql: 1 grade, 2 subjects, 2 units, 3 lessons, sample questions for each type, 1 main_admin + 1 student
- Column names in schema.sql and seed.sql must match exactly — no mismatch

### Phase 2 — Auth
- POST /api/auth/login — accepts login_id + password, returns JWT {id, role, grade_id}
- GET /api/auth/me — returns user from token
- Middleware: requireAuth(roles[]) — blocks unauthorized roles
- Files: authController.js, authRouter.js, authMiddleware.js

### Phase 3 — Admin APIs
- /api/admin/students — GET all, POST, PUT, DELETE, reset password
- /api/admin/admins — main_admin only, manage sub-admins
- /api/admin/grades — CRUD
- /api/admin/subjects — CRUD, scoped to grade
- /api/admin/units — CRUD, scoped to subject
- /api/admin/lessons — CRUD, soft delete, reorder
- /api/admin/lessons/:lessonId/sections — GET sections with question counts
- /api/admin/questions — POST, PUT, DELETE (10-20 per section)
- /api/admin/game-links — CRUD
- Enforce: sub_admin blocked from grades/subjects/units/lessons/admins

### Phase 4 — Student APIs
- GET /api/student/home — streak, grade info, continue lesson, progress
- GET /api/student/subjects/:subjectId/units — units with lesson unlock status
- GET /api/student/lessons/:lessonId — sections + questions (locked if not unlocked)
- POST /api/student/lessons/:lessonId/submit — save answers, score, unlock next lesson
- GET /api/student/profile — streak, completions, badges
- Sequential unlock: lesson N+1 only unlocks after lesson N is completed

### Phase 5 — Admin UI Shell
- Collapsible sidebar: Dashboard, Students, Curriculum, Questions, Admin Users, Profile
- sub_admin sees only: Students, Questions
- React Router routes:
  - /admin/dashboard
  - /admin/students
  - /admin/curriculum → /grade/:gradeId → /grade/:gradeId/subject/:subjectId → /unit/:unitId → /lesson/:lessonId
  - /admin/questions
  - /admin/admin-users
  - /admin/profile

### Phase 6 — Curriculum Manager
- Grade cards → Subject tabs → Unit cards → Lesson list
- Add/edit/delete/reorder at each level
- Active/inactive toggle per unit and lesson

### Phase 7 — Lesson Studio (/admin/curriculum/lesson/:lessonId)
- Panel 1: Lesson details (title, description, video URL, active toggle)
- Panel 2: MCQ editor — up to 20 questions, options A-D, mark correct
- Panel 3: True/False editor — statement + correct answer
- Panel 4: Fill in the Blank — question with blank, correct answer
- Panel 5: Game Link — title, URL, description
- Show question count badge per section

### Phase 8 — Student UI
- /student/login — login_id + password form
- /student/dashboard — name, grade, streak, continue button, progress ring
- /student/unit/:id — lesson roadmap with Done / Active / Locked states
- /student/lesson/:id — tabbed sections, questions one by one, submit, score reveal
- /student/profile — streak, badges, completions, account info

### Phase 9 — Student Management + Admin Users
- Student table: filter by grade/section/search
- Add student modal: auto-generate STU-XXX login_id, name, password, grade
- Edit, delete, reset password, view progress drawer
- Admin Users page: list/create/delete sub-admins (main_admin only)

### Phase 10 — Dashboard + Polish
- Stats cards: total students, lessons, questions, completion rate
- Missing content alerts: lessons with 0 questions
- Streak increment on daily login
- Completion celebration screen after finishing lesson
- Final permission audit: all roles enforced end-to-end

## Rules for Every Phase
1. Complete one phase fully before starting the next
2. Never reference a column that does not exist in schema.sql
3. Always check role before every API response
4. Use async/await with try/catch in all controllers
5. Student lesson lock must be enforced server-side, not just frontend