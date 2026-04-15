import React from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ title, count, isOpen, onChange, children }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => onChange(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {count && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
