import React from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Button from '../../../components/ui/Button';
import { Edit3, Trash2, RefreshCcw, CheckCircle2, AlertCircle, Youtube, Gamepad2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const LessonTable = ({ data, isLoading, onEdit, onDelete, onRestore, onReorder }) => {
  const getStatus = (lesson) => {
    if (lesson.is_deleted) return 'deleted';
    if (lesson.question_count === 3) return 'ready';
    return 'incomplete';
  };

  const columns = [
    {
      key: 'seq_order',
      label: '#',
      width: '60px',
      render: (row) => (
        <span className="font-bold text-gray-400">
          {row.seq_order}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Lesson Title',
      render: (row) => (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold transition-colors",
            row.is_deleted ? "text-gray-400 line-through" : "text-gray-900 group-hover:text-indigo-600"
          )}>
            {row.title}
          </span>
          <span className="text-xs text-gray-400 font-medium truncate max-w-xs">
            {row.description || 'No description provided.'}
          </span>
        </div>
      ),
    },
    {
      key: 'assets',
      label: 'Assets',
      render: (row) => (
        <div className="flex gap-3">
          <div className={cn("p-1.5 rounded-lg border", row.video_url ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-gray-50 border-gray-100 text-gray-300")}>
            <Youtube size={14} title={row.video_url ? 'Video Ready' : 'No Video'} />
          </div>
          <div className={cn("p-1.5 rounded-lg border", row.has_game ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-gray-50 border-gray-100 text-gray-300")}>
            <Gamepad2 size={14} title={row.has_game ? 'Game Enabled' : 'No Game'} />
          </div>
        </div>
      ),
    },
    {
      key: 'questions',
      label: 'Quiz',
      render: (row) => {
        const count = row.question_count || 0;
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1 rounded-full",
              count === 3 ? "text-green-500" : "text-amber-500"
            )}>
              {count === 3 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            </div>
            <span className={cn(
              "text-xs font-bold",
              count === 3 ? "text-green-700" : "text-amber-700"
            )}>
              {count}/3
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={getStatus(row)} />,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.is_deleted ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald-600 hover:bg-emerald-50"
              onClick={() => onRestore(row)}
              icon={RefreshCcw}
              title="Restore Lesson"
            />
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:bg-blue-50"
                onClick={() => onEdit(row)}
                icon={Edit3}
                title="Edit Lesson"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:bg-red-50"
                onClick={() => onDelete(row)}
                icon={Trash2}
                title="Soft Delete"
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No lessons defined. Add your first lesson to this subject."
    />
  );
};

export default LessonTable;
