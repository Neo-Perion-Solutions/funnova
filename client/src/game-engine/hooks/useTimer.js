// file: client/src/game-engine/hooks/useTimer.js

import { useEffect, useRef } from 'react';

/**
 * Countdown timer hook.
 * Decrements timeLeft via dispatch every second.
 * Calls onTimeUp when timer hits zero.
 */
export function useTimer({ state, dispatch, onTimeUp, enabled = true }) {
  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref current
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!enabled || state.isFinished || state.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, state.isFinished, state.isPaused, dispatch]);

  // Watch for time reaching zero
  useEffect(() => {
    if (state.timeLeft <= 0 && enabled && !state.isFinished) {
      onTimeUpRef.current?.();
    }
  }, [state.timeLeft, enabled, state.isFinished]);
}
