import React from 'react';

const StreakWidget = ({ streak = 0 }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-2xl">
        🔥
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Current Streak</p>
        <p className="text-xl font-bold tracking-tight text-slate-900">{streak} days</p>
      </div>
    </div>
  );
};

export default StreakWidget;
