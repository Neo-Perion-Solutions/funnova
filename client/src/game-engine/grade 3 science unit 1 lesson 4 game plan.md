# FunNova Science — "Water Use Game" 💧
## Complete Implementation Guide

> **Brand:** FunNova Science | **Subject:** Grade 3 Science | **Unit 1:** World Around Us  
> **Game:** Water Use Game | **Target Age:** 7–9 years

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Options](#2-tech-stack-options)
3. [Folder Structure](#3-folder-structure)
4. [Game Screens & Flow](#4-game-screens--flow)
5. [Step-by-Step Implementation](#5-step-by-step-implementation)
   - Step 1: Project Setup
   - Step 2: Login Screen
   - Step 3: Level Intro Screen
   - Step 4: Gameplay Screen (Single Select)
   - Step 5: Gameplay Screen (Multi Select — Level 3)
   - Step 6: Timer Logic
   - Step 7: Scoring & Streak System
   - Step 8: Final Dashboard
6. [Question Data Structure](#6-question-data-structure)
7. [Levels & Difficulty](#7-levels--difficulty)
8. [UI/UX Design Specs](#8-uiux-design-specs)
9. [Water Drop Animation](#9-water-drop-animation)
10. [Sound & Feedback System](#10-sound--feedback-system)
11. [Scoring Formula](#11-scoring-formula)
12. [Key Difference from Game 1](#12-key-difference-from-game-1)
13. [Deployment Options](#13-deployment-options)
14. [Antigravity Prompt](#14-antigravity-prompt)

---

## 1. Project Overview

**Goal:** Build a browser-based educational game where Grade 3 students identify **where water is used in daily life** by selecting correct scenarios from a set of options.

**Core Features:**
- Student login with name + avatar
- 3 progressive difficulty levels
- Level 1 & 2: single correct answer tap
- Level 3: **multi-select** (pick all correct uses) + 15-second timer
- Water-themed UI with animated water drops
- Splash sound on correct answer
- Streak counter and +10 score per correct answer
- Final dashboard with stars, accuracy %, best streak

**What makes this game different from Game 1:**
- Level 3 requires selecting **multiple correct answers** before submitting
- Scenarios shown as scene cards (not just a name + emoji)
- Water drop animation runs in the background throughout gameplay

---

## 2. Tech Stack Options

| Option | Technology | Best For | Difficulty |
|--------|-----------|----------|------------|
| **A — Instant Web** | Pure HTML + CSS + JS | Quick prototype | ⭐ Easy |
| **B — React App** | React + Vite + Tailwind | Scalable, reusable | ⭐⭐ Medium |
| **C — Mobile App** | React Native / Expo | iOS + Android | ⭐⭐⭐ Medium-Hard |

**Recommended:** Option B (React + Vite) — same stack as Game 1, fully reusable components.

---

## 3. Folder Structure

```
funnova-science/
├── public/
│   ├── sounds/
│   │   ├── splash.mp3          ← water splash on correct
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   └── cheer.mp3
│   └── images/
│       └── scenarios/
│           ├── drinking.png
│           ├── cooking.png
│           ├── cleaning.png
│           ├── watering_plants.png
│           ├── bathing.png
│           └── playing_games.png
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx       ← reused from Game 1
│   │   ├── LevelIntro.jsx        ← reused from Game 1
│   │   ├── WaterGamePlay.jsx     ← NEW: single + multi select
│   │   ├── Dashboard.jsx         ← reused from Game 1
│   │   ├── WaterDrops.jsx        ← NEW: animated background
│   │   └── TimerBar.jsx          ← NEW: horizontal timer bar
│   ├── data/
│   │   └── waterQuestions.js     ← NEW: water use question data
│   ├── hooks/
│   │   └── useGameState.js
│   ├── utils/
│   │   └── sounds.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 4. Game Screens & Flow

```
[LOGIN SCREEN]
     ↓  (Enter name + pick avatar + tap Start)
[LEVEL INTRO]  💧 "Obvious Uses"
     ↓
[GAMEPLAY — Single Select, No Timer]   ← Level 1
     ↓
[DASHBOARD]  → Next Level
     ↓
[LEVEL INTRO]  💧 "Mixed Choices"
     ↓
[GAMEPLAY — Single Select, No Timer]   ← Level 2
     ↓
[DASHBOARD]  → Next Level
     ↓
[LEVEL INTRO]  ⚡ "Multi-Select + Timer"
     ↓
[GAMEPLAY — Multi Select + 15s Timer]  ← Level 3
     ↓
[FINAL DASHBOARD]  🏆
```

---

## 5. Step-by-Step Implementation

### Step 1: Project Setup

```bash
# If starting fresh
npm create vite@latest funnova-science -- --template react
cd funnova-science
npm install

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Animations
npm install framer-motion

# Sounds
npm install howler
```

Add Nunito font in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

---

### Step 2: Login Screen

Reuse `LoginScreen.jsx` from Game 1 — identical component, just pass a different `gameName` prop:

```jsx
<LoginScreen
  gameName="💧 Water Use Game"
  subtitle="Grade 3 · Unit 1 · Uses of Water"
  bgFrom="#bfdbfe"
  bgTo="#e0f2fe"
  onStart={handleStart}
/>
```

---

### Step 3: Level Intro Screen

Reuse `LevelIntro.jsx` from Game 1 with water-themed content:

```jsx
const LEVEL_INFO = [
  { icon: "💧", title: "Level 1 — Obvious Uses",     desc: "Find the clear water uses!"         },
  { icon: "🌊", title: "Level 2 — Mixed Choices",    desc: "Some tricky ones in the mix!"       },
  { icon: "⚡", title: "Level 3 — Multi-Select!",    desc: "Pick ALL correct uses. Timer on!"   },
];
```

---

### Step 4: Gameplay Screen — Single Select (Levels 1 & 2)

**File:** `src/components/WaterGamePlay.jsx`

```jsx
import { useState, useEffect, useRef } from "react";
import WaterDrops from "./WaterDrops";

export default function WaterGamePlay({ questions, level, player, onLevelEnd }) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);     // for single select
  const [multiSelected, setMultiSelected] = useState([]); // for multi select
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  const q = questions[qi];
  const isMultiLevel = level === 2;       // Level 3 (index 2)
  const isTimerLevel = level === 2;

  useEffect(() => {
    if (!isTimerLevel || answered) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qi, answered]);

  const handleTimeout = () => {
    setFeedback("⏰ Time's up! Try again!");
    setStreak(0);
    setTotal(t => t + 1);
    setAnswered(true);
    setTimeout(nextQ, 1500);
  };

  // Single select answer (Levels 1 & 2)
  const handleSingleAnswer = (option) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(option.id);
    setAnswered(true);
    const isCorrect = option.isWater === true;
    processResult(isCorrect);
    setTimeout(nextQ, 1200);
  };

  // Multi select toggle (Level 3)
  const toggleMulti = (id) => {
    if (answered) return;
    setMultiSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Submit multi-select answer
  const handleMultiSubmit = () => {
    if (answered || multiSelected.length === 0) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    const correctIds = q.options.filter(o => o.isWater).map(o => o.id);
    const isAllCorrect =
      correctIds.length === multiSelected.length &&
      correctIds.every(id => multiSelected.includes(id));
    processResult(isAllCorrect);
    setTimeout(nextQ, 1400);
  };

  const processResult = (isCorrect) => {
    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; });
      setCorrect(c => c + 1);
      setFeedback(["💧 Awesome!", "🌊 Correct!", "⭐ Great job!", "🎉 Yes!"][Math.floor(Math.random()*4)]);
    } else {
      setStreak(0);
      setFeedback("❌ Not quite! Try the next one.");
    }
    setTotal(t => t + 1);
  };

  const nextQ = () => {
    if (qi + 1 >= questions.length) {
      onLevelEnd({ score, correct, total: total + 1, bestStreak });
      return;
    }
    setQi(i => i + 1);
    setFeedback(""); setSelected(null);
    setMultiSelected([]); setAnswered(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 p-5 overflow-hidden">
      
      {/* Animated water drops background */}
      <WaterDrops />

      {/* HUD */}
      <div className="relative z-10 flex justify-between items-center bg-white/60 rounded-2xl px-4 py-2 mb-3 text-sm font-semibold text-blue-900">
        <span>{player.avatar} {player.name}</span>
        <span>⭐ {score}</span>
        <span>🔥 {streak}</span>
        {isTimerLevel && (
          <span className={`font-bold ${timeLeft <= 4 ? "text-red-500" : "text-blue-600"}`}>⏱ {timeLeft}s</span>
        )}
      </div>

      {/* Timer Bar (Level 3) */}
      {isTimerLevel && (
        <div className="relative z-10 h-3 bg-white/40 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>
      )}

      {/* Progress Dots */}
      <div className="relative z-10 flex gap-2 justify-center mb-3">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors
            ${i < qi ? "bg-blue-500" : i === qi ? "bg-yellow-400" : "bg-white/40"}`} />
        ))}
      </div>

      {/* Question */}
      <div className="relative z-10 bg-white rounded-3xl p-5 text-center mb-4 shadow-md">
        <p className="text-gray-400 text-sm mb-1">Where do we use water?</p>
        <p className="text-2xl font-bold text-blue-900 mb-2">{q.question}</p>
        <span className="text-6xl">{q.emoji}</span>
      </div>

      {/* Feedback */}
      <p className="relative z-10 text-center text-lg font-semibold text-blue-800 h-7 mb-3">{feedback}</p>

      {/* Options Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
        {q.options.map(opt => {
          let cls = "bg-white border-2 border-blue-100 text-blue-800";
          if (answered) {
            if (opt.isWater) cls = "bg-green-100 border-green-400 text-green-800";
            else if (isMultiLevel ? multiSelected.includes(opt.id) : selected === opt.id)
              cls = "bg-red-100 border-red-400 text-red-800";
          } else if (isMultiLevel && multiSelected.includes(opt.id)) {
            cls = "bg-blue-100 border-blue-500 text-blue-900";
          }
          return (
            <button
              key={opt.id}
              onClick={() => isMultiLevel ? toggleMulti(opt.id) : handleSingleAnswer(opt)}
              disabled={answered}
              className={`${cls} rounded-2xl p-3 flex flex-col items-center gap-1 font-semibold transition-transform active:scale-95 disabled:cursor-default`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="text-sm">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Submit button for multi-select */}
      {isMultiLevel && !answered && (
        <div className="relative z-10 text-center">
          <button
            onClick={handleMultiSubmit}
            disabled={multiSelected.length === 0}
            className="bg-blue-600 text-white font-bold px-10 py-3 rounded-full disabled:opacity-40 active:scale-95"
          >
            ✅ Submit Answers
          </button>
        </div>
      )}

      <p className="relative z-10 text-center text-sm text-blue-700 mt-3">
        Level {level+1} · Q {qi+1}/{questions.length}
        {isMultiLevel && !answered && " · Select all correct uses"}
      </p>
    </div>
  );
}
```

---

### Step 5: Water Drop Animation Component

**File:** `src/components/WaterDrops.jsx`

```jsx
import { useEffect, useRef } from "react";

export default function WaterDrops() {
  const drops = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 3}s`,
    size: `${16 + Math.random() * 20}px`,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {drops.map(d => (
        <div
          key={d.id}
          className="absolute animate-bounce"
          style={{
            left: d.left,
            top: "-20px",
            fontSize: d.size,
            opacity: d.opacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          💧
        </div>
      ))}
    </div>
  );
}
```

Add custom animation in `tailwind.config.js`:
```javascript
extend: {
  animation: {
    "fall": "fall linear infinite",
  },
  keyframes: {
    fall: {
      "0%":   { transform: "translateY(-20px)", opacity: 0 },
      "10%":  { opacity: 1 },
      "90%":  { opacity: 1 },
      "100%": { transform: "translateY(100vh)", opacity: 0 },
    }
  }
}
```

---

### Step 6: Timer Logic

```javascript
// Level 3 timer — 15 seconds per question (multi-select needs more time)
useEffect(() => {
  if (level !== 2 || answered) return;
  setTimeLeft(15);
  const interval = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) { clearInterval(interval); handleTimeout(); return 0; }
      return t - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [qi]);
```

**Visual timer bar** — shrinks from full width to zero over 15 seconds:
```jsx
<div style={{ width: `${(timeLeft / 15) * 100}%` }}
  className="h-3 bg-blue-500 rounded-full transition-all duration-1000" />
```

---

### Step 7: Scoring & Streak System

```javascript
// Single select (Levels 1 & 2): correct if option.isWater === true
const isCorrect = selectedOption.isWater === true;

// Multi select (Level 3): ALL correct options must be selected, nothing extra
const correctIds = q.options.filter(o => o.isWater).map(o => o.id);
const isAllCorrect =
  correctIds.length === multiSelected.length &&
  correctIds.every(id => multiSelected.includes(id));

// Score & streak (same as Game 1)
if (isCorrect) {
  score += 10;
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  correct += 1;
} else {
  streak = 0;
}
total += 1;
```

---

### Step 8: Final Dashboard

Reuse `Dashboard.jsx` from Game 1 — pass the same props:
```jsx
<Dashboard
  player={player}
  score={score}
  correct={correct}
  total={total}
  bestStreak={bestStreak}
  level={level}
  totalLevels={3}
  onReplay={replay}
  onNext={nextLevel}
/>
```

---

## 6. Question Data Structure

**File:** `src/data/waterQuestions.js`

```javascript
// Each question has:
// - question: the text prompt shown
// - emoji: scene emoji shown large
// - options: array of 4 choices, each with isWater boolean
// - For Level 3: multiple options have isWater=true

export const WATER_QUESTIONS = {

  // LEVEL 1 — Obvious uses, 1 correct answer each
  easy: [
    {
      id: 1, question: "Which activity uses water?", emoji: "🤔",
      options: [
        { id:"a", emoji:"🥤", label:"Drinking water",   isWater: true  },
        { id:"b", emoji:"📚", label:"Reading a book",   isWater: false },
        { id:"c", emoji:"🎮", label:"Playing video games", isWater: false },
        { id:"d", emoji:"✏️", label:"Drawing a picture", isWater: false },
      ]
    },
    {
      id: 2, question: "Where is water used at home?", emoji: "🏠",
      options: [
        { id:"a", emoji:"🛁", label:"Taking a bath",    isWater: true  },
        { id:"b", emoji:"📺", label:"Watching TV",      isWater: false },
        { id:"c", emoji:"🛋️", label:"Sitting on sofa",  isWater: false },
        { id:"d", emoji:"🎵", label:"Listening to music", isWater: false },
      ]
    },
    {
      id: 3, question: "Which needs water to work?", emoji: "🌿",
      options: [
        { id:"a", emoji:"🌱", label:"Watering plants",  isWater: true  },
        { id:"b", emoji:"🖍️", label:"Coloring with crayons", isWater: false },
        { id:"c", emoji:"⚽", label:"Kicking a ball",   isWater: false },
        { id:"d", emoji:"🎨", label:"Finger painting",  isWater: false },
      ]
    },
    {
      id: 4, question: "What uses water to clean?", emoji: "🧼",
      options: [
        { id:"a", emoji:"🧺", label:"Washing clothes",  isWater: true  },
        { id:"b", emoji:"🧸", label:"Playing with toys", isWater: false },
        { id:"c", emoji:"📖", label:"Story time",       isWater: false },
        { id:"d", emoji:"🏃", label:"Running outside",  isWater: false },
      ]
    },
    {
      id: 5, question: "Which meal needs water?", emoji: "🍽️",
      options: [
        { id:"a", emoji:"🍲", label:"Cooking soup",     isWater: true  },
        { id:"b", emoji:"🍎", label:"Eating an apple",  isWater: false },
        { id:"c", emoji:"🥪", label:"Making a sandwich", isWater: false },
        { id:"d", emoji:"🍌", label:"Peeling a banana", isWater: false },
      ]
    },
    {
      id: 6, question: "What uses water outside?", emoji: "🌳",
      options: [
        { id:"a", emoji:"🚿", label:"Garden sprinkler", isWater: true  },
        { id:"b", emoji:"🌲", label:"Climbing a tree",  isWater: false },
        { id:"c", emoji:"🪁", label:"Flying a kite",    isWater: false },
        { id:"d", emoji:"🏕️", label:"Camping",          isWater: false },
      ]
    },
  ],

  // LEVEL 2 — Mixed correct/incorrect, 1 correct answer each
  mixed: [
    {
      id: 7, question: "Which activity uses water?", emoji: "🤔",
      options: [
        { id:"a", emoji:"🦷", label:"Brushing teeth",   isWater: true  },
        { id:"b", emoji:"🎯", label:"Playing darts",    isWater: false },
        { id:"c", emoji:"🧩", label:"Doing a puzzle",   isWater: false },
        { id:"d", emoji:"🎲", label:"Board games",      isWater: false },
      ]
    },
    {
      id: 8, question: "What do farmers use water for?", emoji: "🌾",
      options: [
        { id:"a", emoji:"🚜", label:"Driving a tractor", isWater: false },
        { id:"b", emoji:"🌽", label:"Watering crops",   isWater: true  },
        { id:"c", emoji:"🏚️", label:"Building a barn",  isWater: false },
        { id:"d", emoji:"🐄", label:"Feeding hay",      isWater: false },
      ]
    },
    {
      id: 9, question: "Which uses water to clean?", emoji: "🧹",
      options: [
        { id:"a", emoji:"🧹", label:"Sweeping floor",   isWater: false },
        { id:"b", emoji:"🚗", label:"Washing a car",    isWater: true  },
        { id:"c", emoji:"🧹", label:"Dusting shelves",  isWater: false },
        { id:"d", emoji:"📦", label:"Packing boxes",    isWater: false },
      ]
    },
    {
      id: 10, question: "What animal needs water daily?", emoji: "🐾",
      options: [
        { id:"a", emoji:"🐠", label:"Fish in a tank",   isWater: true  },
        { id:"b", emoji:"🐦", label:"Bird in a cage",   isWater: false },
        { id:"c", emoji:"🐱", label:"Cat sleeping",     isWater: false },
        { id:"d", emoji:"🐇", label:"Rabbit eating",    isWater: false },
      ]
    },
    {
      id: 11, question: "Where is water NOT used?", emoji: "❌",
      options: [
        { id:"a", emoji:"🎸", label:"Playing guitar",   isWater: false },  // correct (NOT water)
        { id:"b", emoji:"🫧",  label:"Making bubbles",  isWater: true  },
        { id:"c", emoji:"🚿", label:"Showering",        isWater: true  },
        { id:"d", emoji:"🍵", label:"Making tea",       isWater: true  },
      ]
      // NOTE: for "NOT used" questions, isWater=false is the correct answer
      // Adjust handleSingleAnswer: correct if isWater === false
    },
    {
      id: 12, question: "Which sport uses the most water?", emoji: "🏊",
      options: [
        { id:"a", emoji:"⚽", label:"Football",         isWater: false },
        { id:"b", emoji:"🏊", label:"Swimming",         isWater: true  },
        { id:"c", emoji:"🏏", label:"Cricket",          isWater: false },
        { id:"d", emoji:"🎾", label:"Tennis",           isWater: false },
      ]
    },
  ],

  // LEVEL 3 — Multi-select: pick ALL correct water uses
  tricky: [
    {
      id: 13, question: "Select ALL uses of water:", emoji: "💧",
      options: [
        { id:"a", emoji:"🥤", label:"Drinking",         isWater: true  },
        { id:"b", emoji:"🧼", label:"Washing hands",    isWater: true  },
        { id:"c", emoji:"🎮", label:"Gaming",           isWater: false },
        { id:"d", emoji:"🌱", label:"Growing plants",   isWater: true  },
      ]
    },
    {
      id: 14, question: "Pick ALL activities needing water:", emoji: "🌊",
      options: [
        { id:"a", emoji:"🍲", label:"Cooking food",     isWater: true  },
        { id:"b", emoji:"🏊", label:"Swimming",         isWater: true  },
        { id:"c", emoji:"📚", label:"Reading",          isWater: false },
        { id:"d", emoji:"🚿", label:"Showering",        isWater: true  },
      ]
    },
    {
      id: 15, question: "Which of these use water?", emoji: "💦",
      options: [
        { id:"a", emoji:"🦷", label:"Brushing teeth",   isWater: true  },
        { id:"b", emoji:"🎵", label:"Singing",          isWater: false },
        { id:"c", emoji:"🚗", label:"Washing a car",    isWater: true  },
        { id:"d", emoji:"🖥️", label:"Using a computer", isWater: false },
      ]
    },
    {
      id: 16, question: "Select ALL water activities:", emoji: "🏄",
      options: [
        { id:"a", emoji:"🎨", label:"Painting",         isWater: false },
        { id:"b", emoji:"🌾", label:"Watering crops",   isWater: true  },
        { id:"c", emoji:"🛁", label:"Taking a bath",    isWater: true  },
        { id:"d", emoji:"🎸", label:"Guitar playing",   isWater: false },
      ]
    },
    {
      id: 17, question: "Pick ALL that need water:", emoji: "🌿",
      options: [
        { id:"a", emoji:"🍵", label:"Making tea",       isWater: true  },
        { id:"b", emoji:"🧺", label:"Doing laundry",    isWater: true  },
        { id:"c", emoji:"🏃", label:"Running",          isWater: false },
        { id:"d", emoji:"🐟", label:"Fish tank",        isWater: true  },
      ]
    },
    {
      id: 18, question: "Which uses water at home?", emoji: "🏠",
      options: [
        { id:"a", emoji:"🧹", label:"Sweeping",         isWater: false },
        { id:"b", emoji:"🚿", label:"Shower",           isWater: true  },
        { id:"c", emoji:"🍝", label:"Boiling pasta",    isWater: true  },
        { id:"d", emoji:"📺", label:"Watching TV",      isWater: false },
      ]
    },
  ]
};

export const LEVEL_CONFIG = [
  { key: "easy",   count: 5,  timer: false, multiSelect: false, label: "Level 1 — Obvious Uses"      },
  { key: "mixed",  count: 6,  timer: false, multiSelect: false, label: "Level 2 — Mixed Choices"     },
  { key: "tricky", count: 5,  timer: true,  multiSelect: true,  label: "Level 3 — Multi-Select!"     },
];
```

---

## 7. Levels & Difficulty

| Level | Mode | Questions | Timer | Correct Answer |
|-------|------|-----------|-------|----------------|
| 1 | Single select | 5 | No | 1 correct option |
| 2 | Single select | 6 | No | 1 correct option (mixed distractors) |
| 3 | Multi-select | 5 | 15 sec | 2–3 correct options, all must be selected |

**Level 3 multi-select rules:**
- Student taps to toggle options (highlighted blue when selected)
- Must tap "Submit Answers" button to confirm
- All correct options AND no wrong options = correct
- Partial credit not given — it's all or nothing per question

---

## 8. UI/UX Design Specs

| Element | Value |
|---------|-------|
| Primary color | `#3B82F6` (water blue) |
| Background | Gradient `#93c5fd → #dbeafe` |
| Card background | `#ffffff` with 20px border radius |
| Font | Nunito (Google Fonts) |
| Button shape | Rounded 2xl (16px) |
| Option grid | 2 columns |
| Correct highlight | `#bbf7d0` green |
| Wrong highlight | `#fecaca` red |
| Selected (multi) | `#bfdbfe` blue |
| Timer bar | Blue → red when <4s remain |
| Water drops | Floating emoji 💧, semi-transparent, z-index 0 |
| Theme | Ocean / water / blue sky |

---

## 9. Water Drop Animation

CSS keyframes for falling water drops:
```css
@keyframes fall {
  0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(110vh) rotate(20deg); opacity: 0; }
}

.water-drop {
  position: absolute;
  animation: fall linear infinite;
  pointer-events: none;
  user-select: none;
  font-size: 20px;
}
```

Generate 12–15 drops with randomized:
- `left` position (0–100%)
- `animation-delay` (0–5s)
- `animation-duration` (3–7s)
- `font-size` (14–28px)
- `opacity` (0.1–0.3)

---

## 10. Sound & Feedback System

```javascript
import { Howl } from "howler";

export const sounds = {
  splash:  new Howl({ src: ["/sounds/splash.mp3"],  volume: 0.7 }),
  correct: new Howl({ src: ["/sounds/correct.mp3"], volume: 0.6 }),
  wrong:   new Howl({ src: ["/sounds/wrong.mp3"],   volume: 0.5 }),
  cheer:   new Howl({ src: ["/sounds/cheer.mp3"],   volume: 0.6 }),
};
// Play splash.mp3 + correct.mp3 together on correct answer
```

**Free sound resources:**
- `splash.mp3` → freesound.org search "water splash"
- `correct.mp3` → freesound.org search "correct ding"
- `wrong.mp3` → freesound.org search "soft wrong buzz"
- `cheer.mp3` → freesound.org search "kids cheer"

**Feedback messages:**

| Event | Sound | Message |
|-------|-------|---------|
| Correct | splash + correct | "💧 Awesome!" / "🌊 Correct!" / "⭐ Great job!" |
| Wrong | wrong | "❌ Not quite! Try the next one." |
| Timeout | wrong | "⏰ Time's up! Try again!" |
| Level done | cheer | Dashboard shown |

---

## 11. Scoring Formula

```
Per question:
  Correct (single select) = +10 pts
  Correct (multi select, ALL right) = +10 pts
  Wrong or timeout = +0, streak resets

Accuracy % = round((correct / total) × 100)

Stars:
  ★★★  →  Accuracy ≥ 85%
  ★★☆  →  Accuracy ≥ 60%
  ★☆☆  →  Accuracy < 60%

Streak = consecutive correct (resets on wrong/timeout)
Best Streak = max streak reached in the session
```

---

## 12. Key Difference from Game 1

| Feature | Game 1 (Plant or Animal) | Game 2 (Water Use) |
|---------|--------------------------|-------------------|
| Answer type | Always single tap | Single (L1/L2), Multi-select (L3) |
| Options layout | 2 large buttons | 2×2 grid of cards |
| Background | Garden green | Ocean blue with water drops |
| Timer duration | 10 seconds | 15 seconds (multi-select needs more time) |
| Timer visual | Text only | Text + shrinking progress bar |
| Sound theme | Cheer/correct | Water splash + correct |
| Level 3 mechanic | Fast single tap | Select multiple + Submit button |

---

## 13. Deployment Options

### Option A — GitHub Pages (Free)
```bash
npm run build
npx gh-pages -d dist
```

### Option B — Netlify (Free, drag & drop)
```bash
npm run build
# Drag /dist folder to netlify.com/drop
```

### Option C — PWA (works offline on classroom tablets)
```bash
npm install vite-plugin-pwa
# Configure in vite.config.js for offline support
```

---

## 14. Antigravity Prompt

See Section 14 — copy the full prompt below and paste it directly into Antigravity.

---

*End of FunNova Science — Water Use Game Implementation Guide*  
*Version 1.0 | Grade 3 Science Curriculum | Unit 1: World Around Us*