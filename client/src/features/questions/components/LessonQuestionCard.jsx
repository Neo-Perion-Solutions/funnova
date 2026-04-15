import React from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Edit3, PlusCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const LessonQuestionCard = ({ lesson, onEdit }) => {
  const hasQuestions = lesson.question_count === 3;

  return (
    <div className={cn(
      "bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden group",
      hasQuestions ? "border-emerald-100 hover:border-emerald-300" : "border-gray-100 hover:border-gray-300 shadow-sm"
    )}>
      {/* Header */}
      <div className={cn(
        "px-6 py-4 flex items-center justify-between",
        hasQuestions ? "bg-emerald-50/50" : "bg-gray-50/30"
      )}>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Lesson #{lesson.seq_order}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
          hasQuestions ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 font-black"
        )}>
          {hasQuestions ? (
            <>
              <CheckCircle2 size={10} />
              Ready
            </>
          ) : (
            <>
              <AlertCircle size={10} />
              Needs Quiz
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
          {lesson.title}
        </h4>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={14} className={hasQuestions ? "text-emerald-500" : "text-gray-300"} />
          <span className="text-xs font-semibold text-gray-500">
            {lesson.question_count || 0} / 3 Questions defined
          </span>
        </div>

        <div className="mt-auto">
          <Button
            variant={hasQuestions ? 'secondary' : 'primary'}
            className="w-full text-xs"
            onClick={() => onEdit(lesson)}
            icon={hasQuestions ? Edit3 : PlusCircle}
          >
            {hasQuestions ? 'Edit Atomic Quiz' : 'Add Atomic Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonQuestionCard;
