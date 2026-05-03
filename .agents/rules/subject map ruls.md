---
trigger: always_on
---

# 📋 Subject Adventure Map — Rules

> Frontend only. These rules protect backend integrity and ensure  
> visual consistency. Every component must follow all rules below.

---

## 🔴 ABSOLUTE RULES (Never Break)

### RULE 1 — Zero Backend Changes
- ❌ Never modify any file in `/api/`, `/routes/`, `/controllers/`, `/models/`
- ❌ Never change any existing hooks (`useSubject`, `useLessons`, etc.)
- ❌ Never add new API endpoints or params to existing ones
- ❌ Never change store actions (Redux/Zustand)
- ✅ Read existing data as-is and display it differently

### RULE 2 — Existing Click Handlers Stay Intact
- The `handleUnitClick` function in `SubjectPage.jsx` must NOT be rewritten
- Map components call `onUnitClick(unit)` → this prop is the existing handler
- Only the toast for locked islands is new — all routing logic already exists

### RULE 3 — GPU-Only Animations
- ✅ Only animate `transform` and `opacity`
- ❌ Never animate `top`, `left`, `width`, `height`, `margin`, `padding`, `background`
- Add `will-change: transform` to every animated element

### RULE 4 — Respect Reduced Motion
```css
/* MUST be in adventure-map.css */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

### RULE 5 — Islands Are `<button>` Elements
- ❌ Never use `<div onClick>` for islands
- ✅ Always `<button>` with `aria-label` and `aria-disabled` for locked

### RULE 6 — Mobile Is Vertical Layout, Not Scaled Map
- ❌ Never use `transform: scale(0.5)` to shrink map on small screens
- ✅ Use `VerticalJourneyMap` component below 768px breakpoint
- ❌ Never show the 2D map on mobile — it causes unclickable tiny hit areas

---

## 🟡 VISUAL RULES

### RULE 7 — Island State = Fixed Visual Language
| State | Color | Icon | Label |
|-------|-------|------|-------|
| completed | `#4CAF50` (green) | ⭐ | Done! |
| in_progress | `#7C3AED` (purple) | ✦ | Play! |
| locked | `#9E9E9E` (grey) | 🔒 | Locked |

- ❌ Never use other colours for island states

### RULE 8 — No Hardcoded Hex in JSX
- ✅ Always use CSS variables: `var(--island-done)`, `var(--island-active)`, `var(--island-locked)`
- ❌ No `#4CAF50` directly in component JSX or inline styles

### RULE 9 — Stars Reflect Real API Data
- Stars filled = `unit.starsEarned` (from existing API)
- Max stars = `unit.maxStars` or default 3
- ❌ Never hardcode star counts

### RULE 10 — Lesson Count Format
- Always: `{lessonsCompleted} / {totalLessons} Lessons Completed`
- ❌ Never show percentage only
- ❌ Never show `0 / 0` — show "Loading..." if data missing

---

## 🟢 COMPONENT RULES

### RULE 11 — Locked Island = Toast Only
```
locked → toast("Complete Unit X to unlock! 🔒") → return
```
- ❌ Never navigate to a locked unit
- ❌ Never hide locked islands — always render them in locked state

### RULE 12 — Mascots Don't Block Islands
- Mascot images: `pointer-events: none`
- Mascots positioned ≥ 20px away from island circle edge
- ❌ Never place mascot on top of the island number

### RULE 13 — Path Must Connect All Islands
- SVG path must pass within 40px of each island center
- If you add/remove islands, recalculate path coordinates
- ❌ Never leave an island visually disconnected from the path

### RULE 14 — Map Canvas Minimum Height
- Desktop: `min-height: 640px`
- ❌ Never let canvas collapse below 640px on desktop

### RULE 15 — Mobile Tap Targets ≥ 60px
- Island button: minimum `60px × 60px` on mobile
- ❌ Never make tap targets smaller

### RULE 16 — Mobile Cards Always Visible
- On mobile: UnitInfoCard renders unconditionally
- ❌ Never use hover-only logic on mobile
- Use: `isMobile ? <AlwaysVisible /> : <HoverTriggered />`

### RULE 17 — Footer Clearance on Mobile
- `VerticalJourneyMap` must have `padding-bottom: 80px`
- ❌ Never let footer nav cover the last island or bottom banner

---

## 🔵 ANIMATION RULES

### RULE 18 — Animation Only on Changed States
- `bounce` → ONLY active/in_progress islands
- `float` → ONLY mascot images
- `sparkle` → ONLY filled star icons on completed islands
- ❌ Never apply bounce to completed or locked islands

### RULE 19 — Island Reveal Is Always Staggered
```css
island-1: animation-delay: 0.2s
island-2: animation-delay: 0.4s
island-3: animation-delay: 0.6s
island-4: animation-delay: 0.8s
island-5: animation-delay: 1.0s
```
- ❌ Never reveal all islands simultaneously

### RULE 20 — Path Draws on Load, Once
- `pathReveal` animation plays ONCE on page mount
- ❌ Never loop the path draw animation

---

## 🚫 GLOBAL PROHIBITIONS TABLE

| ❌ Prohibited | ✅ Correct Alternative |
|---|---|
| Edit any API file or hook | Consume existing data as-is |
| Rewrite `handleUnitClick` | Pass it as `onUnitClick` prop |
| `<div onClick>` for islands | `<button>` with `aria-label` |
| `transform: scale()` for mobile | Switch to `VerticalJourneyMap` |
| Navigate on locked island click | `toast()` only, then return |
| Animate `top/left/width` | Animate `transform/opacity` only |
| Hardcoded hex in JSX | CSS variables always |
| Hardcoded star or lesson counts | Always use API values |
| Show empty map during load | Show `MapLoadingSkeleton` |
| `alert()` for any user message | `react-hot-toast` |

---

*Rules — FUNNOVA Frontend | Neo Perion Solutions | Enforce on every PR*