import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AVATARS = [
  { emoji: '🧒', label: 'Boy' },
  { emoji: '👧', label: 'Girl' },
  { emoji: '🐶', label: 'Puppy' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🦊', label: 'Fox' },
];

const GameLoginScreen = ({ onLogin }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const handleStart = () => {
    if (studentName.trim()) {
      onLogin({
        name: studentName.trim(),
        avatar: AVATARS[selectedAvatar].emoji,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-200 via-green-100 to-emerald-100 flex flex-col items-center justify-center p-4">
      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-emerald-700 mb-2">
            🌱 Plant or Animal?
          </h1>
          <p className="text-emerald-600 font-semibold">Grade 3 Science Adventure!</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              What's your name?
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name..."
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              className="w-full px-4 py-3 rounded-2xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-600 font-semibold text-center text-lg"
            />
          </div>

          {/* Avatar Picker */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Pick your avatar:
            </label>
            <div className="flex justify-between gap-3">
              {AVATARS.map((avatar, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedAvatar(idx)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-4xl p-3 rounded-2xl transition-all ${
                    selectedAvatar === idx
                      ? 'bg-emerald-100 ring-4 ring-emerald-500 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {avatar.emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!studentName.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            🎮 Start Playing!
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLoginScreen;
