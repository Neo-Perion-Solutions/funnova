import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const GradeSelection = () => {
  const navigate = useNavigate();
  const grades = [3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Curriculum Manager</h1>
        <p className="mt-1 text-sm text-gray-600">Select a grade to manage subjects, units, and lessons.</p>
      </div>

      {/* Grade Selection Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grades.map((grade) => (
          <div
            key={grade}
            onClick={() => navigate(`/admin/curriculum/grade/${grade}`)}
            className="rounded-lg border-2 border-gray-200 bg-white p-8 text-center cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Grade {grade}</h3>
            <p className="mt-2 text-sm text-gray-600">Click to manage curriculum for Grade {grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeSelection;
