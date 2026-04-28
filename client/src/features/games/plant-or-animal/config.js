// Plant or Animal Game Config for GameEngine

export const plantOrAnimalConfig = {
  id: 'plant-or-animal',
  title: 'Plant or Animal?',
  description: 'Classify items as plants or animals across 3 levels',
  emoji: '🌱',
  totalRounds: 3,  // 3 levels
  timePerRound: 0,  // No timer for individual questions, only Level 3 has timer
  levels: [
    {
      id: 1,
      title: '🌱 Clear Examples',
      questions: 5,
      hasTimer: false,
    },
    {
      id: 2,
      title: '🌿 Mixed Objects',
      questions: 6,
      hasTimer: false,
    },
    {
      id: 3,
      title: '⚡ Speed Challenge',
      questions: 6,
      hasTimer: true,
      timerDuration: 10,
    },
  ],
};

export default plantOrAnimalConfig;
