import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PlantOrAnimalGame from './PlantOrAnimalGame';

/**
 * PlantOrAnimalLessonGame
 *
 * Wraps the PlantOrAnimalGame for use within lesson assessment roadmaps.
 * - Launches the game with lesson context
 * - Returns results in lesson-compatible format
 * - Integrates with handleGameFinish callback
 */
const PlantOrAnimalLessonGame = ({ gameId, gameDbId, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGameComplete = (results) => {
    // Format results for lesson integration
    const gameResult = {
      gameId: gameDbId || gameId,
      score: results.score,
      accuracy: results.accuracy,
      level: results.level,
      correct: results.correct,
      total: results.total,
    };

    // Notify lesson that game is complete
    onFinish(gameResult);
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50">
        <PlantOrAnimalGameWrapper
          onComplete={handleGameComplete}
          onExit={() => setIsPlaying(false)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🌱</span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Plant or Animal?</h3>
            <p className="text-sm text-gray-600">
              Test your knowledge with 3 levels of increasing difficulty!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>🌱</span>
            <span>Level 1: Clear Examples (5 questions)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>🌿</span>
            <span>Level 2: Mixed Objects (6 questions)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>⚡</span>
            <span>Level 3: Speed Challenge (10s per question)</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          🎮 Start Game Challenge
        </motion.button>
      </div>
    </motion.div>
  );
};

/**
 * PlantOrAnimalGameWrapper
 * Handles full-screen game display and result passing
 */
const PlantOrAnimalGameWrapper = ({ onComplete, onExit }) => {
  const handleLevelComplete = (levelData) => {
    // For now, complete after all 3 levels OR allow exiting after first level
    // This implementation completes the game after Level 1 completes
    // Users can replay to play other levels
    onComplete(levelData);
  };

  return (
    <div className="fixed inset-0 z-50">
      <PlantOrAnimalGame
        onLevelComplete={handleLevelComplete}
        onExit={onExit}
        showBackButton={true}
      />
    </div>
  );
};

export default PlantOrAnimalLessonGame;
