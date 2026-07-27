import { useState } from "react";
import {
  FiGrid,
  FiBriefcase,
  FiDollarSign,
  FiMessageSquare,
  FiTool,
  FiUsers,
  FiAward,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiGrid,
    children: [
      { id: "business", label: "Business" },
      { id: "network", label: "Network", active: true },
    ],
  },
  { id: "business", label: "Business", icon: FiBriefcase, hasSubmenu: true },
  { id: "financial", label: "Financial", icon: FiDollarSign, hasSubmenu: true },
  { id: "communication", label: "Communication", icon: FiMessageSquare, hasSubmenu: true },
  { id: "tools", label: "Tools", icon: FiTool, hasSubmenu: true },
  { id: "members", label: "Members Management", icon: FiUsers, hasSubmenu: true },
  { id: "achievers", label: "Achievers List", icon: FiAward, hasSubmenu: true },
  { id: "settings", label: "Settings", icon: FiSettings, hasSubmenu: true },
  { id: "reports", label: "Reports", icon: FiFileText, hasSubmenu: true },
];

function Sidebar({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState({ dashboard: true });

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar-logo">
        <img src={logo} alt="AurumFX" />
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">A</div>
        <span className="sidebar-username">aurumfx</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOpen = expanded[item.id];

          return (
            <div key={item.id} className="nav-group">
              <button
                type="button"
                className={`nav-item ${item.children ? "nav-item--parent" : ""} ${isOpen && item.children ? "nav-item--active" : ""}`}
                onClick={() => item.children && toggleExpand(item.id)}
              >
                <span className="nav-item-left">
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </span>
                {item.children ? (
                  isOpen ? <FiChevronDown className="nav-chevron" /> : <FiChevronRight className="nav-chevron" />
                ) : (
                  item.hasSubmenu && <FiChevronRight className="nav-chevron" />
                )}
              </button>

              {item.children && isOpen && (
                <div className="nav-subitems">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={`nav-subitem ${child.active ? "nav-subitem--active" : ""}`}
                      onClick={onClose}
                    >
                      {child.active && <span className="nav-dot" />}
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
