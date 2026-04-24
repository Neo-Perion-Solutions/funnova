// file: client/src/game-engine/core/StateManager.js

/**
 * Centralized game state reducer.
 * All games share this state shape and action types,
 * ensuring consistent scoring, streaks, and level tracking.
 */

export const INITIAL_STATE = {
  score: 0,
  streak: 0,
  bestStreak: 0,
  level: 1,
  totalRounds: 5,
  currentRound: 1,
  correctCount: 0,
  wrongCount: 0,
  timeLeft: 30,
  isFinished: false,
  isPaused: false,
};

export const ACTIONS = {
  CORRECT: 'CORRECT',
  WRONG: 'WRONG',
  NEXT_LEVEL: 'NEXT_LEVEL',
  RESET: 'RESET',
  TICK: 'TICK',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  FINISH: 'FINISH',
  SET_CONFIG: 'SET_CONFIG',
};

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.CORRECT: {
      const points = action.payload?.points || 10;
      const newStreak = state.streak + 1;
      return {
        ...state,
        score: state.score + points,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        correctCount: state.correctCount + 1,
      };
    }

    case ACTIONS.WRONG: {
      return {
        ...state,
        streak: 0,
        wrongCount: state.wrongCount + 1,
      };
    }

    case ACTIONS.NEXT_LEVEL: {
      const nextRound = state.currentRound + 1;
      const isFinished = nextRound > state.totalRounds;
      return {
        ...state,
        level: state.level + 1,
        currentRound: nextRound,
        isFinished,
        timeLeft: action.payload?.timePerRound || state.timeLeft,
      };
    }

    case ACTIONS.TICK: {
      const newTime = Math.max(0, state.timeLeft - 1);
      return {
        ...state,
        timeLeft: newTime,
      };
    }

    case ACTIONS.PAUSE:
      return { ...state, isPaused: true };

    case ACTIONS.RESUME:
      return { ...state, isPaused: false };

    case ACTIONS.FINISH:
      return { ...state, isFinished: true };

    case ACTIONS.RESET: {
      const config = action.payload || {};
      return {
        ...INITIAL_STATE,
        totalRounds: config.totalRounds || INITIAL_STATE.totalRounds,
        timeLeft: config.timePerRound || INITIAL_STATE.timeLeft,
      };
    }

    case ACTIONS.SET_CONFIG: {
      return {
        ...state,
        totalRounds: action.payload.totalRounds || state.totalRounds,
        timeLeft: action.payload.timePerRound || state.timeLeft,
      };
    }

    default:
      return state;
  }
}
