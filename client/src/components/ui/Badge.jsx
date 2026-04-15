import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary:   'bg-gray-100 text-gray-700',
    success:   'bg-green-100 text-green-700',
    warning:   'bg-yellow-100 text-yellow-700',
    danger:    'bg-red-100 text-red-600',
    secondary: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
