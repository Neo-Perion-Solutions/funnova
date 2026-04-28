import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameTopbar from '../components/common/GameTopbar';
import ImpersonationBanner from '../components/common/ImpersonationBanner';
import RewardPopup from '../components/game/RewardPopup';
import MascotGuide from '../components/game/MascotGuide';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useGradeContext } from '../context/GradeContext';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';

// Subject theme configuration
const subjectThemes = {
  'Mathematics': { emoji: '🔢', gradient: 'from-blue-400 to-indigo-600', shadow: 'shadow-blue-500/30', bg: 'bg-blue-50', island: '🏝️' },
  'Science': { emoji: '🔬', gradient: 'from-green-400 to-emerald-600', shadow: 'shadow-green-500/30', bg: 'bg-green-50', island: '🌋' },
  'English': { emoji: '📚', gradient: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/30', bg: 'bg-purple-50', island: '🏰' },
  'History': { emoji: '📜', gradient: 'from-amber-400 to-orange-600', shadow: 'shadow-amber-500/30', bg: 'bg-amber-50', island: '🗿' },
  'Geography': { emoji: '🌍', gradient: 'from-teal-400 to-cyan-600', shadow: 'shadow-teal-500/30', bg: 'bg-teal-50', island: '🌊' },
  'Art': { emoji: '🎨', gradient: 'from-pink-400 to-rose-600', shadow: 'shadow-pink-500/30', bg: 'bg-pink-50', island: '🎪' },
};

const getTheme = (name) => subjectThemes[name] || {
  emoji: '📖', gradient: 'from-slate-500 to-slate-700', shadow: 'shadow-slate-500/30', bg: 'bg-slate-50', island: '🏔️'
};

const DashboardPage = () => {
  const { activeGrade } = useGradeContext();
  const { student } = useAuth();
  const navigate = useNavigate();
  const [showReward, setShowReward] = useState(false);

  const { data: homeResponse, loading, error } = useFetch(
    () => studentService.getHome(),
    [activeGrade]
  );

  const homeData = homeResponse?.data;
  const subjects = homeData?.subjects || [];
  const streak = homeData?.streak_days || 0;
  const completedLessons = homeData?.student?.lessons_completed || 0;
  const totalLessonsInGrade = subjects.reduce((sum, s) => sum + (s.total_lessons || 0), 0) || 1;
  const progressPercentage = Math.round((completedLessons / totalLessonsInGrade) * 100);
  const currentLevel = Math.floor(completedLessons / 5) + 1;
  const currentXP = completedLessons * 100 + (homeData?.student?.avg_score || 0);
  const currentLessonId = student?.current_lesson_id;

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';

  // Decorative floating elements data
  const floatingEmoji = ['⭐', '🌟', '✨', '💫', '🎯', '🏆', '🎪', '🎨'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F0F4FF] via-[#E8EDFF] to-[#F5F0FF] fun-scrollbar">
      <ImpersonationBanner />
      <GameTopbar coins={completedLessons * 10} streak={streak} xp={currentXP} level={currentLevel} />

      {/* Floating background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingEmoji.map((emoji, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${10 + (i * 12) % 90}%`,
              top: `${15 + (i * 17) % 70}%`,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* === HERO WELCOME BANNER === */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 shadow-2xl shadow-purple-500/20"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-white shadow-xl shadow-orange-500/30 border-4 border-white/30 shrink-0"
              >
                {student?.avatar_url || firstName.charAt(0).toUpperCase()}
              </motion.div>

              <div className="text-center sm:text-left flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-extrabold text-white leading-tight"
                >
                  Hey, {firstName}! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/70 text-sm sm:text-base font-medium mt-1"
                >
                  Ready for today&apos;s adventure?
                </motion.p>

                {/* XP Progress Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 max-w-sm"
                >
                  <div className="flex items-center justify-between text-xs text-white/60 font-bold mb-1">
                    <span>Level {currentLevel}</span>
                    <span>{currentXP} / {Math.ceil(currentXP / 1000) * 1000 || 1000} XP</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((currentXP % 1000) / 10, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Quick stats pills */}
              <div className="flex sm:flex-col gap-3 shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
                >
                  <span className="text-xl">🔥</span>
                  <div>
                    <p className="text-white font-extrabold text-lg leading-none">{streak}</p>
                    <p className="text-white/50 text-[10px] font-bold">STREAK</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
                >
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="text-white font-extrabold text-lg leading-none">{progressPercentage}%</p>
                    <p className="text-white/50 text-[10px] font-bold">DONE</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* === CONTINUE LEARNING === */}
          {currentLessonId && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/student/lesson/${currentLessonId}`)}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-5 shadow-lg shadow-green-500/20 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-3xl"
                >
                  ▶️
                </motion.span>
                <div className="text-left">
                  <p className="text-white font-extrabold text-lg">Continue Learning</p>
                  <p className="text-white/70 text-sm font-medium">Pick up where you left off!</p>
                </div>
              </div>
              <motion.span
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-2xl text-white"
              >
                →
              </motion.span>
            </motion.button>
          )}

          {/* === SUBJECT ISLANDS === */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-3xl">🗺️</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Choose Your Adventure</h2>
            </motion.div>

            {error && (
              <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600 flex items-center gap-2">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {subjects.map((sub, index) => {
                  const theme = getTheme(sub.name);
                  const subProgress = sub.total_lessons > 0
                    ? Math.round((sub.completed_lessons / sub.total_lessons) * 100)
                    : 0;
                  const starsEarned = Math.min(3, Math.floor(subProgress / 33));

                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                      whileHover={{ scale: 1.04, y: -6 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(`/subject/${sub.id}`)}
                      className={`
                        relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient}
                        p-6 cursor-pointer shadow-xl ${theme.shadow}
                        transition-shadow duration-300 hover:shadow-2xl
                      `}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 opacity-10 text-[100px] -translate-y-4 translate-x-4 pointer-events-none">
                        {theme.island}
                      </div>
                      <div className="absolute inset-0 opacity-10 pointer-events-none fun-shimmer rounded-3xl" />

                      <div className="relative">
                        {/* Icon + Name */}
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, delay: index * 0.3 }}
                            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/30"
                          >
                            {theme.emoji}
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-extrabold text-white">{sub.name}</h3>
                            <p className="text-white/60 text-xs font-bold">{sub.total_lessons || 0} lessons</p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${subProgress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                              className="h-full bg-white/80 rounded-full"
                            />
                          </div>
                          <p className="text-white/60 text-xs font-bold mt-1">
                            {sub.completed_lessons || 0} / {sub.total_lessons || 0} completed
                          </p>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((star) => (
                              <motion.span
                                key={star}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + star * 0.15 }}
                                className={`text-xl ${star <= starsEarned ? '' : 'opacity-30'}`}
                              >
                                ⭐
                              </motion.span>
                            ))}
                          </div>
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-white/80 text-sm font-extrabold flex items-center gap-1"
                          >
                            Play →
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center rounded-3xl border-2 border-dashed border-purple-200 bg-white flex flex-col items-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  🗺️
                </motion.div>
                <h3 className="text-2xl font-extrabold text-gray-700 mb-2">No Adventures Yet!</h3>
                <p className="text-gray-400 max-w-md text-center font-medium">
                  Your teacher hasn&apos;t created any subjects yet. Check back soon for exciting new adventures!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Mascot */}
      <MascotGuide
        message={`Hey ${firstName}! Tap on a subject to start learning! 🚀`}
      />

      {/* Reward Popup */}
      <RewardPopup isOpen={showReward} onClose={() => setShowReward(false)} type="coins" coins={10} />
    </div>
  );
};

export default DashboardPage;
