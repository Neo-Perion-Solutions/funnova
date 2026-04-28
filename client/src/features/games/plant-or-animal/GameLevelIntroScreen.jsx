import React from 'react';
import { motion } from 'framer-motion';
import { GAME_LEVELS } from '../../../data/plantOrAnimalQuestions';

const GameLevelIntroScreen = ({ currentLevel, onStart }) => {
  const level = GAME_LEVELS[currentLevel];
  if (!level) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-200 via-green-100 to-emerald-100 flex flex-col items-center justify-center p-4">
      {/* Level badge animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center mb-8"
      >
        <div className="text-8xl mb-4 inline-block">{level.emoji}</div>
        <h2 className="text-3xl font-black text-emerald-700 mb-2">
          Level {currentLevel}: {level.title}
        </h2>
        <p className="text-gray-600 font-semibold max-w-sm">
          {level.description}
        </p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mb-8"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
            <span className="font-bold text-gray-700">Questions:</span>
            <span className="text-2xl font-black text-emerald-600">
              {level.totalQuestions}
            </span>
          </div>

          {level.timer && (
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
              <span className="font-bold text-gray-700">Time per Q:</span>
              <span className="text-2xl font-black text-orange-600">
                ⏱ {level.timer}s
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
            <span className="font-bold text-gray-700">Difficulty:</span>
            <span className="text-lg">
              {'⭐'.repeat(currentLevel)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/80 backdrop-blur rounded-2xl p-6 max-w-md w-full mb-8 border border-emerald-100"
      >
        <p className="text-sm text-gray-600 font-semibold mb-2">💡 Quick Tips:</p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>🌿 Plants have leaves, roots, and grow in soil</li>
          <li>🐾 Animals can move and eat food</li>
          {level.timer && <li>⏰ Answer quickly - you have {level.timer} seconds per question!</li>}
        </ul>
      </motion.div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
      >
        🚀 Let's Go!
      </motion.button>
    </div>
  );
};

export default GameLevelIntroScreen;
