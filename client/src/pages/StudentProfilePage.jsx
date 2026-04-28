import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ChevronLeft } from 'lucide-react';
import GameTopbar from '../components/common/GameTopbar';
import { useAuth } from '../hooks/useAuth';
import { studentService } from '../services/student.service';
import { useFetch } from '../hooks/useFetch';

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();

  const { data: profileResponse, loading, error } = useFetch(
    () => studentService.getProfile(), []
  );

  const handleLogout = async () => { await logout(); navigate('/student/login'); };

  const profileData = profileResponse?.data;
  const badges = profileData?.badges || [];
  const subjectStats = profileData?.subject_stats || [];
  const scoreBySubject = profileData?.score_by_subject || [];
  const completedLessons = profileData?.student?.lessons_completed || 0;
  const avgScore = Math.round(profileData?.student?.avg_score || 0);
  const streakDays = profileData?.streak_days || 0;
  const currentLevel = Math.floor(completedLessons / 5) + 1;
  const currentXP = completedLessons * 100 + avgScore;

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] via-[#E8EDFF] to-[#F5F0FF] fun-scrollbar">
      <GameTopbar coins={completedLessons * 10} streak={streakDays} xp={currentXP} level={currentLevel} />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Back */}
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-1 text-purple-600 font-bold text-sm bg-purple-50 rounded-full px-4 py-2 mb-6 hover:bg-purple-100 transition-colors">
          <ChevronLeft size={16} /> Back
        </motion.button>

        {/* Profile Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 shadow-2xl mb-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/30 -translate-y-1/3 translate-x-1/3" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl font-extrabold text-white shadow-xl border-4 border-white/30">
              {firstName.charAt(0).toUpperCase()}
            </motion.div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-white">{student?.name || 'Student'}</h1>
              <p className="text-white/60 font-bold mt-1">Grade {student?.grade || '?'} • Level {currentLevel}</p>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogout}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold px-5 py-3 rounded-2xl border border-white/20 hover:bg-red-500/80 transition-colors">
              <LogOut size={18} /> Logout
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto" />
            <p className="mt-3 text-purple-600 font-bold">Loading stats...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 text-xl font-bold bg-white p-6 rounded-3xl shadow-lg">{error}</div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {[
                { emoji: '🔥', label: 'Streak', value: `${streakDays} days`, gradient: 'from-orange-400 to-red-500', shadow: 'shadow-orange-500/20' },
                { emoji: '📚', label: 'Lessons', value: completedLessons, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20' },
                { emoji: '⭐', label: 'Avg Score', value: `${avgScore}%`, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/20' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.03, y: -4 }}
                  className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-6 text-center shadow-xl ${stat.shadow}`}>
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className="text-4xl mb-2">{stat.emoji}</motion.div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg border-2 border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
                <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">🏆 Badges</h3>
              </div>
              <div className="p-6">
                {badges.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {badges.map((badge, idx) => (
                      <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1, type: 'spring' }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 text-center hover:shadow-md transition-shadow">
                        <span className="text-3xl">{badge.icon}</span>
                        <p className="text-[10px] font-bold text-purple-800 leading-tight">{badge.label}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                      className="text-5xl mb-3">🎯</motion.div>
                    <p className="text-gray-500 font-bold">Keep learning to earn badges!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Subject Progress + Accuracy */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-lg border-2 border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                  <h3 className="text-lg font-extrabold text-gray-800">📊 Subject Progress</h3>
                </div>
                <div className="p-4 space-y-3">
                  {subjectStats.length > 0 ? subjectStats.map((subject) => (
                    <div key={subject.id} className="p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800 flex items-center gap-2">
                          <span className="text-xl">{subject.icon || '📘'}</span> {subject.name}
                        </span>
                        <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {subject.progress_pct}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${subject.progress_pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-bold text-right">
                        {subject.completed_lessons}/{subject.total_lessons} lessons
                      </p>
                    </div>
                  )) : <p className="p-6 text-center text-gray-400 font-bold">No progress yet.</p>}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-lg border-2 border-green-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
                  <h3 className="text-lg font-extrabold text-gray-800">🎯 Quiz Accuracy</h3>
                </div>
                <div className="p-4 space-y-3">
                  {scoreBySubject.length > 0 ? scoreBySubject.map((s) => (
                    <div key={s.subject_id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-green-50/50 transition-colors">
                      <div>
                        <span className="font-bold text-gray-800">{s.subject_name}</span>
                        <p className="text-xs text-gray-400 font-bold">{s.correct_count}/{s.total_answered} correct</p>
                      </div>
                      <div className={`text-2xl font-black ${
                        s.accuracy_pct >= 80 ? 'text-green-500' : s.accuracy_pct >= 50 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {s.accuracy_pct}%
                      </div>
                    </div>
                  )) : <p className="p-6 text-center text-gray-400 font-bold">No quiz stats yet.</p>}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfilePage;
