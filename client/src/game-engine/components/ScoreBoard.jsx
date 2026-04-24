// file: client/src/game-engine/components/ScoreBoard.jsx

import React from 'react';
import { useScore } from '../hooks/useScore';

/**
 * End-of-game results screen.
 * Shows total score, accuracy, best streak, and action buttons.
 */
const ScoreBoard = ({ state, onPlayAgain, onContinue, gameTitle = 'Game' }) => {
  const { totalScore, accuracy, bestStreak, correctCount, wrongCount, totalAnswered } = useScore(state);

  const isHighScore = accuracy >= 70;

  const getGrade = () => {
    if (accuracy >= 90) return { emoji: '🏆', label: 'Amazing!', color: 'from-yellow-400 to-orange-500' };
    if (accuracy >= 70) return { emoji: '🌟', label: 'Great Job!', color: 'from-green-400 to-emerald-500' };
    if (accuracy >= 50) return { emoji: '👍', label: 'Good Try!', color: 'from-blue-400 to-indigo-500' };
    return { emoji: '💪', label: 'Keep Practicing!', color: 'from-purple-400 to-pink-500' };
  };

  const grade = getGrade();

  return (
    <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-5">
        {/* Hero Card */}
        <div className={`rounded-2xl bg-gradient-to-br ${grade.color} p-1 shadow-xl`}>
          <div className="bg-white rounded-2xl p-6 space-y-4 text-center">
            {/* Emoji + Title */}
            <div className="text-5xl animate-bounce">{grade.emoji}</div>
            <h3
              className={`text-2xl font-black bg-gradient-to-r ${grade.color} bg-clip-text text-transparent`}
            >
              {grade.label}
            </h3>
            <p className="text-sm text-gray-500">{gameTitle} Complete</p>

            {/* Score Circle */}
            <div className="py-4">
              <div className="text-5xl font-black text-indigo-700">{totalScore}</div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Points</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 border-t-2 border-gray-100 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{bestStreak}</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Best Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{correctCount}/{totalAnswered}</p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Correct</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {accuracy < 100 && (
            <button
              onClick={onPlayAgain}
              className="w-full rounded-xl border-2 border-indigo-200 bg-white px-6 py-3 text-base font-bold text-indigo-700 transition-all hover:bg-indigo-50 active:scale-95"
            >
              🔄 Play Again
            </button>
          )}
          <button
            onClick={onContinue}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-indigo-500/30 active:scale-95"
          >
            ✅ Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
