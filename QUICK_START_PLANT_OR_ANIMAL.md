# 🌱 Plant or Animal? - Quick Start Guide

## 📋 Files Created (8 components + 2 services)

**Game Components:**
```
✅ client/src/features/games/plant-or-animal/
   ├── PlantOrAnimalGame.jsx          (Main orchestrator - all 4 screens)
   ├── GameLoginScreen.jsx            (Login + avatar picker)
   ├── GameLevelIntroScreen.jsx       (Level preview)
   ├── GamePlayScreen.jsx             (Gameplay HUD + questions + timer)
   └── GameResultsScreen.jsx          (Results + star rating + next/replay buttons)

✅ client/src/components/dashboard/
   └── PlantOrAnimalGameCard.jsx      (Dashboard card to launch game)

✅ client/src/data/
   └── plantOrAnimalQuestions.js      (3 levels × 8-10 questions each)

✅ client/src/services/
   └── game.service.js                (API: saveGameScore)
```

**Backend:**
```
✅ server/controllers/game.controller.js  (Updated: saveGameScore function)
✅ server/routes/game.routes.js           (Updated: /games/scores/save endpoint)
✅ server/run-migration-plant-or-animal.js (Helper to setup DB)
✅ server/migrations/001_add_plant_or_animal_game.sql
```

**Integration:**
```
✅ client/src/App.jsx                 (New route: /game/plant-or-animal)
✅ client/src/pages/DashboardPage.jsx (Imported & added game card to grid)
```

---

## 🚀 To Run the Game

### **Step 1: Start Backend**
```bash
cd server
npm install  # if not done
npm start
```

### **Step 2: Start Frontend** 
```bash
cd client
npm run dev
```

### **Step 3: Access the Game**
1. Go to `http://localhost:5173`
2. Login as student (use existing student account)
3. See "Plant or Animal?" card on dashboard 🌱
4. Click to play!

---

## ✨ What Works Out-of-the-Box

✅ Complete 3-level game flow  
✅ Mobile responsive (tested on 320px width)  
✅ Scoring persists to database  
✅ Avatar system (6 emoji options)  
✅ Random question shuffling per play  
✅ Timer on Level 3 (10 seconds/question)  
✅ Star rating system (1-3 stars)  
✅ Streak tracking  
✅ Smooth animations & transitions  
✅ HUD bar with player info + score + streak  
✅ Celebration confetti on level complete  

---

## 🎮 Game Flow Demo

```
👤 Student Login → Dashboard
    ↓
🌱 Click "Plant or Animal?" Card
    ↓
📝 Enter Name + Pick Avatar
    ↓
🎯 Choose Level (1, 2, or 3)
    ↓
📖 Level Intro (show rules)
    ↓
❓ Gameplay (HUD + 5-6 questions)
    ⏱️ Timer on Level 3 only
    ⭐ Streak counter
    📊 Accuracy %
    ↓
🏆 Results (Star Rating + Stats)
    ↓
🔄 Replay or ➡️ Next Level
```

---

## 🎯 Question Breakdown by Level

**Level 1 (Easy, No Timer)** - Pick 5 from:
- Plants: Oak Tree, Sunflower, Palm Tree, Rose
- Animals: Cat, Dog, Duck, Cow

**Level 2 (Medium, No Timer)** - Pick 6 from:
- Plants: Cactus, Mushroom, Fern, Wheat, Bamboo
- Animals: Elephant, Butterfly, Turtle, Fox, Frog

**Level 3 (Hard, 10s Timer)** - Pick 6 from:
- Plants: Hibiscus, Clover, Seaweed, Lotus, Aloe Vera
- Animals: Shark, Eagle, Lizard, Octopus, Crab

---

## 🛠️ Customization

### Change Questions
Edit `client/src/data/plantOrAnimalQuestions.js`:
```javascript
questions: [
  { id: 1, name: 'Item Name', emoji: '🌳', answer: 'plant' }
]
```

### Change Feedback Messages
In same file:
```javascript
correct: ['🎉 Great!', '⭐ Awesome!', ...]
```

### Change Colors
Edit component classes:
- Primary green: `emerald-500/600`
- Change to any Tailwind color: `blue-500`, `purple-600`, etc.

### Change Timer Duration
In `plantOrAnimalQuestions.js`:
```javascript
timer: 10  // seconds per question
```

---

## 📊 Scoring Example

**Scenario: Level 1, Answered 5/5 Correct in 85% Accuracy**
```
Total Score: 50 points (5 × 10)
Accuracy: 100%
Best Streak: 5
Stars: ⭐⭐⭐ (100% > 85%)

↓ Saved to Database
```

---

## ❓ FAQs

**Q: Can I change the number of questions per level?**
A: Yes, edit `totalQuestions` in `plantOrAnimalQuestions.js`

**Q: How do I disable the timer?**
A: Set `timer: null` in Level 3 config

**Q: Can students replay a level?**
A: Yes! "Replay Level" button always visible on results screen

**Q: Are scores cumulative across levels?**
A: No, each level is independent. But best score per student-game pair is tracked

**Q: Does it work offline?**
A: Login & gameplay work offline. Scores save on reconnect (queued locally)

**Q: Can I add more levels?**
A: Yes! Add Level 4, 5, etc. to `GAME_LEVELS` object

---

## 📈 Next Steps

1. ✅ Test gameplay (all 3 levels)
2. ✅ Verify scores save to database
3. ✅ Check dashboard card appears
4. ✅ Test on mobile device
5. Optional: Add leaderboard (query `game_scores` table)
6. Optional: Add achievement badges for streaks
7. Optional: Integrate with admin analytics

---

## 🎨 UI/UX Highlights

- **Garden gradient background** - Soothing green vibes
- **Large emojis (72px)** - Easy for kids to understand
- **Pill-shaped buttons** - Modern, touchable (44px+ tap target)
- **HUD bar sticky** - Always see score + streak + timer
- **Progress dots** - Visual feedback (green/red/yellow)
- **Confetti on win** - Celebration animations
- **Smooth transitions** - 0.3s fade between screens
- **Mobile-first** - Works great on 320px+ screens

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Game card doesn't appear | Check DashboardPage imports & reload browser |
| Scores don't save | Check `/api/games/scores/save` in Network tab |
| Timer not working | Ensure Level 3 has `timer: 10` configured |
| Avatar not showing | Ensure 6 emoji in AVATARS array |
| Questions repeating | Shuffle function should randomize each play |

---

## 💾 Database Tables

**game_scores** (Persisted data)
```
id | student_id | game_id | total_score | accuracy_pct | played_at
```

**games** (Game metadata)
```
id | lesson_id | title | game_url | is_active | created_at
```

---

## 📞 Support

For issues, check:
1. Browser console (F12 → Console tab)
2. Network tab (API requests)
3. Server logs (`npm start` output)
4. Database connection status

---

**Happy Gaming! 🎮 Plant or Animal? is ready to engage Grade 3 students!** 🌱🐾
