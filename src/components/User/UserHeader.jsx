import { FiBell, FiSettings, FiMenu } from "react-icons/fi";
import "./UserHeader.css";

function UserHeader({ onMenuToggle, user }) {
  const userName = user?.name || "PRAVEEN";

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

        <div className="header-user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={userName} />
          ) : (
            <span>{userName.charAt(0)}</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
