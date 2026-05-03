# 🗺️ FUNNOVA — Subject Adventure Map: Frontend Upgrade Plan

> **Page:** `/subject/:id` (e.g. `/subject/9` — Science)  
> **Scope:** FRONTEND ONLY — Zero backend changes  
> **Current:** Linear vertical lesson circles with connecting lines  
> **Target:** Animated isometric adventure map — themed islands, winding golden path, floating mascots, unit popup cards  
> **Backend:** All existing API calls, hooks, and data fetching stay 100% unchanged

---

## ⚠️ FRONTEND-ONLY SCOPE BOUNDARY

```
✅ ALLOWED (Frontend Only)
├── SubjectPage.jsx — replace visual layout only
├── New map components in /components/subject/map/
├── CSS animations, keyframes, variables
├── Conditional rendering based on existing data props
├── SVG path drawing, island positioning
└── Responsive layout switch (desktop map ↔ mobile vertical)

❌ NOT ALLOWED (Backend — Do Not Touch)
├── /api/** routes
├── Database models or schemas  
├── Any existing hooks (useSubject, useLessons, etc.)
├── Redux/Zustand store actions
├── Backend controllers or services
└── Any existing data-fetching logic
```

> **Rule:** The map components receive the SAME data the current lesson list receives.  
> Just display it differently — as an adventure map instead of a list.

---

## 🔌 Existing Data Shape (Read-Only — Don't Change)

The current page already fetches this data. Map components consume it as-is:

```js
// What the existing hook/API already returns — DO NOT modify
{
  subject: {
    id: 9,
    name: "Science",
    icon: "...",
    totalProgress: 60   // journey progress %
  },
  units: [
    {
      id: 1,
      title: "World Around Us",
      status: "completed",          // "completed" | "in_progress" | "locked"
      lessonsCompleted: 5,
      totalLessons: 5,
      starsEarned: 3,
      nextLessonId: null
    },
    {
      id: 2,
      title: "Animals & Their World", 
      status: "completed",
      lessonsCompleted: 4,
      totalLessons: 5,
      starsEarned: 2,
      nextLessonId: null
    },
    {
      id: 3,
      title: "Air & Its Importance",
      status: "in_progress",
      lessonsCompleted: 3,
      totalLessons: 5,
      starsEarned: 1,
      nextLessonId: 4
    },
    {
      id: 4,
      title: "Water & Its Uses",
      status: "in_progress",
      lessonsCompleted: 5,
      totalLessons: 5,
      starsEarned: 3,
      nextLessonId: null
    },
    {
      id: 5,
      title: "Living Things Around Us",
      status: "locked",
      lessonsCompleted: 2,
      totalLessons: 5,
      starsEarned: 0,
      nextLessonId: null
    }
  ]
}
```

---

## 📁 New File Structure (Frontend Only)

```
src/
├── pages/
│   └── SubjectPage.jsx              ← Modify layout section only — keep data hooks
│
└── components/subject/map/          ← ALL NEW FILES (frontend only)
    ├── AdventureMap.jsx             ← Main map canvas container
    ├── MapBackground.jsx            ← 4 zone gradient backgrounds
    ├── MapPath.jsx                  ← SVG winding golden path
    ├── MapIsland.jsx                ← Island node (numbered circle, 3 states)
    ├── UnitInfoCard.jsx             ← Popup card beside each island
    ├── MapMascot.jsx                ← Floating character per island
    ├── JourneyProgressBar.jsx       ← Top animated progress bar
    ├── VerticalJourneyMap.jsx       ← Mobile fallback (vertical layout)
    └── adventure-map.css            ← All map CSS + keyframes
```

### SubjectPage.jsx Change — Minimal

```jsx
// SubjectPage.jsx — ONLY CHANGE: swap the render section
// Keep all existing: hooks, data fetching, navigate calls — UNTOUCHED

import AdventureMap from '../components/subject/map/AdventureMap';
import VerticalJourneyMap from '../components/subject/map/VerticalJourneyMap';
import { useMediaQuery } from '../hooks/useMediaQuery'; // existing or add this tiny hook

function SubjectPage() {
  // ✅ ALL THESE STAY EXACTLY THE SAME — DO NOT TOUCH
  const { subjectId } = useParams();
  const { subject, units, loading } = useSubject(subjectId); // existing hook
  const navigate = useNavigate();                             // existing
  const isMobile = useMediaQuery('(max-width: 768px)');      // NEW — tiny addition

  // ✅ Keep existing click handlers exactly as-is
  const handleUnitClick = (unit) => { /* existing logic stays */ };

  // 🔄 ONLY CHANGE: Replace the JSX return's map/list section
  if (loading) return <MapLoadingSkeleton />;

  return (
    <div className="subject-page">
      <SubjectHeader subject={subject} />              {/* existing component */}
      <JourneyProgressBar progress={subject.totalProgress} />  {/* NEW visual */}
      
      {isMobile
        ? <VerticalJourneyMap units={units} onUnitClick={handleUnitClick} />
        : <AdventureMap units={units} onUnitClick={handleUnitClick} subjectId={subjectId} />
      }
    </div>
  );
}
```

---

## 🏝️ Island Themes Per Unit Position

| Position | Zone | Background Colors | Mascot Asset |
|----------|------|-------------------|--------------|
| Island 1 | Forest | `#4CAF50` → `#A5D6A7` | `tiger.png` |
| Island 2 | Sky | `#64B5F6` → `#BBDEFB` | `elephant.png` |
| Island 3 | Sky-River border | `#80DEEA` → `#B2EBF2` | `cloud-face.png` |
| Island 4 | River | `#26C6DA` → `#80CBC4` | `water-drop.png` |
| Island 5 | Space | `#1A237E` → `#3949AB` | `earth-globe.png` |

---

## 🎨 CSS Variables

```css
/* adventure-map.css */
:root {
  /* Island states */
  --island-done:     #4CAF50;
  --island-active:   #7C3AED;
  --island-locked:   #9E9E9E;

  /* Path */
  --path-color:      #FDD835;
  --path-width:      24px;

  /* Stars */
  --star-filled:     #FFD700;
  --star-empty:      #E0E0E0;

  /* Map canvas */
  --map-min-height:  640px;

  /* Fonts */
  --font-display:    'Nunito', sans-serif;
  --font-body:       'Poppins', sans-serif;
}
```

---

## 🗺️ Island Positions on Map Canvas

```js
// Absolute % positions within the map canvas div
// Adjust after seeing how it renders — these are starting coordinates
export const ISLAND_POSITIONS = {
  1: { left: '14%', top: '65%' },   // bottom-left — forest zone
  2: { left: '60%', top: '22%' },   // top-right — sky zone
  3: { left: '38%', top: '44%' },   // center — sky/river border
  4: { left: '10%', top: '80%' },   // bottom — river zone
  5: { left: '66%', top: '70%' },   // bottom-right — space zone
};

// UnitInfoCard offset direction from island
export const CARD_POSITIONS = {
  1: 'top-right',
  2: 'top-left',
  3: 'right',
  4: 'left',
  5: 'right',
};
```

---

## 🎬 Animation Summary

| Animation | Applied To | Duration | Type |
|-----------|-----------|----------|------|
| `float` | Mascot images | 3s infinite | `translateY` 0 ↔ -10px |
| `bounce` | Active island circle | 2s infinite | `scale` 1 ↔ 1.1 |
| `sparkle` | Stars on completed islands | 1.5s infinite | `opacity` + `rotate` |
| `pathDraw` | SVG path on load | 2s once | `stroke-dashoffset` |
| `islandReveal` | Each island on load | 0.4s staggered | `scale` + `opacity` |
| `cardSlide` | UnitInfoCard appear | 0.25s | `translateY` + `opacity` |
| `lockShake` | Locked island on hover | 0.4s | `rotate` ±6deg |
| `cloudDrift` | Background cloud shapes | 8s infinite | `translateX` |
| `progressFill` | Journey progress bar | 1s on mount | `width` 0 → actual% |

> All animations use `transform` or `opacity` only — no layout properties animated.

---

## 📱 Mobile Behaviour

Below `768px` — switch to `VerticalJourneyMap`:

```
  🟢─── Unit 1: World Around Us ────── ✅ 5/5 ⭐⭐⭐
  │
  🟢─── Unit 2: Animals & Their World ─ ✅ 4/5 ⭐⭐
  │
  🟣─── Unit 3: Air & Its Importance ── 🔄 3/5 ⭐
  │
  🟣─── Unit 4: Water & Its Uses ────── 🔄 5/5 ⭐⭐⭐
  │
  🔒─── Unit 5: Living Things Around Us  Locked
```

- Islands: min 60px tap targets
- Cards always visible (no hover)
- `padding-bottom: 80px` for footer nav

---

## ✅ Execution Phases

| Phase | Task | Days |
|-------|------|------|
| 1 | CSS variables + fonts + file scaffold | Day 1 |
| 2 | MapBackground (4 zones + decorative SVGs) | Day 1–2 |
| 3 | MapPath (SVG winding path + draw animation) | Day 2 |
| 4 | MapIsland (3 states + all animations) | Day 2–3 |
| 5 | UnitInfoCard (popup + stars + slide animation) | Day 3 |
| 6 | MapMascot (float animation + positioning) | Day 4 |
| 7 | JourneyProgressBar (fill animation) | Day 4 |
| 8 | Wire all into AdventureMap with existing data | Day 4–5 |
| 9 | VerticalJourneyMap (mobile layout) | Day 5 |
| 10 | Polish + a11y + cross-browser QA | Day 6 |

---

*FUNNOVA — Neo Perion Solutions | Frontend upgrade only*