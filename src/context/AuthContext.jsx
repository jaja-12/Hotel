import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, usersAPI } from "../services/api";

const AuthContext = createContext(null);

const decodeJwtPayload = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    name: user.name || user.fullname || user.email,
    fullname: user.fullname || user.name,
    role: user.role || "Guest",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("hotel_token");
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await usersAPI.getMe();
      setUser(normalizeUser(data));
    } catch {
      localStorage.removeItem("hotel_token");
      localStorage.removeItem("hotel_user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem("hotel_token", data.token);
    const tokenUser = decodeJwtPayload(data.token);
    const nextUser = normalizeUser(data.user || { ...tokenUser, email: credentials.email });
    localStorage.setItem("hotel_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    if (data.token) localStorage.setItem("hotel_token", data.token);
    const nextUser = normalizeUser(data.user || userData);
    localStorage.setItem("hotel_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const registerAdmin = async (userData) => {
    const { data } = await authAPI.registerAdmin(userData);
    localStorage.setItem("hotel_token", data.token);
    const nextUser = normalizeUser(data.user || userData);
    localStorage.setItem("hotel_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("hotel_token");
    localStorage.removeItem("hotel_user");
    setUser(null);
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, registerAdmin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
