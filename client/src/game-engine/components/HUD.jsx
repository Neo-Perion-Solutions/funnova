// file: client/src/game-engine/components/HUD.jsx

import React from 'react';
import Timer from './Timer';

/**
 * Heads-Up Display shown during gameplay.
 * Displays: score, streak, level/round, and timer.
 * Kid-friendly with large text and bright colors.
 */
const HUD = ({ state, config = {} }) => {
  const showTimer = config.timePerRound && config.timePerRound > 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white border-2 border-indigo-100 px-4 py-3 shadow-sm mb-4">
      {/* Score */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⭐</span>
        <div className="text-center">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Score</p>
          <p className="text-lg font-black text-indigo-700 leading-tight">{state.score}</p>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg">{state.streak >= 3 ? '🔥' : '⚡'}</span>
        <div className="text-center">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Streak</p>
          <p className="text-lg font-black text-amber-600 leading-tight">{state.streak}</p>
        </div>
      </div>

      {/* Round */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg">🎯</span>
        <div className="text-center">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Round</p>
          <p className="text-lg font-black text-emerald-700 leading-tight">
            {Math.min(state.currentRound, state.totalRounds)}/{state.totalRounds}
          </p>
        </div>
      </div>

      {/* Timer */}
      {showTimer && (
        <Timer timeLeft={state.timeLeft} maxTime={config.timePerRound} />
      )}
    </div>
  );
};

export default HUD;
