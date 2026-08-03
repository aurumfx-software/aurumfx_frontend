import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiSettings, FiMenu } from "react-icons/fi";
import { logout } from "../../utils/auth";
import "./UserHeader.css";

function UserHeader({ onMenuToggle, user }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName = user?.name || user?.fullName || "PRAVEEN";
  const userId = user?.userId || localStorage.getItem("userId") || "FX259";
  const userEmail = user?.email || "sreedharan1962@gmail.com";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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

        <button type="button" className="header-icon-btn" aria-label="Notifications">
          <FiBell />
          <span className="notification-dot" />
        </button>

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
