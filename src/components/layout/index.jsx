import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`font-body text-sm transition-colors ${isActive(to) ? "text-amber-600 font-medium" : "text-stone-600 hover:text-stone-900"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLink("/", "Home")}
            {navLink("/rooms", "Rooms")}
            {user && navLink("/my-bookings", "My Bookings")}
            {isAdmin ? navLink("/admin", "Admin") : navLink("/admin/login", "Admin Portal")}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm font-body text-stone-700 hover:text-stone-900 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs font-medium uppercase">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name || "Account"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-100 rounded-sm shadow-lg py-1 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm font-body text-stone-700 hover:bg-stone-50" onClick={() => setDropOpen(false)}>Profile</Link>
                    {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm font-body text-stone-700 hover:bg-stone-50" onClick={() => setDropOpen(false)}>Admin Dashboard</Link>}
                    <hr className="my-1 border-stone-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-body text-red-600 hover:bg-red-50">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="font-body text-sm text-stone-600 hover:text-stone-900 transition-colors">Sign in</Link>
                <Link to="/register" className="font-body text-sm bg-stone-900 text-amber-400 px-4 py-2 rounded-sm hover:bg-stone-800 transition-colors">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-4 space-y-3 animate-slide-up">
          <Link to="/" className="block font-body text-stone-700" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/rooms" className="block font-body text-stone-700" onClick={() => setMenuOpen(false)}>Rooms</Link>
          {user && <Link to="/my-bookings" className="block font-body text-stone-700" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {isAdmin
            ? <Link to="/admin" className="block font-body text-stone-700" onClick={() => setMenuOpen(false)}>Admin</Link>
            : <Link to="/admin/login" className="block font-body text-stone-700" onClick={() => setMenuOpen(false)}>Admin Portal</Link>}
          <hr className="border-stone-100" />
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left font-body text-red-600 text-sm">Sign out</button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="font-body text-stone-700 text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="font-body text-sm bg-stone-900 text-amber-400 px-4 py-2 rounded-sm" onClick={() => setMenuOpen(false)}>Get started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className="bg-stone-900 text-stone-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="mb-3 inline-flex bg-white p-2 rounded-sm">
            <BrandLogo size="sm" />
          </div>
          <p className="text-sm leading-relaxed">Premium hotel stays crafted for the modern traveller.</p>
        </div>
        <div>
          <h4 className="font-body font-medium text-white mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
          <div className="space-y-2">
            {[["Home", "/"], ["Rooms", "/rooms"], ["Login", "/login"]].map(([l, h]) => (
              <Link key={h} to={h} className="block text-sm hover:text-amber-400 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-body font-medium text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <div className="space-y-2 text-sm">
            <p>hello@aurumstay.com</p>
            <p>+1 (555) 000-0000</p>
            <p>123 Grand Ave, NY 10001</p>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {new Date().getFullYear()} AurumStay. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Privacy Policy · Terms of Service</p>
      </div>
    </div>
  </footer>
);

// Route guards
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin h-8 w-8 border-2 border-stone-900 border-t-transparent rounded-full" /></div>;
  if (!user) { navigate("/admin/login"); return null; }
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  if (loading) return null;
  if (!user) { navigate("/login"); return null; }
  if (!isAdmin) { navigate("/admin/login"); return null; }
  return children;
};

export const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-stone-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
