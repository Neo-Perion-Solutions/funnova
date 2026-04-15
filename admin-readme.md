You are a senior full-stack developer. Build the complete FUNNOVA Admin CRUD 
system — the core of the platform where all content is managed manually.

═══════════════════════════════════════════════════════════
ADMIN SYSTEM OVERVIEW
═══════════════════════════════════════════════════════════
The admin panel is the single source of truth for all platform content.
Every lesson, question, game, and student is created and managed here.
No content is hardcoded. Everything flows from admin → database → student.

Tech Stack:
  Backend:  Node.js + Express + PostgreSQL (Neon)
  Frontend: React + Tailwind CSS
  Auth:     JWT (role = 'admin')
  Middleware: authMw.js + requireAdmin.js

═══════════════════════════════════════════════════════════
DATABASE SCHEMA (reference)
═══════════════════════════════════════════════════════════
users:
  id, name, email, password_hash,
  role ('student' | 'admin'),
  grade (3 | 4 | 5 | NULL for admin),
  section VARCHAR(10), avatar_url, created_at

subjects:
  id, name ('Mathematics' | 'Science'), icon, grade

lessons:
  id, subject_id (FK), grade,
  title, description, seq_order,
  video_url, has_game, game_url,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at
  UNIQUE(subject_id, grade, seq_order)

questions:
  id, lesson_id (FK),
  type ('mcq' | 'fill_blank' | 'true_false'),
  question_text,
  options JSONB,           -- {"A":"...","B":"...","C":"...","D":"..."}
  correct_answer,
  question_order (1 | 2 | 3)

games:
  id, lesson_id (FK),
  unit_number, game_number,
  title, topic, objective,
  game_component,          -- React component name
  level_1_desc, level_2_desc, level_3_desc,
  ui_theme,                -- e.g. "garden", "space", "kitchen"
  sound_correct, sound_wrong,
  is_active BOOLEAN DEFAULT TRUE,
  created_at

game_scores:
  id, user_id (FK), game_id (FK),
  total_score, accuracy_pct, best_streak, stars,
  played_at

student_progress:
  id, user_id (FK), lesson_id (FK),
  status DEFAULT 'completed', completed_at
  UNIQUE(user_id, lesson_id)

student_scores:
  id, user_id (FK), lesson_id (FK),
  score_ratio VARCHAR(10),
  UNIQUE(user_id, lesson_id)

═══════════════════════════════════════════════════════════
BACKEND — ADMIN ROUTES
═══════════════════════════════════════════════════════════
All routes protected by: authMw + requireAdmin

── STUDENT MANAGEMENT ─────────────────────────────────────
GET    /api/admin/students
  → List all students
  → Query params: ?grade=3&section=A&search=name
  → Returns: [{ id, name, email, grade, section,
                lessons_completed, avg_score, created_at }]

POST   /api/admin/students
  → Body: { name, email, password, grade, section, avatar_url }
  → Hash password with bcrypt
  → Return created student

PUT    /api/admin/students/:id
  → Body: { name, email, grade, section, avatar_url }
  → Password update optional (re-hash if provided)
  → Return updated student

DELETE /api/admin/students/:id
  → Hard delete (students can be fully removed)
  → Cascade deletes: student_progress, student_scores, game_scores

GET    /api/admin/students/:id/progress
  → Return full progress for one student
  → Include: lessons done, scores, games played, stars earned

── SUBJECT MANAGEMENT ─────────────────────────────────────
GET    /api/admin/subjects
  → List all subjects grouped by grade
  → Returns: [{ id, name, icon, grade, lesson_count }]

POST   /api/admin/subjects
  → Body: { name, icon, grade }

PUT    /api/admin/subjects/:id
  → Body: { name, icon }

── LESSON MANAGEMENT ──────────────────────────────────────
GET    /api/admin/lessons
  → Query params: ?grade=4&subject_id=1
  → Returns all lessons (including is_deleted=false only)
  → Include question_count per lesson

POST   /api/admin/lessons
  → Body: {
      subject_id, grade, title, description,
      video_url, has_game, game_url
    }
  → Auto-assign seq_order as MAX(seq_order)+1
    for that subject+grade combination
  → Return created lesson

PUT    /api/admin/lessons/:id
  → Body: { title, description, video_url,
            has_game, game_url }
  → seq_order editable only via reorder endpoint

DELETE /api/admin/lessons/:id
  → SOFT DELETE ONLY: SET is_deleted = TRUE
  → Never hard delete lessons
  → Hide from students immediately

PUT    /api/admin/lessons/reorder
  → Body: { lessonId, newSeqOrder, subject_id, grade }
  → Shift other lessons up/down to maintain unique sequence
  → Re-index all seq_order values for that subject+grade

── QUESTION MANAGEMENT ────────────────────────────────────
GET    /api/admin/questions/:lessonId
  → Return all 3 questions for a lesson
  → Ordered by question_order

POST   /api/admin/questions
  → Body: {
      lesson_id,
      questions: [
        {
          type: "mcq",
          question_text: "...",
          options: {"A":"...","B":"...","C":"...","D":"..."},
          correct_answer: "C",
          question_order: 1
        },
        {
          type: "fill_blank",
          question_text: "The sun is a ____",
          options: null,
          correct_answer: "star",
          question_order: 2
        },
        {
          type: "true_false",
          question_text: "Plants need sunlight to grow",
          options: null,
          correct_answer: "True",
          question_order: 3
        }
      ]
    }
  → Validate: exactly 3 questions
  → Validate: order 1=mcq, 2=fill_blank, 3=true_false
  → Reject if questions already exist for lesson
    (must use PUT to update)

PUT    /api/admin/questions/:lessonId
  → Same body as POST
  → Replace all 3 questions (delete old, insert new)
  → Atomic transaction

DELETE /api/admin/questions/:questionId
  → Single question delete (only if replacing individually)

── GAME MANAGEMENT ────────────────────────────────────────
GET    /api/admin/games
  → Query params: ?grade=3&subject=Science&unit=1
  → Returns all games with is_active status

POST   /api/admin/games
  → Body: {
      lesson_id, unit_number, game_number,
      title, topic, objective,
      game_component,
      level_1_desc, level_2_desc, level_3_desc,
      ui_theme, sound_correct, sound_wrong
    }

PUT    /api/admin/games/:id
  → Body: same as POST (all fields editable)

PUT    /api/admin/games/:id/toggle
  → Toggle is_active true/false
  → Active = visible to students
  → Inactive = hidden from students

DELETE /api/admin/games/:id
  → Hard delete (game data removed)
  → Confirm: this removes all game_scores too

── PLATFORM STATS ─────────────────────────────────────────
GET    /api/admin/stats
  → Returns: {
      total_students,
      students_by_grade: { 3: N, 4: N, 5: N },
      total_lessons,
      lessons_with_questions,
      lessons_without_questions,
      total_games,
      active_games,
      total_completions,
      avg_score_pct,
      top_performing_students: [...5],
      most_completed_lessons: [...5]
    }

═══════════════════════════════════════════════════════════
FRONTEND — ADMIN PANEL PAGES
═══════════════════════════════════════════════════════════

── AdminLayout.jsx ─────────────────────────────────────────
Persistent sidebar + topbar wrapper for all admin pages.

Sidebar links:
  📊 Dashboard          → /admin
  👥 Students           → /admin/students
  📚 Subjects           → /admin/subjects
  📖 Lessons            → /admin/lessons
  ❓ Questions          → /admin/questions
  🎮 Games              → /admin/games
  🚪 Logout

Topbar:
  - Page title (dynamic)
  - Admin name + avatar
  - Logout button

── AdminDashboard.jsx (/admin) ─────────────────────────────
Stat cards (top row):
  [ Total Students ] [ Total Lessons ] [ Active Games ]
  [ Lessons With Questions ] [ Total Completions ] [ Avg Score ]

Charts section:
  - Students by grade (bar: Grade 3 / 4 / 5)
  - Completion rate per subject (progress bars)

Tables section:
  - Top 5 performing students
  - 5 most completed lessons
  - Lessons missing questions (action required list)

── ManageStudents.jsx (/admin/students) ────────────────────
Top bar:
  [ + Add Student ]  [ Search by name/email ]
  [ Filter: Grade dropdown ] [ Filter: Section dropdown ]

Table columns:
  Name | Email | Grade | Section | Lessons Done | Avg Score
  | Joined Date | Actions

Row actions:
  [ 👁 View Progress ] [ ✏️ Edit ] [ 🗑 Delete ]

Add/Edit Student Modal:
  Fields:
    - Full Name (required)
    - Email (required, unique)
    - Password (required for new, optional for edit)
    - Grade: dropdown (3 / 4 / 5)
    - Section: text input (A / B / C)
    - Avatar: emoji picker or URL input
  Buttons: [ Save ] [ Cancel ]

Delete Confirmation Modal:
  "Are you sure you want to delete [Name]?
   This will remove all their progress and scores."
  Buttons: [ Delete ] [ Cancel ]

Student Progress View (slide-in panel):
  - Name, grade, section, avatar
  - Overall progress bar
  - Per-subject: lessons completed + score
  - Games played + avg stars
  - Recent activity list

── ManageLessons.jsx (/admin/lessons) ──────────────────────
Top filters:
  [ Grade: 3 / 4 / 5 ] [ Subject: Mathematics / Science ]
  [ + Add Lesson ]

Lesson list (table or card list):
  Columns:
    Order | Title | Description | Video | Has Game
    | Questions | Status | Actions

  Status badge:
    🟢 Ready        (has video + 3 questions)
    🟡 Incomplete   (missing questions)
    🔴 Deleted      (soft deleted, toggle restore)

Row actions:
  [ ✏️ Edit ] [ ❓ Manage Questions ] [ 🎮 Link Game ]
  [ ↕ Reorder ] [ 🗑 Soft Delete ] [ ♻️ Restore ]

Add/Edit Lesson Modal:
  Fields:
    - Subject: dropdown (filtered by grade)
    - Grade: dropdown (3 / 4 / 5)
    - Title (required)
    - Description / subtitle
    - Video URL (YouTube embed link)
    - Has Game: toggle (yes/no)
    - Game URL: text (shown only if has_game = true)
    - Seq Order: auto-assigned, manual override allowed
  Buttons: [ Save ] [ Cancel ]

Reorder Modal:
  - Drag-and-drop list of all lessons for subject+grade
  - Save re-indexes all seq_order values
  - Warning: "Reordering affects student unlock sequence"

── ManageQuestions.jsx (/admin/questions) ──────────────────
Top filters:
  [ Grade ] [ Subject ] [ Lesson: dropdown ]
  [ Show: All / Missing / Complete ]

Lesson question cards:
  Each lesson shown as a card:
    - Lesson title + order
    - Question status: ✅ Complete / ⚠️ Incomplete
    - [ + Add Questions ] or [ ✏️ Edit Questions ] button

Question Editor Modal (opens per lesson):
  Header: "Questions for: [Lesson Title]"

  Section 1 — MCQ (Question 1):
    - Question Text: textarea
    - Option A: text input
    - Option B: text input
    - Option C: text input
    - Option D: text input
    - Correct Answer: dropdown (A / B / C / D)

  Section 2 — Fill in the Blank (Question 2):
    - Question Text: textarea
      (hint: "use ____ for the blank")
    - Correct Answer: text input
      (single word or number)

  Section 3 — True / False (Question 3):
    - Statement: textarea
    - Correct Answer: toggle (True / False)

  Validation rules (enforced in UI + backend):
    - All fields required before save
    - MCQ must have all 4 options filled
    - Fill blank answer must not be empty
    - Correct answer must be set for all 3
    - Cannot save partial questions

  Buttons: [ Save All 3 Questions ] [ Cancel ]

  After save:
    - Lesson card updates to ✅ Complete
    - Toast: "Questions saved successfully"

── ManageGames.jsx (/admin/games) ──────────────────────────
Top filters:
  [ Grade ] [ Subject ] [ Unit: 1–5 ]
  [ + Add Game ]

Game cards grid (5 per unit):
  Each card shows:
    - Game number + title
    - Topic + objective
    - Unit badge
    - Active/Inactive toggle (big switch)
    - [ ✏️ Edit ] [ 🗑 Delete ] buttons

Add/Edit Game Modal:
  Fields:
    - Lesson: dropdown (select linked lesson)
    - Unit Number: 1–5
    - Game Number: 1–5 (within unit)
    - Title (required)
    - Topic
    - Objective
    - Game Component: text (React component name)
    - Level 1 Description
    - Level 2 Description
    - Level 3 Description
    - UI Theme: text (e.g., "garden", "space")
    - Sound Correct: text (feedback message)
    - Sound Wrong: text (retry message)
    - Is Active: toggle
  Buttons: [ Save ] [ Cancel ]

Delete Game Modal:
  "Deleting this game removes all student scores for it."
  Buttons: [ Delete ] [ Cancel ]

── ManageSubjects.jsx (/admin/subjects) ────────────────────
Table:
  Subject Name | Icon | Grade | Lesson Count | Actions
  [ ✏️ Edit ] per row

Add/Edit Subject Modal:
  Fields:
    - Name: text
    - Icon: emoji picker
    - Grade: dropdown (3 / 4 / 5)
  Buttons: [ Save ] [ Cancel ]

═══════════════════════════════════════════════════════════
VALIDATION RULES (enforced on both frontend + backend)
═══════════════════════════════════════════════════════════
Lessons:
  - seq_order must be unique per subject+grade
  - video_url must be a valid URL
  - If has_game = true, game_url is required
  - Soft delete only — no hard delete

Questions:
  - Exactly 3 per lesson (no more, no less)
  - Order must be: 1=mcq, 2=fill_blank, 3=true_false
  - MCQ correct_answer must be "A", "B", "C", or "D"
  - fill_blank correct_answer: single word/number, no spaces
  - true_false correct_answer must be "True" or "False"
  - All 4 MCQ options must be non-empty
  - Cannot have duplicate question_order per lesson

Students:
  - Email must be unique
  - Grade must be 3, 4, or 5
  - Password minimum 6 characters
  - Grade cannot be changed if student has progress
    (warn admin + require confirmation)

Games:
  - game_number 1–5 must be unique per unit per subject
  - game_component name must be a valid string (no spaces)

═══════════════════════════════════════════════════════════
MIDDLEWARE
═══════════════════════════════════════════════════════════
authMw.js:
  - Extract JWT from Authorization header
  - Verify token
  - Attach decoded user to req.user
  - Return 401 if missing or invalid

requireAdmin.js:
  - Check req.user.role === 'admin'
  - Return 403 if not admin

Usage:
  router.use(authMw);
  router.use(requireAdmin);
  // All routes below are admin-only

═══════════════════════════════════════════════════════════
REORDER LOGIC (seq_order management)
═══════════════════════════════════════════════════════════
When a lesson is added:
  seq_order = MAX(seq_order) + 1
  for lessons WHERE subject_id = X AND grade = Y
  AND is_deleted = FALSE

When a lesson is reordered (drag-drop):
  BEGIN TRANSACTION
  Fetch all lessons for subject+grade ordered by seq_order
  Rebuild seq_order 1,2,3... based on new arrangement
  UPDATE all affected lessons
  COMMIT

When a lesson is soft deleted:
  SET is_deleted = TRUE
  Do NOT re-index remaining lessons
  Gaps in seq_order are acceptable
  (progression engine uses relative order, not exact numbers)

When a lesson is restored:
  SET is_deleted = FALSE
  Append to end: seq_order = MAX + 1
  Admin can then reorder manually

═══════════════════════════════════════════════════════════
TOAST NOTIFICATIONS (all admin actions)
═══════════════════════════════════════════════════════════
✅ Success toasts:
  "Student created successfully"
  "Lesson saved"
  "Questions saved for [Lesson Title]"
  "Game updated"
  "Lesson order updated"
  "Student deleted"
  "Lesson hidden from students"
  "Lesson restored"

❌ Error toasts:
  "Email already exists"
  "All 3 questions are required"
  "Lesson must have a valid video URL"
  "seq_order conflict — please reorder"
  "Cannot delete: admin account"

═══════════════════════════════════════════════════════════
ADMIN SEED (first-run setup)
═══════════════════════════════════════════════════════════
On first deploy, run seed script that creates:
  1. Default admin account:
       email: admin@funnova.com
       password: Admin@123 (bcrypt hashed)
       role: admin
       grade: null

  2. All subjects:
       Grade 3 — Mathematics (icon: ➕)
       Grade 3 — Science     (icon: 🔬)
       Grade 4 — Mathematics (icon: ➕)
       Grade 4 — Science     (icon: 🔬)
       Grade 5 — Mathematics (icon: ➕)
       Grade 5 — Science     (icon: 🔬)

  3. Lesson shells (title only, no video/questions yet):
       All 10 lesson titles per subject per grade
       is_deleted = FALSE
       has_game = FALSE
       video_url = NULL (admin fills manually)

  This gives admin a pre-built structure to fill in,
  rather than building from zero.

═══════════════════════════════════════════════════════════
DIRECTORY STRUCTURE
═══════════════════════════════════════════════════════════
server/
  routes/
    auth.routes.js
    admin.routes.js        ← all admin CRUD here
  controllers/
    adminController.js     ← students, lessons, questions, games
    statsController.js     ← dashboard stats
  middleware/
    authMw.js
    requireAdmin.js
  db/
    schema.sql
    seed.sql

client/src/
  pages/
    admin/
      AdminDashboard.jsx
      ManageStudents.jsx
      ManageLessons.jsx
      ManageQuestions.jsx
      ManageGames.jsx
      ManageSubjects.jsx
  components/
    admin/
      AdminLayout.jsx      ← sidebar + topbar
      AdminSidebar.jsx
      StatCard.jsx
      DataTable.jsx        ← reusable table
      Modal.jsx            ← reusable modal wrapper
      QuestionEditor.jsx   ← the 3-question form
      LessonCard.jsx
      GameCard.jsx
      ConfirmDialog.jsx    ← delete confirmations
      Toast.jsx            ← notification system

═══════════════════════════════════════════════════════════
BUILD THIS IN ORDER
═══════════════════════════════════════════════════════════
1. Middleware: authMw.js + requireAdmin.js
2. Admin routes + controller skeleton
3. Student CRUD (GET / POST / PUT / DELETE)
4. Subject CRUD
5. Lesson CRUD + soft delete + reorder
6. Question CRUD (3-question atomic save)
7. Game CRUD + toggle active
8. Stats endpoint
9. Seed script (admin + subjects + lesson shells)
10. AdminLayout + Sidebar
11. AdminDashboard (stats cards)
12. ManageStudents (table + modal + progress view)
13. ManageLessons (table + modal + reorder)
14. ManageQuestions (lesson cards + question editor)
15. ManageGames (grid + toggle + modal)

═══════════════════════════════════════════════════════════
START COMMAND
═══════════════════════════════════════════════════════════
Build this step by step. Start with:
[SPECIFY: middleware / admin routes / student CRUD /
 lesson CRUD / question editor / game management /
 stats endpoint / seed script / AdminLayout /
 AdminDashboard / ManageStudents / ManageLessons /
 ManageQuestions / ManageGames]