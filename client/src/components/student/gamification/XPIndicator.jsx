import React from 'react';
import { Zap } from 'lucide-react';
import clsx from 'clsx';

export const XPIndicator = ({
  currentXP = 2400,
  xpToNextLevel = 3000,
  level = 5,
  compact = false,
  className = '',
}) => {
  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <div className="flex items-center gap-1 bg-achievement/10 px-3 py-1 rounded-full">
          <Zap className="w-4 h-4 text-achievement" />
          <span className="text-sm font-semibold text-achievement">{currentXP}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('bg-white rounded-lg border-2 border-achievement/20 p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-achievement/10 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-achievement" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Level {level}</p>
            <p className="font-bold text-gray-900">{currentXP} / {xpToNextLevel}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-achievement to-celebration h-full transition-all duration-500 rounded-full"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      <p className="text-xs text-gray-600 mt-2">
        {xpToNextLevel - currentXP} XP to level {level + 1}
      </p>
    </div>
  );
};

export default XPIndicator;
