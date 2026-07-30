import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes (/user prefix) */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Route Aliases */}
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/register" element={<Navigate to="/user/register" replace />} />
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

        {/* Admin Routes (/admin prefix) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Route Aliases */}
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

        {/* Home Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 404 Unknown Route Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
