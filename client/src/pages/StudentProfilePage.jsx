import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { studentService } from '../services/student.service';
import { useFetch } from '../hooks/useFetch';

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  
  const { data: profileResponse, loading, error } = useFetch(
    () => studentService.getProfile(),
    []
  );

  const handleLogout = async () => {
    await logout();
    navigate('/student/login');
  };

  const profileData = profileResponse?.data;
  const badges = profileData?.badges || [];
  const subjectStats = profileData?.subject_stats || [];
  const scoreBySubject = profileData?.score_by_subject || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 shadow-sm">
        <div className="flex items-center justify-between mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">My Learning Profile</h1>
          <div className="w-[88px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Profile Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shrink-0 shadow-inner border-4 border-indigo-100">
              {student?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student?.name || 'Awesome Student'}</h2>
              <p className="text-gray-600 font-medium">Grade {student?.grade || '3'} • Section {student?.section || 'A'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 border border-red-200 px-6 py-3 font-bold transition-all hover:bg-red-600 hover:text-white active:scale-95 shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Gamification Stats */}
        {loading ? (
          <div className="text-center py-8">Loading your awesome stats...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 text-xl font-bold bg-white p-6 rounded-xl shadow-sm">{error}</div>
        ) : (
          <div className="grid gap-6">
            
            {/* Top Level Metrics */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm text-center transform transition duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-sm font-bold text-amber-700 uppercase tracking-wider">Current Streak</p>
                <p className="mt-1 text-4xl font-extrabold text-gray-900">
                  {profileData?.streak_days || 0}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm text-center transform transition duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Lessons Finished</p>
                <p className="mt-1 text-4xl font-extrabold text-gray-900">
                  {profileData?.student?.lessons_completed || 0}
                </p>
              </div>

              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm text-center transform transition duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-sm font-bold text-green-700 uppercase tracking-wider">Average Score</p>
                <p className="mt-1 text-4xl font-extrabold text-gray-900">
                  {Math.round(profileData?.student?.avg_score || 0)}%
                </p>
              </div>
            </div>

            {/* Earned Badges */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">🏆 Earned Badges</h3>
              </div>
              <div className="p-6">
                {badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4 md:grid-cols-5">
                    {badges.map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 shadow-sm text-center transition hover:bg-indigo-100">
                        <span className="text-4xl filter drop-shadow-md">{badge.icon}</span>
                        <p className="text-xs font-bold text-indigo-900 mt-2 leading-tight">{badge.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-4xl mb-2">🎯</p>
                    <p className="text-gray-600 font-medium">Keep learning to earn your first badges!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subject Breakdown Detailed */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Progress */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                  <h3 className="text-lg font-bold text-gray-900">Subject Progress</h3>
                </div>
                <div className="divide-y divide-gray-100 flex-1 p-2">
                  {subjectStats.length > 0 ? (
                    subjectStats.map((subject) => (
                      <div key={subject.id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{subject.icon || '📘'}</div>
                            <span className="font-bold text-gray-900">{subject.name}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {subject.progress_pct}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${subject.progress_pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium text-right">
                          {subject.completed_lessons} of {subject.total_lessons} lessons
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">No subject progress yet.</div>
                  )}
                </div>
              </div>

              {/* Accuracy */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                  <h3 className="text-lg font-bold text-gray-900">Quiz Accuracy</h3>
                </div>
                <div className="divide-y divide-gray-100 flex-1 p-2">
                  {scoreBySubject.length > 0 ? (
                    scoreBySubject.map((scoreObj) => (
                      <div key={scoreObj.subject_id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 text-lg">{scoreObj.subject_name}</span>
                          <p className="text-sm text-gray-500 font-medium">
                            {scoreObj.correct_count} of {scoreObj.total_answered} correct
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`text-2xl font-extrabold ${scoreObj.accuracy_pct >= 80 ? 'text-green-500' : scoreObj.accuracy_pct >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                            {scoreObj.accuracy_pct}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">No quiz stats available yet.</div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfilePage;
