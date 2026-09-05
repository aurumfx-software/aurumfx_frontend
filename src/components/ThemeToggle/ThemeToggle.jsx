import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle({ className = "", variant = "default" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant} ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-icon theme-toggle-icon--sun" aria-hidden="true">
        <FiSun />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--moon" aria-hidden="true">
        <FiMoon />
      </span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className={`theme-toggle-thumb ${isDark ? "is-dark" : "is-light"}`} />
      </span>
    </button>
  );
}

export default ThemeToggle;
