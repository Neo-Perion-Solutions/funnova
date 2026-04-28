# FunNova Science — "Plant or Animal?" Game
## Complete Implementation Guide

> **Brand:** FunNova Science | **Subject:** Grade 3 Science | **Unit 1:** World Around Us  
> **Game:** Plant or Animal | **Target Age:** 7–9 years

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
   - Step 4: Gameplay Screen
   - Step 5: Timer Logic (Level 3)
   - Step 6: Scoring & Streak System
   - Step 7: Final Dashboard
6. [Question Data Structure](#6-question-data-structure)
7. [Levels & Difficulty](#7-levels--difficulty)
8. [UI/UX Design Specs](#8-uiux-design-specs)
9. [Sound & Feedback System](#9-sound--feedback-system)
10. [Scoring Formula](#10-scoring-formula)
11. [How to Extend to All 25 Games](#11-how-to-extend-to-all-25-games)
12. [Deployment Options](#12-deployment-options)
13. [AI Prompt for Claude](#13-ai-prompt-for-claude)

---

## 1. Project Overview

**Goal:** Build a browser-based educational game for Grade 3 students where they identify whether an object is a **Plant** or an **Animal**.

**Core Features:**
- Student login with name + avatar
- 3 progressive difficulty levels
- Tap-to-answer gameplay with image + name display
- Streak counter and +10 score per correct answer
- Timer mode on Level 3
- Final dashboard with stars, accuracy %, and best streak
- Replay and next-level navigation

---

## 2. Tech Stack Options

| Option | Technology | Best For | Difficulty |
|--------|-----------|----------|------------|
| **A — Instant Web** | Pure HTML + CSS + JavaScript | Quick prototype, classroom browser | ⭐ Easy |
| **B — React App** | React + Vite + Tailwind CSS | Scalable, reusable components | ⭐⭐ Medium |
| **C — Mobile App** | React Native / Expo | iOS + Android app store | ⭐⭐⭐ Medium-Hard |
| **D — Game Engine** | Phaser.js (browser) | Rich animations, sprite sheets | ⭐⭐⭐ Hard |

**Recommended for FunNova:** Option B (React + Vite) — easy to host, fast, component-based, and scalable to all 25 games.

---

## 3. Folder Structure

```
funnova-science/
├── public/
│   ├── sounds/
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   └── cheer.mp3
│   └── images/
│       ├── plants/
│       │   ├── oak_tree.png
│       │   ├── sunflower.png
│       │   └── cactus.png
│       └── animals/
│           ├── cat.png
│           ├── dog.png
│           └── elephant.png
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx
│   │   ├── LevelIntro.jsx
│   │   ├── GamePlay.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProgressDots.jsx
│   │   └── TimerRing.jsx
│   ├── data/
│   │   └── questions.js
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
[LEVEL INTRO]
     ↓  (Tap "Let's Go!")
[GAMEPLAY]
     ↓  (Answer all questions in level)
[DASHBOARD]
     ↓  (Tap "Next Level" OR "Replay")
[LEVEL INTRO → GAMEPLAY → DASHBOARD] × 3 levels
     ↓  (All 3 levels complete)
[FINAL TROPHY SCREEN]
```

---

## 5. Step-by-Step Implementation

### Step 1: Project Setup

```bash
# Create React + Vite project
npm create vite@latest funnova-science -- --template react
cd funnova-science
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Optional: Framer Motion for animations
npm install framer-motion

# Optional: Howler.js for sounds
npm install howler
```

**vite.config.js** — no changes needed for basic setup.

**tailwind.config.js:**
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        funnova: {
          green: "#1D9E75",
          dark: "#085041",
          light: "#E1F5EE",
          yellow: "#EF9F27",
        }
      },
      fontFamily: {
        fun: ["Nunito", "sans-serif"]
      }
    }
  }
}
```

Add Nunito font in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

---

### Step 2: Login Screen

**File:** `src/components/LoginScreen.jsx`

```jsx
import { useState } from "react";

const AVATARS = ["🧒", "👧", "🐶", "🦁", "🐸", "🦊"];

export default function LoginScreen({ onStart }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧒");

  const handleStart = () => {
    if (!name.trim()) return alert("Please enter your name!");
    onStart({ name: name.trim(), avatar });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-100 flex flex-col items-center justify-center p-6">
      
      {/* Brand */}
      <p className="text-sm font-semibold text-green-800 tracking-widest mb-1">🌿 FUNNOVA SCIENCE</p>
      <h1 className="text-4xl font-extrabold text-green-900 mb-1">🌱 Plant or Animal?</h1>
      <p className="text-green-700 mb-8">Grade 3 · Unit 1 · World Around Us</p>

      {/* Name Input */}
      <input
        className="w-72 px-5 py-3 rounded-full border-2 border-green-300 text-lg text-green-900 outline-none focus:border-green-500 mb-5"
        placeholder="Enter your name..."
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={20}
      />

      {/* Avatar Selection */}
      <p className="text-green-700 mb-3 font-semibold">Pick your avatar:</p>
      <div className="flex gap-3 mb-8">
        {AVATARS.map(av => (
          <button
            key={av}
            onClick={() => setAvatar(av)}
            className={`text-4xl w-16 h-16 rounded-full bg-white transition-transform
              ${avatar === av ? "ring-4 ring-green-500 scale-110" : "hover:scale-105"}`}
          >
            {av}
          </button>
        ))}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-10 py-4 rounded-full transition-transform active:scale-95"
      >
        🚀 Start Playing!
      </button>
    </div>
  );
}
```

---

### Step 3: Level Intro Screen

**File:** `src/components/LevelIntro.jsx`

```jsx
export default function LevelIntro({ level, onGo }) {
  const info = [
    { icon: "🌱", title: "Level 1 — Clear Examples", desc: "Easy plants and animals to identify!" },
    { icon: "🌿", title: "Level 2 — Mixed Objects", desc: "A mix of tricky items. Stay sharp!" },
    { icon: "⚡", title: "Level 3 — Speed Challenge!", desc: "Timer on! Answer fast or lose points!" },
  ];
  const { icon, title, desc } = info[level];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-100 flex flex-col items-center justify-center p-6 text-center">
      <span className="text-8xl mb-4">{icon}</span>
      <h2 className="text-3xl font-extrabold text-green-900 mb-2">{title}</h2>
      <p className="text-green-700 text-lg mb-10">{desc}</p>
      <button
        onClick={onGo}
        className="bg-green-600 text-white text-xl font-bold px-10 py-4 rounded-full hover:bg-green-700 active:scale-95 transition-transform"
      >
        Let's Go! →
      </button>
    </div>
  );
}
```

---

### Step 4: Gameplay Screen

**File:** `src/components/GamePlay.jsx`

```jsx
import { useState, useEffect, useRef } from "react";

export default function GamePlay({ questions, level, player, onLevelEnd }) {
  const [qi, setQi] = useState(0);               // current question index
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  const q = questions[qi];
  const isTimerLevel = level === 2; // Level 3 (index 2)

  // Timer for Level 3
  useEffect(() => {
    if (!isTimerLevel || answered) return;
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAutoWrong(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qi, answered]);

  const handleAutoWrong = () => {
    setFeedback(`⏰ Too slow! It was a ${q.type}!`);
    setStreak(0);
    setTotal(t => t + 1);
    setAnswered(true);
    setTimeout(nextQuestion, 1400);
  };

  const handleAnswer = (type) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    const isCorrect = q.type === type;

    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(s => s + 10);
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
      setCorrect(c => c + 1);
      setFeedback(["🎉 Great job!", "⭐ Correct!", "🌟 Awesome!", "🎊 Yes!"][Math.floor(Math.random()*4)]);
    } else {
      setStreak(0);
      setFeedback(`❌ Oops! It was a ${q.type}!`);
    }
    setTotal(t => t + 1);
    setTimeout(nextQuestion, 1100);
  };

  const nextQuestion = () => {
    if (qi + 1 >= questions.length) {
      onLevelEnd({ score, correct: correct + (feedback.includes("⭐") || feedback.includes("🎉") || feedback.includes("🌟") || feedback.includes("🎊") ? 0 : 0), total, bestStreak });
      return;
    }
    setQi(i => i + 1);
    setFeedback("");
    setAnswered(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-100 p-5">
      
      {/* HUD */}
      <div className="flex justify-between items-center bg-white/60 rounded-2xl px-4 py-2 mb-3 text-sm font-semibold text-green-900">
        <span>{player.avatar} {player.name}</span>
        <span>⭐ {score}</span>
        <span>🔥 {streak}</span>
        {isTimerLevel && <span className={`font-bold ${timeLeft <= 3 ? "text-red-500" : "text-orange-500"}`}>⏱ {timeLeft}</span>}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 justify-center mb-3">
        {questions.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors
            ${i < qi ? "bg-green-500" : i === qi ? "bg-yellow-400" : "bg-white/40"}`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 text-center mb-5 shadow-md">
        <span className="text-8xl block mb-3">{q.emoji}</span>
        <p className="text-gray-400 text-sm mb-1">What is this?</p>
        <p className="text-3xl font-bold text-green-900">{q.name}</p>
      </div>

      {/* Feedback */}
      <p className="text-center text-xl font-semibold text-green-800 h-8 mb-3">{feedback}</p>

      {/* Answer Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleAnswer("plant")}
          disabled={answered}
          className="flex-1 max-w-[160px] bg-white border-4 border-green-200 hover:bg-green-50 rounded-2xl py-5 flex flex-col items-center gap-2 text-xl font-bold text-green-700 transition-transform active:scale-95 disabled:opacity-60"
        >
          <span className="text-4xl">🌿</span> Plant
        </button>
        <button
          onClick={() => handleAnswer("animal")}
          disabled={answered}
          className="flex-1 max-w-[160px] bg-white border-4 border-blue-200 hover:bg-blue-50 rounded-2xl py-5 flex flex-col items-center gap-2 text-xl font-bold text-blue-700 transition-transform active:scale-95 disabled:opacity-60"
        >
          <span className="text-4xl">🐾</span> Animal
        </button>
      </div>

      <p className="text-center text-sm text-green-700 mt-4">Level {level+1} · Q {qi+1}/{questions.length}</p>
    </div>
  );
}
```

---

### Step 5: Timer Logic (Level 3)

The timer is handled inside `GamePlay.jsx` using `useEffect` + `useRef`. Key rules:

- Timer resets to 10 seconds on every new question
- Timer clears immediately on any tap
- At 0 seconds → `handleAutoWrong()` is called
- Timer text turns red when ≤ 3 seconds remain

---

### Step 6: Scoring & Streak System

```javascript
// Score Rules
const POINTS_PER_CORRECT = 10;

// On correct answer:
score += POINTS_PER_CORRECT;
streak += 1;
bestStreak = Math.max(bestStreak, streak);

// On wrong answer or timeout:
streak = 0;  // streak resets, score stays

// Accuracy calculation (on dashboard):
accuracy = Math.round((correct / total) * 100);
```

---

### Step 7: Final Dashboard

**File:** `src/components/Dashboard.jsx`

```jsx
export default function Dashboard({ player, score, correct, total, bestStreak, level, totalLevels, onReplay, onNext }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;
  const messages = ["Keep trying! 💪", "Good job! 👍", "Amazing work! 🏆"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-100 p-6 text-center">
      
      {/* Player & Stars */}
      <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
        <div className="text-5xl mb-1">{player.avatar}</div>
        <p className="font-bold text-green-900 mb-2">{player.name}</p>
        <div className="text-5xl mb-2">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
        <h2 className="text-2xl font-extrabold text-green-800">{messages[stars - 1]}</h2>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl p-5 mb-6 shadow-md">
        <div className="flex justify-around">
          <div><p className="text-3xl font-extrabold text-green-800">{score}</p><p className="text-sm text-gray-500">Total Score</p></div>
          <div><p className="text-3xl font-extrabold text-green-800">{accuracy}%</p><p className="text-sm text-gray-500">Accuracy</p></div>
          <div><p className="text-3xl font-extrabold text-green-800">{bestStreak}</p><p className="text-sm text-gray-500">Best Streak</p></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button onClick={onReplay} className="bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 active:scale-95">
          🔄 Replay
        </button>
        {level < totalLevels - 1 && (
          <button onClick={onNext} className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-600 active:scale-95">
            Next Level →
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Question Data Structure

**File:** `src/data/questions.js`

```javascript
export const QUESTIONS = {
  easy: [
    { id: 1,  emoji: "🌳", name: "Oak Tree",   type: "plant"  },
    { id: 2,  emoji: "🐱", name: "Cat",         type: "animal" },
    { id: 3,  emoji: "🌻", name: "Sunflower",   type: "plant"  },
    { id: 4,  emoji: "🐶", name: "Dog",          type: "animal" },
    { id: 5,  emoji: "🌴", name: "Palm Tree",   type: "plant"  },
    { id: 6,  emoji: "🦆", name: "Duck",         type: "animal" },
  ],
  mixed: [
    { id: 7,  emoji: "🌵", name: "Cactus",      type: "plant"  },
    { id: 8,  emoji: "🐘", name: "Elephant",    type: "animal" },
    { id: 9,  emoji: "🍄", name: "Mushroom",    type: "plant"  },
    { id: 10, emoji: "🦋", name: "Butterfly",   type: "animal" },
    { id: 11, emoji: "🌿", name: "Fern",         type: "plant"  },
    { id: 12, emoji: "🐢", name: "Turtle",       type: "animal" },
    { id: 13, emoji: "🌾", name: "Wheat",        type: "plant"  },
    { id: 14, emoji: "🦊", name: "Fox",          type: "animal" },
  ],
  tricky: [
    { id: 15, emoji: "🎋", name: "Bamboo",       type: "plant"  },
    { id: 16, emoji: "🦈", name: "Shark",         type: "animal" },
    { id: 17, emoji: "🌺", name: "Hibiscus",     type: "plant"  },
    { id: 18, emoji: "🦅", name: "Eagle",         type: "animal" },
    { id: 19, emoji: "🍀", name: "Clover",        type: "plant"  },
    { id: 20, emoji: "🦎", name: "Lizard",        type: "animal" },
    { id: 21, emoji: "🌹", name: "Rose",          type: "plant"  },
    { id: 22, emoji: "🐙", name: "Octopus",       type: "animal" },
  ]
};

export const LEVEL_CONFIG = [
  { key: "easy",   count: 5, timer: false, label: "Level 1 — Clear Examples"    },
  { key: "mixed",  count: 6, timer: false, label: "Level 2 — Mixed Objects"     },
  { key: "tricky", count: 6, timer: true,  label: "Level 3 — Speed Challenge!"  },
];
```

---

## 7. Levels & Difficulty

| Level | Pool | # Questions | Timer | Pass Score |
|-------|------|-------------|-------|------------|
| 1 | Easy (clear plants/animals) | 5 | No | 30+ |
| 2 | Mixed (some trickier items) | 6 | No | 40+ |
| 3 | Tricky (timer challenge) | 6 | 10 sec each | 40+ |

Questions are randomly shuffled from the pool on each play to prevent memorization.

```javascript
// Shuffle utility
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Get questions for a level
const levelQuestions = shuffle(QUESTIONS[LEVEL_CONFIG[levelIndex].key])
  .slice(0, LEVEL_CONFIG[levelIndex].count);
```

---

## 8. UI/UX Design Specs

| Element | Value |
|---------|-------|
| Primary color | `#1D9E75` (FunNova green) |
| Background | Gradient `#86efac → #dcfce7` |
| Card background | `#ffffff` with 12px border radius |
| Font | Nunito (Google Fonts) |
| Button border radius | 28px (pill shape) |
| Emoji size (question) | 72–80px |
| Answer button size | min 160px wide, 80px tall |
| Minimum tap target | 44×44px (accessibility) |
| Animation | 0.15s ease-in-out scale on hover/tap |
| Theme | Bright garden / nature |

**Color Coding:**
- Plant button → green border `#9FE1CB`
- Animal button → blue border `#B5D4F4`
- Correct highlight → `#C0DD97` (light green)
- Wrong highlight → `#F7C1C1` (light red)
- Timer warning (≤3s) → `#E24B4A` (red)

---

## 9. Sound & Feedback System

**File:** `src/utils/sounds.js`

```javascript
// Using Howler.js
import { Howl } from "howler";

export const sounds = {
  correct: new Howl({ src: ["/sounds/correct.mp3"], volume: 0.7 }),
  wrong:   new Howl({ src: ["/sounds/wrong.mp3"],   volume: 0.5 }),
  cheer:   new Howl({ src: ["/sounds/cheer.mp3"],   volume: 0.6 }),
  tick:    new Howl({ src: ["/sounds/tick.mp3"],    volume: 0.3 }),
};

// Free sound sources:
// correct.mp3 → freesound.org search "correct chime"
// wrong.mp3   → freesound.org search "soft buzz"
// cheer.mp3   → freesound.org search "kids cheer"
// tick.mp3    → freesound.org search "clock tick"
```

**Feedback Messages by result:**

| Event | Sound | Text Message |
|-------|-------|-------------|
| Correct | `correct.mp3` + `cheer.mp3` | "🎉 Great job!" / "⭐ Correct!" / "🌟 Awesome!" |
| Wrong | `wrong.mp3` | "❌ Oops! It was a [type]!" |
| Timeout | `wrong.mp3` | "⏰ Too slow! It was a [type]!" |
| Level complete | `cheer.mp3` | Dashboard shown |

---

## 10. Scoring Formula

```
Total Score = (correct answers × 10)

Accuracy % = round((correct / total) × 100)

Stars:
  ★★★  →  Accuracy ≥ 85%
  ★★☆  →  Accuracy ≥ 60%
  ★☆☆  →  Accuracy < 60%

Streak = consecutive correct answers (resets on wrong/timeout)
Best Streak = highest streak in the session
```

---

## 11. How to Extend to All 25 Games

The architecture above is built to scale. To add a new game (e.g., Game 2 — Water Use):

1. Create a new question file: `src/data/waterUseQuestions.js`
2. Duplicate `GamePlay.jsx` → rename `WaterGamePlay.jsx`
3. Change button labels from "Plant/Animal" to the new categories
4. Add a new route in `App.jsx`:
   ```jsx
   <Route path="/water-use" element={<WaterUseGame />} />
   ```
5. Add the game card to the main hub `GameHub.jsx`

**Shared components to reuse across all 25 games:**
- `LoginScreen.jsx` — same for all games
- `LevelIntro.jsx` — same structure, different text
- `Dashboard.jsx` — same for all games
- `ProgressDots.jsx` — reusable
- `TimerRing.jsx` — reusable
- `sounds.js` — shared sound utilities

---

## 12. Deployment Options

### Option A — GitHub Pages (Free, instant)
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
# Live at: https://yourusername.github.io/funnova-science
```

### Option B — Netlify (Free, drag & drop)
```bash
npm run build
# Drag the /dist folder to netlify.com/drop
# Live in 30 seconds
```

### Option C — Progressive Web App (works offline)
```bash
npm install vite-plugin-pwa
# Add PWA config to vite.config.js
# Students can "Add to Home Screen" on tablets
```

### Option D — React Native (App Store)
```bash
npx create-expo-app funnova-mobile
# Copy game logic from React web version
# Run: npx expo start
```

---

## 13. AI Prompt for Claude

Copy and paste the following prompt into Claude to generate the complete working game code:

---

```
You are an expert React developer building an educational game for Grade 3 students (ages 7–9) for a brand called "FunNova Science".

Build a complete, single-file React component (or full app with separate files) for a game called "Plant or Animal?" based on the following full specification:

---

BRAND: FunNova Science
GAME TITLE: Plant or Animal?
SUBJECT: Grade 3 Science — Unit 1: World Around Us
OBJECTIVE: Help students identify whether an object is a plant or an animal.

---

SCREENS (in order):

1. LOGIN SCREEN
   - Text input for student name
   - Avatar selection row (at least 4 emoji avatars: 🧒 👧 🐶 🦁)
   - "Start Playing!" button
   - Garden/nature background theme (greens)

2. LEVEL INTRO SCREEN
   - Shows level number, title, and description
   - "Let's Go!" button to begin

3. GAMEPLAY SCREEN
   - Top HUD: player avatar + name, score (⭐), streak counter (🔥), timer (Level 3 only)
   - Progress dots row (one dot per question, fills green when correct, red when wrong)
   - Question card: large emoji (72px), label "What is this?", item name below
   - Feedback text line (shows "🎉 Great job!" or "❌ Oops!" after each answer)
   - Two answer buttons: "🌿 Plant" (green border) and "🐾 Animal" (blue border)
   - Level/question counter at bottom

4. FINAL DASHBOARD SCREEN
   - Player avatar + name
   - Star rating (⭐⭐⭐ based on accuracy)
   - Motivational message
   - Stats: Total Score, Accuracy %, Best Streak
   - "🔄 Replay" button
   - "Next Level →" button (hidden on final level)

---

LEVELS:

Level 1 (easy, no timer, 5 questions):
Items: Oak Tree (plant), Cat (animal), Sunflower (plant), Dog (animal), Palm Tree (plant), Duck (animal)

Level 2 (mixed, no timer, 6 questions):
Items: Cactus (plant), Elephant (animal), Mushroom (plant), Butterfly (animal), Fern (plant), Turtle (animal), Wheat (plant), Fox (animal)

Level 3 (tricky, 10-second timer, 6 questions):
Items: Bamboo (plant), Shark (animal), Hibiscus (plant), Eagle (animal), Clover (plant), Lizard (animal), Rose (plant), Octopus (animal)

---

SCORING:
- +10 per correct answer
- Streak counter increments on consecutive correct answers, resets on wrong
- Best streak tracked across level
- Accuracy = (correct / total) × 100
- Stars: ≥85% = 3 stars, ≥60% = 2 stars, <60% = 1 star

TIMER (Level 3 only):
- Each question starts a 10-second countdown
- Timer clears on any tap
- Auto-wrong + feedback message if timer reaches 0
- Timer text turns red when ≤3 seconds

---

UI DESIGN:
- Bright cartoon style, kid-friendly
- Primary color: green (#1D9E75)
- Background: light green gradient
- Font: Nunito or rounded sans-serif
- Large tap targets (min 44px)
- Smooth transitions between screens (fade or slide)
- Answer buttons: pill/rounded shape, green for Plant, blue for Animal
- Correct answer button highlights green, wrong highlights red after each answer
- Questions are randomly shuffled from the pool each play

---

TECHNICAL:
- Use React with useState, useEffect, useRef hooks
- Use Tailwind CSS for styling (or inline styles if single file)
- No external libraries except React
- Component should work standalone in a browser
- If single file: use HTML + vanilla JavaScript
- Include all game logic: shuffle, timer, scoring, screen transitions

---

OUTPUT FORMAT:
Please provide:
1. Complete working code (all files or single file)
2. Instructions to run the project
3. List of any npm packages needed

Make the game feel fun, polished, and encouraging for young students.
```

---

*End of FunNova Science — Plant or Animal Implementation Guide*  
*Version 1.0 | Built for Grade 3 Science Curriculum*