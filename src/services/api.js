import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — inject JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hotel_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hotel_token");
      localStorage.removeItem("hotel_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  registerAdmin: (data) => api.post("/auth/admin/register", data),
  login: (data) => api.post("/auth/login", data),
};

// ─── ROOMS ────────────────────────────────────────────────────────────────────
export const roomsAPI = {
  getAll: () => api.get("/rooms"),
  getAvailable: () => api.get("/rooms/available"),
  create: (data) => api.post("/rooms", {
    roomNumber: data.roomNumber,
    roomType: data.roomType || data.type,
    pricePerNight: data.pricePerNight,
    status: data.status || (data.isAvailable ? "Available" : "Booked"),
  }),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create: (data) => api.post("/bookings", {
    roomId: data.roomId,
    checkInDate: data.checkInDate || data.checkIn,
    checkOutDate: data.checkOutDate || data.checkOut,
  }),
  getMine: () => api.get("/bookings"),
  getAll: () => api.get("/bookings"),
  cancel: (id) => api.put(`/bookings/${id}`, { paymentStatus: "Cancelled" }),
  updateStatus: (id, data) => api.put(`/bookings/${id}`, {
    paymentStatus: data.paymentStatus || data.status,
  }),
};

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  make: (data) => api.post("/payments/payments", data),
  getAll: () => api.get("/payments/payments"),
};

// ─── USERS ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getMe: () => Promise.resolve({ data: JSON.parse(localStorage.getItem("hotel_user") || "null") }),
  updateMe: (data) => {
    const current = JSON.parse(localStorage.getItem("hotel_user") || "{}");
    const next = { ...current, ...data, fullname: data.fullname || data.name || current.fullname };
    localStorage.setItem("hotel_user", JSON.stringify(next));
    return Promise.resolve({ data: next });
  },
  getAll: () => Promise.resolve({ data: [] }),
};

export default api;
