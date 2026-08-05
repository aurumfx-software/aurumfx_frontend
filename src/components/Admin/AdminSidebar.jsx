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
    children: [
      { id: "business", label: "Business", path: "/admin/dashboard/business" },
      { id: "network", label: "Network", path: "/admin/dashboard/network" },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: FiBriefcase,
    children: [
      { id: "club", label: "Club", path: "/admin/business/club" },
      { id: "enroller", label: "Enroller", path: "/admin/business/enroller" },
      { id: "structure", label: "Structure", path: "/admin/business/structure" },
      { id: "list", label: "List", path: "/admin/business/list" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: FiDollarSign,
    children: [
      { id: "ewallet", label: "E-Wallet", path: "/admin/financial/e-wallet" },
      { id: "deposit-wallet", label: "Deposit Wallet", path: "/admin/financial/deposit-wallet" },
      { id: "fund-credit", label: "Fund Credit", path: "/admin/financial/fund-credits" },
      { id: "payout", label: "Payout", path: "/admin/financial/payout/request" },
      { id: "investments", label: "Investments", path: "/admin/financial/investments/request" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: FiMessageSquare,
    children: [
      { id: "faq", label: "FAQ's", path: "/admin/communication/faqs" },
      { id: "emails", label: "Emails", path: "/admin/communication/mails/inbox" },
      { id: "help-center", label: "Help Center", path: "/admin/communication/help-center/tickets/inprogress" },
      { id: "article", label: "Article", path: "/admin/communication/articles" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: FiTool,
    children: [
      { id: "documents", label: "Documents", path: "/admin/tools/documents" },
      { id: "videos", label: "Videos", path: "/admin/tools/videos" },
    ],
  },
  {
    id: "members",
    label: "Members Management",
    icon: FiUsers,
    children: [
      { id: "network-members", label: "Network Members", path: "/admin/members/network" },
      { id: "holding-tank", label: "Holding Tank", path: "/admin/members/holding-tank" },
      { id: "bank-account", label: "Bank Account", path: "/admin/members/bank-approve" },
      { id: "kyc-details", label: "KYC Details", path: "/admin/members/kyc-details" },
    ],
  },
  {
    id: "achievers",
    label: "Achievers List",
    icon: FiAward,
    children: [
      { id: "rank-achievers", label: "Rank Achievers", path: "/admin/achievers/rank" },
      { id: "criteria-achievers", label: "Criteria Achievers", path: "/admin/achievers/criteria" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: FiSettings,
    children: [
      { id: "brand", label: "Brand", path: "/admin/settings/brand" },
      { id: "network", label: "Network", path: "/admin/settings/network" },
      { id: "withdrawal", label: "Withdrawal", path: "/admin/settings/withdrawal" },
      { id: "advanced", label: "Advanced Settings", path: "/admin/settings/advanced" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FiFileText,
    children: [
      { id: "fund-transfer",   label: "Fund Transfer",   path: "/admin/report/fund-transfer" },
      { id: "joining-report",  label: "Joining Report",  path: "/admin/report/joining" },
      { id: "member-income",   label: "Member Income",   path: "/admin/report/income" },
      { id: "payout-report",   label: "Payout",          path: "/admin/report/payout" },
      { id: "point-history",   label: "Point History",   path: "/admin/report/point/history" },
      { id: "top-earners",     label: "Top Earners",     path: "/admin/report/earners" },
    ],
  },
];

function AdminSidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({
    dashboard: true,
    business: true,
    financial: true,
    communication: false,
    tools: false,
    members: false,
    achievers: false,
    settings: false,
    reports: false,
  });

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) =>
            location.pathname === child.path ||
            (child.id === "network" &&
              (location.pathname === "/admin/dashboard" ||
                location.pathname === "/admin/dashboard/network")) ||
            (child.id === "business" && location.pathname === "/admin/dashboard/business")
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
    <aside className={`admin-sidebar ${isOpen ? "admin-sidebar--open" : ""} ${isCollapsed ? "admin-sidebar--collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="AurumFX Logo" className="sidebar-logo" onClick={onToggleCollapse} style={{ cursor: "pointer" }} />
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
              item.children.some(
                (child) =>
                  location.pathname === child.path ||
                  (child.id === "network" &&
                    (location.pathname === "/admin/dashboard" ||
                      location.pathname === "/admin/dashboard/network")) ||
                  (child.id === "business" &&
                    location.pathname === "/admin/dashboard/business")
              ));

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
                    const isChildActive =
                      location.pathname === child.path ||
                      (child.id === "network" &&
                        (location.pathname === "/admin/dashboard" ||
                          location.pathname === "/admin/dashboard/network")) ||
                      (child.id === "business" &&
                        location.pathname === "/admin/dashboard/business");

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
