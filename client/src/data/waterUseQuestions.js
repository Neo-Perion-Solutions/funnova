/**
 * Water Use Game - Question Data
 * Grade 3 Science | Unit 1: Uses of Water
 * 17 questions across 3 levels (5 easy, 6 mixed, 5 multi-select)
 */

// LEVEL 1 - Easy (5 questions, single select, no timer)
const LEVEL_1_QUESTIONS = [
  {
    id: 'w1',
    question: 'Which activity uses water?',
    emoji: '🤔',
    options: [
      { id: 'a', emoji: '🥤', label: 'Drinking water', isWater: true },
      { id: 'b', emoji: '📚', label: 'Reading a book', isWater: false },
      { id: 'c', emoji: '🎮', label: 'Playing games', isWater: false },
      { id: 'd', emoji: '✏️', label: 'Drawing', isWater: false },
    ],
  },
  {
    id: 'w2',
    question: 'Where is water used at home?',
    emoji: '🏠',
    options: [
      { id: 'a', emoji: '🛁', label: 'Taking a bath', isWater: true },
      { id: 'b', emoji: '📺', label: 'Watching TV', isWater: false },
      { id: 'c', emoji: '🛋️', label: 'Sitting on sofa', isWater: false },
      { id: 'd', emoji: '🎵', label: 'Listening to music', isWater: false },
    ],
  },
  {
    id: 'w3',
    question: 'Which needs water to work?',
    emoji: '🌿',
    options: [
      { id: 'a', emoji: '🌱', label: 'Watering plants', isWater: true },
      { id: 'b', emoji: '🖍️', label: 'Coloring', isWater: false },
      { id: 'c', emoji: '⚽', label: 'Kicking a ball', isWater: false },
      { id: 'd', emoji: '🎨', label: 'Finger painting', isWater: false },
    ],
  },
  {
    id: 'w4',
    question: 'What uses water to clean?',
    emoji: '🧼',
    options: [
      { id: 'a', emoji: '🧺', label: 'Washing clothes', isWater: true },
      { id: 'b', emoji: '🧸', label: 'Playing with toys', isWater: false },
      { id: 'c', emoji: '📖', label: 'Story time', isWater: false },
      { id: 'd', emoji: '🏃', label: 'Running outside', isWater: false },
    ],
  },
  {
    id: 'w5',
    question: 'Which meal needs water?',
    emoji: '🍽️',
    options: [
      { id: 'a', emoji: '🍲', label: 'Cooking soup', isWater: true },
      { id: 'b', emoji: '🍎', label: 'Eating an apple', isWater: false },
      { id: 'c', emoji: '🥪', label: 'Making a sandwich', isWater: false },
      { id: 'd', emoji: '🍌', label: 'Peeling a banana', isWater: false },
    ],
  },
  {
    id: 'w6',
    question: 'What uses water outside?',
    emoji: '🌳',
    options: [
      { id: 'a', emoji: '🚿', label: 'Garden sprinkler', isWater: true },
      { id: 'b', emoji: '🌲', label: 'Climbing a tree', isWater: false },
      { id: 'c', emoji: '🪁', label: 'Flying a kite', isWater: false },
      { id: 'd', emoji: '🏕️', label: 'Camping', isWater: false },
    ],
  },
];

// LEVEL 2 - Mixed (6 questions, single select, no timer)
const LEVEL_2_QUESTIONS = [
  {
    id: 'w7',
    question: 'Which activity uses water?',
    emoji: '🤔',
    options: [
      { id: 'a', emoji: '🦷', label: 'Brushing teeth', isWater: true },
      { id: 'b', emoji: '🎯', label: 'Playing darts', isWater: false },
      { id: 'c', emoji: '🧩', label: 'Doing a puzzle', isWater: false },
      { id: 'd', emoji: '🎲', label: 'Board games', isWater: false },
    ],
  },
  {
    id: 'w8',
    question: 'What do farmers use water for?',
    emoji: '🌾',
    options: [
      { id: 'a', emoji: '🚜', label: 'Driving a tractor', isWater: false },
      { id: 'b', emoji: '🌽', label: 'Watering crops', isWater: true },
      { id: 'c', emoji: '🏚️', label: 'Building a barn', isWater: false },
      { id: 'd', emoji: '🐄', label: 'Feeding hay', isWater: false },
    ],
  },
  {
    id: 'w9',
    question: 'Which uses water to clean?',
    emoji: '🧹',
    options: [
      { id: 'a', emoji: '🧹', label: 'Sweeping floor', isWater: false },
      { id: 'b', emoji: '🚗', label: 'Washing a car', isWater: true },
      { id: 'c', emoji: '🧹', label: 'Dusting shelves', isWater: false },
      { id: 'd', emoji: '📦', label: 'Packing boxes', isWater: false },
    ],
  },
  {
    id: 'w10',
    question: 'What animal needs water daily?',
    emoji: '🐾',
    options: [
      { id: 'a', emoji: '🐠', label: 'Fish in a tank', isWater: true },
      { id: 'b', emoji: '🐦', label: 'Bird in a cage', isWater: false },
      { id: 'c', emoji: '🐱', label: 'Cat sleeping', isWater: false },
      { id: 'd', emoji: '🐇', label: 'Rabbit eating', isWater: false },
    ],
  },
  {
    id: 'w11',
    question: 'Which sport uses the most water?',
    emoji: '🏊',
    options: [
      { id: 'a', emoji: '⚽', label: 'Football', isWater: false },
      { id: 'b', emoji: '🏊', label: 'Swimming', isWater: true },
      { id: 'c', emoji: '🏏', label: 'Cricket', isWater: false },
      { id: 'd', emoji: '🎾', label: 'Tennis', isWater: false },
    ],
  },
  {
    id: 'w12',
    question: 'Which needs water to grow?',
    emoji: '🌻',
    options: [
      { id: 'a', emoji: '🌵', label: 'Cactus', isWater: true },
      { id: 'b', emoji: '🎁', label: 'Plastic plant', isWater: false },
      { id: 'c', emoji: '📄', label: 'Paper flower', isWater: false },
      { id: 'd', emoji: '🧸', label: 'Toy tree', isWater: false },
    ],
  },
];

// LEVEL 3 - Multi-Select (5 questions, multi-select, 15-second timer)
const LEVEL_3_QUESTIONS = [
  {
    id: 'w13',
    question: 'Select ALL uses of water:',
    emoji: '💧',
    options: [
      { id: 'a', emoji: '🥤', label: 'Drinking', isWater: true },
      { id: 'b', emoji: '🧼', label: 'Washing hands', isWater: true },
      { id: 'c', emoji: '🎮', label: 'Gaming', isWater: false },
      { id: 'd', emoji: '🌱', label: 'Growing plants', isWater: true },
    ],
  },
  {
    id: 'w14',
    question: 'Pick ALL activities needing water:',
    emoji: '🌊',
    options: [
      { id: 'a', emoji: '🍲', label: 'Cooking food', isWater: true },
      { id: 'b', emoji: '🏊', label: 'Swimming', isWater: true },
      { id: 'c', emoji: '📚', label: 'Reading', isWater: false },
      { id: 'd', emoji: '🚿', label: 'Showering', isWater: true },
    ],
  },
  {
    id: 'w15',
    question: 'Which of these use water?',
    emoji: '💦',
    options: [
      { id: 'a', emoji: '🦷', label: 'Brushing teeth', isWater: true },
      { id: 'b', emoji: '🎵', label: 'Singing', isWater: false },
      { id: 'c', emoji: '🚗', label: 'Washing a car', isWater: true },
      { id: 'd', emoji: '🖥️', label: 'Using a computer', isWater: false },
    ],
  },
  {
    id: 'w16',
    question: 'Select ALL water activities:',
    emoji: '🏄',
    options: [
      { id: 'a', emoji: '🎨', label: 'Painting', isWater: false },
      { id: 'b', emoji: '🌾', label: 'Watering crops', isWater: true },
      { id: 'c', emoji: '🛁', label: 'Taking a bath', isWater: true },
      { id: 'd', emoji: '🎸', label: 'Guitar playing', isWater: false },
    ],
  },
  {
    id: 'w17',
    question: 'Pick ALL that need water:',
    emoji: '🌿',
    options: [
      { id: 'a', emoji: '🍵', label: 'Making tea', isWater: true },
      { id: 'b', emoji: '🧺', label: 'Doing laundry', isWater: true },
      { id: 'c', emoji: '🏃', label: 'Running', isWater: false },
      { id: 'd', emoji: '🐟', label: 'Fish tank', isWater: true },
    ],
  },
];

export const GAME_LEVELS = {
  0: {
    name: 'Level 1: Obvious Uses',
    icon: '💧',
    description: 'Find the clear water uses!',
    totalQuestions: 5,
    timer: null,
    multiSelect: false,
    difficulty: 'Easy',
  },
  1: {
    name: 'Level 2: Mixed Choices',
    icon: '🌊',
    description: 'Some tricky ones in the mix!',
    totalQuestions: 6,
    timer: null,
    multiSelect: false,
    difficulty: 'Medium',
  },
  2: {
    name: 'Level 3: Multi-Select Challenge',
    icon: '⚡',
    description: 'Pick ALL correct uses. Timer on!',
    totalQuestions: 5,
    timer: 15, // 15 seconds per question
    multiSelect: true,
    difficulty: 'Hard',
  },
};

export const FEEDBACK_MESSAGES = {
  correct: () => {
    const messages = ['💧 Awesome!', '🌊 Correct!', '⭐ Great job!', '🎉 Yes!', '💦 Nice!'];
    return messages[Math.floor(Math.random() * messages.length)];
  },
  wrong: () => '❌ Not quite! Try the next one.',
  timeout: () => '⏰ Time\'s up! Try again!',
};

/**
 * Get random questions from a specific level
 * @param {number} level - 0 (easy), 1 (mixed), 2 (tricky)
 * @param {number} count - How many questions to return
 * @returns {array} Shuffled array of questions
 */
export const getRandomQuestions = (level, count) => {
  let questionPool;

  if (level === 0) {
    questionPool = LEVEL_1_QUESTIONS;
  } else if (level === 1) {
    questionPool = LEVEL_2_QUESTIONS;
  } else if (level === 2) {
    questionPool = LEVEL_3_QUESTIONS;
  }

  // Shuffle and return count
  return [...questionPool].sort(() => Math.random() - 0.5).slice(0, count);
};

/**
 * Calculate star rating based on accuracy
 * @param {number} accuracy - Percentage (0-100)
 * @returns {number} Stars (1, 2, or 3)
 */
export const getStarRating = (accuracy) => {
  if (accuracy >= 85) return 3;
  if (accuracy >= 60) return 2;
  return 1;
};

/**
 * Get all questions for all levels combined (for reference)
 */
export const ALL_QUESTIONS = [...LEVEL_1_QUESTIONS, ...LEVEL_2_QUESTIONS, ...LEVEL_3_QUESTIONS];
