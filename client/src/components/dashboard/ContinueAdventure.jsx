import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * ContinueAdventure — Purple gradient banner with adventure theme.
 * Matches the premium design with background illustration, white info card,
 * subject/lesson details, progress bar, and CTA button.
 * Data from real API: last_active_lesson from /api/student/home
 */
const ContinueAdventure = ({
  subject = '',
  lessonName = '',
  lessonNumber = 1,
  totalLessons = 1,
  completedPercent = 0,
  onContinue,
}) => {
  if (!subject || !lessonName) return null;

  // Subject emoji mapping
  const subjectEmoji = {
    Science: '💧',
    Mathematics: '🔢',
    English: '📚',
  };

  const mascot = subjectEmoji[subject] || '📖';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
      onClick={onContinue}
      style={{
        minHeight: '260px',
        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/adventure-banner-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: "center",
          opacity: 1, /* Fully opaque */
        }}
      />

      {/* Decorative clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cloud 1 */}
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-4 left-[10%] opacity-20"
          style={{
            width: '120px',
            height: '40px',
            background: 'white',
            borderRadius: '40px',
            filter: 'blur(2px)',
          }}
        />
        {/* Cloud 2 */}
        <motion.div
          animate={{ x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute top-8 right-[15%] opacity-15"
          style={{
            width: '90px',
            height: '30px',
            background: 'white',
            borderRadius: '30px',
            filter: 'blur(2px)',
          }}
        />
        {/* Stars */}
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-5 left-[30%] text-lg"
        >⭐</motion.span>
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          className="absolute top-3 right-[35%] text-sm"
        >✨</motion.span>
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
          className="absolute top-10 left-[55%] text-xs"
        >⭐</motion.span>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Main heading */}
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2"
          style={{ fontFamily: 'var(--dash-font-display)', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        >
          Continue Your Adventure! 🚀
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm sm:text-base font-medium mb-6"
          style={{ fontFamily: 'var(--dash-font-body)' }}
        >
          You're doing great! Let's complete your next lesson.
        </motion.p>

        {/* White info card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="bg-white rounded-2xl px-5 sm:px-8 py-4 sm:py-5 shadow-xl w-full max-w-md"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center gap-4">
            {/* Mascot */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl sm:text-5xl shrink-0"
            >
              {mascot}
            </motion.div>

            {/* Lesson info */}
            <div className="flex-1 text-left">
              <h3
                className="text-base sm:text-lg font-extrabold mb-0.5"
                style={{ color: 'var(--dash-primary)', fontFamily: 'var(--dash-font-display)' }}
              >
                {subject}
              </h3>
              <p
                className="text-sm font-semibold mb-0.5"
                style={{ color: 'var(--dash-text)' }}
              >
                {lessonName}
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--dash-text-muted)' }}>
                Lesson {lessonNumber} of {totalLessons}
              </p>

              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#EDE9FE' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completedPercent}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--dash-primary), var(--dash-primary-light))' }}
                  />
                </div>
                <span
                  className="text-sm font-bold shrink-0"
                  style={{ color: 'var(--dash-primary)' }}
                >
                  {completedPercent}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onContinue?.();
          }}
          className="mt-5 inline-flex items-center gap-2.5 px-8 py-3 rounded-full font-extrabold text-base text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            boxShadow: '0 4px 16px rgba(91, 33, 182, 0.5)',
            fontFamily: 'var(--dash-font-display)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <Play size={18} fill="white" />
          Continue Playing
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContinueAdventure;
