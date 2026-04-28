# 🎮 Funnova — Assessment Section UI/UX Redesign
## Complete Implementation Guide (A to Z)

---

## 1. Vision & Design Direction

### What This Is
The student lesson page currently shows a flat question list. The redesign transforms it into a **4-section zigzag adventure roadmap** — each section is a "checkpoint" the student must complete before the next unlocks. The four sections in order are:

1. 📝 **MCQ** — Multiple Choice Questions
2. ✏️ **Fill in the Blanks** (FIB)
3. ✅ **True or False**
4. 🎮 **Game Section** → navigates to game page on click

### Design Aesthetic
- **Theme**: Adventure RPG roadmap, gamified. Think mobile game "level select" screen.
- **Color Palette**:
  - Background: `#0F0C29` → `#302B63` (deep purple-blue dark gradient)
  - Section cards: Glassmorphism (`rgba(255,255,255,0.05)` with blur)
  - Active/unlocked accent: `#F7C948` (gold)
  - Locked: `#4B4B6B` (muted purple-gray)
  - Completed: `#22C55E` (green)
  - Game section: `#FF6B6B` → `#FFD93D` (fire gradient — stands out as final boss)
- **Typography**: `Nunito` (display, rounded, friendly for students) + `DM Sans` (body)
- **Motion**: Unlock pulse animation, path glow, card entrance animations

---

## 2. Page Structure Overview

```
┌─────────────────────────────────────┐
│  LIFE SCIENCE BASICS                │
│  Plants and Their Parts             │
│  [Lesson Overview Card]             │
│  [Tab: Plant Structure | Plant Life]│
└─────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────┐
│  SECTION ROADMAP (zigzag vertical layout)      │
│                                                │
│  ①  [MCQ Card]         ←── LEFT               │
│         ↘ connector path                      │
│                  ②  [FIB Card]   ←── RIGHT    │
│                       ↙ connector path        │
│  ③  [T/F Card]         ←── LEFT               │
│         ↘ connector path                      │
│                  ④  [GAME Card]  ←── RIGHT    │
└────────────────────────────────────────────────┘
```

Each card alternates left–right (zigzag). A dashed animated path connects them.

---

## 3. Component Breakdown

### 3.1 Lesson Header (Keep — Minor Refactor)
- **Lesson title** large, bold, white
- **Breadcrumb**: Grade → Subject → Unit → Lesson
- **Tab bar**: Topic tabs (Plant Structure | Plant Life Cycle) — pill style, active tab gold underline
- **Progress bar**: Replace bland bar with XP-style progress strip at top

### 3.2 Section Roadmap Container
- Full-width vertical scroll container
- Dashed SVG path (or CSS border-dashed) connecting cards in zigzag
- Path is **gray when locked**, **gold animated glow when completed**

### 3.3 Section Card (4 instances)
Each card has these states:

| State     | Visual                                          |
|-----------|-------------------------------------------------|
| Locked    | Blurred, grayscale, 🔒 icon, "Complete previous section" tooltip |
| Unlocked  | Full color, pulsing border, START button        |
| Active    | Bright, animated progress ring, current question count |
| Completed | Green checkmark badge, score shown, RETRY button |

**Card anatomy:**
```
┌──────────────────────────────┐
│  🔵 Section Icon  [Badge]   │
│  Section Title               │
│  Subtitle (e.g. "6 Questions")│
│  ──────────────────────      │
│  Progress: ■■■□□□  3/6      │
│  [      START →      ]      │
└──────────────────────────────┘
```

- Section icon: emoji or custom SVG per type
  - MCQ → 🎯 or target icon
  - FIB → ✏️ or pencil icon
  - T/F → ⚡ or lightning bolt
  - Game → 🎮 controller icon (fire gradient card)

### 3.4 Connector Path (SVG or CSS)
- A dashed vertical line with a curved arc alternating left–right
- Animates: `stroke-dashoffset` animation flows downward when section is completed
- Color: gray (locked) → gold glow (completed)

### 3.5 Question View (Within MCQ / FIB / T/F)
When a section is clicked → expands inline (accordion) OR navigates to `/student/lesson/:id/section/:type`

**Inside Question view:**
- **Progress pill**: `Q1 of 6` with animated progress bar (gold fill)
- **Question card**: White-on-glass card, large readable font
- **Answer options**: Large tap-friendly cards (not small radio buttons)
  - Neutral: `rgba(255,255,255,0.08)` 
  - Selected: Gold border + light gold bg
  - Correct: Green fill + ✓ icon
  - Incorrect: Red fill + ✗ icon + correct answer revealed
- **Navigation**: `← Previous` | `Next →` — pill buttons, right-aligned Next in gold
- **Feedback toast**: Appears for 1.5s after answering — "✅ Correct! +10 XP" or "❌ Not quite!"

### 3.6 Game Section Card (Special)
- Visually distinct — **fire gradient** background (`#FF6B6B → #FFD93D`)
- Animated shimmer effect
- Large 🎮 icon
- Button says **"PLAY GAME →"** (not START)
- On click: navigate to game page (`/student/lesson/:id/game`)
- Shows "🏆 Boss Level" badge top-right

---

## 4. Interaction & Unlock Logic

### Unlock Flow
```
Lesson page loads
  → Check DB/API: which sections are completed for this lesson+student
  → Render sections with correct state (locked / unlocked / completed)

Student clicks START on MCQ
  → Navigate to /student/lesson/:id/section/mcq (or open accordion)
  → Answer all questions
  → Submit → API marks MCQ as complete → FIB unlocks
  → Show unlock animation: card lights up, path glows, confetti burst

Student clicks START on FIB → same flow
Student clicks START on T/F → same flow
Student clicks PLAY GAME → navigate to game page
```

### API Endpoints Needed
```
GET  /api/student/lesson/:lessonId/progress
     → returns { mcq: "completed"|"unlocked"|"locked", fib: ..., tf: ..., game: ... }

POST /api/student/lesson/:lessonId/section/:type/complete
     → body: { score, answers[] }
     → returns { nextSection: "fib"|"tf"|"game"|null, xpEarned: 20 }
```

### State Object (Frontend)
```js
const sectionOrder = ['mcq', 'fib', 'tf', 'game'];

// Example state
const sectionProgress = {
  mcq:  { status: 'completed', score: 5, total: 6 },
  fib:  { status: 'unlocked',  score: null, total: 4 },
  tf:   { status: 'locked',    score: null, total: 5 },
  game: { status: 'locked',    score: null, total: null }
};
```

---

## 5. File Structure

```
src/
├── pages/
│   └── student/
│       └── LessonPage.jsx            ← main page (refactor)
│       └── SectionPage.jsx           ← question runner (new or refactor)
│
├── components/
│   └── lesson/
│       ├── LessonHeader.jsx          ← breadcrumb + tabs + XP bar
│       ├── SectionRoadmap.jsx        ← zigzag container (NEW)
│       ├── SectionCard.jsx           ← individual section card (NEW)
│       ├── ConnectorPath.jsx         ← animated dashed path (NEW)
│       ├── QuestionCard.jsx          ← question + options (refactor)
│       ├── MCQOption.jsx             ← MCQ answer option (refactor)
│       ├── FIBInput.jsx              ← fill-in-blank input (refactor)
│       ├── TFOption.jsx              ← true/false option (refactor)
│       └── SectionCompleteModal.jsx  ← score + XP earned modal (NEW)
│
├── hooks/
│   └── useLessonProgress.js          ← fetch + manage section states
│
└── styles/
    └── lesson.css                    ← or Tailwind utility classes
```

---

## 6. SectionCard Component — Detailed Spec

### Props
```jsx
<SectionCard
  type="mcq"              // 'mcq' | 'fib' | 'tf' | 'game'
  status="unlocked"       // 'locked' | 'unlocked' | 'active' | 'completed'
  score={null}            // number or null
  total={6}               // total questions
  position="left"         // 'left' | 'right' (zigzag alternation)
  onStart={() => {}}      // callback
/>
```

### Section Config Map
```js
const SECTION_CONFIG = {
  mcq: {
    label: 'Multiple Choice',
    icon: '🎯',
    color: '#6C63FF',
    description: 'Test your knowledge with MCQs',
    buttonLabel: 'START',
  },
  fib: {
    label: 'Fill in the Blanks',
    icon: '✏️',
    color: '#3ECFCF',
    description: 'Complete the missing words',
    buttonLabel: 'START',
  },
  tf: {
    label: 'True or False',
    icon: '⚡',
    color: '#F59E0B',
    description: 'Quick-fire true/false round',
    buttonLabel: 'START',
  },
  game: {
    label: 'Game Challenge',
    icon: '🎮',
    color: '#FF6B6B',
    gradientTo: '#FFD93D',
    description: 'Boss Level — Play the game!',
    buttonLabel: 'PLAY GAME',
    isBoss: true,
  },
};
```

---

## 7. Animation Specs

### Card Unlock Animation
```css
@keyframes unlockPulse {
  0%   { box-shadow: 0 0 0 0 rgba(247, 201, 72, 0.7); }
  70%  { box-shadow: 0 0 0 20px rgba(247, 201, 72, 0); }
  100% { box-shadow: 0 0 0 0 rgba(247, 201, 72, 0); }
}

.card-unlocked {
  animation: unlockPulse 1.5s ease-out 2;
}
```

### Connector Path Glow (SVG)
```css
@keyframes pathFlow {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
}

.connector-completed {
  stroke: #F7C948;
  stroke-dasharray: 8 4;
  animation: pathFlow 0.8s ease forwards;
  filter: drop-shadow(0 0 4px #F7C948);
}
```

### Question Card Entrance
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.question-card {
  animation: slideIn 0.3s ease forwards;
}
```

### Answer Feedback Flash
```css
/* Correct */
@keyframes correctFlash {
  0%   { background: rgba(34, 197, 94, 0.3); }
  100% { background: rgba(34, 197, 94, 0.15); }
}

/* Incorrect */
@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-6px); }
  75%       { transform: translateX(6px); }
}
```

---

## 8. Section Complete Modal

After last question is submitted, show a modal:

```
┌────────────────────────────┐
│   🎉 Section Complete!     │
│   MCQ — Plants & Their Parts│
│                            │
│   Score:  5 / 6  (83%)    │
│   ⭐ +20 XP Earned!        │
│                            │
│   [RETRY]   [CONTINUE →]  │
└────────────────────────────┘
```

- Confetti animation on open (use `canvas-confetti` or CSS keyframes)
- XP number counts up (0 → 20) with easing
- CONTINUE unlocks next section and animates back to roadmap

---

## 9. Responsive Behavior

| Screen  | Layout                                           |
|---------|--------------------------------------------------|
| Desktop | Zigzag left/right, cards ~400px wide, SVG path  |
| Tablet  | Same zigzag, cards slightly narrower            |
| Mobile  | **Single column center** — no zigzag; cards full-width, connector path straight vertical |

Mobile breakpoint: `< 640px` → stack all cards center-aligned, remove left/right offset

---

## 10. Accessibility

- All cards must be keyboard-focusable (`tabIndex={0}`, `onKeyDown` for Enter)
- Locked cards: `aria-disabled="true"`, tooltip via `title` attribute
- Progress ring: `aria-label="3 of 6 questions completed"`
- Answer options: use real `<button>` elements, not divs
- Color not sole differentiator — always pair with icon + text for correct/wrong states

---

## 11. What NOT to Change

- ✅ Keep existing routing structure (`/student/lesson/:id`)
- ✅ Keep existing backend API logic — only ADD the progress endpoint
- ✅ Keep admin panel as-is — this is purely student-facing UI
- ✅ Keep existing game page navigation logic
- ✅ Keep auth and role guard logic

---

## 12. Implementation Checklist

### Phase 1 — Roadmap Shell
- [ ] Create `SectionRoadmap.jsx` with 4 cards in zigzag layout
- [ ] Create `SectionCard.jsx` with locked/unlocked/completed states
- [ ] Create `ConnectorPath.jsx` (SVG dashed lines between cards)
- [ ] Wire `useLessonProgress` hook to fetch section states from API
- [ ] Add `GET /api/student/lesson/:id/progress` endpoint if not exists

### Phase 2 — Question Runner Refactor
- [ ] Refactor `QuestionCard.jsx` — larger tap targets, animated options
- [ ] Add answer feedback (color flash + icon) on selection
- [ ] Add XP toast on correct answer
- [ ] Refactor progress bar to gold animated fill

### Phase 3 — Unlock Flow
- [ ] Connect `POST /complete` API on last question submit
- [ ] Trigger unlock animation on next section card
- [ ] Show `SectionCompleteModal` with score + XP
- [ ] Persist completed state across page refreshes

### Phase 4 — Game Section
- [ ] Style Game card with fire gradient + shimmer
- [ ] On click: navigate to game page (existing logic)
- [ ] Show locked overlay if previous sections incomplete

### Phase 5 — Polish
- [ ] Mobile responsive (single column)
- [ ] Entrance animations for all cards on page load (staggered)
- [ ] Accessibility audit (keyboard nav + aria)
- [ ] Cross-browser test

---

## 13. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --bg-primary:       #0F0C29;
  --bg-secondary:     #302B63;
  --card-glass:       rgba(255, 255, 255, 0.05);
  --card-border:      rgba(255, 255, 255, 0.1);
  --accent-gold:      #F7C948;
  --accent-green:     #22C55E;
  --accent-red:       #EF4444;
  --text-primary:     #FFFFFF;
  --text-muted:       #9CA3AF;
  --locked-bg:        #1E1B3A;
  --locked-text:      #4B4B6B;

  /* Section Colors */
  --mcq-color:        #6C63FF;
  --fib-color:        #3ECFCF;
  --tf-color:         #F59E0B;
  --game-color-start: #FF6B6B;
  --game-color-end:   #FFD93D;

  /* Spacing */
  --card-radius:      16px;
  --card-padding:     24px;

  /* Fonts */
  --font-display:     'Nunito', sans-serif;
  --font-body:        'DM Sans', sans-serif;
}
```

---

*Document Version: 1.0 | Funnova — Student Lesson UI/UX Redesign*
*Platform: React + Express + PostgreSQL | Target: Student Role*