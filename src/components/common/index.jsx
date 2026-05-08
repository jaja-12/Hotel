// ─── BUTTON ──────────────────────────────────────────────────────────────────
export const Button = ({
  children, onClick, type = "button", variant = "primary",
  size = "md", loading = false, disabled = false, className = "", fullWidth = false,
}) => {
  const base = "inline-flex items-center justify-center font-body font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-8 py-3.5 text-base" };
  const variants = {
    primary: "bg-stone-900 text-amber-400 hover:bg-stone-800 focus:ring-stone-700 disabled:opacity-50",
    secondary: "bg-amber-400 text-stone-900 hover:bg-amber-300 focus:ring-amber-500 disabled:opacity-50",
    outline: "border border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-400 disabled:opacity-50",
    ghost: "text-stone-600 hover:bg-stone-100 focus:ring-stone-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50",
  };
  return (
    <button
      type={type} onClick={onClick} disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-stone-700 font-body">{label}</label>}
    <input
      className={`w-full px-4 py-2.5 border rounded-sm bg-white text-stone-900 font-body text-sm
        placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent
        transition-colors ${error ? "border-red-400 focus:ring-red-400" : "border-stone-200"} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-body">{error}</p>}
  </div>
);

// ─── SELECT ────────────────────────────────────────────────────────────────────
export const Select = ({ label, error, options = [], className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-stone-700 font-body">{label}</label>}
    <select
      className={`w-full px-4 py-2.5 border rounded-sm bg-white text-stone-900 font-body text-sm
        focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent
        transition-colors ${error ? "border-red-400" : "border-stone-200"} ${className}`}
      {...props}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs text-red-500 font-body">{error}</p>}
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-stone-100 text-stone-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ─── SPINNER ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg className={`animate-spin ${sizes[size]} text-stone-900`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
export const SkeletonCard = () => (
  <div className="bg-white border border-stone-100 rounded-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-stone-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-stone-200 rounded w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-1/2" />
      <div className="h-3 bg-stone-100 rounded w-2/3" />
      <div className="h-8 bg-stone-200 rounded w-1/3 mt-4" />
    </div>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-display text-xl text-stone-800 mb-2">{title}</h3>
    <p className="font-body text-stone-500 text-sm mb-6 max-w-xs">{description}</p>
    {action}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="font-display text-xl text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = "", hover = false }) => (
  <div className={`bg-white border border-stone-100 rounded-sm shadow-sm ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : ""} ${className}`}>
    {children}
  </div>
);

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <h1 className="font-display text-3xl text-stone-900">{title}</h1>
      {subtitle && <p className="font-body text-stone-500 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);
