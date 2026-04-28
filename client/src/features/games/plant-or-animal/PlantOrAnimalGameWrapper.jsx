import React, { useState } from 'react';
import PlantOrAnimalGame from './PlantOrAnimalGame';

/**
 * PlantOrAnimalGameWrapper - GameEngine compatible component
 *
 * Wraps PlantOrAnimalGame for use within the GameEngine.
 * Handles the 3-level game and reports final results via onFinish.
 */
const PlantOrAnimalGameWrapper = ({ state, actions, config, onFinish, gameDbId }) => {
  const [sessionScores, setSessionScores] = useState({});
  const [finalResult, setFinalResult] = useState(null);

  const handleLevelComplete = (levelData) => {
    const scores = {
      ...sessionScores,
      [levelData.level]: levelData,
    };
    setSessionScores(scores);

    // If this was Level 3 (last level), calculate final score
    if (levelData.level === 3) {
      const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
      const allAnswers = Object.values(scores).reduce((sum, s) => sum + s.correct, 0);
      const totalQuestions = Object.values(scores).reduce((sum, s) => sum + s.total, 0);
      const finalAccuracy = Math.round((allAnswers / totalQuestions) * 100);

      const result = {
        gameId: gameDbId,
        score: totalScore,
        accuracy: finalAccuracy,
      };

      setFinalResult(result);

      // Call GameEngine's onFinish callback
      if (onFinish) {
        setTimeout(() => onFinish(result), 500);
      }
      return;
    }

    // Continue to next level (auto-progression in PlantOrAnimalGame)
  };

  // If game is done, show a brief completion screen
  if (finalResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-200 to-green-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Game Complete!</h2>
          <p className="text-emerald-600">Score: {finalResult.score} | Accuracy: {finalResult.accuracy}%</p>
        </div>
      </div>
    );
  }

  return (
    <PlantOrAnimalGame
      currentLevel={1}
      onLevelComplete={handleLevelComplete}
      isLessonMode={true}
      showLevelProgression={true}
    />
  );
};

export default PlantOrAnimalGameWrapper;

