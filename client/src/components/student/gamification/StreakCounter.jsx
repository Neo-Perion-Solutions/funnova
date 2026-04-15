import React from 'react';
import { Flame } from 'lucide-react';
import clsx from 'clsx';

export const StreakCounter = ({
  streak = 0,
  maxStreak = 0,
  daysToBreak = 1,
  className = '',
  compact = false,
}) => {
  const isActive = streak > 0;

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-1', className)}>
        <Flame className={clsx('w-5 h-5', isActive ? 'text-danger' : 'text-gray-400')} />
        <span className={clsx('font-bold', isActive ? 'text-danger' : 'text-gray-500')}>
          {streak}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-lg border-2 p-4 transition-all duration-300',
        isActive
          ? 'bg-danger/5 border-danger'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className={clsx('flex items-center gap-3 mb-3')}>
        <div
          className={clsx(
            'p-3 rounded-lg',
            isActive ? 'bg-danger/20' : 'bg-gray-200'
          )}
        >
          <Flame
            className={clsx(
              'w-6 h-6',
              isActive ? 'text-danger' : 'text-gray-400'
            )}
          />
        </div>
        <div>
          <p className={clsx('text-xs font-semibold', isActive ? 'text-danger' : 'text-gray-500')}>
            LEARNING STREAK
          </p>
          <p className={clsx('text-2xl font-bold', isActive ? 'text-danger' : 'text-gray-600')}>
            {streak} {streak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 rounded p-2">
          <p className="text-xs text-gray-600">Best Streak</p>
          <p className="text-lg font-bold text-gray-900">{maxStreak}</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <p className="text-xs text-gray-600">Days Until Break</p>
          <p className="text-lg font-bold text-gray-900">{daysToBreak}</p>
        </div>
      </div>

      {isActive && (
        <p className="text-xs text-danger mt-3 font-semibold">
          ⚠️ Keep learning to maintain your streak!
        </p>
      )}
    </div>
  );
};

export default StreakCounter;
