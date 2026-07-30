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
    redirect: "/dashboard",
  },
];

export function login(userId, password, requiredRole = null) {
  const user = DEMO_USERS.find(
    (u) => u.userId === userId.trim() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid User ID or password" };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      success: false,
      error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
    };
  }

  localStorage.setItem("token", `demo-token-${user.role}`);
  localStorage.setItem("role", user.role);
  localStorage.setItem("userId", user.userId);

  return { success: true, redirect: user.redirect };
}

export function logout() {
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
