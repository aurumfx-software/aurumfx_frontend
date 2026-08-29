import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiUser, FiHome, FiLogOut } from "react-icons/fi";
import { logoutApi } from "../../api/auth";
import {
  getAdminNotificationsApi,
  getAdminUnreadNotificationCountApi,
  markAdminNotificationAsReadApi,
  markAllAdminNotificationsAsReadApi,
} from "../../api/admin-notifications";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./AdminHeader.css";

function AdminHeader({ onMenuToggle }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const userId = localStorage.getItem("userId") || "aurumfx";
  const userEmail = `${userId}@aurumfx.net`;

  const loadUnreadCount = async () => {
    const result = await getAdminUnreadNotificationCountApi();
    if (result.success) setUnreadCount(result.data);
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError("");
    const [notificationsResult, countResult] = await Promise.all([
      getAdminNotificationsApi(),
      getAdminUnreadNotificationCountApi(),
    ]);
    if (notificationsResult.success) {
      setNotifications(notificationsResult.data);
    } else {
      setNotificationsError(notificationsResult.error);
    }
    if (countResult.success) setUnreadCount(countResult.data);
    setNotificationsLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(loadUnreadCount);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.is_read) return;
    const result = await markAdminNotificationAsReadApi(notification.id);
    if (!result.success) return;

    setNotifications((current) => current.map((item) => (
      item.id === notification.id ? { ...item, is_read: true } : item
    )));
    setUnreadCount((current) => Math.max(0, current - 1));
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    const result = await markAllAdminNotificationsAsReadApi();
    if (!result.success) return;
    setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
    setUnreadCount(0);
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
  };

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
              const nextOpen = !showNotifications;
              setShowNotifications(nextOpen);
              if (nextOpen) loadNotifications();
              setShowUserDropdown(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <FiBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="header-popover notif-popover">
              <div className="notif-popover-header">
                <div>
                  <h4 className="popover-title">Notifications</h4>
                  <p className="popover-sub">You have {unreadCount} unread messages</p>
                </div>
                {unreadCount > 0 && (
                  <button type="button" className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              {notificationsLoading && <p className="notif-status">Loading notifications...</p>}
              {!notificationsLoading && notificationsError && <p className="notif-status notif-status--error">{notificationsError}</p>}
              {!notificationsLoading && !notificationsError && notifications.length === 0 && (
                <p className="notif-status">No notifications yet.</p>
              )}
              {!notificationsLoading && !notificationsError && notifications.length > 0 && (
                <div className="notif-list">
                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notif-item ${notification.is_read ? "notif-item--read" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span className="notif-item-title">{notification.title}</span>
                      <span className="notif-item-message">{notification.message}</span>
                      <span className="notif-item-time">{formatNotificationTime(notification.created_at)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
