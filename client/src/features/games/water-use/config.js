/**
 * Water Use Game Configuration
 * Game configuration for GameEngine registry
 */

export const waterUseConfig = {
  id: 'water-use',
  title: 'Water Use Game',
  description: 'Learn about water uses in daily life across 3 levels',
  emoji: '💧',
  totalRounds: 3,
  timePerRound: 0,
  levels: [
    {
      id: 0,
      title: '💧 Level 1: Obvious Uses',
      description: 'Find the clear water uses!',
      questions: 5,
      hasTimer: false,
      difficulty: 'Easy',
    },
    {
      id: 1,
      title: '🌊 Level 2: Mixed Choices',
      description: 'Some tricky ones in the mix!',
      questions: 6,
      hasTimer: false,
      difficulty: 'Medium',
    },
    {
      id: 2,
      title: '⚡ Level 3: Multi-Select Challenge',
      description: 'Pick ALL correct uses. Timer on!',
      questions: 5,
      hasTimer: true,
      timerDuration: 15,
      multiSelect: true,
      difficulty: 'Hard',
    },
  ],
};
