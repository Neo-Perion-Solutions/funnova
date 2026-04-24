// file: client/src/game-engine/games/number-builder/logic.js

import { randomInt, shuffleArray } from '../../utils/random';

/**
 * Generate a random number with exactly `digits` digits.
 * Ensures the first digit is never 0.
 */
export function generateNumber(digits = 4) {
  const min = Math.pow(10, digits - 1);       // e.g., 1000
  const max = Math.pow(10, digits) - 1;        // e.g., 9999
  return randomInt(min, max);
}

/**
 * Break a number into its individual digits.
 * Returns array of digit strings.
 */
export function getDigits(number) {
  return String(number).split('');
}

/**
 * Get shuffled digits of a number.
 * Ensures the shuffled order is different from the original.
 */
export function shuffleDigits(number) {
  const digits = getDigits(number);
  let shuffled = shuffleArray(digits);

  // If by chance the shuffle produced the same order, shuffle again (up to 5 tries)
  let attempts = 0;
  while (shuffled.join('') === digits.join('') && attempts < 5) {
    shuffled = shuffleArray(digits);
    attempts++;
  }

  return shuffled;
}

/**
 * Validate if selected digits (in order) match the target number.
 */
export function validateAnswer(selected, targetNumber) {
  const targetDigits = getDigits(targetNumber);
  if (selected.length !== targetDigits.length) return false;
  return selected.every((digit, idx) => digit === targetDigits[idx]);
}

/**
 * Get place value label for a position (ones, tens, hundreds, thousands).
 */
export function getPlaceLabel(position, totalDigits) {
  const labels = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten Thousands'];
  const idx = totalDigits - 1 - position;
  return labels[idx] || `Position ${position + 1}`;
}
