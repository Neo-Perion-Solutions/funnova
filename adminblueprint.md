# FUNNOVA Admin Panel — Advanced Production Blueprint
> Version 2.0 | Senior Full-Stack Architect Reference Document

---

## TABLE OF CONTENTS
1. [Architecture Overview](#architecture)
2. [Folder Structure](#folder-structure)
3. [Design System](#design-system)
4. [Global Layout System](#layout)
5. [Reusable Component Library](#components)
6. [State Management](#state)
7. [API Layer](#api-layer)
8. [Dashboard Page](#dashboard)
9. [Students Module](#students)
10. [Subjects Module](#subjects)
11. [Lessons Module](#lessons)
12. [Questions Module](#questions)
13. [Games Module](#games)
14. [Auth & Security](#auth)
15. [Build Order](#build-order)

---

## 1. ARCHITECTURE OVERVIEW {#architecture}

### Pattern: Feature-Based Modular Architecture

```
React (Vite) → React Router v6 → TanStack Query → Axios → Express API → PostgreSQL
```

### Key Principles
- **Zero prop drilling** — all server state via TanStack Query, all UI state via Zustand
- **Feature modules** — each admin section is self-contained (components + hooks + api)
- **Optimistic updates** — mutations update UI instantly, rollback on error
- **Type-safe forms** — React Hook Form + Zod validation on every modal
- **No placeholder UI** — every component is production-functional on first render

### Tech Stack
| Layer | Library | Purpose |
|-------|---------|---------|
| Framework | React 18 + Vite | Core app |
| Routing | React Router v6 | Page navigation |
| Server State | TanStack Query v5 | API cache + mutations |
| UI State | Zustand | Sidebar, modals, toasts |
| Forms | React Hook Form + Zod | Validated forms |
| Styling | Tailwind CSS v3 | Utility-first design |
| Icons | Lucide React | Consistent icon set |
| Charts | Recharts | Dashboard visualizations |
| Drag & Drop | @dnd-kit/core | Lesson reordering |
| HTTP | Axios | API client with interceptors |
| Notifications | Sonner | Toast system |

---

## 2. FOLDER STRUCTURE {#folder-structure}

```
client/src/
├── main.jsx                      ← React root, QueryClient, Router
├── App.jsx                       ← Route definitions
│
├── lib/
│   ├── axios.js                  ← Axios instance + interceptors
│   ├── queryClient.js            ← TanStack Query config
│   └── utils.js                  ← cn(), formatDate(), truncate()
│
├── store/
│   ├── uiStore.js                ← Zustand: sidebar, active modal
│   └── authStore.js              ← Zustand: admin user, token
│
├── hooks/
│   ├── useDebounce.js
│   ├── usePagination.js
│   └── useToast.js
│
├── components/
│   ├── ui/                       ← PURE reusable primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Toggle.jsx
│   │   ├── Badge.jsx
│   │   ├── Spinner.jsx
│   │   ├── Avatar.jsx
│   │   └── Tooltip.jsx
│   │
│   ├── shared/                   ← Composed reusable blocks
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── StatCard.jsx
│   │   ├── FilterBar.jsx
│   │   ├── EmptyState.jsx
│   │   ├── PageHeader.jsx
│   │   └── StatusBadge.jsx
│   │
│   └── layout/
│       ├── AdminLayout.jsx
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       └── SidebarLink.jsx
│
├── features/
│   ├── dashboard/
│   │   ├── DashboardPage.jsx
│   │   ├── components/
│   │   │   ├── StatsGrid.jsx
│   │   │   ├── StudentsByGradeChart.jsx
│   │   │   ├── CompletionRateChart.jsx
│   │   │   ├── TopStudentsTable.jsx
│   │   │   ├── RecentActivityFeed.jsx
│   │   │   └── MissingQuestionsAlert.jsx
│   │   └── hooks/
│   │       └── useDashboardStats.js
│   │
│   ├── students/
│   │   ├── StudentsPage.jsx
│   │   ├── components/
│   │   │   ├── StudentTable.jsx
│   │   │   ├── StudentModal.jsx
│   │   │   ├── StudentProgressPanel.jsx
│   │   │   └── StudentFilters.jsx
│   │   ├── hooks/
│   │   │   ├── useStudents.js
│   │   │   ├── useCreateStudent.js
│   │   │   ├── useUpdateStudent.js
│   │   │   └── useDeleteStudent.js
│   │   └── api/
│   │       └── students.api.js
│   │
│   ├── subjects/
│   │   ├── SubjectsPage.jsx
│   │   ├── components/
│   │   │   ├── SubjectTable.jsx
│   │   │   └── SubjectModal.jsx
│   │   ├── hooks/
│   │   │   └── useSubjects.js
│   │   └── api/
│   │       └── subjects.api.js
│   │
│   ├── lessons/
│   │   ├── LessonsPage.jsx
│   │   ├── components/
│   │   │   ├── LessonTable.jsx
│   │   │   ├── LessonModal.jsx
│   │   │   ├── LessonReorderPanel.jsx
│   │   │   └── LessonFilters.jsx
│   │   ├── hooks/
│   │   │   ├── useLessons.js
│   │   │   ├── useCreateLesson.js
│   │   │   ├── useUpdateLesson.js
│   │   │   ├── useSoftDeleteLesson.js
│   │   │   └── useReorderLessons.js
│   │   └── api/
│   │       └── lessons.api.js
│   │
│   ├── questions/
│   │   ├── QuestionsPage.jsx
│   │   ├── components/
│   │   │   ├── LessonSelector.jsx
│   │   │   ├── LessonQuestionCard.jsx
│   │   │   ├── QuestionEditorModal.jsx
│   │   │   ├── MCQEditor.jsx
│   │   │   ├── FillBlankEditor.jsx
│   │   │   └── TrueFalseEditor.jsx
│   │   ├── hooks/
│   │   │   ├── useQuestions.js
│   │   │   └── useSaveQuestions.js
│   │   └── api/
│   │       └── questions.api.js
│   │
│   └── games/
│       ├── GamesPage.jsx
│       ├── components/
│       │   ├── GameGrid.jsx
│       │   ├── GameCard.jsx
│       │   └── GameModal.jsx
│       ├── hooks/
│       │   └── useGames.js
│       └── api/
│           └── games.api.js
│
└── pages/
    ├── AdminLoginPage.jsx
    └── NotFoundPage.jsx
```

---

## 3. DESIGN SYSTEM {#design-system}

### Color Palette
```js
// Tailwind config additions
colors: {
  primary:  { DEFAULT: '#6366F1', hover: '#4F46E5', light: '#EEF2FF' },
  success:  { DEFAULT: '#10B981', light: '#ECFDF5' },
  warning:  { DEFAULT: '#F59E0B', light: '#FFFBEB' },
  danger:   { DEFAULT: '#EF4444', light: '#FEF2F2' },
  surface:  { DEFAULT: '#FFFFFF', secondary: '#F9FAFB', tertiary: '#F3F4F6' },
  border:   { DEFAULT: '#E5E7EB', strong: '#D1D5DB' },
}
```

### Typography Scale
| Use | Class |
|-----|-------|
| Page title | `text-2xl font-bold text-gray-900` |
| Section heading | `text-lg font-semibold text-gray-800` |
| Table header | `text-xs font-semibold text-gray-500 uppercase tracking-wide` |
| Body text | `text-sm text-gray-700` |
| Muted text | `text-sm text-gray-400` |
| Badge text | `text-xs font-medium` |

### Component Tokens
```
Card:         bg-white rounded-2xl shadow-sm border border-gray-100 p-6
Table row:    hover:bg-gray-50 transition-colors duration-150
Input:        border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500
Button-P:     bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg
Button-S:     border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg
Button-D:     bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg
Sidebar:      bg-gray-900 text-gray-300 w-64 fixed h-screen
Sidebar-active: bg-indigo-600 text-white rounded-lg
```

### Status Badge Colors
| Status | Style |
|--------|-------|
| Ready | `bg-green-100 text-green-700` |
| Incomplete | `bg-yellow-100 text-yellow-700` |
| Deleted | `bg-red-100 text-red-500` |
| Active | `bg-indigo-100 text-indigo-700` |
| Inactive | `bg-gray-100 text-gray-500` |

---

## 4. GLOBAL LAYOUT SYSTEM {#layout}

### AdminLayout.jsx

```jsx
// Structure
<div className="flex h-screen bg-gray-50 overflow-hidden">
  <Sidebar />                        // fixed left, w-64
  <div className="flex-1 flex flex-col ml-64 overflow-hidden">
    <Topbar />                       // fixed top, h-16, shadow
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />                     // React Router page content
    </main>
  </div>
</div>
```

### Sidebar.jsx
- Logo at top: FUNNOVA + admin badge
- Nav links with icons (Lucide):
  - 📊 Dashboard      → /admin
  - 👥 Students       → /admin/students
  - 📚 Subjects       → /admin/subjects
  - 📖 Lessons        → /admin/lessons
  - ❓ Questions      → /admin/questions
  - 🎮 Games          → /admin/games
  - 🚪 Logout         (bottom, triggers auth clear + redirect)
- Active link: indigo highlight
- Collapsed state (icon-only) with toggle button

### Topbar.jsx
- Left: Breadcrumb (Home / Current Page)
- Center: Dynamic page title from route
- Right: Admin avatar + name + dropdown (Profile / Logout)

### Route Protection
```jsx
// ProtectedRoute.jsx
const ProtectedRoute = () => {
  const token = useAuthStore(s => s.token);
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
```

---

## 5. REUSABLE COMPONENT LIBRARY {#components}

### DataTable.jsx
**Props:**
```ts
{
  columns: { key, label, render?, sortable?, width? }[]
  data: object[]
  isLoading: boolean
  pagination: { page, pageSize, total, onChange }
  search: { value, onChange, placeholder }
  emptyMessage: string
  actions?: (row) => ReactNode
}
```
**Features:**
- Sortable column headers
- Skeleton loading rows (5 rows × column count)
- Pagination with page numbers + prev/next
- Search debounced 300ms
- Striped rows (`even:bg-gray-50`)
- Row hover highlight
- Sticky header on scroll

### Modal.jsx
**Props:** `{ isOpen, onClose, title, size, children, footer }`
**Sizes:** `sm (max-w-md)` | `md (max-w-lg)` | `lg (max-w-2xl)` | `xl (max-w-4xl)`
**Behavior:**
- Backdrop blur overlay
- Escape key closes
- Click outside closes
- Scroll lock on body when open
- Slide-in animation (`translate-y` + `opacity`)
- Footer slot for action buttons

### ConfirmDialog.jsx
**Props:** `{ isOpen, onClose, onConfirm, title, message, confirmLabel, isDangerous }`
- Red confirm button when `isDangerous=true`
- Loading state on confirm button
- Prevents double-submit

### Toast System (Sonner)
```js
// useToast.js
export const toast = {
  success: (msg) => sonnerToast.success(msg, { icon: '✅' }),
  error:   (msg) => sonnerToast.error(msg,   { icon: '❌' }),
  info:    (msg) => sonnerToast.info(msg,    { icon: 'ℹ️' }),
  warning: (msg) => sonnerToast.warning(msg, { icon: '⚠️' }),
}
```

### StatCard.jsx
**Props:** `{ title, value, subtitle, icon, color, trend? }`
- Icon in colored circle
- Large bold value
- Subtitle in muted text
- Optional trend arrow (+N% from last week)

### EmptyState.jsx
**Props:** `{ icon, title, description, action? }`
- Centered illustration slot
- Title + description
- Optional CTA button

### FilterBar.jsx
**Props:** `{ filters: FilterConfig[], values, onChange }`
- Renders dropdowns + search inputs in a flex row
- Each filter: `{ key, label, type: 'select'|'search', options? }`
- Reset all button on right

---

## 6. STATE MANAGEMENT {#state}

### TanStack Query — Server State
```js
// Standard query pattern for every feature
const useStudents = (filters) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
};

// Standard mutation pattern
const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });
};
```

### Zustand — UI State
```js
// uiStore.js
const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  activeModal: null,           // 'addStudent' | 'editLesson' | etc.
  modalData: null,             // data passed to modal
  openModal: (name, data) => set({ activeModal: name, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

// authStore.js
const useAuthStore = create(persist(
  (set) => ({
    admin: null,
    token: null,
    setAuth: (admin, token) => set({ admin, token }),
    clearAuth: () => set({ admin: null, token: null }),
  }),
  { name: 'funnova-admin-auth' }
));
```

---

## 7. API LAYER {#api-layer}

### Axios Instance
```js
// lib/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);
```

### Feature API Modules
```js
// features/students/api/students.api.js
export const studentsApi = {
  getAll:      (params) => api.get('/admin/students', { params }),
  getById:     (id) =>     api.get(`/admin/students/${id}`),
  getProgress: (id) =>     api.get(`/admin/students/${id}/progress`),
  create:      (data) =>   api.post('/admin/students', data),
  update:      (id, data) => api.put(`/admin/students/${id}`, data),
  delete:      (id) =>     api.delete(`/admin/students/${id}`),
};
```

---

## 8. DASHBOARD PAGE {#dashboard}

### StatsGrid — 6 cards in 3×2 grid
| Card | Icon | Color |
|------|------|-------|
| Total Students | Users | Indigo |
| Total Lessons | BookOpen | Blue |
| Active Games | Gamepad | Purple |
| Avg Score | TrendingUp | Green |
| Lessons Ready | CheckCircle | Emerald |
| Missing Questions | AlertTriangle | Amber |

### Charts
**StudentsByGradeChart** (Recharts BarChart):
- X: Grade 3, Grade 4, Grade 5
- Y: Student count
- Bar fill: indigo gradient

**CompletionRateChart** (Recharts RadialBarChart):
- One radial bar per subject+grade combo
- Shows % of lessons completed across all students

### Tables
**TopStudentsTable** — columns: Rank | Name | Grade | Score | Lessons Done
**MissingQuestionsAlert** — lessons without questions, direct "Add Questions" link

### RecentActivityFeed
- Last 10 events: "Alice completed Lesson 3 · 2 min ago"
- Pulled from student_progress ordered by completed_at DESC

---

## 9. STUDENTS MODULE {#students}

### StudentsPage.jsx — Layout
```
<PageHeader title="Students" action={<AddStudentButton />} />
<StudentFilters />           // grade, section, search
<StudentTable />             // DataTable with student rows
```

### StudentFilters
- Search: debounced text input (name / email)
- Grade: Select (All / 3 / 4 / 5)
- Section: Select (All / A / B / C)
- Active filter chips with × remove

### StudentTable — Columns
| Column | Notes |
|--------|-------|
| Avatar + Name | Avatar emoji + full name |
| Email | truncated with tooltip |
| Grade | Badge (Grade 3 / 4 / 5) |
| Section | Plain text |
| Lessons Done | "4 / 10" format |
| Avg Score | Progress bar + % |
| Joined | Relative date |
| Actions | Eye / Edit / Delete icon buttons |

### StudentModal (Add / Edit)
**Form fields with Zod schema:**
```js
const schema = z.object({
  name:       z.string().min(2, 'Name required'),
  email:      z.string().email('Invalid email'),
  password:   z.string().min(6).optional().or(z.literal('')),
  grade:      z.enum(['3','4','5']),
  section:    z.string().max(5),
  avatar_url: z.string().optional(),
});
```
- Avatar field: 6 emoji options as clickable tiles + custom URL input
- Password field: show/hide toggle
- "Edit" mode: password optional (blank = no change)
- Submit button: shows spinner during mutation

### StudentProgressPanel (Slide-over)
- Triggered by Eye icon
- Fixed right panel (w-96) slides in
- Sections:
  - Student info header (name, grade, avatar)
  - Overall progress ring chart
  - Per-subject: progress bar + score fraction
  - Games: stars earned per unit
  - Recent lesson completions list

---

## 10. SUBJECTS MODULE {#subjects}

### SubjectsPage — Layout
```
<PageHeader title="Subjects" action={<AddSubjectButton />} />
<SubjectTable />
```

### SubjectTable — Columns
| Column | Notes |
|--------|-------|
| Icon | Large emoji display |
| Name | Mathematics / Science |
| Grade | Grade badge |
| Lessons | "10 lessons" count |
| Actions | Edit only (subjects rarely deleted) |

### SubjectModal
- Name: text input
- Icon: emoji picker (6–8 options)
- Grade: radio group (3 / 4 / 5)

---

## 11. LESSONS MODULE {#lessons}

### LessonsPage — Layout
```
<PageHeader title="Lessons" action={<AddLessonButton />} />
<LessonFilters />            // grade + subject dropdowns
<LessonTable />
```

### LessonFilters
- Grade dropdown (required — no data shown until grade selected)
- Subject dropdown (filtered by grade)
- Status filter: All / Ready / Incomplete / Deleted
- Show Deleted toggle (default OFF)

### LessonTable — Columns
| Column | Notes |
|--------|-------|
| # | seq_order number |
| Title | Bold, with description in muted sub-line |
| Video | ✅ / ⚠️ icon |
| Game | Toggle icon (on/off) |
| Questions | "3/3" or "0/3" badge |
| Status | StatusBadge (Ready/Incomplete/Deleted) |
| Actions | Edit / Questions / Reorder / Delete/Restore |

### Status Logic
```js
const getLessonStatus = (lesson) => {
  if (lesson.is_deleted)             return 'deleted';
  if (lesson.question_count === 3)   return 'ready';
  return 'incomplete';
};
```

### LessonModal (Add / Edit)
**Zod schema:**
```js
z.object({
  title:       z.string().min(3),
  description: z.string().optional(),
  video_url:   z.string().url('Must be valid URL'),
  has_game:    z.boolean(),
  game_url:    z.string().url().optional().or(z.literal('')),
}).refine(d => !d.has_game || d.game_url, {
  message: 'Game URL required when has_game is enabled',
  path: ['game_url'],
});
```
- `has_game` toggle shows/hides `game_url` field with animation
- Video URL preview: shows embedded YouTube thumbnail on blur
- seq_order: shown but readonly (managed via reorder)

### LessonReorderPanel
- Opens as full-width panel below filters
- Uses @dnd-kit/sortable
- Drag handle icon on left of each row
- Shows: order number + title + status badge
- "Save Order" button → POST /admin/lessons/reorder
- Optimistic update: numbers update live while dragging
- Warning banner: "Changing order affects student unlock sequence"

### Soft Delete Behavior
- Delete → `is_deleted = true` + row grays out in table
- "Restore" button appears instead of delete
- Toast: "Lesson hidden from students. Click Restore to undo."
- Filtered out from student-facing APIs automatically

---

## 12. QUESTIONS MODULE {#questions}

### QuestionsPage — Layout
```
<PageHeader title="Questions" />
<LessonSelector />           // cascading: Grade → Subject → (lesson grid)
<LessonQuestionGrid />       // cards for each lesson
```

### LessonSelector (Cascading Dropdowns)
```
[ Grade: dropdown ] → [ Subject: dropdown ] → auto-loads lesson cards
```
- Grade selection clears subject
- Subject selection loads lesson cards for that grade+subject combo
- Persists selection in URL params (?grade=4&subject=1)

### LessonQuestionCard
Each lesson rendered as a card showing:
- Lesson number + title
- Status badge: `✅ Complete` / `⚠️ Incomplete`
- Question count: "3/3" or "0/3"
- Action button: "Add Questions" (if 0) or "Edit Questions" (if 3)
- Video indicator: has video or not

### QuestionEditorModal (size: xl)
**3-section form — all sections visible simultaneously:**

#### Section 1 — MCQ (Question 1)
```
Question Text: [textarea, 3 rows]
┌─────────────────┬─────────────────┐
│ A: [input]      │ B: [input]      │
├─────────────────┼─────────────────┤
│ C: [input]      │ D: [input]      │
└─────────────────┴─────────────────┘
Correct Answer: [dropdown: A / B / C / D]
```

#### Section 2 — Fill in the Blank (Question 2)
```
Question (use ____ for blank): [textarea]
Hint shown: "e.g. The sun is a ____"
Correct Answer: [input, single word/number only]
Validation: no spaces allowed in answer
```

#### Section 3 — True / False (Question 3)
```
Statement: [textarea]
Correct Answer: [Toggle: TRUE / FALSE]
Visual: large pill toggle, green=True, red=False
```

#### Save Logic
- All 3 sections must be filled before "Save Questions" enables
- Progress indicator: "2 / 3 sections complete"
- Submit: `POST /admin/questions` (new) or `PUT /admin/questions/:lessonId` (edit)
- On success: modal closes + lesson card updates to ✅ Complete

#### Validation (Zod)
```js
z.object({
  mcq: z.object({
    question_text:  z.string().min(5),
    option_a:       z.string().min(1),
    option_b:       z.string().min(1),
    option_c:       z.string().min(1),
    option_d:       z.string().min(1),
    correct_answer: z.enum(['A','B','C','D']),
  }),
  fill_blank: z.object({
    question_text:  z.string().min(5).includes('____'),
    correct_answer: z.string().min(1).regex(/^\S+$/, 'No spaces'),
  }),
  true_false: z.object({
    question_text:  z.string().min(5),
    correct_answer: z.enum(['True','False']),
  }),
})
```

---

## 13. GAMES MODULE {#games}

### GamesPage — Layout
```
<PageHeader title="Games" action={<AddGameButton />} />
<GamesFilters />             // grade, subject, unit
<GameGrid />                 // 5-column responsive grid
```

### GameCard
```
┌─────────────────────────┐
│ Unit 1 · Game 3         │
│ 🌿 Air Around Us        │
│ Topic: Importance of Air│
│                         │
│ [● Active toggle]       │
│                         │
│ [Edit]  [Delete]        │
└─────────────────────────┘
```
- Toggle switch: active/inactive (PUT /admin/games/:id/toggle)
- Optimistic toggle update (instant UI, revert on error)
- Inactive cards: opacity-60 grayscale

### GameModal (Add / Edit)
```
Linked Lesson: [dropdown — searchable]
Unit Number:   [1–5 radio]
Game Number:   [1–5 radio]
Title:         [input]
Topic:         [input]
Objective:     [textarea]
Component:     [input — e.g. PlantOrAnimalGame]
Level 1 Desc:  [input]
Level 2 Desc:  [input]
Level 3 Desc:  [input]
UI Theme:      [input — e.g. garden, space, kitchen]
Sound Correct: [input — e.g. "Great job!"]
Sound Wrong:   [input — e.g. "Try again!"]
Is Active:     [toggle]
```

---

## 14. AUTH & SECURITY {#auth}

### AdminLoginPage.jsx
- Centered card, full-height background
- Email + password fields
- Show/hide password toggle
- "Signing in..." loading state
- Error: inline alert (wrong credentials)
- On success: store token + redirect to /admin

### Route Structure
```jsx
<Routes>
  <Route path="/admin/login" element={<AdminLoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<AdminLayout />}>
      <Route path="/admin"             element={<DashboardPage />} />
      <Route path="/admin/students"    element={<StudentsPage />} />
      <Route path="/admin/subjects"    element={<SubjectsPage />} />
      <Route path="/admin/lessons"     element={<LessonsPage />} />
      <Route path="/admin/questions"   element={<QuestionsPage />} />
      <Route path="/admin/games"       element={<GamesPage />} />
    </Route>
  </Route>
</Routes>
```

### Token Handling
- Stored in Zustand (persisted to localStorage via `persist` middleware)
- Attached to every API request via Axios interceptor
- Expired/invalid token → auto-logout + redirect to login
- Admin-only: `role === 'admin'` check in middleware (backend enforced)

---

## 15. BUILD ORDER {#build-order}

```
Phase 1 — Foundation (do first, everything depends on this)
  ☐ lib/axios.js           (interceptors + base URL)
  ☐ lib/queryClient.js     (TanStack Query setup)
  ☐ store/authStore.js     (Zustand + persist)
  ☐ store/uiStore.js       (modal + sidebar state)

Phase 2 — Layout Shell
  ☐ AdminLoginPage.jsx     (auth gate)
  ☐ AdminLayout.jsx        (flex wrapper)
  ☐ Sidebar.jsx            (nav links + collapse)
  ☐ Topbar.jsx             (breadcrumb + admin info)
  ☐ ProtectedRoute.jsx     (token guard)

Phase 3 — Shared Components
  ☐ DataTable.jsx          (skeleton + pagination + search)
  ☐ Modal.jsx              (animated overlay + escape)
  ☐ ConfirmDialog.jsx      (danger confirm)
  ☐ Toast setup            (Sonner integration)
  ☐ StatCard.jsx
  ☐ EmptyState.jsx
  ☐ FilterBar.jsx
  ☐ StatusBadge.jsx
  ☐ PageHeader.jsx

Phase 4 — Dashboard
  ☐ useDashboardStats.js   (GET /admin/stats)
  ☐ StatsGrid.jsx
  ☐ StudentsByGradeChart.jsx
  ☐ TopStudentsTable.jsx
  ☐ MissingQuestionsAlert.jsx

Phase 5 — Students (full CRUD)
  ☐ students.api.js
  ☐ useStudents.js + mutation hooks
  ☐ StudentTable.jsx
  ☐ StudentModal.jsx       (RHF + Zod)
  ☐ StudentProgressPanel.jsx
  ☐ StudentsPage.jsx

Phase 6 — Subjects (simple CRUD)
  ☐ subjects.api.js
  ☐ SubjectTable.jsx + SubjectModal.jsx
  ☐ SubjectsPage.jsx

Phase 7 — Lessons (CRUD + reorder + soft delete)
  ☐ lessons.api.js
  ☐ useLessons.js + mutation hooks
  ☐ LessonTable.jsx
  ☐ LessonModal.jsx        (conditional game URL)
  ☐ LessonReorderPanel.jsx (@dnd-kit)
  ☐ LessonsPage.jsx

Phase 8 — Questions (critical editor)
  ☐ questions.api.js
  ☐ useQuestions.js + useSaveQuestions.js
  ☐ LessonSelector.jsx     (cascading dropdowns)
  ☐ LessonQuestionCard.jsx
  ☐ MCQEditor.jsx
  ☐ FillBlankEditor.jsx
  ☐ TrueFalseEditor.jsx
  ☐ QuestionEditorModal.jsx (3-section form)
  ☐ QuestionsPage.jsx

Phase 9 — Games
  ☐ games.api.js
  ☐ useGames.js
  ☐ GameCard.jsx           (toggle + optimistic)
  ☐ GameModal.jsx
  ☐ GamesPage.jsx
```

---

## ADVANCED PATTERNS USED

### Optimistic Updates (example — game toggle)
```js
const useToggleGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => gamesApi.toggle(id),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['games'] });
      const prev = queryClient.getQueryData(['games']);
      queryClient.setQueryData(['games'], old =>
        old?.map(g => g.id === id ? { ...g, is_active: !g.is_active } : g)
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['games'], ctx.prev);
      toast.error('Toggle failed');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
};
```

### URL-Synced Filters
```js
// In LessonsPage — filters persist across refresh
const [searchParams, setSearchParams] = useSearchParams();
const grade = searchParams.get('grade') || '';
const subject = searchParams.get('subject') || '';
```

### Skeleton Loading (DataTable)
```jsx
// While isLoading, render N skeleton rows
{isLoading && Array.from({ length: 5 }).map((_, i) => (
  <tr key={i}>
    {columns.map((_, j) => (
      <td key={j}><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
    ))}
  </tr>
))}
```

---

*FUNNOVA Admin Blueprint v2.0 — Production Grade*
*React 18 + TanStack Query v5 + Zustand + React Hook Form + Zod + @dnd-kit*