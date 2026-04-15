import React, { useState, useEffect } from 'react';
import Topbar from '../components/common/Topbar';
import GreetingBanner from '../components/dashboard/GreetingBanner';
import SubjectCard from '../components/dashboard/SubjectCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StreakWidget from '../features/dashboard/components/StreakWidget';
import ProgressRing from '../features/dashboard/components/ProgressRing';
import ContinueButton from '../features/dashboard/components/ContinueButton';
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
        }

        // Fetch current lesson if available
        if (student?.current_lesson_id) {
          setCurrentLessonId(student.current_lesson_id);
          // In a real app, fetch the lesson title from API
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <GreetingBanner />

          {/* Dashboard Stats Section */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Streak Widget */}
            <div>
              <StreakWidget streak={streak} />
            </div>

            {/* Progress Ring */}
            <div>
              <ProgressRing percentage={progressPercentage} label="Grade Progress" />
            </div>

            {/* Stats Summary */}
            <div className="flex flex-col gap-2 rounded-lg border border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 p-4 sm:p-6">
              <p className="text-xs font-medium text-gray-600">Quick Stats</p>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-bold text-indigo-600">Grade {student?.grade}</p>
                <p className="text-xs sm:text-sm text-gray-600">Section: {student?.section || 'A'}</p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          {currentLessonId && (
            <ContinueButton
              currentLessonId={currentLessonId}
              currentLessonTitle={currentLessonTitle}
            />
          )}

          {/* Subjects Grid */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-900">Subjects</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {subjects && subjects.map((sub) => (
                  <SubjectCard key={sub.id} subject={sub} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

