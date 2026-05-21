import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-black transition ${location.pathname === to ? "text-slate-950" : "text-slate-500 hover:text-slate-950"}`}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f5f0]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLink("/", "Website")}
          {navLink("/rooms", "Booking")}
          {user && navLink("/my-bookings", "My stays")}
          {isAdmin ? navLink("/admin", "Hotel dashboard") : navLink("/admin/login", "Admin portal")}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 py-2 pl-2 pr-4 shadow-lg shadow-slate-900/5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-xs font-black uppercase text-amber-300">{user.name?.[0] || user.email?.[0]}</span>
                <span className="max-w-[8rem] truncate text-sm font-black text-slate-700">{user.name || user.email || "Account"}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-white/70 bg-white p-2 shadow-2xl shadow-slate-900/10">
                  <Link to="/profile" className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Profile</Link>
                  <Link to="/my-bookings" className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">My bookings</Link>
                  {isAdmin && <Link to="/admin" className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Admin dashboard</Link>}
                  <button onClick={handleLogout} className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-white/70 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-lg shadow-slate-900/5 transition hover:bg-white">Sign in</Link>
              <Link to="/register" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-amber-300 shadow-xl shadow-slate-900/10 transition hover:bg-slate-800">Get started</Link>
            </>
          )}
        </div>

        <button className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-black text-slate-700 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/70 bg-[#f7f5f0] px-4 py-5 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-4">
            {navLink("/", "Website")}
            {navLink("/rooms", "Booking")}
            {user && navLink("/my-bookings", "My stays")}
            {isAdmin ? navLink("/admin", "Hotel dashboard") : navLink("/admin/login", "Admin portal")}
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm font-black text-rose-600">Sign out</button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="rounded-full bg-white px-4 py-3 text-sm font-black text-slate-700">Sign in</Link>
                <Link to="/register" className="rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-amber-300">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className="bg-slate-950 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
      <div>
        <div className="mb-5 inline-flex rounded-2xl bg-white p-3">
          <BrandLogo size="sm" />
        </div>
        <p className="max-w-md text-sm leading-7 text-white/60">Premium hospitality commerce and operations software for ambitious hotel brands, resorts, and multi-property groups.</p>
      </div>
      {[
        ["Product", "Booking engine", "Hotel dashboard", "Payments"],
        ["Company", "About", "Customers", "Careers"],
        ["Resources", "Security", "API docs", "Support"],
      ].map(([title, ...items]) => (
        <div key={title}>
          <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white">{title}</h4>
          {items.map((item) => <p key={item} className="mb-3 text-sm font-semibold text-white/55">{item}</p>)}
        </div>
      ))}
    </div>
    <div className="border-t border-white/10 px-4 py-6 text-center text-xs font-semibold text-white/45">
      {new Date().getFullYear()} AurumStay. Premium RBMS platform.
    </div>
  </footer>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" /></div>;
  if (!user) {
    navigate("/login");
    return null;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  if (loading) return null;
  if (!user) {
    navigate("/login");
    return null;
  }
  if (!isAdmin) {
    navigate("/admin/login");
    return null;
  }
  return children;
};

export const Layout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-[#f7f5f0]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
