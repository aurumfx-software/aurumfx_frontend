import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiSettings, FiMenu } from "react-icons/fi";
import { logout } from "../../utils/auth";
import "./UserHeader.css";

function UserHeader({ onMenuToggle, user }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const userName = user?.name || user?.fullName || "PRAVEEN";
  const userId = user?.userId || localStorage.getItem("userId") || "FX259";
  const userEmail = user?.email || "sreedharan1962@gmail.com";

  // Notifications state (defaults to 0 unread messages matching screenshot)
  const [notifications] = useState([]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/user/login");
  };

  return (
    <header className="user-header">
      <div className="user-header-left">
        <button
          type="button"
          className="user-header-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
      </div>

      <div className="user-header-right">
        <button type="button" className="currency-selector-btn">
          <span>INR ₹</span>
        </button>

        {/* Notifications Icon Button with Dropdown */}
        <div className="header-notif-dropdown-container" ref={notifRef}>
          <button
            type="button"
            className={`header-icon-btn ${notifOpen ? "header-icon-btn--active" : ""}`}
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <FiBell className={notifOpen ? "bell-icon--active" : ""} />
            {notifications.length > 0 && <span className="notification-dot" />}
          </button>

          {notifOpen && (
            <div className="notifications-dropdown">
              <h4 className="notif-title">Notifications</h4>
              <p className="notif-sub">You have {notifications.length} unread messages</p>
              {notifications.length > 0 && (
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      <span className="notif-msg">{n.message}</span>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button type="button" className="header-icon-btn" aria-label="Settings">
          <FiSettings />
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="header-user-dropdown-container" ref={dropdownRef}>
          <button
            type="button"
            className="header-user-avatar"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={userName} />
            ) : (
              <span>{String(userName || "P").charAt(0)}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="user-avatar-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-user-id">{userId}</div>
                <div className="dropdown-user-email">{userEmail}</div>
              </div>
              <div className="dropdown-menu-list">
                <Link
                  to="/"
                  className="dropdown-menu-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/user/profile"
                  className="dropdown-menu-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  className="dropdown-menu-item dropdown-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
