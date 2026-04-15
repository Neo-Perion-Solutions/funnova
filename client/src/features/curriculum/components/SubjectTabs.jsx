import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useSubjects } from '../../subjects/hooks/useSubjects';

const SubjectTabs = ({ gradeId }) => {
  const navigate = useNavigate();
  const { data: subjects = [], isLoading } = useSubjects({ grade: parseInt(gradeId) });

  if (isLoading) {
    return <div className="text-center py-8">Loading subjects...</div>;
  }

  const firstSubject = subjects[0];

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/curriculum')}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Grade {gradeId}</h1>
          <p className="mt-1 text-sm text-gray-600">Select a subject to manage its content</p>
        </div>
      </div>

      {/* Subject Tabs */}
      {subjects.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No subjects found for Grade {gradeId}</p>
        </div>
      ) : (
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() =>
                navigate(
                  `/admin/curriculum/grade/${gradeId}/subject/${subject.id}`
                )
              }
              className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              <span className="text-xl">{subject.icon}</span>
              {subject.name}
            </button>
          ))}
        </div>
      )}

      {/* Placeholder: Tab Content */}
      {firstSubject && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          Click on a subject tab to view and manage its units
        </div>
      )}
    </div>
  );
};

export default SubjectTabs;
