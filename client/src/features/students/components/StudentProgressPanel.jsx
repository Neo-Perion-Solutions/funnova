import React from 'react';
import { X, Award, Target, Book } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Spinner from '../../../components/ui/Spinner';
import { useStudentProgress } from '../hooks/useStudents';

const StudentProgressPanel = ({ student, isOpen, onClose }) => {
  const { data: progress, isLoading } = useStudentProgress(student?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "relative w-full max-w-sm bg-white shadow-2xl flex flex-col h-full",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              {student?.avatar_url || '👤'}
            </div>
            <div>
              <h3 className="font-bold leading-tight">{student?.name}</h3>
              <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest font-bold">
                Grade {student?.grade} • Sec {student?.section}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <Spinner size={32} />
              <p className="text-xs font-bold uppercase mt-4 tracking-widest">Analyzing Progress...</p>
            </div>
          ) : !progress ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center">
              <Book size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">No progress data available for this student yet.</p>
            </div>
          ) : (
            <>
              {/* Overall Summary */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Award size={12} className="text-indigo-600" />
                  Overall Performance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-indigo-600">{progress.avg_score?.toFixed(1)}%</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Avg Score</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-emerald-600">{progress.total_completed}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Lessons Done</p>
                  </div>
                </div>
              </section>

              {/* Subject Breakdown */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Target size={12} className="text-indigo-600" />
                  Subject Progress
                </h4>
                <div className="space-y-5">
                  {(progress.subject_progress || []).map((subj, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">{subj.subject_name}</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {subj.lessons_completed} / {subj.total_lessons}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(subj.lessons_completed / subj.total_lessons) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <History className="text-indigo-600" size={12} />
                  Recent Completions
                </h4>
                <div className="space-y-3">
                  {(progress.recent_activity || []).map((act, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                        <Award size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">{act.lesson_title}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Score: {act.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import { History } from 'lucide-react';

export default StudentProgressPanel;
