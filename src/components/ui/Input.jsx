import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-body font-medium text-navy-700 dark:text-warm-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl font-body text-base
            border-2 transition-all duration-200
            bg-white dark:bg-navy-700
            text-navy-900 dark:text-white
            placeholder-warm-400 dark:placeholder-warm-500
            border-warm-200 dark:border-navy-600
            focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50
            disabled:bg-warm-100 dark:disabled:bg-navy-800 disabled:text-warm-400 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1 font-body">{error}</p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
