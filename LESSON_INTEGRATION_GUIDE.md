# 🌱 Plant or Animal? - Lesson Integration Update

## 📍 Location Change

**Before:** Standalone game card on student dashboard  
**Now:** Integrated as "Game Challenge" in lesson assessment roadmap

```
Science → Unit 1: World Around Us
  └─ Lesson 1: Plants and their types
      └─ Assessment Roadmap:
          1. 🎯 Multiple Choice (MCQ)
          2. 📝 Fill in the Blanks
          3. ✓/✗ True or False
          4. 🎮 Game Challenge  ← Plant or Animal here!
```

---

## 🎮 How It Works

### **For Students:**

1. Open a lesson (e.g., "Plants and their types")
2. See the Assessment Roadmap with 4 sections
3. Complete MCQ → unlocks Fill Blanks → unlocks True/False → unlocks Game Challenge
4. Click "Plant or Animal?" to launch the game
5. Play through 3 levels (skips login screen - already logged in)
6. Results saved automatically to database

### **For Teachers/Admins:**

1. Lessons automatically show the game challenge if it's registered
2. Student progress tracked per section
3. Scores saved to `game_scores` table for analytics

---

## 🔧 Technical Changes

### **Files Modified:**

```
✅ client/src/features/games/plant-or-animal/
   ├── PlantOrAnimalGame.jsx          (Updated: lesson mode support)
   ├── PlantOrAnimalGameWrapper.jsx   (New: GameEngine wrapper)
   ├── PlantOrAnimalLessonGame.jsx    (New: alternative wrapper)
   └── config.js                      (New: game metadata)

✅ client/src/game-engine/registry/gameRegistry.js
   └── Registered 'plant-or-animal' game

✅ client/src/pages/DashboardPage.jsx
   └── Removed standalone game card

✅ server/controllers/game.controller.js
   └── saveGameScore() auto-creates game records
```

### **Registration:**

Plant or Animal game is registered in GameEngine:
```javascript
registerGame('plant-or-animal', {
  component: PlantOrAnimalGameWrapper,
  config: plantOrAnimalConfig,
});
```

When a lesson loads, the GameEngine automatically:
1. Looks up games with `game_url = 'plant-or-animal'`
2. Renders the game in the Game Challenge section
3. Handles player authentication + results

---

## 🎯 Game Flow (Lesson Mode)

```
LessonPage
  ↓
SectionRoadmap displays 4 sections
  ↓
Student clicks "🎮 Game Challenge"
  ↓
GameEngine renders PlantOrAnimalGameWrapper
  ↓
PlantOrAnimalGame (isLessonMode=true)
  ├─ Skips login screen
  ├─ Starts at Level 1
  ├─ Plays all 3 levels
  └─ Returns final score
  ↓
LessonPage.handleGameFinish()
  ├─ Marks game section as completed
  ├─ Saves score to database
  └─ Unlocks next lesson or shows celebration
```

---

## 📊 Database Integration

### **Game Record:**
```sql
INSERT INTO games (lesson_id, title, game_url, is_active)
VALUES (NULL, 'Plant or Animal?', 'plant-or-animal', true);
```

### **Score Storage:**
```sql
INSERT INTO game_scores (student_id, game_id, total_score, accuracy_pct, played_at)
VALUES (123, 1, 150, 100, NOW());
```

### **Automatic Game Creation:**
- First time a student plays, the game record is created automatically
- Subsequent plays update the same record

---

## 🚀 To Use in Lessons

### **Option 1: Attach to Existing Lesson**

The game is already registered. It will appear automatically in any lesson's Game Challenge section if:
- The lesson has sections configured
- A game record exists with `game_url = 'plant-or-animal'`

### **Option 2: Create New Lesson with Game**

```sql
-- Create lesson
INSERT INTO lessons (unit_id, title, description, lesson_order)
VALUES (1, 'Plants and their types', 'Learn about plants', 1);

-- Lessons already have game section in assessment roadmap
-- Game will appear automatically if registered
```

### **Option 3: Link Game to Specific Lesson**

```sql
-- Insert game record linked to lesson
INSERT INTO games (lesson_id, title, game_url, is_active)
VALUES (123, 'Plant or Animal?', 'plant-or-animal', true);
```

---

## ✨ Features (Lesson Mode)

✅ **Lesson-Aware:**
- Skips login screen (student already authenticated)
- Integrates with section progression system
- Reports results to LessonPage

✅ **Seamless Integration:**
- Works with existing GameEngine
- Follows lesson unlock pattern
- Scores saved automatically

✅ **Backward Compatible:**
- Can still play standalone via route `/game/plant-or-animal`
- Dashboard card removed but route still active

---

## 🔑 Key Props (PlantOrAnimalGame)

```javascript
<PlantOrAnimalGame
  currentLevel={1}              // Starting level (1-3)
  onLevelComplete={callback}    // Called when level completes
  isLessonMode={true}           // Skip login, auto-report
  showLevelProgression={true}   // Allow all 3 levels
  playerName="Alice"            // Pre-set (from lesson context)
  playerAvatar="🧒"             // Pre-set avatar
/>
```

---

## 🎓 Lesson Assessment Roadmap

The roadmap shows 4 sections in zigzag pattern:

```
Left     ┌─────────────────┐
         │  🎯 MCQ         │
         │  Start Here     │
         └────────┬────────┘
                  │ (connector)
Right            └─────────────────┐
                  ┌─────────────────┘
                  │  📝 Fill Blanks │
                  │  (locked)       │
                  └────────┬────────┘
                           │
Left                       └─────────────────┐
                  ┌─────────────────────────┘
                  │  ✓/✗ True or False      │
                  │  (locked)               │
                  └────────┬────────────────┘
                           │
Right                      └─────────────────┐
                  ┌─────────────────────────┘
                  │  🎮 Game Challenge      │
                  │  (locked)               │
                  └─────────────────────────┘
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Game doesn't appear in lesson | Check game is registered in gameRegistry.js |
| "Game not found" error | Verify plant-or-animal is in registry |
| Scores not saving | Check `/api/games/scores/save` endpoint |
| Login screen appears in lesson | Ensure `isLessonMode={true}` is passed |
| Player name/avatar wrong | Check wrapper passes student data correctly |

---

## 📈 Next Steps

1. ✅ Test game in lesson context
2. ✅ Verify scores save correctly
3. ✅ Check section unlock progression
4. Optional: Add leaderboards for game scores
5. Optional: Add difficulty selection by teacher
6. Optional: Track per-student game analytics

---

## 💾 Related Files

**Lesson Components:**
- `client/src/components/lesson/SectionRoadmap.jsx` - Displays 4 sections
- `client/src/components/lesson/SectionCard.jsx` - Individual section card
- `client/src/pages/LessonPage.jsx` - Main lesson page

**Game Engine:**
- `client/src/game-engine/core/GameEngine.jsx` - Game orchestrator
- `client/src/game-engine/registry/gameRegistry.js` - Game registry

**Backend:**
- `server/routes/game.routes.js` - Game API routes
- `server/controllers/game.controller.js` - Game logic

---

**Plant or Animal? is now fully integrated into FunNova's lesson system! 🌱🐾**
