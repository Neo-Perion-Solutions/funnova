import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import clsx from 'clsx';

// Color mapping for subjects
const subjectColors = {
  'Mathematics': 'from-blue-500 to-blue-600',
  'English': 'from-purple-500 to-purple-600',
  'Science': 'from-green-500 to-green-600',
  'History': 'from-amber-500 to-amber-600',
  'Geography': 'from-teal-500 to-teal-600',
  'Art': 'from-pink-500 to-pink-600',
  'Sports': 'from-red-500 to-red-600',
};

const subjectIcons = {
  'Mathematics': '🔢',
  'English': '📚',
  'Science': '🔬',
  'History': '📜',
  'Geography': '🌍',
  'Art': '🎨',
  'Sports': '⚽',
};

export const GamifiedDashboardCard = ({
  subject,
  unit_count = 0,
  lesson_count = 0,
  progress = 0,
  completedLessons = 0,
  onClick,
}) => {
  const navigate = useNavigate();
  const colors = subjectColors[subject?.name] || 'from-indigo-500 to-indigo-600';
  const icon = subjectIcons[subject?.name] || '📖';
  const progressPercentage = lesson_count > 0
    ? Math.round((completedLessons / lesson_count) * 100)
    : 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/subject/${subject?.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
    >
      <div className={clsx(
        'relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300',
        'bg-gradient-to-br',
        colors,
        'hover:shadow-2xl'
      )}>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 text-5xl opacity-50">{icon}</div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </div>

        {/* Header content */}
        <div className="relative p-6 pb-24">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1">
                📖 Subject
              </p>
              <h3 className="text-white text-2xl font-bold leading-tight">
                {subject?.name || 'Unknown'}
              </h3>
            </div>
            <span className="text-4xl leading-none">{icon}</span>
          </div>

          {/* Subject Info */}
          <div className="text-white/95 text-sm space-y-1">
            <p className="flex items-center gap-2">
              <span>📦</span>
              {unit_count} {unit_count === 1 ? 'Unit' : 'Units'}
            </p>
            <p className="flex items-center gap-2">
              <span>📝</span>
              {lesson_count} {lesson_count === 1 ? 'Lesson' : 'Lessons'}
            </p>
          </div>
        </div>

        {/* Bottom Progress Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/20 p-6 flex items-center justify-between">
          {/* Progress Info */}
          <div className="text-white">
            <p className="text-xs opacity-90 mb-1">📊 Progress</p>
            <p className="text-lg font-bold">
              {completedLessons}/{lesson_count}
            </p>
            <p className="text-xs opacity-75">
              {progressPercentage}% complete
            </p>
          </div>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(progressPercentage / 100) * 220} 220`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Hover overlay with action */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Card Footer Stats */}
      <div className="mt-4 space-y-2 px-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-semibold">
            {completedLessons === lesson_count ? '✨ Completed' : `${completedLessons}/${lesson_count} done`}
          </span>
          <span className={clsx(
            'font-bold',
            progressPercentage === 100 ? 'text-success' : 'text-achievement'
          )}>
            {progressPercentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-500 rounded-full',
              progressPercentage === 100
                ? 'bg-gradient-to-r from-success to-green-400'
                : 'bg-gradient-to-r from-achievement to-orange-400'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamifiedDashboardCard;
