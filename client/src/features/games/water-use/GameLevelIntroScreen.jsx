import React from 'react';
import { motion } from 'framer-motion';
import { GAME_LEVELS } from '../../../data/waterUseQuestions';

const GameLevelIntroScreen = ({ level, onStart }) => {
  const levelData = GAME_LEVELS[level];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 flex items-center justify-center p-5"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-7xl mb-6"
        >
          {levelData.icon}
        </motion.div>

        <h2 className="text-3xl font-bold text-blue-900 mb-2">
          {levelData.name}
        </h2>

        <p className="text-lg text-gray-700 mb-4 font-semibold">
          {levelData.description}
        </p>

        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <div className="space-y-2 text-sm text-blue-900">
            <p>
              <strong>Questions:</strong> {levelData.totalQuestions}
            </p>
            <p>
              <strong>Difficulty:</strong> {levelData.difficulty}
            </p>
            {levelData.timer && (
              <p>
                <strong>Timer:</strong> {levelData.timer} seconds per question
              </p>
            )}
            {levelData.multiSelect && (
              <p>
                <strong>Mode:</strong> Select ALL correct answers
              </p>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl text-xl"
        >
          🚀 Let&apos;s Go!
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameLevelIntroScreen;
