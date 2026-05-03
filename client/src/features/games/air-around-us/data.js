export const AIR_OBJECTS = [
  { id: 1, name: 'Human', emoji: '👦', needsAir: true, reaction: 'breathing', message: 'Human needs air to breathe' },
  { id: 2, name: 'Fish', emoji: '🐟', needsAir: true, reaction: 'swimming', message: 'Fish needs air in water' },
  { id: 3, name: 'Balloon', emoji: '🎈', needsAir: true, reaction: 'inflate', message: 'Balloon needs air to inflate' },
  { id: 4, name: 'Windmill', emoji: '🎡', needsAir: true, reaction: 'spin', message: 'Windmill uses moving air to spin' },
  { id: 5, name: 'Plant', emoji: '🌿', needsAir: true, reaction: 'sway', message: 'Plants need air to make food' },
  { id: 6, name: 'Stone', emoji: '🪨', needsAir: false, reaction: 'none', message: 'Stone does not need air' },
  { id: 7, name: 'Chair', emoji: '🪑', needsAir: false, reaction: 'none', message: 'Chair does not need air' },
  { id: 8, name: 'Book', emoji: '📖', needsAir: false, reaction: 'none', message: 'Book does not need air' },
];

export const GAME_LEVELS = [
  {
    level: 1,
    title: 'Tap What Needs Air',
    instruction: 'Tap the things that need air!',
    type: 'tap',
    timer: null,
    rounds: 5,
  },
  {
    level: 2,
    title: 'Interact With Air',
    instruction: 'Drag the WIND to see what happens!',
    type: 'drag-air',
    timer: null,
    rounds: 5,
  },
  {
    level: 3,
    title: 'Speed Challenge',
    instruction: 'Quick! Tap things that need air before time runs out!',
    type: 'tap-speed',
    timer: 15,
    rounds: 6,
  }
];

export const getRandomObjects = (count, requireMix = false) => {
  const shuffled = [...AIR_OBJECTS].sort(() => 0.5 - Math.random());
  if (!requireMix) return shuffled.slice(0, count);

  // Ensure at least one that needs air and one that doesn't
  const needs = shuffled.find(o => o.needsAir);
  const doesnt = shuffled.find(o => !o.needsAir);
  
  const rest = shuffled.filter(o => o.id !== needs.id && o.id !== doesnt.id);
  const selected = [needs, doesnt, ...rest.slice(0, count - 2)];
  return selected.sort(() => 0.5 - Math.random());
};
