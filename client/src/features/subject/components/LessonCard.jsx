import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';

const LessonCard = ({ lesson, isCompleted, isUnlocked }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const isLocked = !isUnlocked;
  const isActive = isUnlocked && !isCompleted;

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
        <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 shadow-sm">
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
    relative flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300
    ${isCompleted ? 'border-green-200 bg-green-50/50 cursor-pointer hover:border-green-400 hover:shadow-md' : ''}
    ${isActive ? 'border-blue-300 bg-white cursor-pointer hover:border-blue-500 hover:shadow-xl shadow-md transform hover:-translate-y-1' : ''}
    ${isLocked ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75 grayscale-[0.5]' : ''}
  `;

  return (
    <div className="relative h-full">
      <button
        onClick={handleClick}
        disabled={isLocked}
        className={`${cardClasses} w-full h-full text-left flex flex-col justify-between`}
      >
        <div>
          {/* Lesson Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
              {lesson.title || 'Untitled Lesson'}
            </h3>
          </div>
          {/* Lesson Description */}
          {lesson.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {lesson.description}
            </p>
          )}
        </div>

        {/* State Badge bottom anchored */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100/50">
          <span className="text-xs font-medium text-gray-400">
            Lesson {lesson.lesson_order}
          </span>
          {getStateIndicator()}
        </div>
      </button>

      {/* Tooltip for locked lessons */}
      {showTooltip && isLocked && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-xl z-20">
          Complete previous lessons first
          {/* Caret */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default LessonCard;
