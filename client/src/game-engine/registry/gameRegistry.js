// file: client/src/game-engine/registry/gameRegistry.js

import NumberBuilder from '../games/number-builder/NumberBuilder';
import numberBuilderConfig from '../games/number-builder/config';

/**
 * Game Registry — central mapping of gameId → game component + config.
 *
 * To add a new game:
 * 1. Create game folder in games/
 * 2. Import component and config here
 * 3. Call registerGame() below
 *
 * That's it. No core engine changes needed.
 */

const registry = new Map();

/**
 * Register a game in the registry.
 */
export function registerGame(id, entry) {
  if (!id || !entry.component) {
    throw new Error(`registerGame: id and component are required`);
  }
  registry.set(id, {
    component: entry.component,
    config: entry.config || {},
  });
}

/**
 * Get a game entry by its ID.
 * Returns { component, config } or null.
 */
export function getGame(id) {
  return registry.get(id) || null;
}

/**
 * Check if a game exists in the registry.
 */
export function hasGame(id) {
  return registry.has(id);
}

/**
 * Get all registered game IDs.
 */
export function getRegisteredGameIds() {
  return [...registry.keys()];
}

// =============================================
// Register built-in games
// =============================================

registerGame('number-builder', {
  component: NumberBuilder,
  config: numberBuilderConfig,
});

export default registry;
