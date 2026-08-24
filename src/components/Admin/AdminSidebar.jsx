import { useState, useEffect } from "react";
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
    path: "/admin/dashboard",
  },
  {
    id: "business",
    label: "Business",
    icon: FiBriefcase,
    children: [
      {
        id: "family",
        label: "Family",
        path: "/admin/genealogy",
      },
      {
        id: "enrollers",
        label: "Enrolment",
        path: "/admin/enrollers",
      },
      {
        id: "family-list",
        label: "Family List",
        path: "/admin/genealogy/list",
      },
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
        id: "payout",
        label: "Payout",
        path: "/admin/financial/payout",
      },
      {
        id: "investments",
        label: "Investments",
        path: "/admin/financial/investments/request",
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
        id: "bank-account",
        label: "Bank Account",
        path: "/admin/members/bank-approve",
      },
      {
        id: "kyc-details",
        label: "KYC Details",
        path: "/admin/members/kyc-details",
      },
    ],
  },
  {
    id: "rank-list",
    label: "Rank List",
    icon: FiAward,
    path: "/admin/rank-list",
  },
  {
    id: "settings",
    label: "Settings",
    icon: FiSettings,
    children: [
      { id: "investment-plan", label: "Investment Plan", path: "/admin/financial/investment-plan" },
      { id: "investment-type", label: "Return Type", path: "/admin/financial/investment-type" },
      { id: "lot-settings", label: "Lot Settings", path: "/admin/financial/lot-settings" },
      { id: "ranks", label: "Ranks", path: "/admin/settings/ranks" },
      { id: "level-settings", label: "Level Commission", path: "/admin/settings/level-settings" },
      { id: "admin-fee", label: "Admin Fee", path: "/admin/settings/admin-fee" },
      { id: "referral-commission", label: "Referral Commission", path: "/admin/settings/referral-commission" },
      { id: "return-date-settings", label: "Return Date", path: "/admin/settings/return-date" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FiFileText,
    children: [
      {
        id: "investment-report",
        label: "Investment Report",
        path: "/admin/report/investment",
      },
      {
        id: "level-income-report",
        label: "Level Income Report",
        path: "/admin/report/level-income",
      },
      {
        id: "referral-income-report",
        label: "Referral Income Report",
        path: "/admin/report/referral-income",
      },
      {
        id: "rank-income-report",
        label: "Rank Income Report",
        path: "/admin/report/rank-income",
      },
      {
        id: "payout-report",
        label: "Payout Report",
        path: "/admin/report/payout",
      },
    ],
  },
  {
    id: "help-center",
    label: "Help Center",
    icon: FiMessageSquare,
    children: [
      { id: "help-center-tickets", label: "Support Tickets", path: "/admin/help-center" },
    ],
  },
];

function AdminSidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const adminId = localStorage.getItem("userId") || "ADMIN";
  const storedAdminName = localStorage.getItem("userName");
  const adminName = storedAdminName && storedAdminName !== adminId ? storedAdminName : "Admin User";

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

  const toggleExpand = (id) => {
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

      {!isCollapsed && (
        <div className="admin-sidebar-profile">
          <div className="admin-sidebar-profile-avatar">{adminName.charAt(0).toUpperCase()}</div>
          <div className="admin-sidebar-profile-details">
            <strong>{adminName}</strong>
            <span>{adminId}</span>
          </div>
        </div>
      )}

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
                return matchesChildPath(child.path, location.pathname);
              }));

          const isExpanded = expanded[item.id];

          return (
            <div key={item.id} className="nav-group">
              <button
                type="button"
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
                    const isChildActive = matchesChildPath(child.path, location.pathname);

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
