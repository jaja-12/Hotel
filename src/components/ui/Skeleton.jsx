import React from 'react';

const Skeleton = ({
  count = 1,
  height = 20,
  width = '100%',
  circle = false,
  className = '',
  inline = false,
}) => {
  const containerClass = inline ? 'inline-block' : 'block';

  return (
    <div className={containerClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            bg-gradient-to-r from-warm-200 to-warm-100
            dark:from-navy-700 dark:to-navy-600
            animate-shimmer
            ${circle ? 'rounded-full' : 'rounded-lg'}
            ${className}
            ${i > 0 ? 'mt-2' : ''}
          `}
          style={{
            height: `${height}px`,
            width,
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
