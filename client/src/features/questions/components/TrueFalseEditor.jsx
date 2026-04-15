import React from 'react';
import { cn } from '../../../lib/utils';

const TrueFalseEditor = ({ register, watch, errors }) => {
  const correctVal = watch('true_false.correct_answer');

  return (
    <div className="space-y-4 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Question 3: True or False</h4>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Statement Validation</span>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Statement to Evaluate</label>
        <textarea
          rows={3}
          placeholder="e.g. Earth is the only planet in the solar system."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          {...register('true_false.question_text')}
        />
        {errors.true_false?.question_text && <p className="text-xs text-red-500 font-medium">{errors.true_false.question_text.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Correct Answer</label>
        <div className="flex items-center p-1 bg-gray-100 rounded-xl w-fit gap-1">
          <label 
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all",
              correctVal === 'True' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <input type="radio" value="True" className="hidden" {...register('true_false.correct_answer')} />
            TRUE
          </label>
          <label 
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all",
              correctVal === 'False' ? "bg-white text-red-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <input type="radio" value="False" className="hidden" {...register('true_false.correct_answer')} />
            FALSE
          </label>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseEditor;
