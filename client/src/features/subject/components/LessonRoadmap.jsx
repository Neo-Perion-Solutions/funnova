import React from 'react';
import LessonCard from './LessonCard';

const LessonRoadmap = ({ lessons, currentLessonId, completedLessonIds = [] }) => {
  if (!lessons || lessons.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">No lessons available yet. Check back soon! 🌟</p>
      </div>
    );
  }

  // Calculate progress
  const completedCount = completedLessonIds.length;
  const totalCount = lessons.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Find the first incomplete lesson to determine active
  const firstIncompleteIndex = lessons.findIndex(
    (lesson) => !completedLessonIds.includes(lesson.id)
  );

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">
            Progress: <span className="font-bold text-blue-600">{completedCount} of {totalCount}</span> lessons completed
          </p>
          <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isActive = index === firstIncompleteIndex;
          const isLocked = index > firstIncompleteIndex && !isCompleted;

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              isCompleted={isCompleted}
              isActive={isActive}
              isLocked={isLocked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonRoadmap;
