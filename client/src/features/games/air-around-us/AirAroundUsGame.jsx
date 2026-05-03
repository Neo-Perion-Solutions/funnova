import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIR_OBJECTS, GAME_LEVELS, getRandomObjects } from './data';
import SoundSystem from '../../../game-engine/systems/SoundSystem';

/* ───────────────────────────────────────────────────────────────
 * FLOATING OBJECT COMPONENT
 * ─────────────────────────────────────────────────────────────── */
const FloatingObject = ({ 
  object, 
  mode, 
  onInteract, 
  interactable, 
  feedbackState, // 'correct' | 'wrong' | null
  isActive // true if currently being reacted to (e.g. breathing/inflating)
}) => {
  // Determine animation based on interaction and feedback
  let animateProps = { y: [0, -10, 0] };
  let transitionProps = { repeat: Infinity, duration: 3, ease: "easeInOut" };
  let className = "relative bg-white/60 backdrop-blur-md rounded-[32px] p-6 flex flex-col items-center justify-center cursor-pointer border-4 border-white shadow-xl w-32 h-32 sm:w-40 sm:h-40 transition-colors";

  if (feedbackState === 'correct') {
    animateProps = { scale: 1.1, y: -20 };
    transitionProps = { type: "spring" };
    className += " ring-8 ring-emerald-400 bg-emerald-50";
  } else if (feedbackState === 'wrong') {
    animateProps = { x: [-10, 10, -10, 10, 0] };
    transitionProps = { duration: 0.4 };
    className += " ring-8 ring-red-400 bg-red-50";
  } else if (isActive) {
    if (object.reaction === 'inflate') {
      animateProps = { scale: 1.3 };
      transitionProps = { type: "spring", bounce: 0.5 };
    } else if (object.reaction === 'spin') {
      animateProps = { rotate: 360 };
      transitionProps = { repeat: Infinity, duration: 1, ease: "linear" };
    } else if (object.reaction === 'breathing') {
      animateProps = { scale: [1, 1.1, 1] };
      transitionProps = { repeat: Infinity, duration: 1.5, ease: "easeInOut" };
    } else if (object.reaction === 'sway') {
      animateProps = { rotate: [-5, 5, -5] };
      transitionProps = { repeat: Infinity, duration: 2, ease: "easeInOut" };
    }
  }

  // Add dull background if mode is speed (Level 3)
  if (mode === 'tap-speed' && !isActive && !feedbackState) {
    className += " grayscale-[30%] opacity-80";
  }

  const handleClick = () => {
    if (interactable && (mode === 'tap' || mode === 'tap-speed')) {
      onInteract(object);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={interactable ? { scale: 1.05 } : {}}
      whileTap={interactable ? { scale: 0.95 } : {}}
      animate={animateProps}
      transition={transitionProps}
      className={className}
      id={`obj-${object.id}`}
    >
      <div className="text-5xl sm:text-6xl mb-2 drop-shadow-md pointer-events-none">
        {object.emoji}
      </div>
      <div className="text-sm font-black text-gray-700 pointer-events-none">
        {object.name}
      </div>
    </motion.div>
  );
};

/* ───────────────────────────────────────────────────────────────
 * DRAG AIR CONTROLLER (Level 2)
 * ─────────────────────────────────────────────────────────────── */
const DragAirController = ({ onDrop, active }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (!active) return;
    
    // Check intersection with all objects
    const x = info.point.x;
    const y = info.point.y;
    
    // Find all objects on screen
    const elements = document.elementsFromPoint(x, y);
    const targetEl = elements.find(el => el.id && el.id.startsWith('obj-'));
    
    if (targetEl) {
      const objId = parseInt(targetEl.id.split('-')[1]);
      onDrop(objId);
    }
  };

  if (!active) return null;

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        drag
        dragSnapToOrigin
        onDragStart={() => {
          setIsDragging(true);
          // Play whoosh sound
          SoundSystem.playClick();
        }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.2, rotate: 10 }}
        className="pointer-events-auto bg-blue-100 border-4 border-blue-400 text-blue-700 rounded-full px-8 py-4 flex items-center gap-3 shadow-xl cursor-grab active:cursor-grabbing"
      >
        <span className="text-4xl animate-pulse">🌬️</span>
        <span className="font-black text-xl">Drag Air to Objects!</span>
      </motion.div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────────
 * MAIN GAME COMPONENT
 * ─────────────────────────────────────────────────────────────── */
const AirAroundUsGame = ({ state, actions, config }) => {
  const [mode, setMode] = useState('tap');
  const [levelInfo, setLevelInfo] = useState(GAME_LEVELS[0]);
  const [objects, setObjects] = useState([]);
  const [feedbackState, setFeedbackState] = useState({}); // { objId: 'correct' | 'wrong' }
  const [activeReaction, setActiveReaction] = useState(null); // objId
  const [message, setMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Setup round logic based on GameEngine currentRound
  useEffect(() => {
    let currentMode, currentLevelObj;
    if (state.currentRound <= 5) {
      currentMode = 'tap';
      currentLevelObj = GAME_LEVELS[0];
    } else if (state.currentRound <= 10) {
      currentMode = 'drag-air';
      currentLevelObj = GAME_LEVELS[1];
    } else {
      currentMode = 'tap-speed';
      currentLevelObj = GAME_LEVELS[2];
    }

    setMode(currentMode);
    setLevelInfo(currentLevelObj);

    // Only set objects if not transitioning
    if (!isTransitioning) {
      // Level 1: 3 objects, Level 2: 4 objects, Level 3: 4 objects
      const count = currentMode === 'tap' ? 3 : 4;
      setObjects(getRandomObjects(count, true));
      setFeedbackState({});
      setActiveReaction(null);
      setMessage('');
    }
  }, [state.currentRound, isTransitioning]);

  const handleInteract = useCallback((obj) => {
    if (isTransitioning || feedbackState[obj.id]) return;

    const isCorrect = obj.needsAir;
    
    setFeedbackState({ [obj.id]: isCorrect ? 'correct' : 'wrong' });
    setMessage(isCorrect ? obj.message : (mode === 'drag-air' ? 'This does not use air!' : `Oops! ${obj.name} does not need air.`));
    
    if (isCorrect) {
      SoundSystem.playCorrect();
      setActiveReaction(obj.id);
      actions.correct(10);
    } else {
      SoundSystem.playWrong();
      actions.wrong();
    }

    setIsTransitioning(true);
    
    setTimeout(() => {
      // Progress engine
      actions.nextLevel(levelInfo.timer);
      setIsTransitioning(false);
    }, 2500);

  }, [isTransitioning, feedbackState, actions, levelInfo.timer, mode]);

  const handleDropAir = useCallback((objId) => {
    const obj = objects.find(o => o.id === objId);
    if (obj) handleInteract(obj);
  }, [objects, handleInteract]);

  return (
    <div className="relative min-h-[500px] bg-gradient-to-b from-[#87CEEB] to-[#E0F7FA] rounded-[32px] overflow-hidden p-6 sm:p-10 font-[Nunito]">
      
      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-40 animate-[pulse_4s_infinite]">☁️</div>
      <div className="absolute top-20 right-20 text-5xl opacity-30 animate-[pulse_5s_infinite]">☁️</div>
      
      {/* Level Header */}
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
          Level {levelInfo.level}
        </h2>
        <h3 className="text-2xl sm:text-3xl font-black text-blue-900 bg-white/70 backdrop-blur-sm inline-block px-8 py-3 rounded-full shadow-sm">
          {levelInfo.instruction}
        </h3>
      </div>

      {/* Main Play Area */}
      <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-12 mt-8">
        <AnimatePresence mode="popLayout">
          {objects.map((obj) => (
            <motion.div
              key={`${state.currentRound}-${obj.id}`}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            >
              <FloatingObject
                object={obj}
                mode={mode}
                interactable={!isTransitioning && !feedbackState[obj.id]}
                onInteract={handleInteract}
                feedbackState={feedbackState[obj.id]}
                isActive={activeReaction === obj.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Explanation Banner */}
      <div className="absolute top-[60%] left-0 right-0 flex justify-center pointer-events-none z-40">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`px-8 py-4 rounded-full font-black text-xl shadow-2xl text-white ${
                Object.values(feedbackState).includes('correct') ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level 2 Drag Controller */}
      <DragAirController 
        active={mode === 'drag-air' && !isTransitioning} 
        onDrop={handleDropAir} 
      />

    </div>
  );
};

export default AirAroundUsGame;
