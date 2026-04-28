import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEEDBACK_MESSAGES, GAME_LEVELS } from '../../../data/plantOrAnimalQuestions';

const GamePlayScreen = ({ currentLevel, questions, playerName, playerAvatar, onLevelComplete }) => {
  const level = GAME_LEVELS[currentLevel];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timer);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(null); // 'correct', 'wrong', 'timeout'
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]); // Track all answers
  const timerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / (currentQuestionIndex + 1)) * 100);

  // Timer logic
  useEffect(() => {
    if (!level.timer || answered || currentQuestionIndex >= totalQuestions) {
      return;
    }

    setTimeLeft(level.timer);
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
  }, [currentQuestionIndex, answered, level.timer]);

  const handleTimeout = () => {
    const isCorrect = false;
    const message = FEEDBACK_MESSAGES.timeout(currentQuestion.answer);
    procesAnswer(isCorrect, message, 'timeout');
  };

  const procesAnswer = (isCorrect, message, type = 'normal') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setAnswered(true);

    if (isCorrect) {
      setScore(score + 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      setFeedbackType('correct');
    } else {
      setStreak(0);
      setFeedbackType('wrong');
    }

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        isCorrect,
        answer: selectedAnswer,
      },
    ]);

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        setFeedbackMessage('');
      } else {
        // Game complete
        const finalAccuracy = Math.round((correctCount + (isCorrect ? 1 : 0)) / totalQuestions * 100);
        onLevelComplete({
          level: currentLevel,
          score: score + (isCorrect ? 10 : 0),
          accuracy: finalAccuracy,
          streak: bestStreak,
          correct: correctCount + (isCorrect ? 1 : 0),
          total: totalQuestions,
        });
      }
    }, 2000);
  };

  const handleAnswer = (answer) => {
    if (answered) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.answer;
    const message = isCorrect
      ? FEEDBACK_MESSAGES.correct[Math.floor(Math.random() * FEEDBACK_MESSAGES.correct.length)]
      : FEEDBACK_MESSAGES.wrong(currentQuestion.answer);

    procesAnswer(isCorrect, message);
    if (level.timer) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-200 via-green-100 to-emerald-100 pb-8">
      {/* HUD Bar */}
      <div className="bg-white/90 backdrop-blur border-b-2 border-emerald-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top row: Player info | Score | Streak | Timer */}
          <div className="flex items-center justify-between mb-4">
            {/* Player Info */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">{playerAvatar}</span>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Player</p>
                <p className="font-bold text-gray-900 text-sm">{playerName}</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-gray-500 uppercase">Score</p>
              <p className="text-2xl font-black text-emerald-600">⭐ {score}</p>
            </div>

            {/* Streak */}
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-gray-500 uppercase">Streak</p>
              <p className="text-2xl font-black text-orange-500">🔥 {streak}</p>
            </div>

            {/* Timer (Level 3 only) */}
            {level.timer && (
              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-gray-500 uppercase">Time</p>
                <p
                  className={`text-2xl font-black transition-colors ${
                    timeLeft <= 3 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  ⏱ {timeLeft}s
                </p>
              </div>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 justify-center items-center">
            {questions.map((_, idx) => {
              let color = 'bg-yellow-300'; // current
              if (idx < currentQuestionIndex) {
                const ans = answers[idx];
                color = ans?.isCorrect ? 'bg-emerald-500' : 'bg-red-500';
              } else if (idx === currentQuestionIndex) {
                color = 'bg-yellow-400 ring-2 ring-yellow-600 scale-125';
              }

              return (
                <motion.div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${color}`}
                  animate={idx === currentQuestionIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4 mt-12"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Question number */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 uppercase">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>

          {/* Label */}
          <p className="text-gray-600 font-semibold mb-6">What is this?</p>

          {/* Large Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="text-8xl mb-8"
          >
            {currentQuestion.emoji}
          </motion.div>

          {/* Item Name */}
          <h3 className="text-2xl font-black text-gray-900 mb-8">
            {currentQuestion.name}
          </h3>

          {/* Feedback message */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`mb-6 py-3 px-4 rounded-2xl font-bold text-lg ${
                  feedbackType === 'correct'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedbackMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {/* Plant Button */}
            <motion.button
              whileHover={{ scale: answered ? 1 : 1.05 }}
              whileTap={{ scale: answered ? 1 : 0.95 }}
              onClick={() => handleAnswer('plant')}
              disabled={answered}
              className={`relative py-6 px-4 rounded-2xl font-bold text-lg transition-all overflow-hidden ${
                !answered
                  ? 'border-4 border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                  : selectedAnswer === 'plant'
                  ? feedbackType === 'correct'
                    ? 'bg-emerald-400 text-white scale-95'
                    : 'bg-red-400 text-white scale-95'
                  : 'opacity-50 border-4 border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl mr-2">🌿</span>
              Plant
            </motion.button>

            {/* Animal Button */}
            <motion.button
              whileHover={{ scale: answered ? 1 : 1.05 }}
              whileTap={{ scale: answered ? 1 : 0.95 }}
              onClick={() => handleAnswer('animal')}
              disabled={answered}
              className={`relative py-6 px-4 rounded-2xl font-bold text-lg transition-all overflow-hidden ${
                !answered
                  ? 'border-4 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                  : selectedAnswer === 'animal'
                  ? feedbackType === 'correct'
                    ? 'bg-emerald-400 text-white scale-95'
                    : 'bg-red-400 text-white scale-95'
                  : 'opacity-50 border-4 border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl mr-2">🐾</span>
              Animal
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Accuracy display */}
      <div className="text-center mt-8">
        <p className="text-sm font-semibold text-gray-600">
          Accuracy: <span className="text-emerald-600 font-black">{accuracy}%</span>
        </p>
      </div>
    </div>
  );
};

export default GamePlayScreen;
