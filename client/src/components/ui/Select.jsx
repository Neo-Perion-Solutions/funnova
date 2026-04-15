import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className, label, error, options, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          ref={ref}
          className={cn(
            'w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm appearance-none transition-all outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-950 disabled:bg-gray-50 disabled:text-gray-500',
            error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
