// file: client/src/game-engine/hooks/useGameState.js

import { useReducer, useCallback } from 'react';
import { gameReducer, INITIAL_STATE, ACTIONS } from '../core/StateManager';

/**
 * Hook that wraps the centralized game reducer.
 * Every game uses this to get consistent state + dispatch.
 */
export function useGameState(config = {}) {
  const initialState = {
    ...INITIAL_STATE,
    totalRounds: config.totalRounds || INITIAL_STATE.totalRounds,
    timeLeft: config.timePerRound || INITIAL_STATE.timeLeft,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const correct = useCallback((points) => {
    dispatch({ type: ACTIONS.CORRECT, payload: { points } });
  }, []);

  const wrong = useCallback(() => {
    dispatch({ type: ACTIONS.WRONG });
  }, []);

  const nextLevel = useCallback((timePerRound) => {
    dispatch({ type: ACTIONS.NEXT_LEVEL, payload: { timePerRound } });
  }, []);

  const reset = useCallback((newConfig) => {
    dispatch({ type: ACTIONS.RESET, payload: newConfig });
  }, []);

  const finish = useCallback(() => {
    dispatch({ type: ACTIONS.FINISH });
  }, []);

  const tick = useCallback(() => {
    dispatch({ type: ACTIONS.TICK });
  }, []);

  return {
    state,
    dispatch,
    actions: { correct, wrong, nextLevel, reset, finish, tick },
  };
}
