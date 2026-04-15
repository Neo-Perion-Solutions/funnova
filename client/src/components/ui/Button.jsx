import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled, 
  children, 
  icon: Icon,
  ...props 
}, ref) => {
  const variants = {
    primary:   'bg-gray-950 text-white hover:bg-gray-800 shadow-sm',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white',
    danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100',
    ghost:     'text-gray-600 hover:bg-gray-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
