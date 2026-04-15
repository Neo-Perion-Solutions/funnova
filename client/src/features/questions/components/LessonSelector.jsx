import React from 'react';
import { cn } from '../../../lib/utils';
import { ChevronRight } from 'lucide-react';

const LessonSelector = ({ grade, setGrade, subjects = [], subjectId, setSubjectId }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-6 mb-8">
      <div className="w-full sm:w-48">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">1. Select Grade</label>
        <div className="flex gap-2">
          {['3', '4', '5'].map(g => (
            <button
              key={g}
              onClick={() => { setGrade(g); setSubjectId(''); }}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-bold transition-all border-2",
                grade === g ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
              )}
            >
              G{g}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <ChevronRight size={20} className="text-gray-200 mt-6" />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">2. Select Subject</label>
        <div className="flex flex-wrap gap-2">
          {!subjects || subjects.length === 0 ? (
            <span className="text-sm text-gray-400 italic py-2">No subjects found for this grade.</span>
          ) : (
            subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSubjectId(s.id.toString())}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 flex items-center gap-2",
                  subjectId === s.id.toString() 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                )}
              >
                <span className="text-lg">{s.icon_url}</span>
                {s.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonSelector;
