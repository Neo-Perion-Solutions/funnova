import React from 'react';
import DataTable from '../../../components/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { formatDate, cn } from '../../../lib/utils';

const AdminUserTable = ({ data, isLoading, onEdit, onDelete, onActivity }) => {
  const columns = [
    {
      key: 'name',
      label: 'Admin',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-sm font-bold text-purple-600 shadow-sm">
            {row.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
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
      key: 'email',
      label: 'Email',
      render: (row) => (
        <span className="text-gray-500 font-medium text-xs tracking-tight">
          {row.email}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        row.role === 'main_admin' ? (
          <Badge variant="warning">Main Admin</Badge>
        ) : (
          <Badge variant="info">Sub Admin</Badge>
        )
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (row) => (
        <span className="text-gray-400 text-xs font-semibold">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: 'last_login',
      label: 'Last Login',
      render: (row) => (
        <span className="text-gray-400 text-xs font-semibold">
          {row.last_login ? formatDate(row.last_login) : 'Never'}
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
            onClick={() => onActivity?.(row)}
            icon={Eye}
            title="View Activity"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => onEdit(row)}
            icon={Edit2}
            title="Edit Admin"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={() => onDelete(row)}
            icon={Trash2}
            title="Remove Admin"
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
      emptyMessage="No admin users found matching your criteria."
    />
  );
};

export default AdminUserTable;
