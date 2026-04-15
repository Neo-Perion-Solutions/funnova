import React from 'react';
import Badge from '../ui/Badge';

const StatusBadge = ({ status }) => {
  const config = {
    ready:      { label: 'Ready', variant: 'success' },
    incomplete: { label: 'Incomplete', variant: 'warning' },
    deleted:    { label: 'Deleted', variant: 'danger' },
    active:     { label: 'Active', variant: 'primary' },
    inactive:   { label: 'Inactive', variant: 'secondary' },
  };

  const { label, variant } = config[status.toLowerCase()] || { label: status, variant: 'secondary' };

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
