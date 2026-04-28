import React from 'react';
import { motion } from 'framer-motion';

/**
 * GameCard — A reusable, bouncy, colorful card used across the student UI.
 * Supports gradient backgrounds, icons, and tap/hover animations.
 */
const GameCard = ({
  children,
  onClick,
  gradient = 'from-purple-500 to-pink-500',
  className = '',
  delay = 0,
  disabled = false,
  glow = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-3 rounded-2xl',
    md: 'p-5 rounded-3xl',
    lg: 'p-8 rounded-3xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={!disabled ? { scale: 1.04, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative overflow-hidden bg-gradient-to-br ${gradient}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-60 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${glow ? 'fun-pulse-glow' : ''}
        shadow-lg hover:shadow-2xl transition-shadow duration-300
        ${className}
      `}
    >
      {/* Shimmer overlay */}
      {!disabled && (
        <div className="absolute inset-0 opacity-20 pointer-events-none fun-shimmer rounded-3xl" />
      )}
      {children}
    </motion.div>
  );
};

export default GameCard;
