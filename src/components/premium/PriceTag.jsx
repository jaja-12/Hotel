import React from 'react';

const PriceTag = ({
  price,
  currency = 'USD',
  period = null,
  original = null,
  discount = null,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`inline-block ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`${sizes[size]} font-display font-bold text-gold-500`}>
          {formatPrice(price)}
        </span>
        {original && (
          <span className="text-sm font-body line-through text-warm-500 dark:text-warm-400">
            {formatPrice(original)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {period && (
          <span className="text-xs font-body text-warm-600 dark:text-warm-400">
            per {period}
          </span>
        )}
        {discount && (
          <span className="text-xs font-body font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            Save {discount}%
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceTag;
