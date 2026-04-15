import React from 'react';

const StreakWidget = ({ streak = 0 }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 px-4 py-3">
      <div className="text-3xl">🔥</div>
      <div>
        <p className="text-xs font-medium text-gray-600">Current Streak</p>
        <p className="text-xl font-bold text-amber-700">{streak} days</p>
      </div>
    </div>
  );
};

export default StreakWidget;
