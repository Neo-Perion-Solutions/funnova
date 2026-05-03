import React from 'react';
import { motion } from 'framer-motion';

/**
 * StreakCard — Dedicated streak card with flame animation, day count, motivational message.
 * Data from real API: streak_days from /api/student/home
 */
const StreakCard = ({ streakDays = 0 }) => {
  // Motivational messages based on streak milestones
  const getMessage = (days) => {
    if (days >= 30) return "Legendary! You're unstoppable! 🏆";
    if (days >= 14) return "Two weeks strong! Amazing! 🌟";
    if (days >= 7) return "One week streak! Incredible! ⚡";
    if (days >= 3) return "Great job! Keep it up! 🎯";
    if (days >= 1) return "Nice start! Keep going! 💪";
    return "Start your streak today! 🚀";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="dash-card"
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
        border: '1px solid #FED7AA',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg dash-flame">🔥</span>
        <h3
          className="font-extrabold text-sm uppercase tracking-wider"
          style={{ color: '#92400E', fontFamily: 'var(--dash-font-display)' }}
        >
          STREAK
        </h3>
      </div>

      <div className="flex items-center gap-4">
        {/* Day count circle */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
          }}
        >
          <span className="text-white font-extrabold text-xl leading-none">{streakDays}</span>
          <span className="text-white/80 text-[8px] font-bold uppercase">Days</span>
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <p
            className="text-sm font-bold"
            style={{ color: '#78350F', fontFamily: 'var(--dash-font-body)' }}
          >
            {getMessage(streakDays)}
          </p>
        </div>

        {/* Decorative flame */}
        <motion.span
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-3xl"
        >
          🔥
        </motion.span>
      </div>
    </motion.div>
  );
};

export default StreakCard;
