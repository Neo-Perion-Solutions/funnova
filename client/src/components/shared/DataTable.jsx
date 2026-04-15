import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import Input from '../ui/Input';

const DataTable = ({
  columns,
  data = [],
  isLoading,
  pagination = { page: 1, pageSize: 10, total: 0, onChange: () => {} },
  search = { value: '', onChange: () => {}, placeholder: 'Search...' },
  emptyMessage = 'No records found.',
  className,
}) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className={cn('space-y-4', className)}>
      {search && (
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="pl-10"
            placeholder={search.placeholder}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && <ArrowUpDown size={12} className="text-gray-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: pagination.pageSize || 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150 even:bg-white odd:bg-gray-50/30">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Showing <span className="text-gray-900">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
              <span className="text-gray-900">
                {Math.min(pagination.page * pagination.pageSize, pagination.total)}
              </span>{' '}
              of <span className="text-gray-900">{pagination.total}</span> entries
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => pagination.onChange(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  // Simplified pagination logic: show first, last, and current ± 1
                  if (
                    p === 1 || 
                    p === totalPages || 
                    Math.abs(p - pagination.page) <= 1
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => pagination.onChange(p)}
                        className={cn(
                          'w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm',
                          pagination.page === p
                            ? 'bg-gray-950 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {p}
                      </button>
                    );
                  }
                  // Show ellipsis
                  if (p === 2 || p === totalPages - 1) {
                    return <span key={p} className="text-gray-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                disabled={pagination.page >= totalPages}
                onClick={() => pagination.onChange(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
