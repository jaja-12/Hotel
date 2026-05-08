import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { Layout, ProtectedRoute, AdminRoute } from "./components/layout";

// Pages
import LandingPage from "./pages/LandingPage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import { AdminLoginPage, AdminRegisterPage, LoginPage, RegisterPage } from "./pages/AuthPages";
import PaymentPage from "./pages/PaymentPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "DM Sans, sans-serif", fontSize: "14px", borderRadius: "2px" },
            success: { iconTheme: { primary: "#f59e0b", secondary: "#1c1917" } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/rooms" element={<Layout><RoomsPage /></Layout>} />
          <Route path="/rooms/:id" element={<Layout><RoomDetailPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />

          {/* Protected routes */}
          <Route path="/payment/:bookingId" element={<ProtectedRoute><Layout><PaymentPage /></Layout></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><Layout><MyBookingsPage /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <p className="font-display text-8xl text-stone-200 mb-4">404</p>
                <h1 className="font-display text-3xl text-stone-800 mb-3">Page Not Found</h1>
                <p className="font-body text-stone-500 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="bg-stone-900 text-amber-400 font-body text-sm px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors">
                  Return Home
                </a>
              </div>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
