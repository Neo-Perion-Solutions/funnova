import React from 'react';
import DataTable from '../../../components/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Edit2 } from 'lucide-react';
import { BookOpen } from 'lucide-react';

const SubjectTable = ({ data, isLoading, onEdit }) => {
  const columns = [
    {
      key: 'name',
      label: 'Subject',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm">
            {row.icon_url || '📚'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">
              {row.name}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Curriculum Component
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'grade',
      label: 'Target Grade',
      render: (row) => (
        <Badge variant="secondary">Grade {row.grade}</Badge>
      ),
    },
    {
      key: 'lesson_count',
      label: 'Curriculum Depth',
      render: (row) => (
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-700">
            {row.lesson_count || 0} Lessons
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-600 hover:bg-indigo-50"
            onClick={() => onEdit(row)}
            icon={Edit2}
          >
            Edit Module
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No subjects have been defined for this grade level."
    />
  );
};

export default SubjectTable;
