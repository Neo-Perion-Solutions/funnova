import React from 'react';

const SectionTabs = ({ sections, activeIndex, onSectionChange, disabled = false }) => {
  if (!sections || sections.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6 border-b border-gray-200 overflow-x-auto">
      <div className="flex gap-1 sm:gap-2">
        {sections.map((section, index) => (
          <button
            key={section.id || index}
            onClick={() => !disabled && onSectionChange(index)}
            disabled={disabled}
            className={`whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors active:scale-95
              ${
                activeIndex === index
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {section.title || `Section ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionTabs;
