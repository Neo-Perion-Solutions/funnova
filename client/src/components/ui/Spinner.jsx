import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const Spinner = ({ size = 24, className }) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Loader2 size={size} className="animate-spin text-gray-950" />
    </div>
  );
};

export default Spinner;
