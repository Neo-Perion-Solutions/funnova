import React from 'react';
import { motion } from 'framer-motion';
import { getStarRating } from '../../../data/plantOrAnimalQuestions';

const GameResultsScreen = ({ playerName, playerAvatar, levelData, onReplay, onNextLevel, hasNextLevel }) => {
  const { level, score, accuracy, streak, correct, total } = levelData;
  const stars = getStarRating(accuracy);

  const isLevelComplete = accuracy >= 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-200 via-green-100 to-emerald-100 flex flex-col items-center justify-center p-4">
      {/* Celebration animation */}
      {isLevelComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -10, opacity: 1 }}
              animate={{ y: window.innerHeight + 20, opacity: 0 }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
              }}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
              }}
            >
              {['🎉', '🎊', '⭐', '🌟', '🎈'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-4xl font-black mb-2 ${
              isLevelComplete ? 'text-emerald-700' : 'text-orange-600'
            }`}
          >
            {isLevelComplete ? '🎉 Level Complete!' : '⚠️ Keep Trying!'}
          </motion.h1>
          <p className="text-gray-600 font-semibold">
            {playerName}'s Results
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Player + Avatar */}
          <div className="flex items-center justify-center gap-3 mb-6 pb-6 border-b-2 border-gray-200">
            <span className="text-5xl">{playerAvatar}</span>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Player</p>
              <p className="text-xl font-black text-gray-900">{playerName}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Your Rating</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex justify-center gap-2"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: i < stars ? 1 : 0.2, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                  className="text-4xl"
                >
                  ⭐
                </motion.div>
              ))}
            </motion.div>
            <p className="text-sm font-semibold text-gray-600 mt-2">
              {stars === 3 && 'Perfect! 🌟'}
              {stars === 2 && 'Great job! 👏'}
              {stars === 1 && 'Good effort! 💪'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Score */}
            <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-200">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Score</p>
              <p className="text-3xl font-black text-blue-700">
                {score}
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
              <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Accuracy</p>
              <p className="text-3xl font-black text-emerald-700">
                {accuracy}%
              </p>
            </div>

            {/* Correct */}
            <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-200">
              <p className="text-xs font-bold text-green-600 uppercase mb-1">Correct</p>
              <p className="text-3xl font-black text-green-700">
                {correct}/{total}
              </p>
            </div>

            {/* Best Streak */}
            <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-200">
              <p className="text-xs font-bold text-orange-600 uppercase mb-1">Best Streak</p>
              <p className="text-3xl font-black text-orange-700">
                🔥 {streak}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="text-sm text-gray-600 text-center space-y-1 py-4 bg-gray-50 rounded-2xl">
            <p>You answered <span className="font-bold text-emerald-600">{correct} correctly</span> out of {total} questions.</p>
            <p>Keep practicing to improve your accuracy! 📚</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Replay Button - Always visible */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReplay}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg transition-all"
          >
            🔄 Replay Level {level}
          </motion.button>

          {/* Next Level Button - If available */}
          {hasNextLevel && isLevelComplete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              ➡️ Next Level →
            </motion.button>
          )}

          {/* Exit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-2xl text-sm shadow-lg transition-all"
          >
            ← Back to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameResultsScreen;
