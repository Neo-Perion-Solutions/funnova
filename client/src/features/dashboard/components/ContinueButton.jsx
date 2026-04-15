import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContinueButton = ({ currentLessonId = null, currentLessonTitle = null }) => {
  const navigate = useNavigate();

  if (!currentLessonId) {
    return null;
  }

  return (
    <button
      onClick={() => navigate(`/student/lesson/${currentLessonId}`)}
      className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-lg px-4 py-3 sm:py-4 font-semibold transition-all active:scale-95 min-h-11"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base">Continue: {currentLessonTitle || 'Lesson'}</span>
        <ChevronRight size={20} className="hidden sm:block" />
        <ChevronRight size={18} className="sm:hidden" />
      </div>
    </button>
  );
};

export default ContinueButton;
