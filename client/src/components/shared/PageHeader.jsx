import React from 'react';

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Overview</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
