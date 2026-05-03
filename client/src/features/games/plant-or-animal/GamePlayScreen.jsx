import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEEDBACK_MESSAGES, GAME_LEVELS } from '../../../data/plantOrAnimalQuestions';
import { SoundSystem } from '../../../game-engine/systems/SoundSystem';

const GamePlayScreen = ({ currentLevel, questions, playerName, playerAvatar, onLevelComplete }) => {
  const level = GAME_LEVELS[currentLevel];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timer);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct', 'wrong', 'timeout', null
  const [explanation, setExplanation] = useState('');
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]); // Track all answers
  const [showConfetti, setShowConfetti] = useState(false);
  
  const timerRef = useRef(null);
  const plantRef = useRef(null);
  const animalRef = useRef(null);
  const containerRef = useRef(null);

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
    SoundSystem.playWrong();
    processAnswer(false, 'timeout');
  };

  const processAnswer = (isCorrect, type = 'normal') => {
    setAnswered(true);
    setFeedbackState(isCorrect ? 'correct' : 'wrong');
    
    // Generate explanation
    if (isCorrect) {
      setExplanation(`Great job! ${currentQuestion.name} is indeed a ${currentQuestion.answer}.`);
      setShowConfetti(true);
    } else {
      setExplanation(`Oops! ${currentQuestion.name} is actually a ${currentQuestion.answer}.`);
    }

    if (isCorrect) {
      setScore(score + 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
    } else {
      setStreak(0);
    }

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        isCorrect,
      },
    ]);

    // Move to next question after delay
    setTimeout(() => {
      setShowConfetti(false);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false);
        setFeedbackState(null);
        setExplanation('');
      } else {
        // Game complete
        const finalAccuracy = Math.round((correctCount + (isCorrect ? 1 : 0)) / totalQuestions * 100);
        onLevelComplete({
          level: currentLevel,
          score: score + (isCorrect ? 10 : 0),
          accuracy: finalAccuracy,
          streak: Math.max(bestStreak, isCorrect ? streak + 1 : streak),
          correct: correctCount + (isCorrect ? 1 : 0),
          total: totalQuestions,
        });
      }
    }, 2500);
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    const isCorrect = answer === currentQuestion.answer;
    
    if (isCorrect) {
      SoundSystem.playCorrect();
    } else {
      SoundSystem.playWrong();
    }

    processAnswer(isCorrect);
    if (level.timer) clearInterval(timerRef.current);
  };

  const handleDragEnd = (event, info) => {
    if (answered) return;
    
    // Check intersections
    const pRect = plantRef.current?.getBoundingClientRect();
    const aRect = animalRef.current?.getBoundingClientRect();
    const { x, y } = info.point;
    
    const isInside = (rect) => rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    
    if (isInside(pRect)) {
      handleAnswer('plant');
    } else if (isInside(aRect)) {
      handleAnswer('animal');
    }
  };

  const getDragControls = () => {
    if (answered) return {};
    return {
      drag: true,
      dragConstraints: containerRef,
      dragElastic: 0.2,
      dragSnapToOrigin: !answered, // Snaps back if dropped outside target
      whileDrag: { scale: 1.1, rotate: Math.random() > 0.5 ? 5 : -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }
    };
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#e8f5e9] pb-8 overflow-hidden font-[Nunito]">
      
      {/* SUCCESS OVERLAY (Confetti + Glow) */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none bg-emerald-500/10 flex items-center justify-center"
          >
            {/* Simple CSS Confetti Burst representation */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ 
                  x: (Math.random() - 0.5) * 500, 
                  y: (Math.random() - 0.5) * 500 - 200, 
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-4 h-4 rounded-sm"
                style={{ 
                  backgroundColor: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)] 
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Bar */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 rounded-b-3xl mx-4 lg:mx-auto max-w-5xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{playerAvatar}</span>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</p>
                <p className="font-extrabold text-gray-900 text-base">{playerName}</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score</p>
                <p className="text-2xl font-black text-amber-500">{score}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Streak</p>
                <p className="text-2xl font-black text-orange-500">🔥 {streak}</p>
              </div>
              {level.timer && (
                <div className="flex flex-col items-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time</p>
                  <p className={`text-2xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                    ⏱ {timeLeft}s
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 justify-center items-center h-4">
            {questions.map((_, idx) => {
              let color = 'bg-gray-200';
              if (idx < currentQuestionIndex) {
                color = answers[idx]?.isCorrect ? 'bg-emerald-500' : 'bg-red-400';
              } else if (idx === currentQuestionIndex) {
                color = 'bg-amber-400 ring-4 ring-amber-100 scale-125';
              }
              return (
                <motion.div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${color}`}
                  animate={idx === currentQuestionIndex ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 mt-8 relative z-10 flex flex-col items-center">
        
        {/* Instruction */}
        <p className="text-gray-500 font-extrabold uppercase tracking-widest text-sm mb-6 text-center">
          Tap or Drag into the right zone!
        </p>

        {/* The Draggable Object */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="mb-12 relative z-20 cursor-grab active:cursor-grabbing"
            {...getDragControls()}
            onDragEnd={handleDragEnd}
            whileHover={!answered ? { scale: 1.05 } : {}}
          >
            {/* Object Card */}
            <motion.div 
              className={`bg-white rounded-[40px] shadow-xl p-10 flex flex-col items-center justify-center border-4 border-white w-64 h-64
                ${feedbackState === 'correct' ? 'ring-8 ring-emerald-400' : ''}
                ${feedbackState === 'wrong' ? 'ring-8 ring-red-400' : ''}
              `}
              animate={feedbackState === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : feedbackState === 'correct' ? { y: [0, -15, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className="text-8xl mb-4 pointer-events-none drop-shadow-sm">{currentQuestion.emoji}</div>
              <h3 className="text-3xl font-black text-gray-800 pointer-events-none">{currentQuestion.name}</h3>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Explanation Text */}
        <div className="h-16 flex items-center justify-center mb-8">
          <AnimatePresence>
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`px-6 py-3 rounded-full font-bold text-lg text-white shadow-lg
                  ${feedbackState === 'correct' ? 'bg-emerald-500' : 'bg-red-500'}
                `}
              >
                {feedbackState === 'correct' ? '🎉' : '❌'} {explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drop Zones / Buttons */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
          
          {/* PLANT ZONE */}
          <motion.div
            ref={plantRef}
            whileHover={!answered ? { scale: 1.03 } : {}}
            whileTap={!answered ? { scale: 0.95 } : {}}
            onClick={() => handleAnswer('plant')}
            className={`
              rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors shadow-lg
              ${answered ? 'opacity-50 grayscale cursor-not-allowed' : 'bg-emerald-50 hover:bg-emerald-100 border-4 border-emerald-400'}
            `}
          >
            <span className="text-5xl mb-3 drop-shadow-sm">🌿</span>
            <span className="text-2xl font-black text-emerald-700">PLANT</span>
          </motion.div>

          {/* ANIMAL ZONE */}
          <motion.div
            ref={animalRef}
            whileHover={!answered ? { scale: 1.03 } : {}}
            whileTap={!answered ? { scale: 0.95 } : {}}
            onClick={() => handleAnswer('animal')}
            className={`
              rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors shadow-lg
              ${answered ? 'opacity-50 grayscale cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100 border-4 border-blue-400'}
            `}
          >
            <span className="text-5xl mb-3 drop-shadow-sm">🐾</span>
            <span className="text-2xl font-black text-blue-700">ANIMAL</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default GamePlayScreen;

