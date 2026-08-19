import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiDollarSign,
  FiAward,
  FiUser,
  FiUserPlus,
  FiBarChart2,
  FiHelpCircle,
  FiChevronRight,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../../utils/auth";
import logo from "../../assets/logo.png";
import "./UserSidebar.css";

const userNavItems = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/user/dashboard" },
  { id: "new-registration", label: "New Registration", icon: FiUserPlus, path: "/user/register" },
  {
    id: "account",
    label: "Account",
    icon: FiUser,
    hasSubmenu: true,
    children: [
      { id: "profile", label: "Profile", path: "/user/account/profile" },
      { id: "bank-details", label: "Bank Details", path: "/user/account/bank-details" },
      { id: "kyc", label: "KYC", path: "/user/account/kyc" },
      { id: "edit-info", label: "Edit info", path: "/user/account/edit-info" },
      { id: "settings", label: "Settings", path: "/user/account/settings" },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: FiAward,
    hasSubmenu: true,
    children: [
      { id: "family", label: "Family", path: "/user/business/family" },
      { id: "enrolment", label: "Enrolment", path: "/user/business/enroller" },
      { id: "list", label: "List", path: "/user/business/list" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    hasSubmenu: true,
    children: [
      { id: "ewallet", label: "My Wallet", path: "/user/financial/my-wallet" },
      { id: "withdrawal", label: "Withdrawal", path: "/user/financial/withdrawal" },
      { id: "investments", label: "Investment", path: "/user/financial/investment" },
    ],
  },
  { id: "ranks", label: "Ranks", icon: FiAward, path: "/user/ranks" },
  { id: "support", label: "Support", icon: FiHelpCircle, path: "/user/help/tickets" },
  { id: "logout", label: "Log out", icon: FiLogOut, path: "/user/login" },
];

function UserSidebar({ isOpen, isCollapsed, onClose, onToggleCollapse, user }) {
  const location = useLocation();
  const itemRefs = useRef({});

  const isAchieversSubpage = location.pathname.startsWith("/user/achievers");
  const isRankPage = location.pathname === "/user/achievers/rank" || location.pathname === "/user/rank";

  const getItemExpandedState = (item) => {
    if (!item.children) return false;

    if (item.id === "achievers") {
      return isAchieversSubpage;
    }

    return item.children.some((child) => location.pathname === child.path);
  };

  const getInitialExpanded = () => {
    const state = {};
    userNavItems.forEach((item) => {
      if (item.children) {
        state[item.id] = getItemExpandedState(item);
      }
    });
    return state;
  };

  const [expanded, setExpanded] = useState(getInitialExpanded);

  useEffect(() => {
    const nextExpanded = {};

    userNavItems.forEach((item) => {
      if (item.children) {
        nextExpanded[item.id] = getItemExpandedState(item);
      }
    });

    setExpanded((prev) => {
      const hasChanged = userNavItems.some((item) => {
        if (!item.children) return false;
        return Boolean(prev[item.id]) !== Boolean(nextExpanded[item.id]);
      });

      if (!hasChanged) return prev;
      return nextExpanded;
    });
  }, [location.pathname]);

  useEffect(() => {
    const activeGroup = userNavItems.find((item) => {
      if (!item.children) return false;
      if (item.id === "achievers" && isRankPage) return false;
      return item.children.some((child) => location.pathname === child.path);
    });

    if (activeGroup && itemRefs.current[activeGroup.id]) {
      itemRefs.current[activeGroup.id].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [location.pathname]);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const nextState = {};

      userNavItems.forEach((item) => {
        if (item.children) {
          nextState[item.id] = item.id === id ? !Boolean(prev[id]) : false;
        }
      });

      return nextState;
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/user/login";
  };

  const userId = user?.userId || "FX001";
  const suppliedName = user?.fullName || user?.name || "";
  const userName = suppliedName && suppliedName.toUpperCase() !== userId.toUpperCase()
    ? suppliedName
    : "Your Profile";

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="user-sidebar-backdrop" onClick={onClose} />}

      <aside
        className={`user-sidebar ${isOpen ? "user-sidebar--open" : ""} ${
          isCollapsed ? "user-sidebar--collapsed" : ""
        }`}
      >
        {/* Header Logo */}
        <div className="user-sidebar-logo">
          <Link to="/user/dashboard" className="sidebar-logo-link">
            {isCollapsed ? (
              <span className="logo-compact-mark">A</span>
            ) : (
              <img src={logo} alt="AurumFX" className="sidebar-logo-img" />
            )}
          </Link>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse || onClose}
            aria-label="Toggle sidebar collapse"
            title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        </div>

        {/* User Card */}
        <div className="user-sidebar-profile">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={userName} />
            ) : (
              <div className="avatar-placeholder">{String(userName || "P").charAt(0)}</div>
            )}
          </div>
          {!isCollapsed && (
            <div className="profile-info">
              <h4 className="profile-name">{userName}</h4>
              <span className="profile-id">{userId}</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="user-sidebar-nav">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expanded[item.id];
            const isParentActive =
              item.children &&
              item.children.some((child) => location.pathname === child.path);
            const isActive =
              location.pathname === item.path ||
              (item.id === "dashboard" &&
                (location.pathname === "/user/dashboard" ||
                  location.pathname === "/dashboard"));

            return (
              <div key={item.id} className="user-nav-group">
                {item.children ? (
                  <button
                    type="button"
                    ref={(element) => {
                      if (element) itemRefs.current[item.id] = element;
                    }}
                    className={`user-nav-item ${
                      isParentActive || isActive ? "user-nav-item--active" : ""
                    } ${isExpanded ? "user-nav-item--expanded" : ""}`}
                    onClick={() => toggleExpand(item.id)}
                    title={item.label}
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </span>
                    {!isCollapsed &&
                      (isExpanded ? (
                        <FiChevronDown className="nav-chevron" />
                      ) : (
                        <FiChevronRight className="nav-chevron" />
                      ))}
                  </button>
                ) : item.id === "logout" ? (
                  <button
                    type="button"
                    className="user-nav-item user-nav-item--logout"
                    title={item.label}
                    onClick={() => {
                      handleLogout();
                      onClose && onClose();
                    }}
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </span>
                  </button>
                ) : item.external ? (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noreferrer"
                    className="user-nav-item"
                    title={item.label}
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </span>
                  </a>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={`user-nav-item ${
                      isActive ? "user-nav-item--active" : ""
                    }`}
                    title={item.label}
                    onClick={() => {
                      if (item.hasSubmenu) {
                        toggleExpand(item.id);
                      } else {
                        onClose && onClose();
                      }
                    }}
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </span>
                    {!isCollapsed && item.hasSubmenu && (
                      <FiChevronRight className="nav-chevron" />
                    )}
                  </Link>
                )}

                {/* Submenu items */}
                {!isCollapsed && item.children && isExpanded && (
                  <div className="user-nav-subitems">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={`user-nav-subitem ${
                            isChildActive ? "user-nav-subitem--active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span className="subitem-bullet">•</span>
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default UserSidebar;
