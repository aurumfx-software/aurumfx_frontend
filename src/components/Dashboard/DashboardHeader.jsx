import { FiBell, FiSettings, FiMenu } from "react-icons/fi";
import "./DashboardHeader.css";

function DashboardHeader({ onMenuToggle }) {
  return (
    <header className="dashboard-header">
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
        <button type="button" className="header-currency">
          <span className="currency-full">INR ₹</span>
          <span className="currency-short">₹</span>
        </button>

        <button type="button" className="header-icon-btn" aria-label="Notifications">
          <FiBell />
        </button>

        <button type="button" className="header-icon-btn header-settings-btn" aria-label="Settings">
          <FiSettings />
        </button>

        <div className="header-avatar">A</div>
      </div>
    </header>
  );
}

export default DashboardHeader;
