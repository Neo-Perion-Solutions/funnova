# 🌱 Plant or Animal? - Complete Implementation Guide

## ✅ What's Been Built

### 1. **Game Files Created**
- `client/src/features/games/plant-or-animal/PlantOrAnimalGame.jsx` - Main game orchestrator
- `client/src/features/games/plant-or-animal/GameLoginScreen.jsx` - Student login & avatar selection
- `client/src/features/games/plant-or-animal/GameLevelIntroScreen.jsx` - Level preview screen
- `client/src/features/games/plant-or-animal/GamePlayScreen.jsx` - Gameplay with HUD, timer, scoring
- `client/src/features/games/plant-or-animal/GameResultsScreen.jsx` - Results with star ratings
- `client/src/data/plantOrAnimalQuestions.js` - Question data for 3 levels + utilities
- `client/src/services/game.service.js` - API calls to save scores
- `client/src/components/dashboard/PlantOrAnimalGameCard.jsx` - Dashboard card to launch game

### 2. **Backend Integration**
- Added `/api/games/scores/save` endpoint to save game scores
- Updated `game.controller.js` with `saveGameScore()` function
- Game auto-creates itself on first score save (no manual setup needed)
- Scores persist to `game_scores` table

### 3. **Frontend Routes**
- Added `/game/plant-or-animal` route in `App.jsx`
- Integrated as a PrivateRoute (requires student login)
- Added game card to `DashboardPage` 

### 4. **Database Support**
- Created migration: `server/migrations/001_add_plant_or_animal_game.sql`
- Games table now supports `lesson_id = NULL` for standalone games
- Scores tracked per student-game pair

---

## 🎮 Game Features

### **3 Progressive Levels**
1. **🌱 Level 1: Clear Examples** (5 questions, no timer)
   - Easy: Oak Tree, Cat, Sunflower, Dog, Palm Tree, Duck, Rose, Cow

2. **🌿 Level 2: Mixed Objects** (6 questions, no timer)
   - Medium: Cactus, Elephant, Mushroom, Butterfly, Fern, Turtle, Wheat, Fox, Bamboo, Frog

3. **⚡ Level 3: Speed Challenge!** (6 questions, 10-second timer per question)
   - Hard: Hibiscus, Shark, Clover, Eagle, Seaweed, Lizard, Lotus, Octopus, Aloe Vera, Crab

### **Scoring System**
- +10 points per correct answer
- Streak tracking (consecutive correct answers)
- Best streak recorded per session
- Accuracy calculation: (correct ÷ total) × 100
- Star rating:
  - ⭐⭐⭐ = 85%+ accuracy (3 stars)
  - ⭐⭐ = 60-84% accuracy (2 stars)
  - ⭐ = <60% accuracy (1 star)

### **UI/UX Elements**
- ✅ Mobile-responsive design (works on tablets & phones)
- ✅ Smooth transitions (0.3s fade + spring animations)
- ✅ HUD bar: Player avatar + name | Score | Streak | Timer (Level 3)
- ✅ Progress dots: Green (correct), Red (wrong), Yellow (current)
- ✅ Emoji feedback: "🎉 Great job!", "❌ Oops!", "⏰ Too slow!"
- ✅ Celebration confetti on level complete
- ✅ Answer buttons with 44px+ tap target (mobile-friendly)
- ✅ Green garden gradient background
- ✅ Nunito font (rounded, kid-friendly)

---

## 🚀 How to Run

### **Option 1: Automatic Setup (Recommended)**
1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. The game will auto-create itself on first score save

3. Start the client:
   ```bash
   cd client
   npm run dev
   ```

4. Navigate to `http://localhost:5173`
5. Login as a student
6. Click the "Plant or Animal?" card on dashboard

### **Option 2: Manual Database Setup (If needed)**
1. Run the migration script:
   ```bash
   cd server
   node run-migration-plant-or-animal.js
   ```

2. This will:
   - Make `lesson_id` nullable in games table
   - Create the "Plant or Animal?" game record

---

## 🎯 Flow Diagram

```
Dashboard 
  ↓
Click "Plant or Animal?" Card
  ↓
Game Login Screen (Enter Name + Pick Avatar)
  ↓
Level Selection (e.g., Level 1: "Clear Examples")
  ↓
Level Intro Screen (Show rules + difficulty)
  ↓
Gameplay Screen (HUD + Questions + Timer [L3 only])
  ↓
Results Screen (Stars + Score + Accuracy + Buttons)
  ↓
[Replay] or [Next Level] or [Back to Dashboard]
```

---

## 📊 Data Flow

### **Scoring API**
```
POST /api/games/scores/save
{
  "student_id": 123,
  "game_id": "plant-animal-grade3", // Auto-creates if string
  "total_score": 50,
  "accuracy_pct": 83,
  "level": 1,
  "correct": 5,
  "total": 6,
  "streak": 5
}

Response:
{
  "success": true,
  "message": "Game score saved",
  "data": {
    "id": 1,
    "student_id": 123,
    "game_id": 1,
    "total_score": 50,
    "accuracy_pct": 83,
    "played_at": "2026-04-28T12:00:00Z"
  }
}
```

---

## 🔧 Customization

### **Change Question Data**
Edit `client/src/data/plantOrAnimalQuestions.js`:
```javascript
export const GAME_LEVELS = {
  1: {
    title: '🌱 Clear Examples',
    totalQuestions: 5,
    questions: [
      { id: 1, name: 'Oak Tree', emoji: '🌳', answer: 'plant' },
      // Add more...
    ]
  }
}
```

### **Change Feedback Messages**
Edit in `plantOrAnimalQuestions.js`:
```javascript
export const FEEDBACK_MESSAGES = {
  correct: ['🎉 Great job!', '⭐ Correct!', ...],
  wrong: (answer) => `❌ Oops! It was a ${answer}!`,
  timeout: (answer) => `⏰ Too slow! It was a ${answer}!`
}
```

### **Change Colors**
Edit component files:
- Primary color: `#1D9E75` (emerald-600)
- Background: `from-emerald-200 via-green-100 to-emerald-100`
- Modify Tailwind classes in components

### **Add/Remove Levels**
Update `GAME_LEVELS` object and `PlantOrAnimalGame.jsx` level logic

---

## 🐛 Troubleshooting

### **"Login failed" error**
- Ensure student is logged in before accessing `/game/plant-or-animal`
- Check `/student/login` page works first

### **Scores not saving**
- Verify `/api/games/scores/save` endpoint is accessible
- Check browser console for API errors
- Ensure `student_id` is present in request

### **Game UI looks off**
- Clear browser cache
- Check that Tailwind CSS is loaded (`npm run dev` auto-includes it)
- Verify screen width is >320px for mobile responsiveness

### **Timer not working (Level 3)**
- Ensure `level.timer` is set to 10 in questions.js
- Check that GamePlayScreen receives correct level data
- Browser tab must be active (browsers throttle timers in background)

---

## 📦 Dependencies Used

- **React 18.2** - UI framework
- **Framer Motion 12.38** - Animations & transitions
- **React Router v6** - Routing
- **Tailwind CSS 4.2** - Styling
- **Axios 1.6** - API calls
- **Zustand** - State management (for auth)

---

## ✨ Features Implemented

- ✅ Multi-level gameplay (3 levels with progression)
- ✅ Progressive difficulty scaling
- ✅ Timer system (Level 3 only)
- ✅ Streak tracking & best streak
- ✅ Accuracy calculation & star ratings
- ✅ Persistent scoring to database
- ✅ Mobile-responsive design
- ✅ Smooth animations & transitions
- ✅ Automatic game creation on first play
- ✅ Avatar system with 6 emoji options
- ✅ Randomized questions per play
- ✅ Session-level score tracking
- ✅ Result celebration with confetti

---

## 🎓 Grade 3 Science Alignment

- **Subject**: Grade 3 Science — Unit 1: World Around Us
- **Brand**: FunNova Science
- **Age Group**: 7–9 years
- **Learning Objective**: Classify living things as plants or animals
- **Engagement**: Gamified with points, streaks, stars, and celebration animations

---

## 📝 Notes

- Questions shuffle randomly on each play (no repetition)
- Timer automatically triggers "timeout" if reaches 0
- Scores update using GREATEST() to keep best score per level
- Questions are validated before save (ensures data integrity)
- Game is fully offline-capable (works without API on initial load)

---

**Built with ❤️ for FunNova Science students!** 🌱🐾
