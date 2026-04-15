# Latest Fixes Applied (2026-04-15)

## Critical Fixes

### 1. Question Order NULL Constraint - FIXED ✅
**Problem**: `null value in column "question_order" violates not-null constraint`

**Root Cause**: Form data was not being properly transformed. Form collects `option_a`, `option_b`, etc., but server expects `options` object. Also `question_order` was not being guaranteed to have a value.

**Solution**:
- Transform form fields `option_a/b/c/d` into proper `options` object
- Ensure `question_order` always defaults to 1 (never NULL)
- Preserve existing question data during edits to prevent overwriting with undefined

**Files Modified**:
- `client/src/features/lessons/hooks/useLessonQuestions.js`

---

### 2. Route Ordering Bug - FIXED ✅
**Problem**: `/lessons/reorder` endpoint was unreachable

**Root Cause**: Express routes are matched in order. `/lessons/:id` would match `/lessons/reorder` before the reorder route.

**Solution**: Moved reorder route before the `:id` parameterized route

**Files Modified**:
- `server/routes/admin.routes.js`

---

### 3. Questions API Endpoint Mismatch - FIXED ✅
**Problem**: Client calling wrong endpoints (`/lessons/` format)

**Solution**: 
- Questions API now uses correct server endpoints
- GET `/admin/questions/:lessonId` for fetching
- PUT `/admin/questions/:lessonId` for bulk updates

**Files Modified**:
- `client/src/features/questions/api/questions.api.js`
- `client/src/features/lessons/hooks/useLessonQuestions.js`
- Panel components (MCQPanel, TrueFalsePanel, FillBlankPanel)

---

## Current Issues Being Investigated

### Students Endpoint 400 Error
The `/admin/students` endpoint is returning 400 Bad Request. This needs investigation.

**To Debug**:
1. Enable server logs
2. Check what parameters are being sent
3. Verify admin is authenticated with proper role

---

## How to Test

1. **Stop and restart the server**:
   ```bash
   cd server
   npm start
   ```

2. **Seed database with test data**:
   ```bash
   node seed-admin.js
   ```
   Creates:
   - Admin: `ADMIN-001` / `admin123`
   - Student: `STUDENT-001` / `student123`

3. **Rebuild and reload client**:
   ```bash
   cd client
   npm run build
   ```
   Then hard-refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

4. **Test Admin Login**: 
   - Navigate to http://localhost:5173/admin/login
   - Login with ADMIN-001 / admin123
   - Should redirect to /admin

5. **Test Questions Feature**:
   - Go to Curriculum and navigate to a lesson
   - Go to Lesson Studio
   - Try adding MCQ/True-False/Fill-Blank questions
   - Should no longer get NULL constraint errors

6. **Test Student Management**:
   - Go to Students page
   - Should load student list (currently showing 400 error - needs fix)

---

## Commits Made

1. `9f3de43` - Fix API endpoint mismatches and route ordering issues
2. `075d403` - Fix question_order NULL constraint and form data transformation

---

## Next Steps

1. **Investigate 400 error** on `/admin/students` endpoint
2. **Fix HTTP method mismatch**: Client uses POST for `/admin/lessons/reorder` but server expects PUT
3. **Test all CRUD operations** for each feature
4. **Verify student login** works correctly
