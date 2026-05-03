import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

/**
 * HeroGreeting — Avatar + greeting + Level badge + XP progress bar + Streak + Stars
 * Data sourced from useDashboardData (real API).
 */
const HeroGreeting = ({
  studentName = 'Explorer',
  avatarUrl,
  level = 1,
  xpCurrent = 0,
  xpMax = 500,
  streakDays = 0,
  starsTotal = 0,
}) => {
  const firstName = studentName ? studentName.split(' ')[0] : 'Explorer';
  const xpPct = xpMax > 0 ? Math.min((xpCurrent / xpMax) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dash-hero-greeting"
      style={{ padding: '10px 0 20px 0' }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Avatar */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shrink-0"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #F97316)',
            border: '4px solid #FEF3C7',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={firstName} className="w-full h-full rounded-full object-cover" />
          ) : (
            firstName.charAt(0).toUpperCase()
          )}
        </motion.div>

        {/* Name + Subtitle */}
        <div className="flex-1 text-center sm:text-left">
          <h1
            className="text-xl sm:text-2xl font-extrabold"
            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-display)', textShadow: '0 2px 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)' }}
          >
            Hey, {firstName}! 👋
          </h1>
          <p
            className="text-sm mt-0.5 font-bold"
            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-body)', textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}
          >
            Ready for a new adventure today?
          </p>
        </div>

        {/* Level Badge + XP */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Level */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, var(--dash-primary), var(--dash-primary-dark))',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              }}
            >
              <Shield size={18} className="text-white/50 absolute" />
              <span className="text-white font-extrabold text-lg relative z-10">{level}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--dash-text-muted)' }}>
              Level
            </span>
          </motion.div>

          {/* XP Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden sm:block"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold" style={{ color: 'var(--dash-text-muted)' }}>XP Progress</span>
            </div>
            <div className="dash-xp-bar" style={{ width: '120px' }}>
              <div className="dash-xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-[11px] font-bold mt-1" style={{ color: 'var(--dash-text-muted)' }}>
              {Math.round(xpCurrent)} / {xpMax} XP
            </p>
          </motion.div>
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden sm:block w-px h-14 bg-gray-200 mx-2" />

        {/* Streak + Stars (Mockup style white pills) */}
        <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex items-center gap-2 px-4 py-2 rounded-full dash-card"
            style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.9)', border: 'none' }}
          >
            <span className="text-xl dash-flame">🔥</span>
            <span className="font-extrabold text-lg" style={{ color: 'var(--dash-text)' }}>{streakDays}</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="flex items-center gap-2 px-4 py-2 rounded-full dash-card"
            style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.9)', border: 'none' }}
          >
            <span className="text-xl">⭐</span>
            <span className="font-extrabold text-lg" style={{ color: 'var(--dash-text)' }}>{starsTotal}</span>
          </motion.div>
        </div>
      </div>

      {/* Mobile XP bar (shown only on mobile) */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1" style={{ color: 'var(--dash-text-muted)' }}>
          <span>Level {level} · XP Progress</span>
          <span>{Math.round(xpCurrent)} / {xpMax}</span>
        </div>
        <div className="dash-xp-bar">
          <div className="dash-xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroGreeting;
