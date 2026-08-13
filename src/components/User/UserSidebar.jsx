import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiDollarSign,
  FiAward,
  FiUser,
  FiHelpCircle,
  FiSend,
  FiChevronRight,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./UserSidebar.css";

const userNavItems = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/user/dashboard" },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    hasSubmenu: true,
    children: [
      { id: "ewallet", label: "My Wallet", path: "/user/financial/ewallet" },
      { id: "investments", label: "Investments", path: "/user/financial/investments" },
    ],
  },
  { id: "profile", label: "My Profile", icon: FiUser, path: "/user/profile" },
  {
    id: "help",
    label: "Help Center",
    icon: FiHelpCircle,
    hasSubmenu: true,
    children: [
      { id: "faq", label: "FAQ's", path: "/user/help/faqs" },
      { id: "knowledge", label: "Knowledge Base", path: "/user/help/knowledge-base" },
      { id: "emails", label: "Emails", path: "/user/help/emails" },
      { id: "tickets", label: "Support Tickets", path: "/user/help/tickets" },
      { id: "documents", label: "Documents", path: "/user/help/documents" },
      { id: "videos", label: "Videos", path: "/user/help/videos" },
    ],
  },
  { id: "telegram", label: "Join Telegram", icon: FiSend, external: "https://t.me" },
];

function UserSidebar({ isOpen, isCollapsed, onClose, onToggleCollapse, user }) {
  const location = useLocation();
  const itemRefs = useRef({});
  const lastExpandedId = useRef(null);

  // Determine initial expanded state based on current location
  const getInitialExpanded = () => {
    const state = { business: true };
    userNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => location.pathname === child.path
        );
        if (hasActiveChild) {
          state[item.id] = true;
        }
      }
    });
    return state;
  };

  const [expanded, setExpanded] = useState(getInitialExpanded);

  useEffect(() => {
    const nextExpanded = {};
    userNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => location.pathname === child.path
        );
        if (hasActiveChild) {
          nextExpanded[item.id] = true;
        }
      }
    });
    setExpanded((prev) => {
      const nextState = userNavItems.reduce((state, item) => {
        state[item.id] = Boolean(nextExpanded[item.id]);
        return state;
      }, {});
      return JSON.stringify(prev) === JSON.stringify(nextState) ? prev : nextState;
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!lastExpandedId.current) return;
    const id = lastExpandedId.current;
    if (expanded[id] && itemRefs.current[id]) {
      itemRefs.current[id].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [expanded]);

  const toggleExpand = (id) => {
    lastExpandedId.current = id;
    setExpanded((prev) => {
      const isOpen = prev[id];
      const nextState = userNavItems.reduce((state, item) => {
        state[item.id] = false;
        return state;
      }, {});
      nextState[id] = !isOpen;
      return nextState;
    });
  };

  const userName = user?.name || "PRAVEEN";
  const userId = user?.userId || "FX001";

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
