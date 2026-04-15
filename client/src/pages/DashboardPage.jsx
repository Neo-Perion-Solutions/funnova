import React, { useState, useEffect } from 'react';
import Topbar from '../components/common/Topbar';
import ImpersonationBanner from '../components/common/ImpersonationBanner';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import SubjectCard from '../components/dashboard/SubjectCard';
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
import { getSubjects } from '../services/lesson.service';
import { progressService } from '../services/progress.service';

const DashboardPage = () => {
  const { activeGrade } = useGradeContext();
  const { student } = useAuth();
  const [streak, setStreak] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState(null);
  const [level, setLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(2400);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({});

  const { data: subjects, loading } = useFetch(
    () => getSubjects(activeGrade),
    [activeGrade]
  );

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const progressData = await progressService.getProgressSummary();
        if (progressData) {
          setStreak(progressData.streak || 0);
          // Calculate progress percentage
          const lessonsCompleted = progressData.lessonsCompleted || 0;
          const totalLessonsInGrade = subjects?.reduce((sum, s) => sum + (s.lesson_count || 0), 0) || 1;
          const percentage = Math.round((lessonsCompleted / totalLessonsInGrade) * 100);
          setProgressPercentage(Math.min(percentage, 100));

          // Set gamification data (from API in future)
          setLevel(progressData.level || 5);
          setCurrentXP(progressData.currentXP || 2400);
        }

        // Fetch current lesson if available
        if (student?.current_lesson_id) {
          setCurrentLessonId(student.current_lesson_id);
          setCurrentLessonTitle('Continue Learning');
        }
      } catch (err) {
        console.error('Failed to load progress data:', err);
      }
    };

    if (student) {
      fetchProgressData();
    }
  }, [student, subjects]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <ImpersonationBanner />
      <Topbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <GreetingBanner />

          {/* Top Stats Row - Gamification header */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Level Badge */}
            <LevelBadge level={level} xp={currentXP} />

            {/* XP Indicator */}
            <XPIndicator currentXP={currentXP} xpToNextLevel={3000} level={level} />

            {/* Streak Widget */}
            <StreakWidget streak={streak} />

            {/* Progress Ring */}
            <ProgressRing percentage={progressPercentage} label="Grade Progress" />
          </div>

          {/* Continue Button */}
          {currentLessonId && (
            <ContinueButton
              currentLessonId={currentLessonId}
              currentLessonTitle={currentLessonTitle}
            />
          )}

          {/* Subjects Grid - With Gamified Cards */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-900">📚 Learning Subjects</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {subjects && subjects.map((sub) => (
                  <GamifiedDashboardCard
                    key={sub.id}
                    subject={sub}
                    unit_count={sub.unit_count || 0}
                    lesson_count={sub.lesson_count || 0}
                    completedLessons={sub.completed_lessons || 0}
                  />
                ))}
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

