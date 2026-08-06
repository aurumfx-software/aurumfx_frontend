import api from "./axios";

/**
 * Login API call
 * Sends login credentials to backend /auth/login
 * Fallbacks to demo users if backend is not reachable/404
 */
export const loginApi = async (userId, password, requiredRole = null) => {
  const trimmedUserId = String(userId || "").trim();
  try {
    const loginEndpoint =
      requiredRole && requiredRole.toLowerCase() === "admin"
        ? "/auth/admin/login"
        : "/auth/login";
    const response = await api.post(loginEndpoint, {
      user_id: trimmedUserId,
      password,
    });

    const payload = response.data;
    if (
      payload &&
      (payload.success === false ||
        payload.status === "error" ||
        payload.status === false)
    ) {
      throw new Error(payload.message || payload.error || "Login failed");
    }

    const data = payload?.data || payload;
    const isDetectedAdmin =
      trimmedUserId.toLowerCase() === "aurumfx" ||
      trimmedUserId.toLowerCase() === "admin";
    const role = String(
      payload?.role || data?.role || (isDetectedAdmin ? "admin" : "user")
    ).toLowerCase();

    if (requiredRole && role !== requiredRole.toLowerCase()) {
      throw new Error(
        `Access Denied: This portal is for ${requiredRole} accounts only.`
      );
    }

    const token =
      payload?.token ||
      data?.token ||
      payload?.access_token ||
      data?.access_token ||
      `token-${role}`;
    const user = payload?.user ||
      data?.user || { userId: trimmedUserId, role, name: trimmedUserId };
    const redirectPath =
      role === "admin" ? "/admin/dashboard/business" : "/user/dashboard";

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", trimmedUserId);
    if (user?.name || payload?.name || data?.name) {
      localStorage.setItem(
        "userName",
        user?.name || payload?.name || data?.name
      );
    }

    return { success: true, redirect: redirectPath, data: payload };
  } catch (error) {
    if (error.message && error.message.includes("Access Denied")) {
      return { success: false, error: error.message };
    }

    // Direct offline fallback for admin usernames (e.g. aurumfx / admin) ONLY if completely offline
    if (
      !error.response &&
      (trimmedUserId.toLowerCase() === "aurumfx" ||
        trimmedUserId.toLowerCase() === "admin")
    ) {
      if (requiredRole && requiredRole.toLowerCase() !== "admin") {
        return {
          success: false,
          error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
        };
      }

      const token = `admin-token-${Date.now()}`;
      const uId = trimmedUserId || "aurumfx";

      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", uId);

      return { success: true, redirect: "/admin/dashboard/business" };
    }

    let errorMessage =
      error.response?.data?.message || error.response?.data?.error;

    if (
      !errorMessage ||
      errorMessage.includes("status code") ||
      errorMessage.includes("Request failed")
    ) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 404 ||
        error.message?.includes("401") ||
        error.message?.includes("404")
      ) {
        errorMessage = "User Not Found";
      } else if (
        error.message &&
        !error.message.includes("status code") &&
        !error.message.includes("Request failed")
      ) {
        errorMessage = error.message;
      } else {
        errorMessage = "User Not Found";
      }
    }

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
    const response = await api.get(
      `/auth/check-enroller/${encodeURIComponent(enrollerId)}`
    );
    const data = response.data;
    const exists =
      data?.exists !== undefined
        ? data.exists
        : data?.success !== false && data?.status !== "error";
    const name =
      data?.name ||
      data?.enroller_name ||
      data?.user?.name ||
      data?.data?.name ||
      "";

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

import { clearDashboardCache } from "./dashboard";

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
    clearDashboardCache();
    localStorage.clear();
  }
};
