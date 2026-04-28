import React from 'react';
import { motion } from 'framer-motion';
import { getStarRating } from '../../../data/waterUseQuestions';

const GameResultsScreen = ({ playerAvatar, playerName, score, correct, total, bestStreak, level, onReplay, onNext }) => {
  const accuracy = Math.round((correct / total) * 100);
  const stars = getStarRating(accuracy);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 flex items-center justify-center p-5"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-6xl mb-4"
        >
          {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '😊' : '🤔'}
        </motion.div>

        {/* Player Info */}
        <div className="text-4xl mb-2">{playerAvatar}</div>
        <h2 className="text-2xl font-bold text-blue-900 mb-1">{playerName}</h2>
        <p className="text-gray-600 mb-6">Level {level + 1} Complete! 🎊</p>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6 text-4xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
            >
              {i < stars ? '⭐' : '☆'}
            </motion.div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Total Score:</span>
            <span className="text-2xl font-bold text-blue-600">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Accuracy:</span>
            <span className="text-2xl font-bold text-green-600">{accuracy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Correct:</span>
            <span className="text-2xl font-bold text-blue-600">
              {correct}/{total}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Best Streak:</span>
            <span className="text-2xl font-bold text-orange-500">🔥 {bestStreak}</span>
          </div>
        </div>

        {/* Motivational Message */}
        <p className="text-sm text-gray-600 mb-6 italic">
          {accuracy >= 85
            ? '🌟 Incredible! You\'re a water expert!'
            : accuracy >= 70
              ? '👏 Great job! Keep practicing!'
              : accuracy >= 50
                ? '💪 Good effort! Learn more about water!'
                : '🌱 Keep learning! Water is important!'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReplay}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-2xl text-lg hover:bg-gray-300"
          >
            🔄 Replay
          </motion.button>
          {level < 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl text-lg"
            >
              Next Level →
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameResultsScreen;
