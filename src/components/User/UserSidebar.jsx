import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiShare2,
  FiDollarSign,
  FiAward,
  FiUser,
  FiHelpCircle,
  FiSend,
  FiChevronRight,
  FiChevronDown,
  FiChevronsLeft,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./UserSidebar.css";

const userNavItems = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/user/dashboard" },
  {
    id: "business",
    label: "Business",
    icon: FiShare2,
    hasSubmenu: true,
    children: [
      { id: "club", label: "Club", path: "/user/genealogy/binary" },
      { id: "enroller", label: "Enroller", path: "/user/genealogy/sponsor" },
      { id: "structure", label: "Structure", path: "/user/genealogy/tree" },
      { id: "list", label: "List", path: "/user/genealogy/list" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    hasSubmenu: true,
    children: [
      { id: "ewallet", label: "My Ewallet", path: "/user/financial/ewallet" },
      { id: "transfer", label: "Fund Transfer", path: "/user/financial/transfer" },
      { id: "withdrawals", label: "Withdrawals", path: "/user/financial/withdrawals" },
      { id: "investments", label: "Investments", path: "/user/financial/investments" },
    ],
  },
  {
    id: "achievers",
    label: "Achievers List",
    icon: FiAward,
    hasSubmenu: true,
    children: [
      { id: "rank-achievers", label: "Rank Achievers", path: "/user/achievers/rank" },
      { id: "criteria-achievers", label: "Criteria Achievers", path: "/user/achievers/criteria" },
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

function UserSidebar({ isOpen, onClose, user }) {
  const location = useLocation();

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
    userNavItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => location.pathname === child.path
        );
        if (hasActiveChild) {
          setExpanded((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const userName = user?.name || "PRAVEEN";
  const userId = user?.userId || "FX001";

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && <div className="user-sidebar-backdrop" onClick={onClose} />}

      <aside className={`user-sidebar ${isOpen ? "user-sidebar--open" : ""}`}>
        {/* Header Logo */}
        <div className="user-sidebar-logo">
          <Link to="/user/dashboard">
            <img src={logo} alt="AurumFX" className="sidebar-logo-img" />
          </Link>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onClose}
            aria-label="Collapse sidebar"
          >
            <FiChevronsLeft />
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
          <div className="profile-info">
            <h4 className="profile-name">{userName}</h4>
            <span className="profile-id">{userId}</span>
          </div>
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
                    className={`user-nav-item ${
                      isParentActive || isActive ? "user-nav-item--active" : ""
                    } ${isExpanded ? "user-nav-item--expanded" : ""}`}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      <span>{item.label}</span>
                    </span>
                    {isExpanded ? (
                      <FiChevronDown className="nav-chevron" />
                    ) : (
                      <FiChevronRight className="nav-chevron" />
                    )}
                  </button>
                ) : item.external ? (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noreferrer"
                    className="user-nav-item"
                  >
                    <span className="nav-left">
                      <Icon className="nav-icon" />
                      <span>{item.label}</span>
                    </span>
                  </a>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={`user-nav-item ${
                      isActive ? "user-nav-item--active" : ""
                    }`}
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
                      <span>{item.label}</span>
                    </span>
                    {item.hasSubmenu && (
                      <FiChevronRight className="nav-chevron" />
                    )}
                  </Link>
                )}

                {/* Submenu items */}
                {item.children && isExpanded && (
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
