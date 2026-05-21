import React from 'react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'font-body font-medium rounded-2xl transition-all duration-200 inline-flex items-center justify-center gap-2 whitespace-nowrap';

  const variants = {
    primary: 'bg-navy-500 text-white hover:bg-navy-600 active:bg-navy-700 disabled:bg-warm-300 disabled:text-warm-600',
    secondary: 'bg-warm-100 text-navy-500 hover:bg-warm-200 active:bg-warm-300 disabled:bg-warm-200 disabled:text-warm-400',
    outline: 'border-2 border-navy-500 text-navy-500 hover:bg-navy-50 active:bg-navy-100 disabled:border-warm-300 disabled:text-warm-400',
    ghost: 'text-navy-500 hover:bg-warm-100 active:bg-warm-200 disabled:text-warm-400',
    gold: 'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700 disabled:bg-warm-300 disabled:text-warm-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-warm-300 disabled:text-warm-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg',
    full: 'w-full px-4 py-2.5 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
