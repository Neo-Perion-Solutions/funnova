// file: client/src/game-engine/systems/InputSystem.js

/**
 * Keyboard input system.
 * Provides helper functions for games that need keyboard interaction.
 */

/**
 * Subscribe to key press events.
 * Returns an unsubscribe function.
 *
 * @param {string|string[]} keys - Key(s) to listen for (e.g., 'Enter', ['ArrowLeft', 'ArrowRight'])
 * @param {Function} callback - Called with the KeyboardEvent
 */
export function onKeyPress(keys, callback) {
  const keySet = new Set(Array.isArray(keys) ? keys : [keys]);

  const handler = (e) => {
    if (keySet.has(e.key)) {
      e.preventDefault();
      callback(e);
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

/**
 * Subscribe to key release events.
 * Returns an unsubscribe function.
 */
export function onKeyRelease(keys, callback) {
  const keySet = new Set(Array.isArray(keys) ? keys : [keys]);

  const handler = (e) => {
    if (keySet.has(e.key)) {
      callback(e);
    }
  };

  window.addEventListener('keyup', handler);
  return () => window.removeEventListener('keyup', handler);
}

/**
 * React hook-friendly: use inside useEffect.
 *
 * useEffect(() => {
 *   return onKeyPress('Enter', () => submitAnswer());
 * }, []);
 */
