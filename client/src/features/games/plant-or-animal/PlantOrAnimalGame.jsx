import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import GameLoginScreen from './GameLoginScreen';
import GameLevelIntroScreen from './GameLevelIntroScreen';
import GamePlayScreen from './GamePlayScreen';
import GameResultsScreen from './GameResultsScreen';
import GameResultsModal from './GameResultsModal';
import { getRandomQuestions, GAME_LEVELS } from '../../../data/plantOrAnimalQuestions';
import { gameService } from '../../../services/game.service';

/**
 * PlantOrAnimalGame - Standalone or Lesson-Integrated Game
 *
 * Props:
 *   currentLevel: Starting level (default 1)
 *   onLevelComplete: Callback when a level completes
 *   isLessonMode: If true, skip login screen (default false)
 *   showLevelProgression: If true, allow playing all 3 levels in sequence
 *   playerName: Pre-set player name (lesson mode)
 *   playerAvatar: Pre-set player avatar (lesson mode)
 */
const PlantOrAnimalGame = ({
  currentLevel: startLevel = 1,
  onLevelComplete: onLevelCompleteExternal = null,
  isLessonMode = false,
  showLevelProgression = false,
  playerName: presetPlayerName = null,
  playerAvatar: presetPlayerAvatar = null,
}) => {
  const navigate = useNavigate();
  const { student } = useAuth();

  // Game states
  const [screen, setScreen] = useState(isLessonMode ? 'levelIntro' : 'login');
  const [playerName, setPlayerName] = useState(presetPlayerName || '');
  const [playerAvatar, setPlayerAvatar] = useState(presetPlayerAvatar || '');
  const [currentLevel, setCurrentLevel] = useState(startLevel);
  const [questions, setQuestions] = useState([]);
  const [levelData, setLevelData] = useState(null);
  const [sessionScores, setSessionScores] = useState({});

  // Handle login
  const handleLogin = (data) => {
    setPlayerName(data.name);
    setPlayerAvatar(data.avatar);
    setCurrentLevel(1);
    setSessionScores({});
    proceedToLevelIntro(1);
  };

  // Proceed to level intro
  const proceedToLevelIntro = (levelNum) => {
    setCurrentLevel(levelNum);
    setScreen('levelIntro');
  };

  // Start level gameplay
  const beginLevel = () => {
    const level = GAME_LEVELS[currentLevel];
    const randomQuestions = getRandomQuestions(currentLevel, level.totalQuestions);
    setQuestions(randomQuestions);
    setScreen('gameplay');
  };

  // Handle level complete
  const handleLevelComplete = async (data) => {
    setLevelData(data);

    // Save score to backend (if not in lesson mode, or always?)
    if (!isLessonMode) {
      try {
        await gameService.saveGameScore({
          student_id: student?.id,
          game_id: 'plant-animal-grade3',
          level: data.level,
          total_score: data.score,
          accuracy_pct: data.accuracy,
          correct: data.correct,
          total: data.total,
          streak: data.streak,
        });
      } catch (error) {
        console.warn('Failed to save score to backend:', error);
      }
    }

    // Track session scores
    const updatedScores = {
      ...sessionScores,
      [data.level]: data,
    };
    setSessionScores(updatedScores);

    // Always show results screen
    setScreen('results');

    // If in lesson mode, also call external callback
    if (isLessonMode && onLevelCompleteExternal) {
      // Wait for modal to show, then call callback
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
    if (currentLevel < 3) {
      proceedToLevelIntro(currentLevel + 1);
    } else {
      // All levels complete - go back
      if (isLessonMode) {
        // In lesson mode, already called onLevelCompleteExternal
        return;
      }
      navigate('/student/dashboard');
    }
  };

  const hasNextLevel = currentLevel < 3;

  return (
    <AnimatePresence mode="wait">
      {screen === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GameLoginScreen onLogin={handleLogin} />
        </motion.div>
      )}

      {screen === 'levelIntro' && (
        <motion.div
          key="levelIntro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GameLevelIntroScreen currentLevel={currentLevel} onStart={beginLevel} />
        </motion.div>
      )}

      {screen === 'gameplay' && (
        <motion.div
          key="gameplay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GamePlayScreen
            currentLevel={currentLevel}
            questions={questions}
            playerName={playerName}
            playerAvatar={playerAvatar}
            onLevelComplete={handleLevelComplete}
          />
        </motion.div>
      )}

      {screen === 'results' && levelData && (
        isLessonMode ? (
          // Lesson mode: use modal overlay
          <GameResultsModal
            playerName={playerName}
            playerAvatar={playerAvatar}
            levelData={levelData}
            onClose={handleReplay}
            onNextLevel={handleNextLevel}
            hasNextLevel={hasNextLevel}
          />
        ) : (
          // Standalone mode: use full screen
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameResultsScreen
              playerName={playerName}
              playerAvatar={playerAvatar}
              levelData={levelData}
              onReplay={handleReplay}
              onNextLevel={handleNextLevel}
              hasNextLevel={hasNextLevel}
            />
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

export default PlantOrAnimalGame;

