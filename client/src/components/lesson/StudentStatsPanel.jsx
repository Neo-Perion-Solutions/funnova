/**
 * StudentStatsPanel - Right Sidebar
 *
 * Shows:
 * - Student avatar
 * - XP points
 * - Level badge
 * - Streak counter
 * - Accuracy %
 * - Daily missions
 * - Progress cards
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const StudentStatsPanel = ({ lessonData, progress, completedGames }) => {
  const { student } = useAuth();

  const homeData = lessonData || {};
  const currentLevel = Math.floor((homeData.student?.lessons_completed || 0) / 5) + 1;
  const currentXP = (homeData.student?.lessons_completed || 0) * 100 + (homeData.student?.avg_score || 0);
  const streak = homeData.student?.streak_days || 0;
  const avgAccuracy = homeData.student?.avg_score || 0;

  // Calculate progress percentage
  const totalSections = Object.keys(progress).length;
  const completedSections = Object.values(progress).filter((s) => s.status === 'completed').length;
  const progressPercent = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  const missions = [
    { id: 1, title: 'Complete a section', icon: '✏️', done: completedSections >= 1 },
    { id: 2, title: 'Play a game', icon: '🎮', done: completedGames.size > 0 },
    { id: 3, title: 'Get 80% accuracy', icon: '🎯', done: avgAccuracy >= 80 },
  ];

  return (
    <div className="space-y-4">
      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center text-4xl border-4 border-white shadow-lg">
            {student?.avatar_url || '🧑'}
          </div>
          <h3 className="text-xl font-black mb-1">{student?.name || 'Explorer'}</h3>
          <p className="text-white/70 text-sm">Grade {student?.grade || 3}</p>
        </div>
      </motion.div>

      {/* Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">Current Level</p>
            <p className="text-4xl font-black">{currentLevel}</p>
          </div>
          <div className="text-6xl">⭐</div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <p className="text-xs mt-2 opacity-90">60% to next level</p>
      </motion.div>

      {/* XP Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 text-white shadow-xl"
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">Experience Points</p>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black">{currentXP}</p>
          <p className="text-lg opacity-90">XP</p>
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-3 text-sm font-bold"
        >
          +10 per lesson ✨
        </motion.div>
      </motion.div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-br from-rose-400 to-red-500 rounded-3xl p-6 text-white shadow-xl"
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">Streak Days</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black">{streak}</p>
          <p className="text-2xl">🔥</p>
        </div>
        <p className="text-sm mt-3 font-bold opacity-90">Keep it going!</p>
      </motion.div>

      {/* Accuracy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl p-6 text-white shadow-xl"
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">Accuracy</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-black">{Math.round(avgAccuracy)}%</p>
          </div>
          <div className="text-5xl">🎯</div>
        </div>
      </motion.div>

      {/* Lesson Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-lg"
      >
        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">Lesson Progress</p>
        <div className="space-y-3">
          {Object.entries(progress).map(([type, data], idx) => {
            const icons = {
              mcq: '🎯',
              fill_blank: '📝',
              true_false: '✓',
              game: '🎮',
            };
            const names = {
              mcq: 'Multiple Choice',
              fill_blank: 'Fill Blanks',
              true_false: 'True/False',
              game: 'Game Challenge',
            };

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{icons[type]}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{names[type]}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          data.status === 'completed'
                            ? '100%'
                            : data.status === 'active'
                              ? '50%'
                              : '0%',
                      }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                      className={`h-full ${
                        data.status === 'completed'
                          ? 'bg-emerald-500'
                          : data.status === 'active'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                      }`}
                    />
                  </div>
                </div>
                <span className="text-lg">
                  {data.status === 'completed' ? '✓' : data.status === 'active' ? '→' : '🔒'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 border-2 border-yellow-200 shadow-lg"
      >
        <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">🎯 Daily Missions</p>
        <div className="space-y-2">
          {missions.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-2xl ${
                mission.done
                  ? 'bg-emerald-100 border-2 border-emerald-300'
                  : 'bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <span className="text-2xl">{mission.icon}</span>
              <span className="flex-1 text-sm font-bold text-gray-800">{mission.title}</span>
              {mission.done && <span className="text-emerald-600 font-black">✓</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl"
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">Overall Progress</p>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-5xl font-black mb-2"
          >
            {Math.round(progressPercent)}%
          </motion.div>
          <p className="text-sm opacity-90">
            {completedSections} of {totalSections} sections
          </p>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-3 text-lg font-black"
          >
            Keep going! 🚀
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentStatsPanel;
