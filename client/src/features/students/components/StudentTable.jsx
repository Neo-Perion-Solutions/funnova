import React from 'react';
import DataTable from '../../../components/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Edit2, Trash2, Eye, Key } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { useUIStore } from '../../../store/uiStore';

const StudentTable = ({ data, isLoading, onEdit, onDelete, onProgress, onResetPassword }) => {
  const openModal = useUIStore((s) => s.openModal);

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-sm">
            {row.avatar_url || '👤'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {row.name}
            </span>
            <span className="text-xs text-gray-400 font-medium tracking-tight">
              ID: {row.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'login_id',
      label: 'Login ID',
      render: (row) => (
        <code className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {row.login_id || 'N/A'}
        </code>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => (
        <span className="text-gray-500 font-medium text-xs tracking-tight">
          {row.email}
        </span>
      ),
    },
    {
      key: 'grade',
      label: 'Grade / Sec',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="primary">Grade {row.grade}</Badge>
          <span className="text-gray-400 font-bold">•</span>
          <span className="text-gray-600 font-bold text-sm tracking-widest">{row.section}</span>
        </div>
      ),
    },
    {
      key: 'avg_score',
      label: 'Avg Score',
      render: (row) => (
        <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
            <span>Score</span>
            <span>{parseFloat(row.avg_score || 0).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                parseFloat(row.avg_score || 0) > 70 ? 'bg-green-500' : 'bg-indigo-500'
              )} 
              style={{ width: `${row.avg_score || 0}%` }} 
            />
          </div>
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (row) => (
        <span className="text-gray-400 text-xs font-semibold">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:bg-indigo-50"
            onClick={() => onProgress(row)}
            icon={Eye}
            title="View Progress"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:bg-amber-50"
            onClick={() => onResetPassword?.(row)}
            icon={Key}
            title="Reset Password"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => onEdit(row)}
            icon={Edit2}
            title="Edit Student"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={() => onDelete(row)}
            icon={Trash2}
            title="Remove Student"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No students found matching your criteria."
    />
  );
};

// Utility cn import needed inside render
import { cn } from '../../../lib/utils';

export default StudentTable;
