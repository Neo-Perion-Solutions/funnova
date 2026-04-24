import React, { useState, useEffect } from 'react';
import Topbar from '../components/common/Topbar';
import ImpersonationBanner from '../components/common/ImpersonationBanner';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StreakWidget from '../features/dashboard/components/StreakWidget';
import ProgressRing from '../features/dashboard/components/ProgressRing';
import ContinueButton from '../features/dashboard/components/ContinueButton';
import GamifiedDashboardCard from '../components/student/dashboard/GamifiedDashboardCard';
import XPIndicator from '../components/student/gamification/XPIndicator';
import LevelBadge from '../components/student/gamification/LevelBadge';
import CelebrationModal from '../components/student/achievement/CelebrationModal';
import { useGradeContext } from '../context/GradeContext';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';

const DashboardPage = () => {
  const { activeGrade } = useGradeContext();
  const { student, updateStudent } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({});

  // Fetch comprehensive student home data
  const { data: homeResponse, loading, error } = useFetch(
    () => studentService.getHome(),
    [activeGrade]
  );

  const homeData = homeResponse?.data;
  const subjects = homeData?.subjects || [];
  const streak = homeData?.streak_days || 0;
  
  // Calculate total progress percentage accurately across all grade subjects
  const completedLessons = homeData?.student?.lessons_completed || 0;
  const totalLessonsInGrade = subjects.reduce((sum, s) => sum + (s.total_lessons || 0), 0) || 1;
  const progressPercentage = Math.round((completedLessons / totalLessonsInGrade) * 100);

  // Derived level tracking (e.g. 10 lessons completed = level up)
  const currentLevel = Math.floor(completedLessons / 5) + 1;
  const currentXP = completedLessons * 100 + (homeData?.student?.avg_score || 0);

  // Mock checking if there is a next lesson to continue
  // Ideally this is handled by student.current_lesson_id, but the backend sequential unlocked lessons gives us a way
  // We'll use the user's recent completions to suggest the "Continue" if needed, but for now fallback to student context
  const currentLessonId = student?.current_lesson_id;
  const currentLessonTitle = currentLessonId ? 'Continue Learning' : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ImpersonationBanner />
      <Topbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Welcome Section */}
          <GreetingBanner />

          {/* Gamification Stats Row - 4 Column Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {/* Level Badge */}
            <div className="transform transition hover:scale-105">
              <LevelBadge level={currentLevel} xp={currentXP} />
            </div>

            {/* XP Indicator */}
            <div className="transform transition hover:scale-105">
              <XPIndicator currentXP={currentXP} xpToNextLevel={Math.ceil(currentXP / 1000) * 1000 || 1000} level={currentLevel} />
            </div>

            {/* Streak Widget */}
            <div className="transform transition hover:scale-105">
              <StreakWidget streak={streak} />
            </div>

            {/* Progress Ring */}
            <div className="transform transition hover:scale-105">
              <ProgressRing percentage={progressPercentage} label="Overall Progress" />
            </div>
          </div>

          {/* Continue Learning Section */}
          {currentLessonId && (
            <div className="mt-8">
              <ContinueButton
                currentLessonId={currentLessonId}
                currentLessonTitle={currentLessonTitle}
              />
            </div>
          )}

          {/* Learning Subjects Section - Enhanced */}
          <div className="mt-12">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                📚 Learning Subjects
              </h2>
              <span className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                {subjects.length} Subjects
              </span>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Subjects Grid - Responsive */}
            {loading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {subjects.map((sub) => (
                  <div key={sub.id} className="transform transition-all duration-300 hover:-translate-y-1">
                    <GamifiedDashboardCard
                      subject={sub}
                      unit_count={0} 
                      lesson_count={sub.total_lessons || 0}
                      completedLessons={sub.completed_lessons || 0}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No subjects unlocked yet</h3>
                <p className="text-gray-500 max-w-md text-center">
                  Looks like your teacher hasn't assigned any curriculum or subjects for your grade yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={celebrationData.title || 'Great Work!'}
        message={celebrationData.message || 'Keep up the amazing progress!'}
        type={celebrationData.type || 'achievement'}
        xpGained={celebrationData.xpGained || 0}
      />
    </div>
  );
};

export default DashboardPage;
