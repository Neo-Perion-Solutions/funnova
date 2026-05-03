import React from 'react';
import { useNavigate } from 'react-router-dom';

import ImpersonationBanner from '../components/common/ImpersonationBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Dashboard components
import HeroGreeting from '../components/dashboard/HeroGreeting';
import ContinueAdventure from '../components/dashboard/ContinueAdventure';
import ExploreSubjects from '../components/dashboard/ExploreSubjects';
import DailyMissions from '../components/dashboard/DailyMissions';
import StreakCard from '../components/dashboard/StreakCard';
import RewardsCard from '../components/dashboard/RewardsCard';
import MobileFooterNav from '../components/dashboard/MobileFooterNav';

// Hooks — wired to real backend
import { useDashboardData } from '../hooks/useDashboardData';

// Dashboard CSS
import '../styles/dashboard.css';

/**
 * DashboardPage — Full gamified student dashboard.
 *
 * Layout (Desktop ≥ 1024px):
 *   HeroGreeting (full width)
 *   ┌─────────────────────────────────┬────────────────────────┐
 *   │  ContinueAdventure (2/3)        │  DailyMissions (1/3)   │
 *   ├─────────────────────────────────┤                        │
 *   │  ExploreSubjects (2/3)          ├────────────────────────┤
 *   │  [Math] [Science] [English]     │  StreakCard (1/3)      │
 *   │                                 ├────────────────────────┤
 *   │                                 │  RewardsCard (1/3)     │
 *   └─────────────────────────────────┴────────────────────────┘
 *
 * Layout (Mobile < 768px):
 *   Hero → Continue → Missions → Subjects → Streak → Rewards → Footer Nav
 *
 * All data comes from real API: GET /api/student/home (enhanced).
 * NO mock data.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useDashboardData();

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="flex justify-center items-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="max-w-xl mx-auto mt-20 text-center">
          <div className="dash-card p-8">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h2
              className="text-xl font-extrabold mb-2"
              style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-display)' }}
            >
              Oops! Something went wrong
            </h2>
            <p className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    student,
    subjects,
    streakDays,
    lastActiveLesson,
    dailyMissions,
    starsTotal,
    badges,
    currentLevel,
    xpCurrent,
    xpMax,
  } = data;

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';

  return (
    <div className="dashboard-page min-h-screen">
      <ImpersonationBanner />

      {/* ====== MAIN DASHBOARD GRID ====== */}
      <div className="dashboard-grid">

        {/* === HERO GREETING (full width) === */}
        <div style={{ gridColumn: '1 / -1' }}>
          <HeroGreeting
            studentName={student?.name}
            avatarUrl={student?.avatar_url}
            level={currentLevel}
            xpCurrent={xpCurrent}
            xpMax={xpMax}
            streakDays={streakDays}
            starsTotal={starsTotal}
          />
        </div>

        {/* === LEFT COLUMN (Main content) === */}
        <div className="dashboard-main">
          {/* Continue Adventure */}
          {lastActiveLesson && (
            <ContinueAdventure
              subject={lastActiveLesson.subject_name}
              lessonName={lastActiveLesson.lesson_title}
              lessonNumber={lastActiveLesson.lesson_number}
              totalLessons={lastActiveLesson.total_lessons}
              completedPercent={lastActiveLesson.completed_pct}
              onContinue={() => navigate(`/student/lesson/${lastActiveLesson.lesson_id}`)}
            />
          )}

          {/* Explore Subjects */}
          <ExploreSubjects subjects={subjects} />
        </div>

        {/* === RIGHT COLUMN (Sidebar) === */}
        <div className="dashboard-sidebar">
          {/* Daily Missions */}
          <DailyMissions missions={dailyMissions} />

          {/* Streak Card */}
          <StreakCard streakDays={streakDays} />

          {/* Rewards Card */}
          <RewardsCard starsTotal={starsTotal} badges={badges} />
        </div>

      </div>

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  );
};

export default DashboardPage;
