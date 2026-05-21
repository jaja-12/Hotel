import React from 'react';

const RatingStars = ({ rating = 4.5, count = null, size = 'md', interactive = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= Math.floor(rating);
      const isHalf = starValue === Math.ceil(rating) && rating % 1 !== 0;

      return (
        <div key={i} className="relative inline-block">
          <svg
            className={`${sizes[size]} text-warm-300 dark:text-navy-600`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {(isFilled || isHalf) && (
            <svg
              className={`${sizes[size]} absolute top-0 left-0 text-gold-500`}
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ clip: isHalf ? 'rect(0, 12px, 24px, 0)' : 'auto' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </div>
      );
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex gap-0.5">
        {renderStars()}
      </div>
      <span className="text-sm font-body text-warm-600 dark:text-warm-400">
        {rating}
        {count && <span className="text-warm-500 dark:text-warm-500"> ({count})</span>}
      </span>
    </div>
  );
};

export default RatingStars;
