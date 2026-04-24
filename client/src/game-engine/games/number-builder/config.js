// file: client/src/game-engine/games/number-builder/config.js

/**
 * Number Builder game configuration.
 * Adjust these values to change difficulty.
 */
const numberBuilderConfig = {
  /** Total rounds per game session */
  totalRounds: 5,

  /** Points awarded per correct answer */
  pointsPerCorrect: 10,

  /** Number of digits in the target number */
  digits: 4,

  /** Seconds per round (0 = no timer) */
  timePerRound: 30,

  /** Game display name */
  title: 'Number Builder',

  /** Game instructions shown to student */
  instructions: 'Tap the digits in the correct order to build the number!',
};

export default numberBuilderConfig;
