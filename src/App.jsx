import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClubBusiness from "./pages/user/genealogy/ClubBusiness";
import EnrollerBusiness from "./pages/user/genealogy/EnrollerBusiness";
import StructureBusiness from "./pages/user/genealogy/StructureBusiness";
import ListBusiness from "./pages/user/genealogy/ListBusiness";
import EWallet from "./pages/user/financial/EWallet";
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
        <Route
          path="/user/genealogy/binary"
          element={
            <ProtectedRoute requiredRole="user">
              <ClubBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/sponsor"
          element={
            <ProtectedRoute requiredRole="user">
              <EnrollerBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/tree"
          element={
            <ProtectedRoute requiredRole="user">
              <StructureBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/genealogy/list"
          element={
            <ProtectedRoute requiredRole="user">
              <ListBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/e-wallet"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/financial/ewallet"
          element={
            <ProtectedRoute requiredRole="user">
              <EWallet />
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
