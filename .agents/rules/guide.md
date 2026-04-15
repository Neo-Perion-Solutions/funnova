---
trigger: always_on
---

# Project Rules — Always Follow

## Project Identity
- Project: Educational platform (funnova)
- Stack: React + Vite + Tailwind (client), Express.js (server), PostgreSQL (database)
- Hierarchy: Grade → Subject → Unit → Lesson → Sections → Questions

## Database Rules
- Never reference a column that does not exist in schema.sql
- Always check schema.sql before writing any query or controller
- Use parameterized queries only — no string concatenation in SQL
- Soft delete lessons using is_deleted = true, never hard delete
- options column in questions table is JSONB

## Auth Rules
- Auth uses login_id + password — NO email login anywhere
- Passwords must be hashed with bcrypt before storing
- Every protected route must call requireAuth middleware
- JWT payload contains: id, role, grade_id

## Role Permissions — Enforce Server-Side
- main_admin: full access to all routes
- sub_admin: only /api/admin/students and /api/admin/questions
- student: only /api/student/* routes
- Never trust role from frontend — always verify from JWT

## API Rules
- All controllers use async/await with try/catch
- Return consistent shape: { success: true, data: {} } or { success: false, message: "" }
- Validate required fields before hitting the database
- Student lesson access must check unlock status server-side

## File Structure Rules
- Controllers go in server/controllers/
- Routes go in server/routes/
- Middleware goes in server/middleware/
- One file per resource (studentsController.js, lessonsController.js, etc.)

## Frontend Rules
- No inline styles — use Tailwind classes only
- All API calls go through a central api.js or axios instance with JWT header
- Protected routes check role before rendering
- sub_admin sidebar shows only: Students, Questions

## Student Unlock Logic
- Lesson N+1 is locked until lesson N has a row in lesson_completions for that student
- Lock status must be computed in the backend, not just hidden in frontend
- Sequential order is determined by lesson_order column

## Code Quality
- No console.log left in production code
- No hardcoded IDs or passwords in source files
- Every new API endpoint must be listed in a comment block at the top of the route file
- If a file exceeds 300 lines, split it