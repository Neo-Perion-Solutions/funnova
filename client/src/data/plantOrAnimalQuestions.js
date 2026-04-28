// Plant or Animal? Game Questions - Grade 3 Science Unit 1
// FunNova Science - World Around Us

export const GAME_LEVELS = {
  1: {
    title: '🌱 Clear Examples',
    description: 'Easy level - pick obvious plants and animals',
    emoji: '🌱',
    timer: null,
    totalQuestions: 5,
    questions: [
      { id: 1, name: 'Oak Tree', emoji: '🌳', answer: 'plant' },
      { id: 2, name: 'Cat', emoji: '🐱', answer: 'animal' },
      { id: 3, name: 'Sunflower', emoji: '🌻', answer: 'plant' },
      { id: 4, name: 'Dog', emoji: '🐕', answer: 'animal' },
      { id: 5, name: 'Palm Tree', emoji: '🌴', answer: 'plant' },
      { id: 6, name: 'Duck', emoji: '🦆', answer: 'animal' },
      { id: 7, name: 'Rose', emoji: '🌹', answer: 'plant' },
      { id: 8, name: 'Cow', emoji: '🐄', answer: 'animal' },
    ],
  },
  2: {
    title: '🌿 Mixed Objects',
    description: 'Medium level - spot tricky items',
    emoji: '🌿',
    timer: null,
    totalQuestions: 6,
    questions: [
      { id: 9, name: 'Cactus', emoji: '🌵', answer: 'plant' },
      { id: 10, name: 'Elephant', emoji: '🐘', answer: 'animal' },
      { id: 11, name: 'Mushroom', emoji: '🍄', answer: 'plant' },
      { id: 12, name: 'Butterfly', emoji: '🦋', answer: 'animal' },
      { id: 13, name: 'Fern', emoji: '🌿', answer: 'plant' },
      { id: 14, name: 'Turtle', emoji: '🐢', answer: 'animal' },
      { id: 15, name: 'Wheat', emoji: '🌾', answer: 'plant' },
      { id: 16, name: 'Fox', emoji: '🦊', answer: 'animal' },
      { id: 17, name: 'Bamboo', emoji: '🎋', answer: 'plant' },
      { id: 18, name: 'Frog', emoji: '🐸', answer: 'animal' },
    ],
  },
  3: {
    title: '⚡ Speed Challenge!',
    description: 'Hard level - 10 seconds per question!',
    emoji: '⚡',
    timer: 10,
    totalQuestions: 6,
    questions: [
      { id: 19, name: 'Hibiscus', emoji: '🌺', answer: 'plant' },
      { id: 20, name: 'Shark', emoji: '🦈', answer: 'animal' },
      { id: 21, name: 'Clover', emoji: '🍀', answer: 'plant' },
      { id: 22, name: 'Eagle', emoji: '🦅', answer: 'animal' },
      { id: 23, name: 'Seaweed', emoji: '🌊', answer: 'plant' },
      { id: 24, name: 'Lizard', emoji: '🦎', answer: 'animal' },
      { id: 25, name: 'Lotus', emoji: '🪷', answer: 'plant' },
      { id: 26, name: 'Octopus', emoji: '🐙', answer: 'animal' },
      { id: 27, name: 'Aloe Vera', emoji: '🌱', answer: 'plant' },
      { id: 28, name: 'Crab', emoji: '🦀', answer: 'animal' },
    ],
  },
};

export const FEEDBACK_MESSAGES = {
  correct: [
    '🎉 Great job!',
    '⭐ Correct!',
    '🌟 Awesome!',
    '🎊 Yes!',
    '✅ Well done!',
  ],
  wrong: (answer) => `❌ Oops! It was a ${answer === 'plant' ? '🌿 plant' : '🐾 animal'}!`,
  timeout: (answer) => `⏰ Too slow! It was a ${answer === 'plant' ? '🌿 plant' : '🐾 animal'}!`,
};

// Shuffle array
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random questions for a level
export const getRandomQuestions = (levelId, count) => {
  const level = GAME_LEVELS[levelId];
  if (!level) return [];
  const shuffled = shuffleArray(level.questions);
  return shuffled.slice(0, count);
};

// Calculate star rating
export const getStarRating = (accuracy) => {
  if (accuracy >= 85) return 3;
  if (accuracy >= 60) return 2;
  return 1;
};
