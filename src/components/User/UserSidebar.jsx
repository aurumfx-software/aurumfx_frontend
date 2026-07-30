import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
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
  { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/dashboard" },
  {
    id: "business",
    label: "Business",
    icon: FiBriefcase,
    hasSubmenu: true,
    children: [
      { id: "club", label: "Club", path: "/business/club" },
      { id: "structure", label: "Structure", path: "/business/structure" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    hasSubmenu: true,
    children: [
      { id: "income", label: "Income", path: "/financial/income" },
      { id: "withdrawals", label: "Withdrawals", path: "/financial/withdrawals" },
    ],
  },
  {
    id: "achievers",
    label: "Achievers List",
    icon: FiAward,
    hasSubmenu: true,
  },
  { id: "profile", label: "My Profile", icon: FiUser, path: "/profile" },
  {
    id: "help",
    label: "Help Center",
    icon: FiHelpCircle,
    hasSubmenu: true,
  },
  { id: "telegram", label: "Join Telegram", icon: FiSend, external: "https://t.me" },
];

function UserSidebar({ isOpen, onClose, user }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState({});

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
          <Link to="/dashboard">
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
              <div className="avatar-placeholder">{userName.charAt(0)}</div>
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
            const isActive =
              location.pathname === item.path ||
              (item.id === "dashboard" && location.pathname === "/dashboard");

            return (
              <div key={item.id} className="user-nav-group">
                {item.children ? (
                  <button
                    type="button"
                    className={`user-nav-item ${isExpanded ? "user-nav-item--expanded" : ""}`}
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
                    className={`user-nav-item ${isActive ? "user-nav-item--active" : ""}`}
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
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className="user-nav-subitem"
                        onClick={onClose}
                      >
                        {child.label}
                      </Link>
                    ))}
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
