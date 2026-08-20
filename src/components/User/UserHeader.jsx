import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiMenu } from "react-icons/fi";
import { getMyKycApi, getProfileBankDetailsApi } from "../../api/auth";
import { logout } from "../../utils/auth";
import { hasBankSubmission } from "../../pages/user/profileTabs/shared";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./UserHeader.css";

const STATUS_CONFIG = {
  pending: {
    label: "PENDING REVIEW — YOUR DOCUMENTS ARE UNDER REVIEW",
    className: "status-pending",
  },
  approved: {
    label: "APPROVED — YOUR DETAILS HAVE BEEN VERIFIED",
    className: "status-approved",
  },
  not_submitted: {
    label: "PLEASE SUBMIT YOUR DETAILS TO COMPLETE VERIFICATION",
    className: "status-not-submitted",
  },
  rejected: {
    label: "UPDATE REQUIRED — PLEASE RESUBMIT YOUR DETAILS",
    className: "status-rejected",
  },
};

function normalizeStatus(value) {
  const status = String(value || "").toLowerCase();
  if (status.includes("approv") || status.includes("verified")) return "approved";
  if (status.includes("reject") || status.includes("fail")) return "rejected";
  if (status.includes("pending") || status.includes("review") || status.includes("submit")) return "pending";
  return "not_submitted";
}

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

  const [verificationStatuses, setVerificationStatuses] = useState({
    kyc: "not_submitted",
    bank: "not_submitted",
  });

  useEffect(() => {
    let active = true;
    Promise.all([getMyKycApi(), getProfileBankDetailsApi()]).then(([kycRes, bankRes]) => {
      if (!active) return;

      const kycPayload = kycRes.success ? (kycRes.data?.data || kycRes.data || {}) : {};
      const documents = Array.isArray(kycPayload)
        ? kycPayload
        : kycPayload.documents || kycPayload.kyc_documents || [];
      const requiredDocuments = documents.filter((doc) =>
        ["pan", "aadhaar", "aadhar"].includes(String(doc.document_type || "").toLowerCase())
      );
      const documentStatuses = requiredDocuments.map((doc) => normalizeStatus(doc.status));
      const kyc = requiredDocuments.length === 0
        ? "not_submitted"
        : documentStatuses.every((status) => status === "approved")
          ? "approved"
          : documentStatuses.some((status) => status === "rejected")
            ? "rejected"
            : "pending";

      const bankPayload = bankRes.success ? (bankRes.data?.data || bankRes.data || {}) : {};
      const bankDetails = bankPayload.bank_details || {};
      const nomineeDetails = bankPayload.nominee_details || {};
      const bank = hasBankSubmission(bankDetails, nomineeDetails)
        ? normalizeStatus(bankDetails.bank_status || bankDetails.status)
        : "not_submitted";
      setVerificationStatuses({ kyc, bank });
    });

    return () => {
      active = false;
    };
  }, []);

  const marqueeItems = [
    { label: `KYC ${STATUS_CONFIG[verificationStatuses.kyc].label}`, className: STATUS_CONFIG[verificationStatuses.kyc].className },
    { label: `BANK DETAILS ${STATUS_CONFIG[verificationStatuses.bank].label}`, className: STATUS_CONFIG[verificationStatuses.bank].className },
  ];

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

  const handleLogout = async () => {
    await logout();
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

      {/* KYC Status Marquee */}
      <div className="kyc-marquee-wrap">
        <div className="kyc-marquee-track">
          <div className="kyc-marquee-group">
            {marqueeItems.map((item) => (
              <span className={`kyc-marquee-item ${item.className}`} key={item.label}>
                <span className="kyc-dot" />
                {item.label}
              </span>
            ))}
          </div>
          <div className="kyc-marquee-group" aria-hidden="true">
            {marqueeItems.map((item) => (
              <span className={`kyc-marquee-item ${item.className}`} key={`copy-${item.label}`}>
                <span className="kyc-dot" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="user-header-right">
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

        {/* Theme Toggle */}
        <ThemeToggle className="user-header-theme-toggle" variant="user-header" />

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
                <span className="dropdown-user-mark" aria-hidden="true">
                  {String(userName || "P").charAt(0).toUpperCase()}
                </span>
                <div className="dropdown-user-details">
                  <div className="dropdown-user-id">{userId}</div>
                  <div className="dropdown-user-email">{userEmail}</div>
                </div>
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