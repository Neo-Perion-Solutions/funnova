import { studentService } from '../services/student.service';
import { useFetch } from './useFetch';
import { useGradeContext } from '../context/GradeContext';

/**
 * useDashboardData — single hook that fetches all data for the student dashboard.
 * Wired to real backend: GET /api/student/home (enhanced with last_active_lesson,
 * daily_missions, stars_total, badges).
 */
export function useDashboardData() {
  const { activeGrade } = useGradeContext();

  const { data: homeResponse, loading, error, setData } = useFetch(
    () => studentService.getHome(),
    [activeGrade]
  );

  const homeData = homeResponse?.data;

  if (!homeData) {
    return { loading, error, data: null };
  }

  const student = homeData.student || {};
  const subjects = homeData.subjects || [];
  const streakDays = homeData.streak_days || 0;
  const recentCompletions = homeData.recent_completions || [];
  const lastActiveLesson = homeData.last_active_lesson || null;
  const dailyMissions = homeData.daily_missions || [];
  const starsTotal = homeData.stars_total || 0;
  const badges = homeData.badges || [];

  // Compute derived values
  const lessonsCompleted = student.lessons_completed || 0;
  const totalLessonsInGrade = subjects.reduce(
    (sum, s) => sum + (s.total_lessons || 0), 0
  ) || 1;
  const progressPercentage = Math.round((lessonsCompleted / totalLessonsInGrade) * 100);
  const currentLevel = Math.floor(lessonsCompleted / 5) + 1;
  const xpCurrent = lessonsCompleted * 100 + (student.avg_score || 0);
  const xpMax = Math.ceil(xpCurrent / 500) * 500 || 500;

  return {
    loading,
    error,
    data: {
      student,
      subjects,
      streakDays,
      recentCompletions,
      lastActiveLesson,
      dailyMissions,
      starsTotal,
      badges,
      lessonsCompleted,
      progressPercentage,
      currentLevel,
      xpCurrent,
      xpMax,
    },
    setData,
  };
}
