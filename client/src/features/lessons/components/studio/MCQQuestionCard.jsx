import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';

const MCQQuestionCard = ({ question, index, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {index}
            </span>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{question.question_text}</p>
          </div>
          <div className="flex items-center gap-2 ml-8">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
              Answer: {question.correct_answer}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Edit2 size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MCQQuestionCard;
