---
description: # 🔄 Subject Adventure Map — Developer Workflow (http://localhost:5173/subject)
---

# 🔄 Subject Adventure Map — Developer Workflow

> **Frontend Only** — 10 steps, each with a clear Definition of Done  
> Never touch backend files. Start from Step 1 and check off each DoD before moving on.

---

## PRE-WORK CHECKLIST

Before starting any step:
- [ ] Confirm existing `useSubject(subjectId)` hook works and returns units array
- [ ] Note exact field names from existing API response (status, lessonsCompleted etc.)
- [ ] Install `react-hot-toast` if not already: `npm install react-hot-toast`
- [ ] Add Google Fonts in `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  ```

---

## STEP 1 — Scaffold + CSS Variables

### Actions
```bash
mkdir -p src/components/subject/map
touch src/components/subject/map/AdventureMap.jsx
touch src/components/subject/map/MapBackground.jsx
touch src/components/subject/map/MapPath.jsx
touch src/components/subject/map/MapIsland.jsx
touch src/components/subject/map/UnitInfoCard.jsx
touch src/components/subject/map/MapMascot.jsx
touch src/components/subject/map/JourneyProgressBar.jsx
touch src/components/subject/map/VerticalJourneyMap.jsx
touch src/components/subject/map/adventure-map.css
```

### Add to `adventure-map.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');

:root {
  --island-done:   #4CAF50;
  --island-active: #7C3AED;
  --island-locked: #9E9E9E;
  --path-color:    #FDD835;
  --star-filled:   #FFD700;
  --star-empty:    #E0E0E0;
  --map-min-height: 640px;
  --font-display:  'Nunito', sans-serif;
  --font-body:     'Poppins', sans-serif;
}

/* All CSS keyframes defined here */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.1); }
}
@keyframes sparkle {
  0%, 100% { opacity: 1;   transform: scale(1)   rotate(0deg); }
  50%       { opacity: 0.6; transform: scale(1.2) rotate(15deg); }
}
@keyframes cloudDrift {
  0%, 100% { transform: translateX(0px); }
  50%       { transform: translateX(-15px); }
}
@keyframes cardSlide {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lockShake {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-6deg); }
  75%       { transform: rotate(6deg); }
}
@keyframes islandReveal {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes progressFill {
  from { width: 0%; }
  to   { width: var(--progress-target); }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

### DoD Step 1
- [ ] All files created with no errors
- [ ] CSS variables load without conflict
- [ ] All keyframes defined in one file

---

## STEP 2 — MapBackground (Zone Backgrounds)

### Goal
4 quadrant background zones inside the map canvas — no JS logic, pure CSS.

```jsx
// MapBackground.jsx
import './adventure-map.css';

const ZONES = [
  { id: 'forest', style: { background: 'linear-gradient(160deg,#4CAF50 0%,#A5D6A7 100%)',
      top:0, left:0, width:'55%', height:'55%' } },
  { id: 'sky',    style: { background: 'linear-gradient(180deg,#64B5F6 0%,#BBDEFB 100%)',
      top:0, right:0, width:'48%', height:'60%' } },
  { id: 'river',  style: { background: 'linear-gradient(160deg,#26C6DA 0%,#80CBC4 100%)',
      bottom:0, left:0, width:'55%', height:'50%' } },
  { id: 'space',  style: { background: 'linear-gradient(180deg,#1A237E 0%,#3949AB 100%)',
      bottom:0, right:0, width:'48%', height:'45%' } },
];

export default function MapBackground() {
  return (
    <div className="map-background" style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:24 }}>
      {ZONES.map(z => (
        <div key={z.id} className={`zone zone--${z.id}`}
          style={{ position:'absolute', opacity:0.85, ...z.style }} />
      ))}
      {/* Decorative elements per zone */}
      <CloudShape style={{ top:'8%', right:'20%', animation:'cloudDrift 8s ease-in-out infinite' }} />
      <CloudShape style={{ top:'15%', right:'35%', animation:'cloudDrift 10s ease-in-out infinite 2s' }} />
      <StarDots />   {/* space zone stars */}
    </div>
  );
}

// Simple cloud: CSS border-radius trick
function CloudShape({ style }) {
  return (
    <div style={{
      width: 80, height: 32, background: 'rgba(255,255,255,0.7)',
      borderRadius: 50, position:'absolute', ...style
    }} />
  );
}

// Space dots — rendered as tiny circles
function StarDots() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    key: i,
    style: {
      position: 'absolute',
      width: Math.random() * 3 + 2 + 'px',
      height: Math.random() * 3 + 2 + 'px',
      borderRadius: '50%',
      background: 'white',
      opacity: Math.random() * 0.6 + 0.4,
      bottom: Math.random() * 40 + '%',
      right: Math.random() * 45 + '%',
    }
  }));
  return <>{stars.map(s => <div key={s.key} style={s.style} />)}</>;
}
```

### DoD Step 2
- [ ] 4 zones visible with correct colours
- [ ] Zones blend (no sharp hard border)
- [ ] Clouds animate (cloudDrift)
- [ ] Stars dots visible in space zone
- [ ] Background fills canvas fully

---

## STEP 3 — MapPath (SVG Winding Road)

### Goal
Yellow dashed SVG path snaking between all island positions. Animates drawing itself on load.

```jsx
// MapPath.jsx
import { useEffect, useRef } from 'react';

// Bezier path connecting islands 1→2→3→4→5
// Adjust control points after islands are placed
const PATH_D = `
  M 140,520
  C 200,380 380,350 480,250
  C 580,150 680,200 790,145
  C 870,110 900,290 770,370
  C 650,440 510,500 390,560
`;

export default function MapPath() {
  const pathRef = useRef(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.setProperty('--path-length', length);
    pathRef.current.style.strokeDasharray = length;
    pathRef.current.style.strokeDashoffset = length;

    // Trigger draw animation
    requestAnimationFrame(() => {
      pathRef.current.style.transition = 'stroke-dashoffset 2s ease-out';
      pathRef.current.style.strokeDashoffset = '0';
    });
  }, []);

  return (
    <svg
      className="map-path-svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}
      viewBox="0 0 1000 660"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow layer */}
      <path d={PATH_D} stroke="#FDE68A" strokeWidth="32" strokeLinecap="round"
        fill="none" opacity="0.4" filter="url(#glow)" />
      {/* Main path */}
      <path ref={pathRef} d={PATH_D}
        stroke="#FDD835" strokeWidth="20" strokeLinecap="round"
        strokeDasharray="14 9" fill="none" />
    </svg>
  );
}
```

### DoD Step 3
- [ ] Yellow dashed path visible on map
- [ ] Path draws itself (left to right) on page load
- [ ] Glow effect visible
- [ ] Path visually passes near each island position

---

## STEP 4 — MapIsland (Island Circles)

### Goal
Numbered circular buttons. 3 visual states. Staggered reveal on load. Bounce on active.

```jsx
// MapIsland.jsx
const STATE_CONFIG = {
  completed:   { bg: 'var(--island-done)',   icon: '⭐', label: 'Done!',  anim: 'sparkle' },
  in_progress: { bg: 'var(--island-active)', icon: '✦',  label: 'Play!',  anim: 'bounce'  },
  locked:      { bg: 'var(--island-locked)', icon: '🔒', label: 'Locked', anim: 'none'    },
};

export const ISLAND_POSITIONS = {
  1: { left: '14%', top: '65%' },
  2: { left: '60%', top: '22%' },
  3: { left: '38%', top: '44%' },
  4: { left: '10%', top: '80%' },
  5: { left: '66%', top: '70%' },
};

export default function MapIsland({ unit, index, onClick }) {
  const cfg = STATE_CONFIG[unit.status];
  const pos = ISLAND_POSITIONS[unit.id];

  return (
    <button
      onClick={() => onClick(unit)}
      aria-label={`Unit ${unit.id}: ${unit.title}, ${unit.status}`}
      aria-disabled={unit.status === 'locked'}
      className={`map-island island--${unit.status}`}
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        transform: 'translate(-50%, -50%)',
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: cfg.bg,
        border: '4px solid rgba(255,255,255,0.5)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        cursor: unit.status === 'locked' ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        animation: `islandReveal 0.4s ${index * 0.2}s ease-out both${
          unit.status === 'in_progress' ? ', bounce 2s ease-in-out infinite' : ''}`,
        willChange: 'transform',
        fontFamily: 'var(--font-display)',
        zIndex: 10,
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1 }}>
        {unit.id}
      </span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
        {cfg.label}
      </span>
    </button>
  );
}
```

### DoD Step 4
- [ ] All 5 islands render at correct positions
- [ ] Green/purple/grey colours match state
- [ ] Islands reveal staggered on load
- [ ] Active island bounces
- [ ] "Done!" / "Play!" / "Locked" labels show

---

## STEP 5 — UnitInfoCard (Popup Cards)

```jsx
// UnitInfoCard.jsx
const CARD_OFFSET = {
  'top-right': { left: '110%', bottom: '60%' },
  'top-left':  { right: '110%', bottom: '60%' },
  'right':     { left: '110%', top: '50%', transform: 'translateY(-50%)' },
  'left':      { right: '110%', top: '50%', transform: 'translateY(-50%)' },
};

export default function UnitInfoCard({ unit, position = 'top-right', visible }) {
  return (
    <div style={{
      position: 'absolute',
      ...CARD_OFFSET[position],
      background: 'white',
      borderRadius: 16,
      padding: '12px 16px',
      minWidth: 200,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: visible ? 'cardSlide 0.25s ease-out forwards' : undefined,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 20,
      fontFamily: 'var(--font-body)',
    }}>
      <span style={{
        background: unit.status === 'completed' ? '#E8F5E9' : '#EDE7F6',
        color: unit.status === 'completed' ? '#2E7D32' : '#5E35B1',
        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
        letterSpacing: 1,
      }}>
        UNIT {unit.id}
      </span>
      <p style={{ margin: '6px 0 4px', fontWeight: 700, fontSize: 14, color: '#1E1B4B' }}>
        {unit.title}
      </p>
      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#6B7280' }}>
        {unit.lessonsCompleted} / {unit.totalLessons} Lessons Completed
      </p>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: unit.maxStars || 3 }, (_, i) => (
          <span key={i} style={{
            fontSize: 16,
            color: i < unit.starsEarned ? 'var(--star-filled)' : 'var(--star-empty)',
            animation: i < unit.starsEarned ? 'sparkle 1.5s ease-in-out infinite' : undefined,
            animationDelay: `${i * 0.3}s`,
          }}>★</span>
        ))}
      </div>
    </div>
  );
}
```

### DoD Step 5
- [ ] Cards render adjacent to each island
- [ ] Card shows correct unit title, lesson count, stars
- [ ] cardSlide animation on appear
- [ ] Stars are filled/empty correctly from real data

---
## STEP 6 — MapMascot (Floating Characters)

```jsx
// MapMascot.jsx
// Mascot PNG offsets from island center
const MASC