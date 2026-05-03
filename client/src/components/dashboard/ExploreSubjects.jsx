import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * ExploreSubjects — 3 subject cards (Math, Science, English). NO GAMES.
 * Desktop: 3-column grid. Mobile: horizontal scroll row.
 * Data from real API subjects array.
 */

const SUBJECT_CONFIG = {
  Mathematics: {
    color: 'var(--dash-math)',
    lightBg: '#EFF6FF',
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    icon: '🔢',
    iconLabel: '123',
  },
  Science: {
    color: 'var(--dash-science)',
    lightBg: '#ECFDF5',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    icon: '🔬',
    iconLabel: '🔬',
  },
  English: {
    color: 'var(--dash-english)',
    lightBg: '#FDF2F8',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    icon: '📚',
    iconLabel: 'ABC',
  },
};

const defaultConfig = {
  color: '#6366F1',
  lightBg: '#EEF2FF',
  gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
  icon: '📖',
  iconLabel: '📖',
};

const ExploreSubjects = ({ subjects = [] }) => {
  const navigate = useNavigate();

  // Filter to only show Math, Science, English (NO Games)
  const filteredSubjects = subjects.filter(
    (s) => s.name !== 'Games'
  );

  if (filteredSubjects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <h2
        className="text-lg font-extrabold mb-4 flex items-center gap-2"
        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-display)' }}
      >
        <span className="text-xl">🗺️</span>
        EXPLORE SUBJECTS
      </h2>

      <div className="dash-subjects-scroll grid grid-cols-3 gap-5">
        {filteredSubjects.map((subject, index) => {
          const config = SUBJECT_CONFIG[subject.name] || defaultConfig;
          const progressPct = subject.progress_pct || 0;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="rounded-3xl cursor-pointer overflow-hidden"
              style={{
                background: config.gradient,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <div className="p-6 text-white">
                {/* Subject name */}
                <h3
                  className="font-extrabold text-lg sm:text-xl mb-4"
                  style={{ fontFamily: 'var(--dash-font-display)' }}
                >
                  {subject.name}
                </h3>

                {/* Icon */}
                <div className="text-6xl sm:text-7xl mb-5 opacity-90">
                  {config.icon}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="dash-progress-bar" style={{ background: 'rgba(255,255,255,0.25)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="dash-progress-fill"
                      style={{ background: 'rgba(255,255,255,0.9)' }}
                    />
                  </div>
                  <p className="text-[11px] font-bold mt-1 opacity-80">
                    {progressPct}%
                  </p>
                </div>

                {/* Continue button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-extrabold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    fontFamily: 'var(--dash-font-display)',
                  }}
                >
                  Continue
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ExploreSubjects;
