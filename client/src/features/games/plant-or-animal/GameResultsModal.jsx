import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getStarRating } from '../../../data/plantOrAnimalQuestions';

/**
 * GameResultsModal - Full-screen results overlay for lesson mode
 *
 * Displays completion results, stars, and scores in a modal overlay
 * that breaks out of the lesson page container.
 */
const GameResultsModal = ({ playerName, playerAvatar, levelData, onClose, onNextLevel, hasNextLevel }) => {
  const { level, score, accuracy, streak, correct, total } = levelData;
  const stars = getStarRating(accuracy);
  const isLevelComplete = accuracy >= 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      {/* Celebration confetti */}
      {isLevelComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, opacity: 0 }}
              transition={{
                duration: 2.5,
                delay: Math.random() * 0.5,
                repeat: 1,
              }}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
              }}
            >
              {['🎉', '🎊', '⭐', '🌟', '✨'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Results Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-black mb-2 ${
              isLevelComplete ? 'text-emerald-700' : 'text-orange-600'
            }`}
          >
            {isLevelComplete ? '🎉 Level Complete!' : '⚠️ Keep Trying!'}
          </motion.h1>
          <p className="text-gray-600 font-semibold">{playerName}'s Results</p>
        </div>

        {/* Player Card */}
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
          <motion.div className="flex justify-center gap-2">
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
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Score</p>
            <p className="text-2xl font-black text-blue-700">{score}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Accuracy</p>
            <p className="text-2xl font-black text-emerald-700">{accuracy}%</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
            <p className="text-xs font-bold text-green-600 uppercase mb-1">Correct</p>
            <p className="text-2xl font-black text-green-700">{correct}/{total}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-200">
            <p className="text-xs font-bold text-orange-600 uppercase mb-1">Streak</p>
            <p className="text-2xl font-black text-orange-700">🔥 {streak}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="text-sm text-gray-600 text-center space-y-1 py-4 bg-gray-50 rounded-2xl mb-6">
          <p>You answered <span className="font-bold text-emerald-600">{correct} correctly</span> out of {total} questions.</p>
          <p>Keep practicing to improve your accuracy! 📚</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Replay Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg transition-all"
          >
            🔄 Replay Level {level}
          </motion.button>

          {/* Next Level Button */}
          {hasNextLevel && isLevelComplete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              ➡️ Next Level →
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameResultsModal;
