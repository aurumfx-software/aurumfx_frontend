import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext(null);
const STORAGE_KEY = "aurumfx-theme";

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }

  return null;
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getDefaultThemeForPath(pathname) {
  const publicRoutes = ["/", "/user/login", "/user/register", "/admin/login"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/user/login") || pathname.startsWith("/user/register") || pathname.startsWith("/admin/login");

  if (isPublicRoute) return "dark";
  return "light";
}

export function ThemeProvider({ children }) {
  const location = useLocation();
  const [theme, setThemeState] = useState(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    return getDefaultThemeForPath(window.location.pathname);
  });

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setThemeState(stored);
      return;
    }

    const nextTheme = getDefaultThemeForPath(location.pathname);
    setThemeState(nextTheme);
  }, [location.pathname]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (next, persist = true) => {
    if (next === "light" || next === "dark") {
      setThemeState(next);
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      }
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next, true);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
