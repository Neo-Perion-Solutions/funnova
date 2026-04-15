import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-950 disabled:bg-gray-50 disabled:text-gray-500',
          error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
