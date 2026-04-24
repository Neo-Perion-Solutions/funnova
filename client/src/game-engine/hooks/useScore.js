// file: client/src/game-engine/hooks/useScore.js

import { useMemo } from 'react';
import { calculateAccuracy } from '../utils/helpers';

/**
 * Derived scoring data from game state.
 * Use this to get display-ready values for HUD and ScoreBoard.
 */
export function useScore(state) {
  const totalAnswered = state.correctCount + state.wrongCount;

  const accuracy = useMemo(
    () => calculateAccuracy(state.correctCount, totalAnswered),
    [state.correctCount, totalAnswered]
  );

  const progressPct = useMemo(
    () => state.totalRounds > 0
      ? Math.round(((state.currentRound - 1) / state.totalRounds) * 100)
      : 0,
    [state.currentRound, state.totalRounds]
  );

  return {
    totalScore: state.score,
    accuracy,
    currentStreak: state.streak,
    bestStreak: state.bestStreak,
    correctCount: state.correctCount,
    wrongCount: state.wrongCount,
    totalAnswered,
    progressPct,
    level: state.level,
    isFinished: state.isFinished,
  };
}
