---
description: 
---

You are building the upgraded Student Dashboard for FUNNOVA — a gamified kids' learning app.
Stack: React + Vite, Tailwind CSS (or CSS Modules if Tailwind not available).

Design system:
- Fonts: Nunito (display) + Poppins (body) from Google Fonts
- Colors: primary #7C3AED (purple), amber #F59E0B (stars/XP), math #3B82F6 (blue), 
  science #10B981 (green), english #EC4899 (pink), bg #F5F3FF
- Border radius: 16px cards, pill buttons

Build these components in order:

1. HeroGreeting — Avatar + "Hey Siva! 👋" + Level 3 shield badge + XP progress bar 
   (242/500) + 🔥3 Day Streak pill + ⭐120 Stars pill. Row layout desktop, stacked mobile.

2. ContinueAdventure — Warm yellow gradient banner (#FDE68A→#FCD34D). Shows subject "Science", 
   lesson "Water and its Uses", "Lesson 2 of 5", 60% progress bar, purple "▶ Continue Playing" 
   CTA button. Right side has a nature/waterfall illustration placeholder.

3. ExploreSubjects — Grid of 3 colored cards: Mathematics (blue), Science (green), English (pink).
   Each card: big subject icon, label, progress bar (60%, 60%, 45%), "Continue →" button.
   IMPORTANT: Do NOT include a Games card. Only Math, Science, English.
   Desktop: 3-column grid. Mobile: horizontal scroll row.

4. DailyMissions — Sidebar panel on desktop, stacked below on mobile. Shows:
   ✅ Complete 1 lesson — 10⭐
   ○  Play 1 game — 10⭐  
   ○  Get 80% accuracy — 15⭐
   "View All Missions" link at bottom.

5. StreakCard — Orange circle badge "3 Days" + 🔥 emoji + "Great job! Keep it up!"

6. RewardsCard — ⭐120 Stars + 🛡️ Explorer Badge + "View All Rewards" link.

7. MobileFooterNav — Fixed bottom nav, visible ONLY on mobile (max-width: 768px).
   4 tabs: 🏠 Home · 📚 Subjects · 🎯 Missions · 👤 Profile.
   IMPORTANT: Do NOT include a Games tab. Only these 4 tabs.
   Active tab: purple. Height: 64px. Safe area padding for iOS.

Desktop layout: HeroGreeting full width. Then 8-col left (ContinueAdventure + ExploreSubjects) 
and 4-col right sidebar (DailyMissions + StreakCard + RewardsCard).

Mobile layout: All sections stack vertically in this order: Hero → ContinueAdventure → 
DailyMissions → ExploreSubjects (horizontal scroll) → StreakCard → RewardsCard → Fixed Footer Nav.

Use dummy/mock data for now. Add smooth animations: XP bar fills on load, cards fade-in with 
stagger delay, button hover scale(1.03). All components must be fully responsive.