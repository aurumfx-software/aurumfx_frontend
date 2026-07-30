import api from "./axios";
import { DEMO_USERS } from "../utils/auth";

/**
 * Login API call
 * Sends login credentials to backend /auth/login
 * Fallbacks to demo users if backend is not reachable/404
 */
export const loginApi = async (userId, password, requiredRole = null) => {
  try {
    const response = await api.post("/auth/login", {
      userId: userId.trim(),
      password,
      role: requiredRole,
    });

    const { token, user, role, redirect } = response.data;
    const userRole = role || user?.role || requiredRole || "user";
    const redirectPath = redirect || (userRole === "admin" ? "/admin/dashboard" : "/dashboard");

    localStorage.setItem("token", token || `token-${userRole}`);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userId", userId.trim());
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { success: true, redirect: redirectPath, data: response.data };
  } catch (error) {
    // If backend server is unreachable or endpoint not found (404), fallback to demo accounts
    if (!error.response || error.response.status === 404) {
      const demoUser = DEMO_USERS.find(
        (u) => u.userId === userId.trim() && u.password === password
      );

      if (demoUser) {
        if (requiredRole && demoUser.role !== requiredRole) {
          return {
            success: false,
            error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
          };
        }
        localStorage.setItem("token", `demo-token-${demoUser.role}`);
        localStorage.setItem("role", demoUser.role);
        localStorage.setItem("userId", demoUser.userId);
        return { success: true, redirect: demoUser.redirect };
      }
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Invalid User ID or password";

    return { success: false, error: errorMessage };
  }
};

/**
 * Register API call
 * Sends registration form data to backend /auth/register
 */
export const registerApi = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);
    return { success: true, data: response.data };
  } catch (error) {
    // Fallback response for offline / mock testing if backend server is not available
    if (!error.response) {
      return {
        success: true,
        isMock: true,
        message: "Registration recorded (offline mode)",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed. Please try again.";

    return { success: false, error: errorMessage };
  }
};

/**
 * Logout API call
 * Sends POST /auth/logout to backend and clears session
 */
export const logoutApi = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token && !token.startsWith("demo-")) {
      await api.post("/auth/logout");
    }
  } catch (error) {
    console.warn("Logout API call failed or offline:", error.message);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }
};

