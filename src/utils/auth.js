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
  const user = DEMO_USERS.find(
    (u) => u.userId.toLowerCase() === trimmed.toLowerCase() && u.password === password
  );

  const role = String(user ? user.role : requiredRole || "user").toLowerCase();
  const token = user ? `demo-token-${user.role}` : `token-${role}-${Date.now()}`;
  const userObj = { userId: trimmed, role, name: role === "admin" ? "aurumfx" : "User" };

  if (requiredRole && user && user.role !== requiredRole) {
    return {
      success: false,
      error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
    };
  }

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", trimmed);
  localStorage.setItem("user", JSON.stringify(userObj));
  localStorage.setItem("isLoggedIn", "true");

  if (role === "admin") {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminId", trimmed);
    localStorage.setItem("adminUser", JSON.stringify(userObj));
  }

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
