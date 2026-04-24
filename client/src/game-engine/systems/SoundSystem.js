// file: client/src/game-engine/systems/SoundSystem.js

/**
 * Sound system stub.
 * Uses the Web Audio API to play simple sound effects.
 * Currently generates tones programmatically — can be wired
 * to actual sound files later by changing the play functions.
 */

class SoundSystemClass {
  constructor() {
    this._enabled = true;
    this._ctx = null;
  }

  _getContext() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        this._enabled = false;
      }
    }
    return this._ctx;
  }

  _playTone(frequency, duration = 0.15, type = 'sine') {
    if (!this._enabled) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Silently fail — sound is non-critical
    }
  }

  playCorrect() {
    this._playTone(523.25, 0.1); // C5
    setTimeout(() => this._playTone(659.25, 0.15), 100); // E5
  }

  playWrong() {
    this._playTone(200, 0.3, 'square');
  }

  playComplete() {
    this._playTone(523.25, 0.1);
    setTimeout(() => this._playTone(659.25, 0.1), 120);
    setTimeout(() => this._playTone(783.99, 0.2), 240); // G5
  }

  playClick() {
    this._playTone(800, 0.05);
  }

  setEnabled(enabled) {
    this._enabled = enabled;
  }

  isEnabled() {
    return this._enabled;
  }
}

// Export singleton instance
export const SoundSystem = new SoundSystemClass();
export default SoundSystem;
