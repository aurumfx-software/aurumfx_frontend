import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = getAuth();

  if (!token) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
