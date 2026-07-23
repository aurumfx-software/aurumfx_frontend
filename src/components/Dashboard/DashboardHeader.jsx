import { FiBell, FiSettings } from "react-icons/fi";
import "./DashboardHeader.css";

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="header-spacer" />

      <div className="header-actions">
        <button type="button" className="header-currency">
          INR ₹
        </button>

        <button type="button" className="header-icon-btn" aria-label="Notifications">
          <FiBell />
        </button>

        <button type="button" className="header-icon-btn" aria-label="Settings">
          <FiSettings />
        </button>

        <div className="header-avatar">A</div>
      </div>
    </header>
  );
}

export default DashboardHeader;
