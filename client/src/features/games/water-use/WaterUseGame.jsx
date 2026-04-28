import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import GameLoginScreen from './GameLoginScreen';
import GameLevelIntroScreen from './GameLevelIntroScreen';
import GamePlayScreen from './GamePlayScreen';
import GameResultsScreen from './GameResultsScreen';
import { getRandomQuestions, GAME_LEVELS } from '../../../data/waterUseQuestions';
import { gameService } from '../../../services/game.service';

/**
 * WaterUseGame - Main game component
 * Can run standalone or in lesson mode
 *
 * Props:
 *   currentLevel: Starting level (default 0)
 *   onLevelComplete: Callback when a level completes
 *   isLessonMode: If true, skip login (use preset player data)
 *   playerName: Pre-set player name (lesson mode)
 *   playerAvatar: Pre-set player avatar (lesson mode)
 */
const WaterUseGame = ({
  currentLevel: startLevel = 0,
  onLevelComplete: onLevelCompleteExternal = null,
  isLessonMode = false,
  playerName: presetPlayerName = null,
  playerAvatar: presetPlayerAvatar = null,
}) => {
  const { student } = useAuth();

  // Game state
  const [screen, setScreen] = useState(isLessonMode ? 'levelIntro' : 'login');
  const [playerName, setPlayerName] = useState(presetPlayerName || '');
  const [playerAvatar, setPlayerAvatar] = useState(presetPlayerAvatar || '');
  const [currentLevel, setCurrentLevel] = useState(startLevel);
  const [questions, setQuestions] = useState([]);
  const [levelResults, setLevelResults] = useState({});
  const [sessionScores, setSessionScores] = useState({});

  // Handle login
  const handleLogin = (data) => {
    setPlayerName(data.name);
    setPlayerAvatar(data.avatar);
    setCurrentLevel(0);
    setSessionScores({});
    setLevelResults({});
    proceedToLevelIntro(0);
  };

  // Go to level intro
  const proceedToLevelIntro = (levelNum) => {
    setCurrentLevel(levelNum);
    setScreen('levelIntro');
  };

  // Begin level gameplay
  const beginLevel = () => {
    const level = GAME_LEVELS[currentLevel];
    const randomQuestions = getRandomQuestions(currentLevel, level.totalQuestions);
    setQuestions(randomQuestions);
    setScreen('gameplay');
  };

  // Handle level complete
  const handleLevelComplete = async (data) => {
    setLevelResults(data);

    // Save score to backend
    if (!isLessonMode) {
      try {
        await gameService.saveGameScore({
          student_id: student?.id,
          game_id: 'water-use-grade3',
          level: data.level,
          total_score: data.score,
          accuracy_pct: data.accuracy,
          correct: data.correct,
          total: data.total,
          streak: data.streak,
        });
      } catch (error) {
        console.warn('Failed to save score:', error);
      }
    }

    // Track session scores
    const updatedScores = {
      ...sessionScores,
      [data.level]: data,
    };
    setSessionScores(updatedScores);

    // Show results
    setScreen('results');

    // Notify parent if in lesson mode
    if (isLessonMode && onLevelCompleteExternal) {
      setTimeout(() => {
        onLevelCompleteExternal(data);
      }, 500);
    }
  };

  // Replay current level
  const handleReplay = () => {
    proceedToLevelIntro(currentLevel);
  };

  // Go to next level
  const handleNextLevel = () => {
    if (currentLevel < 2) {
      proceedToLevelIntro(currentLevel + 1);
    } else {
      // All levels complete
      setScreen('gameComplete');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <GameLoginScreen key="login" onStart={handleLogin} />
        )}

        {screen === 'levelIntro' && (
          <GameLevelIntroScreen
            key="levelIntro"
            level={currentLevel}
            onStart={beginLevel}
          />
        )}

        {screen === 'gameplay' && (
          <GamePlayScreen
            key="gameplay"
            level={currentLevel}
            questions={questions}
            playerName={playerName}
            playerAvatar={playerAvatar}
            onLevelComplete={handleLevelComplete}
          />
        )}

        {screen === 'results' && (
          <GameResultsScreen
            key="results"
            playerAvatar={playerAvatar}
            playerName={playerName}
            score={levelResults.score}
            correct={levelResults.correct}
            total={levelResults.total}
            bestStreak={levelResults.streak}
            level={currentLevel}
            onReplay={handleReplay}
            onNext={handleNextLevel}
          />
        )}

        {screen === 'gameComplete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-blue-300 to-blue-100 flex items-center justify-center"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-7xl mb-6"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                All Levels Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                You mastered the Water Use Game! 💧
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => proceedToLevelIntro(0)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl text-lg"
              >
                Play Again! 🎮
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaterUseGame;
