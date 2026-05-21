import React, { useEffect } from 'react';

const Modal = React.forwardRef(({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
}, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={ref}
        className={`
          relative z-10 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl
          w-[90vw] ${sizes[size]} max-h-[90vh] overflow-y-auto
          animate-slide-up ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200 dark:border-navy-700">
            <h2 className="text-xl font-display font-bold text-navy-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-warm-400 hover:text-warm-600 dark:hover:text-warm-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
export default Modal;
