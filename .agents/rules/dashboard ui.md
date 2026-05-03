---
trigger: always_on
---

# 🚀 FUNNOVA Dashboard Upgrade — Execution Plan

> **Project:** FUNNOVA Learning Adventure  
> **Scope:** Student Dashboard UI Overhaul  
> **Current State:** Minimal cards (Math + Science only)  
> **Target State:** Full gamified dashboard matching design mockup  
> **Stack Assumption:** React + Vite (localhost:5173), Tailwind CSS or CSS Modules

---

## 📌 Current vs Target — Gap Analysis

| Section | Current State | Target State |
|---|---|---|
| Hero / Greeting | Basic name + XP bar | Avatar + greeting + Level badge + XP bar + Streak + Stars |
| Continue Adventure | ❌ Missing | "Continue Your Adventure" banner with subject, lesson, progress, CTA |
| Explore Subjects | Math + Science cards only | Math, Science, English cards with progress % (NO Games) |
| Daily Missions | ❌ Missing | Sidebar panel — 3 missions with star rewards + View All |
| Streak Section | Small top-bar icon | Dedicated streak card — Days count + motivational copy |
| Rewards Section | ❌ Missing | Stars count + Explorer Badge + View All Rewards |
| Mobile Layout | ❌ Not responsive | Full mobile layout with bottom footer nav |
| Footer Nav (Mobile) | ❌ None | Home · Subjects · Missions · Profile (NO Games tab) |

---

## 🗂️ File Structure (Recommended)

```
src/
├── pages/
│   └── StudentDashboard.jsx          ← Main page (refactor this)
├── components/dashboard/
│   ├── HeroGreeting.jsx              ← Avatar + name + XP + badges
│   ├── ContinueAdventure.jsx         ← "Continue Your Adventure" banner
│   ├── ExploreSubjects.jsx           ← Subject cards grid
│   ├── DailyMissions.jsx             ← Missions sidebar panel
│   ├── StreakCard.jsx                ← Streak days display
│   ├── RewardsCard.jsx               ← Stars + badges
│   └── MobileFooterNav.jsx           ← Bottom nav (mobile only)
├── hooks/
│   └── useDashboardData.js           ← Fetch XP, streak, missions, subjects
└── styles/
    └── dashboard.css                 ← CSS variables + global dashboard styles
```

---

## 🎨 Design System — CSS Variables

```css
/* styles/dashboard.css */
:root {
  --color-primary:     #7C3AED;   /* Purple — primary actions */
  --color-secondary:   #F59E0B;   /* Amber — stars, XP, streak */
  --color-math:        #3B82F6;   /* Blue — Mathematics */
  --color-science:     #10B981;   /* Green — Science */
  --color-english:     #EC4899;   /* Pink — English */
  --color-bg:          #F5F3FF;   /* Light lavender page bg */
  --color-card:        #FFFFFF;
  --color-text:        #1E1B4B;
  --color-text-muted:  #6B7280;
  --radius-card:       16px;
  --shadow-card:       0 4px 20px rgba(124, 58, 237, 0.08);
  --font-display:      'Nunito', sans-serif;   /* Rounded, kid-friendly */
  --font-body:         'Poppins', sans-serif;
}
```

---

## 🧩 Component Breakdown & Implementation

---

### 1. `HeroGreeting.jsx`

**What it shows:** Avatar, greeting message, level badge, XP progress bar, streak count, stars count.

**Props / Data needed:**
```js
{
  studentName: "Siva",
  avatarUrl: "/assets/avatars/siva.png",
  level: 3,
  xpCurrent: 242,
  xpMax: 500,
  streakDays: 3,
  starsTotal: 120
}
```

**Layout:**
```
[ Avatar ] [ Hey, Siva! 👋 ]  [ 🛡️ Level 3 ]  [ XP ████░░ 242/500 ]  |  [ 🔥 3 Day Streak ]  [ ⭐ 120 Stars ]
```

**Key implementation notes:**
- XP bar: `width: (xpCurrent / xpMax) * 100 + '%'` with CSS transition
- Level badge: purple shield icon (use Lucide `Shield` or emoji 🛡️)
- Streak/Stars: separate pill-shaped badges with icon + number
- Responsive: stack vertically on mobile, row on desktop

---

### 2. `ContinueAdventure.jsx`

**What it shows:** Yellow/warm banner — last active subject, lesson name, progress bar, "Continue Playing" CTA button. Background illustration (waterfall/nature scene).

**Props / Data needed:**
```js
{
  subject: "Science",
  lessonName: "Water and its Uses",
  lessonNumber: 2,
  totalLessons: 5,
  completedPercent: 60,
  onContinue: () => navigate('/lesson/science/water')
}
```

**Layout:**
```
[ 🚀 CONTINUE YOUR ADVENTURE ]
[ Mascot Img ]  [ Science — Water and its Uses ]  [ Landscape Illustration ]
                [ Lesson 2 of 5 · ████░░ 60% ]
                [ ▶ Continue Playing  ]
```

**Key implementation notes:**
- Background: `background: linear-gradient(135deg, #FDE68A, #FCD34D)` (warm yellow)
- Mascot: animated water-drop character (SVG or PNG asset)
- CTA button: `--color-primary` purple, pill shape, hover scale effect
- Progress bar inside the banner, label "X% Completed"
- Responsive: mascot hides on mobile, layout goes single-column

---

### 3. `ExploreSubjects.jsx` ⚠️ NO GAMES

**Subjects to show:** Mathematics · Science · English  
**Games card is REMOVED.**

**Props / Data needed:**
```js
subjects: [
  { id: 'math',    label: 'Mathematics', color: '--color-math',    icon: '123', progress: 60 },
  { id: 'science', label: 'Science',     color: '--color-science', icon: '🔬',  progress: 60 },
  { id: 'english', label: 'English',     color: '--color-english', icon: 'ABC', progress: 45 },
]
```

**Layout (Desktop):**
```
[ Math 60% ▶ Continue ]  [ Science 60% ▶ Continue ]  [ English 45% ▶ Continue ]
```

**Layout (Mobile):**  
Horizontal scroll row — 3 compact cards visible, swipeable.

**Key implementation notes:**
- Each card: colored background (`--color-math` etc.), subject icon (big, centered), label, progress bar, "Continue →" button
- Grid: `grid-template-columns: repeat(3, 1fr)` desktop → horizontal scroll on mobile
- Card hover: `transform: translateY(-4px)` with shadow lift
- Progress bar color matches card color

---

### 4. `DailyMissions.jsx`

**What it shows:** 3 daily missions with completion status, star reward per mission, "View All Missions" link.

**Props / Data needed:**
```js
missions: [
  { id: 1, label: 'Complete 1 lesson', stars: 10, completed: true },
  { id: 2, label: 'Play 1 game',       stars: 10, completed: false },
  { id: 3, label: 'Get 80% accuracy',  stars: 15, completed: false },
]
```

**Layout:**
```
⚡ DAILY MISSIONS
[✅] Complete 1 lesson ········ 10⭐
[○ ] Play 1 game       ········ 10⭐
[○ ] Get 80% accuracy  ········ 15⭐
          [ View All Missions ]
```

**Key implementation notes:**
- Completed: green checkmark circle icon
- Incomplete: hollow grey circle
- Star reward: `⭐ 10` right-aligned
- "View All Missions" → purple underline text button
- On mobile: this section moves BELOW the ContinueAdventure banner (not sidebar)

---

### 5. `StreakCard.jsx`

**What it shows:** Current streak days, flame emoji, motivational message.

**Props / Data needed:**
```js
{ streakDays: 3, message: "Great job! Keep it up!" }
```

**Layout:**
```
🔥 STREAK
[ 🟠 3 Days ]  Great job! Keep it up!  🔥
```

**Key implementation notes:**
- Orange circle badge with day count
- Animated flame (CSS keyframe wiggle or Lottie)
- Motivational copy changes based on streak milestone (3→7→14→30)

---

### 6. `RewardsCard.jsx`

**What it shows:** Stars earned total, badge earned (Explorer Badge), "View All Rewards" link.

**Props / Data needed:**
```js
{ starsTotal: 120, badges: [{ id: 'explorer', label: 'Explorer Badge', icon: '🛡️' }] }
```

**Layout:**
```
🏆 REWARDS
[ ⭐ 120 Stars ]  [ 🛡️ Explorer Badge ]
      [ View All Rewards ]
```

---

### 7. `MobileFooterNav.jsx` ⚠️ NO GAMES TAB

**Tabs:** Home · Subjects · Missions · Profile  
**Games tab is REMOVED.**

```jsx
const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: HomeIcon,    path: '/student/dashboard' },
  { id: 'subjects', label: 'Subjects', icon: BookIcon,    path: '/student/subjects'  },
  { id: 'missions', label: 'Missions', icon: TargetIcon,  path: '/student/missions'  },
  { id: 'profile',  label: 'Profile',  icon: UserIcon,    path: '/student/profile'   },
];
```

**Key implementation notes:**
- Fixed bottom: `position: fixed; bottom: 0; left: 0; right: 0`
- Show ONLY on mobile: `@media (max-width: 768px) { display: flex }` — hidden on desktop
- Active tab: purple icon + label, inactive: grey
- Height: `64px`, safe-area padding for iOS: `padding-bottom: env(safe-area-inset-bottom)`
- White background with subtle top border shadow

---

## 📐 Dashboard Layout Grid

### Desktop (≥ 1024px)
```
┌──────────────────────────────────────────────────────────┐
│  HeroGreeting (full width)                               │
├─────────────────────────────────┬────────────────────────┤
│  ContinueAdventure (col 8)      │  DailyMissions (col 4) │
├─────────────────────────────────┤                        │
│  ExploreSubjects (col 8)        ├────────────────────────┤
│  [Math] [Science] [English]     │  StreakCard (col 4)    │
│                                 ├────────────────────────┤
│                                 │  RewardsCard (col 4)   │
└─────────────────────────────────┴────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────┐
│  HeroGreeting          │
├────────────────────────┤
│  ContinueAdventure     │
├────────────────────────┤
│  DailyMissions         │
├────────────────────────┤
│  Explore Subjects      │
│  ← scroll [M][S][E] → │
├────────────────────────┤
│  StreakCard            │
├────────────────────────┤
│  RewardsCard           │
├────────────────────────┤
│ 🏠Home 📚Sub 🎯Miss 👤Pro │  ← Fixed footer
└────────────────────────┘
```

---

## 🔌 API / Data Hooks
```js
// hooks/useDashboardData.js
export function useDashboardData(studentId) {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/students/${studentId}/profile`),
      fetch(`/api/students/${studentId}/progress`),
      fetch(`/api/students/${studentId}/missions/daily`),
      fetch(`/api/students/${studentId}/rewards`),
    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([profile, progress, missions, rewards]) => {
      setData({ profile, progress, missions, rewards });
    });
  }, [studentId]);

  return data;
}
```

**Backend endpoints needed:**
| Endpoint | Returns |
|---|---|
| `GET /api/students/:id/profile` | name, avatar, level, xp, streakDays, starsTotal |
| `GET /api/students/:id/progress` | subjects array (id, label, completedPercent, lastLesson) |
| `GET /api/students/:id}/missions/daily` | missions array (id, label, stars, completed) |
| `GET /api/students/:id/rewards` | starsTotal, badges array |

---

## ✅ Execution Checklist

### Phase 1 — Foundation (Day 1)
- [ ] Set up CSS variables in `dashboard.css`
- [ ] Import Google Fonts: Nunito + Poppins
- [ ] Create `useDashboardData` hook wired to your existing backend
- [ ] Scaffold `StudentDashboard.jsx` with new grid layout

### Phase 2 — Core Components (Day 2–3)
- [ ] Build `HeroGreeting.jsx` — XP bar animation, badges
- [ ] Build `ContinueAdventure.jsx` — yellow banner, progress, CTA
- [ ] Build `ExploreSubjects.jsx` — 3 cards (Math, Science, English) NO GAMES
- [ ] Build `DailyMissions.jsx` — missions list, star rewards

### Phase 3 — Sidebar & Gamification (Day 4)
- [ ] Build `StreakCard.jsx` — animated flame, day count
- [ ] Build `RewardsCard.jsx` — stars + badge display
- [ ] Wire all to `useDashboardData` hook

### Phase 4 — Mobile Responsive (Day 5)
- [ ] Add responsive breakpoints to all components
- [ ] Build `MobileFooterNav.jsx` — 4 tabs, NO Games tab
- [ ] Test on 375px (iPhone SE), 390px (iPhone 14), 412px (Android)
- [ ] Fix horizontal scroll for ExploreSubjects on mobile

### Phase 5 — Polish (Day 6)
- [ ] Add page load animations (staggered card reveals)
- [ ] Add hover states and micro-interactions
- [ ] Test XP bar, progress bars rendering correctly from real API
- [ ] Cross-browser check (Chrome, Safari, Firefox)

---

## 🚫 What's Explicitly Excluded

- ❌ **Games** — removed from Explore Subjects section
- ❌ **Games tab** — removed from mobile footer navigation
- ❌ No leaderboard (future phase)
- ❌ No notifications bell (future phase)

---

## 📎 Assets Required

| Asset | Description | Source |
|---|---|---|
| Student avatar | Cartoon avatar image | Generate or use existing |
| Subject icons | Math (123), S