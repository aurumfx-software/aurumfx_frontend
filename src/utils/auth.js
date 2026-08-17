import { logoutApi } from "../api/auth";

export function login(userId, password, requiredRole = null) {
  const trimmed = String(userId || "").trim();
  const role = String(user ? user.role : requiredRole || "user").toLowerCase();
  const token = user ? `demo-token-${user.role}` : `token-${role}-${Date.now()}`;

  if (requiredRole && user && user.role !== requiredRole) {
    return {
      success: false,
      error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
    };
  }

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", trimmed);

  return { success: true, redirect: role === "admin" ? "/admin/dashboard" : "/user/dashboard" };

}

export async function logout() {
  try {
    await logoutApi();
  } catch (error) {
    console.warn("Logout request failed:", error?.message || error);
  } finally {
    localStorage.clear();
  }
}


export { logoutApi };

export function getAuth() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
  };
}
