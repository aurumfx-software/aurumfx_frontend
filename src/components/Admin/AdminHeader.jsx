import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiSettings, FiMenu, FiUser, FiHome, FiLogOut } from "react-icons/fi";
import { logoutApi } from "../../api/auth";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./AdminHeader.css";

function AdminHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const userId = localStorage.getItem("userId") || "aurumfx";
  const userEmail = `${userId}@aurumfx.net`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutApi();
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <button
        type="button"
        className="header-menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <FiMenu />
      </button>

      <div className="header-spacer" />

      <div className="header-actions">
        <ThemeToggle variant="user-header" className="admin-theme-toggle" />

        {/* Notifications Dropdown */}
        <div className="header-dropdown-wrap" ref={notifRef}>
          <button
            type="button"
            className={`header-icon-btn ${showNotifications ? "header-icon-btn--active" : ""}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            aria-label="Notifications"
          >
            <FiBell />
          </button>

          {showNotifications && (
            <div className="header-popover notif-popover">
              <h4 className="popover-title">Notifications</h4>
              <p className="popover-sub">You have 0 unread messages</p>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          type="button"
          className="header-icon-btn header-settings-btn"
          aria-label="Settings"
          onClick={() => navigate("/admin/settings/return-date")}
        >
          <FiSettings />
        </button>

        {/* Admin Profile Dropdown */}
        <div className="header-dropdown-wrap" ref={userRef}>
          <button
            type="button"
            className="header-avatar-btn"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            aria-label="Admin Admin Menu"
          >
            A
          </button>

          {showUserDropdown && (
            <div className="header-popover user-popover">
              <div className="user-popover-info">
                <span className="popover-user-id">{userId}</span>
                <span className="popover-user-email">{userEmail}</span>
              </div>
              <div className="popover-menu-list">
                <Link
                  to="/"
                  className="popover-item"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <FiHome className="popover-item-icon" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/admin/dashboard/business"
                  className="popover-item"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <FiUser className="popover-item-icon" />
                  <span>Profile</span>
                </Link>
                <button
                  type="button"
                  className="popover-item popover-logout"
                  onClick={handleLogout}
                >
                  <FiLogOut className="popover-item-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
