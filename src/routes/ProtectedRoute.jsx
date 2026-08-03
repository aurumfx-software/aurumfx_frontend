import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = getAuth();

  if (!token) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/user/login"} replace />;
  }

  // Fallback effective role to requiredRole or 'user' if role in localStorage is unset
  const currentRole = role || requiredRole || "user";

  // Prevent cross-role navigation loops
  if (requiredRole === "admin" && currentRole !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (requiredRole === "user" && currentRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
