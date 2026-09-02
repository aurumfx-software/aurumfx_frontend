import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell, FiMenu } from "react-icons/fi";
import { getMyKycApi, getProfileBankDetailsApi } from "../../api/auth";
import {
  getUserNotificationsApi,
  getUserUnreadNotificationCountApi,
  markUserNotificationAsReadApi,
  markAllUserNotificationsAsReadApi,
} from "../../api/user-notifications";
import { logout } from "../../utils/auth";
import { switchBackToAdminApi } from "../../api/admin-members-management";
import {
  hasBankSubmission,
  hasKycSubmission,
  deriveSectionStatus,
} from "../../pages/user/profileTabs/shared";
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

function UserHeader({ onMenuToggle, user }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [switchingBack, setSwitchingBack] = useState(false);
  const [switchBackError, setSwitchBackError] = useState("");
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const userName = user?.name || user?.fullName || "PRAVEEN";
  const userId = user?.userId || localStorage.getItem("userId") || "FX259";
  const avatarUrl = typeof user?.avatar === "string" ? user.avatar.trim() : "";
  const hasAdminSession = Boolean(sessionStorage.getItem("adminImpersonationSession"));

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  const loadUnreadCount = async () => {
    const result = await getUserUnreadNotificationCountApi();
    if (result.success) setUnreadCount(result.data);
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError("");
    const [notificationsResult, countResult] = await Promise.all([
      getUserNotificationsApi(),
      getUserUnreadNotificationCountApi(),
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
    const result = await markUserNotificationAsReadApi(notification.id);
    if (!result.success) return;
    setNotifications((current) => current.map((item) => (
      item.id === notification.id ? { ...item, is_read: true } : item
    )));
    setUnreadCount((current) => Math.max(0, current - 1));
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    const result = await markAllUserNotificationsAsReadApi();
    if (!result.success) return;
    setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
    setUnreadCount(0);
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
  };

  const [verificationStatuses, setVerificationStatuses] = useState({
    kyc: null,
    bank: null,
  });
  const [verificationLoaded, setVerificationLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setVerificationLoaded(false);

    Promise.all([getMyKycApi(), getProfileBankDetailsApi()])
      .then(([kycRes, bankRes]) => {
        if (!active) return;

        const kyc = kycRes.success ? (kycRes.data?.data || kycRes.data || {}) : {};
        const kycSubmitted = hasKycSubmission(kyc);
        const kycStatus = deriveSectionStatus(kycSubmitted, kyc.status);

        const bankPayload = bankRes.success ? (bankRes.data?.data || bankRes.data || {}) : {};
        const bankDetails = bankPayload.bank_details || bankPayload || {};
        const nomineeDetails = bankPayload.nominee_details || {};
        const bankSubmitted = hasBankSubmission(bankDetails, nomineeDetails);
        const bankStatusValue = bankDetails.bank_status ?? bankDetails.status ?? bankPayload.bank_status ?? bankPayload.status;
        const bankStatus = deriveSectionStatus(bankSubmitted, bankStatusValue);

        setVerificationStatuses({ kyc: kycStatus, bank: bankStatus });
        setVerificationLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setVerificationStatuses({ kyc: null, bank: null });
        setVerificationLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const marqueeItems = verificationLoaded
    ? [
        ...(verificationStatuses.kyc
          ? [{ label: `KYC ${STATUS_CONFIG[verificationStatuses.kyc].label}`, className: STATUS_CONFIG[verificationStatuses.kyc].className }]
          : []),
        ...(verificationStatuses.bank
          ? [{ label: `BANK DETAILS ${STATUS_CONFIG[verificationStatuses.bank].label}`, className: STATUS_CONFIG[verificationStatuses.bank].className }]
          : []),
      ]
    : [];

  // Filter out approved items - only show pending, not submitted, or rejected
  const filteredMarqueeItems = marqueeItems.filter(
    (item) => !item.className.includes("status-approved")
  );

  // Only show marquee if verification data has finished loading and there are non-approved items
  const shouldShowMarquee = verificationLoaded && filteredMarqueeItems.length > 0;

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
    sessionStorage.removeItem("adminImpersonationSession");
    await logout();
    navigate("/user/login");
  };

  const handleBackToAdmin = async () => {
    const storedSession = sessionStorage.getItem("adminImpersonationSession");
    if (!storedSession || switchingBack) return;

    try {
      setSwitchingBack(true);
      setSwitchBackError("");
      const result = await switchBackToAdminApi();
      if (!result.success) {
        setSwitchBackError(result.error || "Unable to switch back to admin.");
        return;
      }
      const adminSession = JSON.parse(storedSession);
      const returnedToken = result.data?.token || result.data?.access_token;
      localStorage.setItem("token", returnedToken || adminSession.token || "");
      localStorage.setItem("role", adminSession.role || "admin");
      localStorage.setItem("userId", adminSession.userId || "");
      if (adminSession.userName) localStorage.setItem("userName", adminSession.userName);
      sessionStorage.removeItem("adminImpersonationSession");
      navigate("/admin/members/network", { replace: true });
    } catch {
      sessionStorage.removeItem("adminImpersonationSession");
      setSwitchBackError("Unable to switch back to admin.");
    } finally {
      setSwitchingBack(false);
    }
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
      {shouldShowMarquee && (
        <div className="kyc-marquee-wrap">
          <div className="kyc-marquee-track">
            <div className="kyc-marquee-group">
              {filteredMarqueeItems.map((item) => (
                <span className={`kyc-marquee-item ${item.className}`} key={item.label}>
                  <span className="kyc-dot" />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="kyc-marquee-group" aria-hidden="true">
              {filteredMarqueeItems.map((item) => (
                <span className={`kyc-marquee-item ${item.className}`} key={`copy-${item.label}`}>
                  <span className="kyc-dot" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="user-header-right">
        {hasAdminSession && (
          <div className="back-to-admin-wrap">
            <button type="button" className="back-to-admin-btn" onClick={handleBackToAdmin} disabled={switchingBack} title="Return to admin">
              <FiArrowLeft />
              <span>{switchingBack ? "Switching..." : "Back to Admin"}</span>
            </button>
            {switchBackError && <span className="back-to-admin-error">{switchBackError}</span>}
          </div>
        )}

        {/* Notifications Icon Button with Dropdown */}
        <div className="header-notif-dropdown-container" ref={notifRef}>
          <button
            type="button"
            className={`header-icon-btn ${notifOpen ? "header-icon-btn--active" : ""}`}
            onClick={() => {
              const nextOpen = !notifOpen;
              setNotifOpen(nextOpen);
              if (nextOpen) loadNotifications();
            }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <FiBell className={notifOpen ? "bell-icon--active" : ""} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="notifications-dropdown">
              <div className="notif-popover-header">
                <div>
                  <h4 className="notif-title">Notifications</h4>
                  <p className="notif-sub">You have {unreadCount} unread messages</p>
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
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} />
            ) : (
              <span>{String(userName || "P").charAt(0).toUpperCase()}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="user-avatar-dropdown">
              <div className="dropdown-user-info">
                <span className="dropdown-user-mark" aria-hidden="true">
                  {String(userName || "P").charAt(0).toUpperCase()}
                </span>
                <div className="dropdown-user-details">
                  <div className="dropdown-user-name">{userName}</div>
                  <div className="dropdown-user-id">{userId}</div>
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