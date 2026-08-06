import { logoutApi } from "../api/auth";

export const DEMO_USERS = [
  {
    userId: "aurumfx",
    password: "admin123",
    role: "admin",
    redirect: "/admin/dashboard",
  },
  {
    userId: "user",
    password: "user123",
    role: "user",
    redirect: "/user/dashboard",
  },
];

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

export function logout() {
  localStorage.clear();
  logoutApi();
}


export { logoutApi };

export function getAuth() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
  };
}
