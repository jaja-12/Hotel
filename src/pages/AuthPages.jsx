import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";
import { BrandLogo } from "../components/common/BrandLogo";
import toast from "react-hot-toast";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back${user.name ? `, ${user.name}` : ""}!`);
      navigate(user.role === "Admin" ? "/admin" : "/rooms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #f59e0b 0%, transparent 60%)" }}
        />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <span className="inline-flex bg-white p-2 rounded-sm">
              <BrandLogo size="md" />
            </span>
          </Link>
          <h2 className="font-display text-4xl text-white mb-4 leading-tight">Your next great<br />stay awaits.</h2>
          <p className="font-body text-stone-400 text-base leading-relaxed max-w-sm">
            Sign in to manage your bookings, access exclusive rates, and enjoy a seamless hotel experience.
          </p>
          <div className="mt-12 flex gap-8">
            {[["🌟", "Premium Rooms"], ["🔒", "Secure Booking"], ["🎯", "Best Rates"]].map(([i, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl mb-1">{i}</div>
                <p className="font-body text-stone-400 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
              <BrandLogo size="md" />
            </Link>
            <h1 className="font-display text-3xl text-stone-900">Sign in</h1>
            <p className="font-body text-stone-500 text-sm mt-1">Welcome back. Please enter your details.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              error={errors.password}
            />
          </div>

          <Button fullWidth size="lg" onClick={handleSubmit} loading={loading} className="mt-6">
            Sign in
          </Button>

          <p className="font-body text-sm text-stone-500 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber-600 hover:underline font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role !== "Admin") {
        logout();
        toast.error("This account is not an admin account");
        return;
      }
      toast.success("Welcome to the admin portal");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white p-8 border border-stone-100 rounded-sm">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <BrandLogo size="md" />
        </Link>

        <h1 className="font-display text-3xl text-stone-900 mb-1">Admin portal</h1>
        <p className="font-body text-stone-500 text-sm mb-8">Sign in to manage rooms, bookings, and payments.</p>

        <div className="space-y-4">
          <Input
            label="Admin email"
            type="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            error={errors.password}
          />
        </div>

        <Button fullWidth size="lg" onClick={handleSubmit} loading={loading} className="mt-6">
          Sign in as admin
        </Button>

        <p className="font-body text-sm text-stone-500 text-center mt-6">
          Need an admin account?{" "}
          <Link to="/admin/register" className="text-amber-600 hover:underline font-medium">Create admin</Link>
        </p>
      </div>
    </div>
  );
}

export function AdminRegisterPage() {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerAdmin({ fullname: form.name, email: form.email, password: form.password });
      toast.success("Admin account created");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white p-8 border border-stone-100 rounded-sm">
        <Link to="/admin/login" className="flex items-center gap-2 mb-8">
          <BrandLogo size="md" />
        </Link>

        <h1 className="font-display text-3xl text-stone-900 mb-1">Create admin</h1>
        <p className="font-body text-stone-500 text-sm mb-8">Admin accounts can add rooms that guests will see as available.</p>

        <div className="space-y-4">
          <Input label="Full name" placeholder="Admin User" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} />
          <Input label="Email address" type="email" placeholder="admin@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} />
          <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
        </div>

        <Button fullWidth size="lg" onClick={handleSubmit} loading={loading} className="mt-6">
          Create admin account
        </Button>

        <p className="font-body text-sm text-stone-500 text-center mt-6">
          Already have admin access?{" "}
          <Link to="/admin/login" className="text-amber-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ fullname: form.name, email: form.email, password: form.password });
      toast.success("Account created! Welcome to AurumStay 🎉");
      navigate("/rooms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <BrandLogo size="md" />
        </Link>

        <h1 className="font-display text-3xl text-stone-900 mb-1">Create account</h1>
        <p className="font-body text-stone-500 text-sm mb-8">Join AurumStay for the best hotel experience.</p>

        <div className="space-y-4">
          <Input label="Full name" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} />
          <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} />
          <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
        </div>

        <Button fullWidth size="lg" onClick={handleSubmit} loading={loading} className="mt-6">
          Create account
        </Button>

        <p className="font-body text-sm text-stone-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
