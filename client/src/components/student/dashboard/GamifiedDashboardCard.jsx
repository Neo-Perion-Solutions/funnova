import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
  const colors = subjectColors[subject.name] || 'from-indigo-500 to-indigo-600';
  const icon = subjectIcons[subject.name] || '📖';
  const progressPercentage = lesson_count > 0
    ? Math.round((completedLessons / lesson_count) * 100)
    : 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/subject/${subject.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    >
      <div className={clsx(
        'relative overflow-hidden rounded-xl shadow-lg transition-all duration-300',
        'bg-gradient-to-br',
        colors
      )}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 text-4xl">{icon}</div>
        </div>

        {/* Header content */}
        <div className="relative p-6 pb-20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-semibold">Subject</p>
              <h3 className="text-white text-2xl font-bold">{subject.name}</h3>
            </div>
            <span className="text-3xl">{icon}</span>
          </div>

          <p className="text-white/90 text-sm">
            {unit_count} {unit_count === 1 ? 'Unit' : 'Units'} • {lesson_count} {lesson_count === 1 ? 'Lesson' : 'Lessons'}
          </p>
        </div>

        {/* Progress ring at bottom-right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${(progressPercentage / 100) * 176} 176`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{progressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Footer bar showing progress */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Hover action indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Stats below card */}
      <div className="mt-3 flex justify-between text-sm">
        <span className="text-gray-700 font-semibold">
          {completedLessons}/{lesson_count} completed
        </span>
        <span className="text-achievement font-bold">
          {progressPercentage}% done
        </span>
      </div>
    </div>
  );
};

export default GamifiedDashboardCard;
