import React from 'react';

const Card = React.forwardRef(({
  children,
  className = '',
  glass = false,
  hover = false,
  shadow = 'lg',
  ...props
}, ref) => {
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const glassStyle = glass
    ? 'bg-white/10 dark:bg-white/5 backdrop-blur-glass border border-white/20 dark:border-white/10'
    : 'bg-white dark:bg-navy-800 border border-warm-200 dark:border-navy-700';

  return (
    <div
      ref={ref}
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${glassStyle}
        ${shadowClasses[shadow]}
        ${hover ? 'hover:shadow-xl hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
export default Card;
