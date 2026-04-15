import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, Flame } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { progressService } from '../services/progress.service';
import { useFetch } from '../hooks/useFetch';

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progressData, scoresData] = await Promise.all([
          progressService.getProgressSummary(),
          progressService.getScores(),
        ]);
        setStats(progressData);
        setScores(scoresData || []);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/student/login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Profile Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xl sm:text-2xl font-bold text-white shrink-0">
                {student?.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{student?.name || 'Student'}</h2>
                <p className="text-sm sm:text-base text-gray-600">Grade {student?.grade}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-red-700 active:scale-95 w-full sm:w-auto"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Streak Widget */}
        <div className="mb-8 rounded-lg border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-4 sm:p-6 shadow-sm">
          <div className="text-center">
            <div className="mb-2 text-4xl sm:text-5xl">🔥</div>
            <p className="mb-1 text-base sm:text-lg font-bold text-gray-900">
              {stats?.streak || 0} Day Streak!
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Keep up the great work to maintain your streak</p>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-8">Loading stats...</div>
        ) : (
          <>
            <div className="mb-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats?.lessonsCompleted || 0}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Questions Answered</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-indigo-600">
                  {stats?.totalQuestionsAnswered || 0}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Accuracy</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-green-600">
                  {stats?.totalQuestionsAnswered > 0
                    ? Math.round(
                        ((stats?.correctAnswers || 0) / (stats?.totalQuestionsAnswered || 1)) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Subject Progress</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {scores.length > 0 ? (
                  scores.map((subject) => (
                    <div key={subject.subject_id} className="flex flex-col gap-3 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl shrink-0">{subject.icon || '📚'}</div>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900">{subject.subject_name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{subject.percentage}% complete</p>
                        </div>
                      </div>
                      <div className="flex w-full sm:w-24 items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-600 shrink-0">
                          {subject.percentage}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                    <p className="text-sm sm:text-base text-gray-600">Start learning to see your progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements (Placeholder) */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Achievements</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 p-4 sm:p-6 sm:grid-cols-4">
                {[
                  { emoji: '🏆', label: 'First Quiz' },
                  { emoji: '⭐', label: 'Perfect Score' },
                  { emoji: '🔥', label: 'Week Warrior' },
                  { emoji: '🎓', label: 'Scholar' },
                ].map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2 rounded-lg border border-gray-200 p-2 sm:p-4 text-center active:scale-95">
                    <span className="text-2xl sm:text-3xl">{badge.emoji}</span>
                    <p className="text-xs font-medium text-gray-600">{badge.label}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 text-center">
                <p className="text-xs sm:text-sm text-gray-600">Unlock more achievements as you progress</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentProfilePage;
