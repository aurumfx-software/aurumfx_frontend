import api from "./axios";
import { DEMO_USERS } from "../utils/auth";

/**
 * Login API call
 * Sends login credentials to backend /auth/login
 * Fallbacks to demo users if backend is not reachable/404
 */
export const loginApi = async (userId, password, requiredRole = null) => {
  const trimmedUserId = String(userId || "").trim();
  try {
    const response = await api.post("/auth/login", {
      user_id: trimmedUserId,
      password,
      role: requiredRole,
    });

    const payload = response.data;
    if (payload && (payload.success === false || payload.status === "error" || payload.status === false)) {
      throw new Error(payload.message || payload.error || "Login failed");
    }

    const data = payload?.data || payload;
    const token = payload?.token || data?.token;
    const user = payload?.user || data?.user;
    const role = payload?.role || data?.role || user?.role || requiredRole || "user";
    const redirectPath = payload?.redirect || data?.redirect || (role === "admin" ? "/admin/dashboard" : "/user/dashboard");

    localStorage.setItem("token", token || `token-${role}`);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", trimmedUserId);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { success: true, redirect: redirectPath, data: payload };
  } catch (error) {
    // Check fallback demo users if API fails or is offline or unauthorized
    const demoUser = DEMO_USERS.find(
      (u) => u.userId.toLowerCase() === trimmedUserId.toLowerCase() && u.password === password
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

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
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
 * Check Enroller ID API call
 * Sends GET /auth/check-enroller/{enroller_id} to backend
 */
export const checkEnrollerApi = async (enrollerId) => {
  try {
    const response = await api.get(`/auth/check-enroller/${encodeURIComponent(enrollerId)}`);
    const data = response.data;
    const exists = data?.exists !== undefined ? data.exists : (data?.success !== false && data?.status !== "error");
    const name = data?.name || data?.enroller_name || data?.user?.name || data?.data?.name || "";

    return {
      success: true,
      exists,
      name,
      message: data?.message,
      data,
    };
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        exists: true,
        isMock: true,
        message: "Enroller check (offline mode)",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Enroller ID does not exist";

    return { success: false, exists: false, error: errorMessage };
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

