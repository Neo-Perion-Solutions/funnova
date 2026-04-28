import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import WaterUseGame from './WaterUseGame';

/**
 * WaterUseGameWrapper - GameEngine-compatible wrapper
 * Manages progression through all 3 levels and returns final results
 *
 * Props from GameEngine:
 *   state: Game state object
 *   actions: Game action dispatchers
 *   config: Game configuration
 *   onFinish: Callback with final results { gameId, score, accuracy }
 *   gameDbId: Database ID of the game record
 */
const WaterUseGameWrapper = ({ state, actions, config, onFinish, gameDbId }) => {
  const [sessionScores, setSessionScores] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');

  const handleLevelComplete = useCallback(
    (levelData) => {
      const level = levelData.level;
      const updatedScores = {
        ...sessionScores,
        [level]: levelData,
      };
      setSessionScores(updatedScores);

      // All 3 levels complete (0, 1, 2)
      if (level === 2) {
        // Calculate final scores
        const totalScore = Object.values(updatedScores).reduce(
          (sum, s) => sum + (s.score || 0),
          0
        );
        const totalCorrect = Object.values(updatedScores).reduce(
          (sum, s) => sum + (s.correct || 0),
          0
        );
        const totalQuestions = Object.values(updatedScores).reduce(
          (sum, s) => sum + (s.total || 0),
          0
        );
        const finalAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
        const bestStreak = Math.max(
          ...Object.values(updatedScores).map((s) => s.streak || 0)
        );

        // Show completion screen briefly then call onFinish
        setTimeout(() => {
          if (onFinish) {
            onFinish({
              gameId: gameDbId,
              score: totalScore,
              accuracy: finalAccuracy,
              bestStreak,
              totalCorrect,
              totalQuestions,
            });
          }
        }, 500);
      }
    },
    [sessionScores, gameDbId, onFinish]
  );

  return (
    <div className="w-full h-full">
      <WaterUseGame
        currentLevel={0}
        isLessonMode={false}
        onLevelComplete={handleLevelComplete}
      />
    </div>
  );
};

export default WaterUseGameWrapper;
