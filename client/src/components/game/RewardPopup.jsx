import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RewardPopup — Shows when a student answers correctly or completes a milestone.
 * Features confetti, coin spin, and star burst animations.
 */
const RewardPopup = ({ isOpen, onClose, type = 'correct', coins = 10, message = '' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1,
        color: ['#FFD93D', '#FF9F43', '#6C5CE7', '#FD79A8', '#00B894', '#74B9FF'][
          Math.floor(Math.random() * 6)
        ],
        size: 6 + Math.random() * 8,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const configs = {
    correct: {
      emoji: '✅',
      title: 'Awesome!',
      bg: 'from-green-400 to-emerald-500',
      glow: 'shadow-green-500/40',
    },
    wrong: {
      emoji: '💪',
      title: 'Try Again!',
      bg: 'from-orange-400 to-red-400',
      glow: 'shadow-orange-500/40',
    },
    coins: {
      emoji: '🪙',
      title: `+${coins} Coins!`,
      bg: 'from-yellow-400 to-amber-500',
      glow: 'shadow-yellow-500/40',
    },
    star: {
      emoji: '⭐',
      title: 'Star Earned!',
      bg: 'from-purple-400 to-pink-500',
      glow: 'shadow-purple-500/40',
    },
    levelup: {
      emoji: '🚀',
      title: 'Level Up!',
      bg: 'from-blue-500 to-purple-600',
      glow: 'shadow-blue-500/40',
    },
  };

  const config = configs[type] || configs.correct;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Confetti */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, scale: 1 }}
              animate={{ y: '100vh', opacity: 0, rotate: 720 }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                left: 0,
              }}
            />
          ))}

          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`bg-gradient-to-br ${config.bg} rounded-3xl px-10 py-8 text-center shadow-2xl ${config.glow} pointer-events-auto`}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-3"
            >
              {config.emoji}
            </motion.div>
            <h3 className="text-2xl font-extrabold text-white drop-shadow-md">
              {config.title}
            </h3>
            {message && (
              <p className="text-white/90 text-sm mt-2 font-medium">{message}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardPopup;
