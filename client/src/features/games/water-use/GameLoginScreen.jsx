import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AVATARS = ['🧒', '👧', '🐶', '🦁', '🐸', '🦊'];

const GameLoginScreen = ({ onStart }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleStart = () => {
    if (name.trim()) {
      onStart({ name: name.trim(), avatar: selectedAvatar });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 flex flex-col items-center justify-center p-5"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl text-center mb-4"
        >
          💧
        </motion.div>

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
          Water Use Game
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Grade 3 Science • Unit 1
        </p>

        <div className="mb-6">
          <label className="block text-sm font-bold text-blue-900 mb-2">
            Your Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-blue-900 mb-3">Pick Your Avatar:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {AVATARS.map((avatar) => (
              <motion.button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`text-4xl p-3 rounded-2xl transition-all ${
                  selectedAvatar === avatar
                    ? 'ring-4 ring-blue-500 bg-blue-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {avatar}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50 text-lg"
        >
          🎮 Start Playing!
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameLoginScreen;
