import React from 'react';

const Badge = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-navy-100 text-navy-700 dark:bg-navy-700 dark:text-navy-100',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
    gold: 'bg-gold-100 text-gold-700 dark:bg-gold-900 dark:text-gold-100',
    outline: 'border border-navy-300 text-navy-700 dark:border-navy-500 dark:text-navy-100',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-medium',
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full font-body ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;
