import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Star, Award } from 'lucide-react';
import clsx from 'clsx';

const celebrationIcons = {
  achievement: Trophy,
  milestone: Star,
  level_up: Award,
  first_time: Sparkles,
};

export const CelebrationModal = ({
  isOpen,
  onClose,
  title = 'Achievement Unlocked!',
  message = 'Great job! Keep up the amazing work.',
  type = 'achievement',
  xpGained = 0,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const IconComponent = celebrationIcons[type] || celebrationIcons.achievement;

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    if (autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
      />

      {/* Modal */}
      <div
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
          isClosing
            ? 'opacity-0 scale-95'
            : 'opacity-100 scale-100'
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-celebration via-achievement to-primary p-8 text-center relative overflow-hidden">
            {/* Confetti-like background elements */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce-slow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>

            {/* Icon with animation */}
            <div className="relative mb-4 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full animate-pulse">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-10">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-4 text-lg">{message}</p>

            {xpGained > 0 && (
              <div className="bg-achievement/10 border-2 border-achievement rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">XP Gained</p>
                <p className="text-3xl font-bold text-achievement">+{xpGained}</p>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(onClose, 300);
              }}
              className="w-full bg-gradient-to-r from-primary to-celebration text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue
            </button>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-celebration via-achievement to-primary" />
        </div>
      </div>
    </>
  );
};

export default CelebrationModal;
