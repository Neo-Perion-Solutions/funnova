import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

/**
 * DailyMissions — 3 daily missions with completion status and star rewards.
 * Data from real API: daily_missions from /api/student/home
 */
const DailyMissions = ({ missions = [] }) => {
  if (missions.length === 0) return null;

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="dash-card"
      style={{ padding: '20px' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚡</span>
        <h3
          className="font-extrabold text-sm uppercase tracking-wider"
          style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-display)' }}
        >
          DAILY MISSIONS
        </h3>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: completedCount === missions.length ? '#D1FAE5' : '#F3F4F6',
            color: completedCount === missions.length ? '#059669' : 'var(--dash-text-muted)',
          }}
        >
          {completedCount}/{missions.length}
        </span>
      </div>

      {/* Mission list */}
      <div className="flex flex-col gap-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            {/* Check icon */}
            {mission.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 + index * 0.1 }}
              >
                <CheckCircle size={22} className="text-green-500 shrink-0" />
              </motion.div>
            ) : (
              <Circle size={22} className="text-gray-300 shrink-0" />
            )}

            {/* Label */}
            <span
              className="flex-1 text-sm font-semibold"
              style={{
                color: mission.completed ? 'var(--dash-text-muted)' : 'var(--dash-text)',
                textDecoration: mission.completed ? 'line-through' : 'none',
                fontFamily: 'var(--dash-font-body)',
              }}
            >
              {mission.label}
            </span>

            {/* Star reward */}
            <span className="flex items-center gap-1 text-sm font-bold" style={{ color: '#D97706' }}>
              {mission.stars}
              <span className="text-base">⭐</span>
            </span>
          </motion.div>
        ))}
      </div>

      {/* View All */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
        style={{
          color: 'var(--dash-primary)',
          background: 'rgba(124, 58, 237, 0.06)',
          border: '1px solid rgba(124, 58, 237, 0.12)',
          fontFamily: 'var(--dash-font-display)',
        }}
      >
        View All Missions
      </motion.button>
    </motion.div>
  );
};

export default DailyMissions;
