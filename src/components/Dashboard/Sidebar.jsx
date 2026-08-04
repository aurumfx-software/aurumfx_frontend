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
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

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
      { id: "ewallet", label: "E-Wallet", path: "/admin/financial/ewallet" },
      { id: "deposit-wallet", label: "Deposit Wallet", path: "/admin/financial/deposit" },
      { id: "fund-transfer", label: "Fund Transfer", path: "/admin/financial/transfer" },
      { id: "payout", label: "Payout", path: "/admin/financial/payout" },
      { id: "investments", label: "Investments", path: "/admin/financial/investments" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: FiMessageSquare,
    children: [
      { id: "mails", label: "Emails & Mails", path: "/admin/communication/mails" },
      { id: "tickets", label: "Support Tickets", path: "/admin/communication/tickets" },
      { id: "announcements", label: "Announcements", path: "/admin/communication/announcements" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: FiTool,
    children: [
      { id: "documents", label: "Documents", path: "/admin/tools/documents" },
      { id: "videos", label: "Video Tutorials", path: "/admin/tools/videos" },
      { id: "faqs", label: "FAQ's", path: "/admin/tools/faqs" },
    ],
  },
  {
    id: "members",
    label: "Members Management",
    icon: FiUsers,
    children: [
      { id: "member-list", label: "Members List", path: "/admin/members/list" },
      { id: "add-member", label: "Add New Member", path: "/admin/members/add" },
      { id: "kyc", label: "KYC Verification", path: "/admin/members/kyc" },
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
      { id: "general", label: "General Settings", path: "/admin/settings/general" },
      { id: "payment", label: "Payment Methods", path: "/admin/settings/payment" },
      { id: "commissions", label: "Commission Structure", path: "/admin/settings/commissions" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FiFileText,
    children: [
      { id: "sales-report", label: "Sales Reports", path: "/admin/reports/sales" },
      { id: "payout-report", label: "Payout Reports", path: "/admin/reports/payout" },
      { id: "tax-report", label: "Tax & Analytics", path: "/admin/reports/tax" },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
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

  const handleParentClick = (e, item) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [item.id]: true }));
    if (item.children && item.children.length > 0 && item.children[0].path) {
      navigate(item.children[0].path);
      if (onClose) onClose();
    }
  };

  const handleChevronClick = (e, itemId) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar-logo">
        <Link to="/admin/dashboard/business" onClick={onClose}>
          <img src={logo} alt="AurumFX Admin" />
        </Link>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">A</div>
        <span className="sidebar-username">aurumfx</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemExpanded = expanded[item.id];
          const isParentActive =
            item.children &&
            item.children.some(
              (child) =>
                location.pathname === child.path ||
                (item.id === "dashboard" &&
                  (location.pathname === "/admin/dashboard" ||
                    location.pathname === "/admin/dashboard/network" ||
                    location.pathname === "/admin/dashboard/business"))
            );

          return (
            <div key={item.id} className="nav-group">
              <button
                type="button"
                className={`nav-item ${item.children ? "nav-item--parent" : ""} ${
                  isParentActive ? "nav-item--active" : ""
                } ${isItemExpanded && item.children ? "nav-item--expanded" : ""}`}
                onClick={(e) => handleParentClick(e, item)}
              >
                <span className="nav-item-left">
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </span>
                {item.children && (
                  <span
                    className="chevron-box"
                    onClick={(e) => handleChevronClick(e, item.id)}
                  >
                    {isItemExpanded ? (
                      <FiChevronDown className="nav-chevron" />
                    ) : (
                      <FiChevronRight className="nav-chevron" />
                    )}
                  </span>
                )}
              </button>

              {item.children && isItemExpanded && (
                <div className="nav-subitems">
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

export default Sidebar;
