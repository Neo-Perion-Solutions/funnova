import React from 'react';
import LessonCard from './LessonCard';

const LessonRoadmap = ({ units = [], currentLessonId }) => {
  if (!units || units.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center flex flex-col items-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No units available yet</h3>
        <p className="text-gray-500 max-w-md text-center">
          Check back soon for new content!
        </p>
      </div>
    );
  }

  // Calculate overall subject progress
  let totalCount = 0;
  let completedCount = 0;
  
  units.forEach(unit => {
    unit.lessons?.forEach(lesson => {
      totalCount++;
      if (lesson.is_completed) completedCount++;
    });
  });

  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Overview Progress Card */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            Progress: <span className="font-bold text-blue-600">{completedCount} of {totalCount}</span> lessons completed
          </p>
          <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-blue-200/50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Render Units sequentially */}
      <div className="space-y-10">
        {units.map((unit) => (
          <div key={unit.id} className="relative pl-6 sm:pl-8 border-l-4 border-gray-200">
            {/* Unit Header Node */}
            <div className="absolute -left-[14px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-4 border-indigo-200">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
            </div>
            
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Unit {unit.unit_order}: {unit.title}
            </h2>
            
            {/* Unit Lessons Grid */}
            {unit.lessons && unit.lessons.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {unit.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={lesson.is_completed}
                    isUnlocked={lesson.is_unlocked}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No lessons assigned yet in this unit.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonRoadmap;
