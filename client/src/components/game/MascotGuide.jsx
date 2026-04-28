import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MascotGuide — A friendly floating mascot (owl) that shows helpful tips.
 * Appears in the corner with speech bubbles, bounces when interacted with.
 */
const MascotGuide = ({ message = '', position = 'bottom-right', autoHide = true }) => {
  const [showBubble, setShowBubble] = useState(!!message);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-24 right-6',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end gap-2`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="relative bg-white rounded-2xl px-4 py-3 shadow-xl border-2 border-purple-200 max-w-[250px]"
          >
            <button
              onClick={() => {
                setShowBubble(false);
                if (autoHide) setDismissed(true);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 text-white rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ✕
            </button>
            <p className="text-sm font-medium text-gray-700 leading-snug">{message}</p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b-2 border-r-2 border-purple-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <motion.button
        onClick={() => setShowBubble(!showBubble)}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/30 border-4 border-white hover:shadow-2xl transition-shadow"
      >
        🦉
      </motion.button>
    </div>
  );
};

export default MascotGuide;
