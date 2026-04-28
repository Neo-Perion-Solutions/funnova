import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PlantOrAnimalGameCard = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/game/plant-or-animal')}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.96 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-6 cursor-pointer shadow-xl shadow-emerald-500/30 transition-shadow duration-300 hover:shadow-2xl w-full h-full text-left"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 text-[100px] -translate-y-4 translate-x-4 pointer-events-none">
        🌿
      </div>
      <div className="absolute inset-0 opacity-10 pointer-events-none fun-shimmer rounded-3xl" />

      <div className="relative">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/30"
          >
            🌱
          </motion.div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Plant or Animal?</h3>
            <p className="text-white/60 text-xs font-bold">3 Levels</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 text-sm font-semibold mb-4 line-clamp-2">
          Test your knowledge about plants and animals! 🌿🐾
        </p>

        {/* Progress indicator */}
        <div className="mb-3">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '0%' }}
              transition={{ duration: 0.8 }}
              className="h-full bg-white/80 rounded-full"
            />
          </div>
          <p className="text-white/60 text-xs font-bold mt-1">
            New Challenge
          </p>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <motion.span
                key={level}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: level * 0.15 }}
                className="text-lg"
              >
                {level === 1 ? '🌱' : level === 2 ? '🌿' : '⚡'}
              </motion.span>
            ))}
          </div>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-white/80 text-sm font-extrabold flex items-center gap-1"
          >
            Play →
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
};

export default PlantOrAnimalGameCard;
