import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./AdminSidebar.css";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiGrid,
    children: [
      { id: "business", label: "Business", path: "/admin/dashboard/business" },
      { id: "network", label: "Network", path: "/admin/dashboard/network" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    children: [
      {
        id: "wallet",
        label: "Wallet",
        path: "/admin/wallet",
      },
      {
        id: "investments",
        label: "Investments",
        path: "/admin/financial/investments/request",
      },
      {
        id: "investment-plan",
        label: "Investment Plan",
        path: "/admin/financial/investment-plan",
      },
      {
        id: "investment-type",
        label: "Return Type",
        path: "/admin/financial/investment-type",
      },
          {
            id: "lot-settings",
            label: "Lot Settings",
            path: "/admin/financial/lot-settings",
          },
    ],
  },

  {
    id: "members",
    label: "Members Management",
    icon: FiUsers,
    children: [
      {
        id: "network-members",
        label: "Network Members",
        path: "/admin/members/network",
      },
      {
        id: "holding-tank",
        label: "Holding Tank",
        path: "/admin/members/holding-tank",
      },
      {
        id: "bank-account",
        label: "Bank Account",
        path: "/admin/members/bank-approve",
      },
      {
        id: "kyc-details",
        label: "KYC Details",
        path: "/admin/members/kyc-details",
      },
      {
        id: "genealogy",
        label: "Genealogy",
        path: "/admin/genealogy",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: FiSettings,
    children: [
      { id: "brand", label: "Brand", path: "/admin/settings/brand" },
      { id: "network", label: "Network", path: "/admin/settings/network" },
          { id: "ranks", label: "Ranks", path: "/admin/settings/ranks" },
      { id: "level-settings", label: "Level Commission", path: "/admin/settings/level-settings" },
      { id: "level-report", label: "Level Commission Report", path: "/admin/settings/level-report" },
      {
        id: "withdrawal",
        label: "Withdrawal",
        path: "/admin/settings/withdrawal",
      },
      {
        id: "advanced",
        label: "Advanced Settings",
        path: "/admin/settings/advanced",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FiFileText,
    children: [
      {
        id: "fund-transfer",
        label: "Fund Transfer",
        path: "/admin/report/fund-transfer",
      },
      {
        id: "joining-report",
        label: "Joining Report",
        path: "/admin/report/joining",
      },
      {
        id: "member-income",
        label: "Member Income",
        path: "/admin/report/income",
      },
      { id: "payout-report", label: "Payout", path: "/admin/report/payout" },
      {
        id: "point-history",
        label: "Point History",
        path: "/admin/report/point/history",
      },
      {
        id: "top-earners",
        label: "Top Earners",
        path: "/admin/report/earners",
      },
    ],
  },
];

function AdminSidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const itemRefs = useRef({});
  const lastExpandedId = useRef(null);

  const isDashboardNetworkPath =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin/dashboard/network";

  const isDashboardBusinessPath = location.pathname === "/admin/dashboard/business";

  const matchesChildPath = (childPath, currentPath) => {
    if (!childPath) return false;
    return currentPath === childPath || currentPath.startsWith(`${childPath}/`);
  };

  const [expanded, setExpanded] = useState({
    dashboard: true,
    business: false,
    financial: false,
    communication: false,
    tools: false,
    members: false,
    achievers: false,
    settings: false,
    reports: false,
  });

  useEffect(() => {
    const newExpanded = {
      dashboard: false,
      business: false,
      financial: false,
      communication: false,
      tools: false,
      members: false,
      achievers: false,
      settings: false,
      reports: false,
    };

    navItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => {
          if (child.id === "network" && item.id === "dashboard") {
            return isDashboardNetworkPath;
          }

          if (child.id === "business" && item.id === "dashboard") {
            return isDashboardBusinessPath;
          }

          return matchesChildPath(child.path, location.pathname);
        });

        if (hasActiveChild) {
          newExpanded[item.id] = true;
        }
      }
    });

    setExpanded((prev) => {
      const hasChange = Object.keys(newExpanded).some(
        (key) => newExpanded[key] !== prev[key]
      );
      return hasChange ? newExpanded : prev;
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
      const nextState = {
        dashboard: false,
        business: false,
        financial: false,
        communication: false,
        tools: false,
        members: false,
        achievers: false,
        settings: false,
        reports: false,
      };
      nextState[id] = !isOpen;
      return nextState;
    });
  };

  const handleParentClick = (item) => {
    if (isCollapsed) {
      if (item.children && item.children.length > 0) {
        navigate(item.children[0].path);
      } else if (item.path) {
        navigate(item.path);
      }
      return;
    }
    if (item.children && item.children.length > 0) {
      toggleExpand(item.id);
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "admin-sidebar--open" : ""} ${
        isCollapsed ? "admin-sidebar--collapsed" : ""
      }`}
    >
      <div className="sidebar-header">
        <img
          src={logo}
          alt="AurumFX Logo"
          className="sidebar-logo"
          onClick={onToggleCollapse}
          style={{ cursor: "pointer" }}
        />
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {isCollapsed && (
        <div className="sidebar-avatar">
          <div className="sidebar-avatar-circle">A</div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isItemActive =
            location.pathname === item.path ||
            (item.children &&
              item.children.some((child) => {
                if (child.id === "network" && item.id === "dashboard") {
                  return isDashboardNetworkPath;
                }

                if (child.id === "business" && item.id === "dashboard") {
                  return isDashboardBusinessPath;
                }

                return matchesChildPath(child.path, location.pathname);
              }));

          const isExpanded = expanded[item.id];

          return (
            <div key={item.id} className="nav-group">
              <button
                type="button"
                ref={(el) => {
                  if (el) itemRefs.current[item.id] = el;
                }}
                className={`nav-item ${isItemActive ? "nav-item--active" : ""}`}
                onClick={() => handleParentClick(item)}
                title={item.label}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.children && (
                  <span className="nav-arrow">
                    {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                )}
              </button>

              {!isCollapsed && item.children && isExpanded && (
                <div className="nav-submenu">
                  {item.children.map((child) => {
                    const isChildActive =
                      item.id === "dashboard" && child.id === "network"
                        ? isDashboardNetworkPath
                        : item.id === "dashboard" && child.id === "business"
                          ? isDashboardBusinessPath
                          : matchesChildPath(child.path, location.pathname);

                    return (
                      <Link
                        key={child.id}
                        to={child.path}
                        className={`nav-subitem ${
                          isChildActive ? "nav-subitem--active" : ""
                        }`}
                        onClick={onClose}
                      >
                        {isChildActive && <span className="nav-dot" />}
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
  );
}

export default AdminSidebar;
