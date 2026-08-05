import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = getAuth();

  if (!token) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/user/login"} replace />;
  }

  // Determine effective role from stored role or token fallback, converting to lowercase
  const normalizedRequiredRole = String(requiredRole || "").toLowerCase();
  const normalizedCurrentRole = String(role || (token && token.toLowerCase().includes("admin") ? "admin" : requiredRole) || "user").toLowerCase();

  // Prevent cross-role navigation loops
  if (normalizedRequiredRole === "admin" && normalizedCurrentRole !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (normalizedRequiredRole === "user" && normalizedCurrentRole === "admin") {
    return <Navigate to="/admin/dashboard/business" replace />;
  }

  return children;
}

export default ProtectedRoute;
