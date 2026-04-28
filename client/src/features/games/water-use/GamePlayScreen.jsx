import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_LEVELS, FEEDBACK_MESSAGES } from '../../../data/waterUseQuestions';
import WaterDrops from './WaterDrops';

const GamePlayScreen = ({
  level,
  questions,
  playerName,
  playerAvatar,
  onLevelComplete,
}) => {
  const levelData = GAME_LEVELS[level];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(levelData.timer || 999);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [multiSelected, setMultiSelected] = useState([]);
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / Math.max(1, answers.length)) * 100);
  const isMultiSelectLevel = levelData.multiSelect;

  // Timer logic for Level 3
  useEffect(() => {
    if (!levelData.timer || answered) {
      return;
    }

    setTimeLeft(levelData.timer);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, answered, levelData.timer]);

  const handleTimeout = () => {
    processAnswer(false, FEEDBACK_MESSAGES.timeout(), 'timeout');
  };

  const handleSingleAnswer = (option) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(option);
    setAnswered(true);
    const isCorrect = option.isWater;
    processAnswer(isCorrect, isCorrect ? FEEDBACK_MESSAGES.correct() : FEEDBACK_MESSAGES.wrong(), 'normal');
  };

  const toggleMultiSelect = (optionId) => {
    if (answered) return;
    setMultiSelected((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleMultiSubmit = () => {
    if (answered || multiSelected.length === 0) return;
    clearInterval(timerRef.current);
    setAnswered(true);

    const correctIds = currentQuestion.options
      .filter((o) => o.isWater)
      .map((o) => o.id);
    const isCorrect =
      correctIds.length === multiSelected.length &&
      correctIds.every((id) => multiSelected.includes(id));

    processAnswer(isCorrect, isCorrect ? FEEDBACK_MESSAGES.correct() : FEEDBACK_MESSAGES.wrong(), 'normal');
  };

  const processAnswer = (isCorrect, message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);

    if (isCorrect) {
      setScore((s) => s + 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
    } else {
      setStreak(0);
    }

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        isCorrect,
        selectedAnswer: isMultiSelectLevel ? multiSelected : selectedAnswer?.id,
      },
    ]);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        setMultiSelected([]);
        setFeedbackMessage('');
      } else {
        // Level complete
        const newCorrectCount = answers.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0);
        const finalAccuracy = Math.round((newCorrectCount / (answers.length + 1)) * 100);
        onLevelComplete({
          level,
          score: score + (isCorrect ? 10 : 0),
          correct: newCorrectCount,
          total: answers.length + 1,
          accuracy: finalAccuracy,
          streak: bestStreak,
        });
      }
    }, 1200);
  };

  const timerBarColor = timeLeft <= 4 ? 'bg-red-500' : 'bg-blue-500';
  const timerTextColor = timeLeft <= 4 ? 'text-red-500' : 'text-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 p-4 overflow-hidden"
    >
      {/* Animated water drops */}
      <WaterDrops />

      {/* Content wrapper - relative z-index */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* HUD Bar */}
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 mb-4 text-sm font-semibold text-blue-900">
          <span>
            {playerAvatar} {playerName}
          </span>
          <span>⭐ {score}</span>
          <span>🔥 {streak}</span>
          {levelData.timer && (
            <span className={`font-bold ${timerTextColor}`}>
              ⏱ {timeLeft}s
            </span>
          )}
        </div>

        {/* Timer Bar (Level 3 only) */}
        {levelData.timer && (
          <div className="mb-4 h-3 bg-white/40 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${timerBarColor} rounded-full`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / levelData.timer) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          <AnimatePresence>
            {questions.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < currentQuestionIndex
                    ? answers[i]?.isCorrect
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : i === currentQuestionIndex
                      ? 'bg-yellow-400'
                      : 'bg-white/40'
                }`}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 text-center mb-4 shadow-md"
        >
          <p className="text-gray-400 text-sm mb-2">Where do we use water?</p>
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            {currentQuestion.question}
          </h3>
          <div className="text-6xl">{currentQuestion.emoji}</div>
        </motion.div>

        {/* Feedback Message */}
        <motion.p
          key={feedbackMessage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-lg font-bold h-7 mb-4 ${
            feedbackType === 'correct'
              ? 'text-green-600'
              : feedbackType === 'timeout'
                ? 'text-orange-600'
                : 'text-gray-600'
          }`}
        >
          {feedbackMessage}
        </motion.p>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {currentQuestion.options.map((option) => {
            let bgClass = 'bg-white border-2 border-blue-100';
            if (answered) {
              if (option.isWater) {
                bgClass = 'bg-green-100 border-green-400';
              } else if (isMultiSelectLevel ? multiSelected.includes(option.id) : selectedAnswer?.id === option.id) {
                bgClass = 'bg-red-100 border-red-400';
              }
            } else if (isMultiSelectLevel && multiSelected.includes(option.id)) {
              bgClass = 'bg-blue-100 border-blue-500';
            }

            return (
              <motion.button
                key={option.id}
                whileHover={!answered ? { scale: 1.05 } : {}}
                whileTap={!answered ? { scale: 0.95 } : {}}
                onClick={() =>
                  isMultiSelectLevel
                    ? toggleMultiSelect(option.id)
                    : handleSingleAnswer(option)
                }
                disabled={answered}
                className={`${bgClass} rounded-2xl p-4 flex flex-col items-center gap-2 font-semibold transition-all disabled:cursor-default text-blue-900`}
              >
                <span className="text-4xl">{option.emoji}</span>
                <span className="text-sm leading-tight">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Multi-select Submit Button */}
        {isMultiSelectLevel && !answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <motion.button
              whileHover={multiSelected.length > 0 ? { scale: 1.05 } : {}}
              whileTap={multiSelected.length > 0 ? { scale: 0.95 } : {}}
              onClick={handleMultiSubmit}
              disabled={multiSelected.length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-8 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-lg"
            >
              ✅ Submit Answers {multiSelected.length > 0 && `(${multiSelected.length})`}
            </motion.button>
          </motion.div>
        )}

        {/* Question Counter */}
        <p className="text-center text-sm text-blue-700">
          Level {level + 1} • Q {currentQuestionIndex + 1}/{totalQuestions} • 🎯 {accuracy}%
        </p>
      </div>
    </motion.div>
  );
};

export default GamePlayScreen;
