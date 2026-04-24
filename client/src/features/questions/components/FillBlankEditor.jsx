import React from 'react';
import Input from '../../../components/ui/Input';
import { Trash2 } from 'lucide-react';

const FillBlankEditor = ({ register, errors, index, remove }) => {
  return (
    <div className="space-y-4 p-6 bg-purple-50/50 rounded-2xl border border-purple-100 relative group transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-purple-600 uppercase tracking-widest">Fill in the Blank #{index + 1}</h4>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-medium text-purple-400">
            <span>Use</span>
            <code className="bg-purple-100 px-1 rounded font-bold text-purple-700">____</code>
            <span>for blank</span>
          </div>
          {remove && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg transition-colors border border-red-100"
              title="Remove Question"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Question Statement</label>
        <textarea
          rows={3}
          placeholder="e.g. The sun is a ____ and provides light."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          {...register(`fill_blank.${index}.question_text`)}
        />
        {errors.fill_blank?.[index]?.question_text && <p className="text-xs text-red-500 font-medium">{errors.fill_blank[index].question_text.message}</p>}
      </div>

      <div className="w-1/2">
        <Input
          label="Correct Answer (Single Word)"
          placeholder="e.g. STAR"
          error={errors.fill_blank?.[index]?.correct_answer?.message}
          {...register(`fill_blank.${index}.correct_answer`)}
        />
      </div>
    </div>
  );
};

export default FillBlankEditor;
