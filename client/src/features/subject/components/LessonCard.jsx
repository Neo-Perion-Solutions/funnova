import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';

const LessonCard = ({ lesson, index, isCompleted, isActive, isLocked }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }
    navigate(`/student/lesson/${lesson.id}`);
  };

  const getStateIndicator = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-xs font-semibold text-green-600">Done</span>
        </div>
      );
    }
    if (isActive) {
      return (
        <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1">
          <ChevronRight size={16} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-600">Active</span>
        </div>
      );
    }
    if (isLocked) {
      return (
        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
          <Lock size={16} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400">Locked</span>
        </div>
      );
    }
    return null;
  };

  const cardClasses = `
    relative flex flex-col gap-3 rounded-lg border-2 p-4 transition-all duration-200 active:scale-95
    ${isCompleted ? 'border-green-200 bg-green-50 cursor-pointer hover:border-green-400' : ''}
    ${isActive ? 'border-blue-300 bg-blue-50 cursor-pointer hover:border-blue-500 shadow-md' : ''}
    ${isLocked ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : ''}
    ${!isCompleted && !isActive && !isLocked ? 'border-blue-100 bg-white cursor-pointer hover:border-blue-300' : ''}
  `;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLocked}
        className={cardClasses}
      >
        {/* Lesson Number */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{lesson.title || `Lesson ${index + 1}`}</h3>
              {lesson.description && (
                <p className="text-xs text-gray-600">{lesson.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* State Badge */}
        <div className="flex justify-between items-center">
          <div />
          {getStateIndicator()}
        </div>
      </button>

      {/* Tooltip for locked lessons */}
      {showTooltip && isLocked && (
        <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg z-10">
          Complete previous lessons first
        </div>
      )}
    </div>
  );
};

export default LessonCard;
