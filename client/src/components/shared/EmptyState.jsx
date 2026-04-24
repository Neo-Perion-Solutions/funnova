import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/60 p-12 text-center">
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <Icon size={40} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold leading-tight text-gray-950">
        {title}
      </h3>
      <p className="max-w-70 text-sm text-gray-500 mt-2 mb-6">
        {description}
      </p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
