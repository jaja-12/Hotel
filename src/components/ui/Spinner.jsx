import React from 'react';

const Spinner = ({ size = 'md', color = 'gold' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    gold: 'border-gold-500',
    navy: 'border-navy-500',
    white: 'border-white',
  };

  return (
    <div className={`inline-flex items-center justify-center ${sizes[size]}`}>
      <div
        className={`
          animate-spin rounded-full border-4
          ${colors[color]}
          border-t-transparent border-r-transparent
          ${sizes[size]}
        `}
      />
    </div>
  );
};

export default Spinner;
