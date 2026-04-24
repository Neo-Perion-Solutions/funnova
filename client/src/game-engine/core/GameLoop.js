// file: client/src/game-engine/core/GameLoop.js

/**
 * Simple game loop using requestAnimationFrame.
 * Provides a tick system that games can hook into for
 * frame-based updates (timer countdown, animations, etc).
 */

export class GameLoop {
  constructor() {
    this._callbacks = [];
    this._rafId = null;
    this._running = false;
    this._lastTime = 0;
    this._interval = 1000; // default 1 second tick
  }

  /**
   * Register a callback to be called on each tick.
   * Returns an unsubscribe function.
   */
  onTick(callback) {
    this._callbacks.push(callback);
    return () => {
      this._callbacks = this._callbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Set the tick interval in milliseconds.
   */
  setInterval(ms) {
    this._interval = ms;
  }

  /**
   * Start the game loop.
   */
  start() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._tick();
  }

  /**
   * Stop the game loop.
   */
  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _tick() {
    if (!this._running) return;

    const now = performance.now();
    const delta = now - this._lastTime;

    if (delta >= this._interval) {
      this._lastTime = now - (delta % this._interval);
      this._callbacks.forEach((cb) => cb(delta));
    }

    this._rafId = requestAnimationFrame(() => this._tick());
  }
}

export default GameLoop;
