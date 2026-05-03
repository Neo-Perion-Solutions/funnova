import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

/**
 * RewardsCard — Stars earned total, badges, View All Rewards link.
 * Data from real API: stars_total and badges from /api/student/home
 */
const RewardsCard = ({ starsTotal = 0, badges = [] }) => {
  // Show Explorer Badge as the first/primary badge, or fall back
  const primaryBadge = badges.length > 0
    ? badges[badges.length - 1]
    : { id: 'explorer', label: 'Explorer Badge', icon: '🛡️' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="dash-card"
      style={{ padding: '20px' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏆</span>
        <h3
          className="font-extrabold text-sm uppercase tracking-wider"
          style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-display)' }}
        >
          REWARDS
        </h3>
      </div>

      {/* Stars + Badge */}
      <div className="flex items-center gap-3 mb-4">
        {/* Stars */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: '#FEF9C3',
            border: '1px solid #FDE68A',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl"
          >
            ⭐
          </motion.span>
          <div>
            <p className="font-extrabold text-lg leading-none" style={{ color: '#92400E' }}>
              {starsTotal}
            </p>
            <p className="text-[10px] font-bold" style={{ color: '#B45309' }}>Stars</p>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: '#EDE9FE',
            border: '1px solid #DDD6FE',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--dash-primary), var(--dash-primary-dark))',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-xs leading-tight" style={{ color: '#5B21B6' }}>
              {primaryBadge.label}
            </p>
          </div>
        </motion.div>
      </div>

      {/* View All */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-colors"
        style={{
          color: 'var(--dash-primary)',
          background: 'rgba(124, 58, 237, 0.06)',
          border: '1px solid rgba(124, 58, 237, 0.12)',
          fontFamily: 'var(--dash-font-display)',
        }}
      >
        View All Rewards
      </motion.button>
    </motion.div>
  );
};

export default RewardsCard;
