import React, { useState } from 'react';
import { Star, Trophy, Flame, Award } from 'lucide-react';
import clsx from 'clsx';

const badgeTypes = {
  star: { icon: Star, color: 'text-achievement', bgColor: 'bg-achievement/10' },
  trophy: { icon: Trophy, color: 'text-primary', bgColor: 'bg-primary/10' },
  flame: { icon: Flame, color: 'text-danger', bgColor: 'bg-danger/10' },
  award: { icon: Award, color: 'text-celebration', bgColor: 'bg-celebration/10' },
};

export const AchievementBadge = ({
  title,
  description,
  type = 'star',
  isUnlocked = false,
  progress = 100,
  className = ''
}) => {
  const badgeConfig = badgeTypes[type] || badgeTypes.star;
  const IconComponent = badgeConfig.icon;

  return (
    <div
      className={clsx(
        'rounded-lg p-4 transition-all duration-300',
        isUnlocked
          ? `${badgeConfig.bgColor} border-2 border-${badgeConfig.color} shadow-md`
          : 'bg-gray-100 border-2 border-gray-300 opacity-60',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={clsx(
            'p-3 rounded-full mb-2',
            isUnlocked ? badgeConfig.bgColor : 'bg-gray-200'
          )}
        >
          <IconComponent
            className={clsx(
              'w-6 h-6',
              isUnlocked ? badgeConfig.color : 'text-gray-400'
            )}
          />
        </div>
        <h3 className={clsx('font-bold text-sm mb-1', isUnlocked ? 'text-gray-900' : 'text-gray-600')}>
          {title}
        </h3>
        <p className={clsx('text-xs mb-2', isUnlocked ? 'text-gray-700' : 'text-gray-500')}>
          {description}
        </p>

        {/* Progress bar for locked badges */}
        {!isUnlocked && progress < 100 && (
          <div className="w-full bg-gray-300 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {isUnlocked && (
          <span className="text-xs font-semibold text-primary mt-1">✓ Unlocked</span>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
