import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Trash2 } from 'lucide-react';

const MCQEditor = ({ register, errors, index, remove }) => {
  return (
    <div className="space-y-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative group transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Multiple Choice #{index + 1}</h4>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Logical Assessment</span>
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
          placeholder="Ask a question with 4 possible answers..."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          {...register(`mcq.${index}.question_text`)}
        />
        {errors.mcq?.[index]?.question_text && <p className="text-xs text-red-500 font-medium">{errors.mcq[index].question_text.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Option A" placeholder="First choice" error={errors.mcq?.[index]?.option_a?.message} {...register(`mcq.${index}.option_a`)} />
        <Input label="Option B" placeholder="Second choice" error={errors.mcq?.[index]?.option_b?.message} {...register(`mcq.${index}.option_b`)} />
        <Input label="Option C" placeholder="Third choice" error={errors.mcq?.[index]?.option_c?.message} {...register(`mcq.${index}.option_c`)} />
        <Input label="Option D" placeholder="Fourth choice" error={errors.mcq?.[index]?.option_d?.message} {...register(`mcq.${index}.option_d`)} />
      </div>

      <div className="w-1/2">
        <Select
          label="Correct Answer"
          options={[
            { label: 'Option A', value: 'A' },
            { label: 'Option B', value: 'B' },
            { label: 'Option C', value: 'C' },
            { label: 'Option D', value: 'D' },
          ]}
          {...register(`mcq.${index}.correct_answer`)}
          error={errors.mcq?.[index]?.correct_answer?.message}
        />
      </div>
    </div>
  );
};

export default MCQEditor;
