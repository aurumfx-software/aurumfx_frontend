import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiGift,
  FiCreditCard,
  FiUsers,
  FiBriefcase,
  FiInfo,
  FiCalendar,
} from "react-icons/fi";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAdminDashboardData } from "../../api/dashboard";
import "./AdminDashboard.css";

const defaultChartData = [
  { day: 19, value: 5000 },
  { day: 20, value: 12000 },
  { day: 21, value: 28000 },
  { day: 22, value: 40000 },
  { day: 23, value: 8000 },
  { day: 24, value: 3000 },
  { day: 25, value: 2000 },
];

function NetworkBonusChart({ data = defaultChartData }) {
  const chartData = data && data.length ? data : defaultChartData;
  const width = 520;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 30, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(...chartData.map((d) => d.value), 40000);

  const points = chartData.map((d, i) => ({
    x: padding.left + (i / Math.max(chartData.length - 1, 1)) * chartW,
    y: padding.top + chartH - (d.value / maxVal) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];
  const xTicks = chartData.map((d) => d.day);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="network-chart" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc52d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffc52d" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => {
        const y = padding.top + chartH - (tick / maxVal) * chartH;
        return (
          <g key={tick}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#eee" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="chart-axis-label">
              {Math.round(tick).toLocaleString()}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="url(#chartGradient)" />
      <path d={linePath} fill="none" stroke="#ffc52d" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {xTicks.map((day, i) => {
        const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * chartW;
        return (
          <text key={day} x={x} y={height - 8} textAnchor="middle" className="chart-axis-label">
            {day}
          </text>
        );
      })}
    </svg>
  );
}

function CircularGauge({ value, label, active }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = active && value > 0 ? 0.75 : 0;

  return (
    <div className="gauge-item">
      <div className={`gauge-ring ${active ? "gauge-ring--active" : ""}`}>
        <svg viewBox="0 0 90 90" className="gauge-svg">
          <circle cx="45" cy="45" r={radius} fill="none" stroke="#eee" strokeWidth="6" />
          {active && (
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#ffc52d"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
          )}
        </svg>
        <span className="gauge-value">{value}</span>
      </div>
      <span className="gauge-label">{label}</span>
    </div>
  );
}

function MembersMap() {
  return (
    <svg viewBox="0 0 800 400" className="members-map" preserveAspectRatio="xMidYMid meet">
      <rect width="800" height="400" fill="#f8f8f8" rx="8" />
      <ellipse cx="560" cy="210" rx="28" ry="35" fill="#222" />
      <ellipse cx="650" cy="300" rx="50" ry="40" fill="#ffc52d" opacity="0.6" />
    </svg>
  );
}

/* 3D Isometric Bar Chart Illustration for Sales Performance Card */
function SalesPerformanceGraphic() {
  return (
    <svg viewBox="0 0 160 120" className="sales-banner-graphic" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(10, 10)">
        <polygon points="15,75 75,45 135,75 75,105" fill="#ffb703" opacity="0.3" />
        <polygon points="35,65 50,57 50,30 35,38" fill="#fb8500" />
        <polygon points="50,57 65,65 65,38 50,30" fill="#ffb703" />
        <polygon points="35,38 50,30 65,38 50,46" fill="#ffc52d" />
        <polygon points="60,52 75,44 75,15 60,23" fill="#fb8500" />
        <polygon points="75,44 90,52 90,23 75,15" fill="#ffb703" />
        <polygon points="60,23 75,15 90,23 75,31" fill="#ffe399" />
        <polygon points="85,65 100,57 100,35 85,43" fill="#fb8500" />
        <polygon points="100,57 115,65 115,43 100,35" fill="#ffb703" />
        <polygon points="85,43 100,35 115,43 100,51" fill="#ffc52d" />
      </g>
    </svg>
  );
}

/* Sales Graph Chart Component for Admin Business View */
function SalesGraphChart() {
  return (
    <div className="sales-graph-container">
      <svg viewBox="0 0 500 240" className="sales-graph-svg" preserveAspectRatio="xMidYMid meet">
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = 200 - tick * 42;
          return (
            <g key={tick}>
              <line x1="35" y1={y} x2="490" y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x="24" y={y + 4} textAnchor="end" className="graph-tick-text">
                {tick}
              </text>
            </g>
          );
        })}
        {["02", "03"].map((day, idx) => (
          <text key={day} x={idx === 0 ? "55" : "470"} y="222" textAnchor="middle" className="graph-tick-text">
            {day}
          </text>
        ))}
        <line x1="55" y1="200" x2="470" y2="200" stroke="#ffc52d" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <div className="sales-graph-legend">
        <div className="legend-entry">
          <span className="legend-box legend-box--package" />
          <span>Package</span>
        </div>
        <div className="legend-entry">
          <span className="legend-box legend-box--product" />
          <span>Product</span>
        </div>
      </div>
    </div>
  );
}

/* Empty State Illustration for Tables */
function EmptyStateGraphic() {
  return (
    <div className="empty-state-box">
      <div className="empty-graphic-wrapper">
        <svg viewBox="0 0 140 100" className="empty-svg">
          <rect x="25" y="15" width="90" height="60" rx="16" fill="#f4f4f4" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="40" y1="32" x2="80" y2="32" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
          <line x1="40" y1="46" x2="65" y2="46" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
          <circle cx="78" cy="54" r="18" fill="#ffffff" stroke="#9e9e9e" strokeWidth="4" />
          <line x1="91" y1="67" x2="108" y2="84" stroke="#9e9e9e" strokeWidth="5" strokeLinecap="round" />
          <text x="78" y="60" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#757575">?</text>
        </svg>
      </div>
      <p className="empty-state-text">No Data Available</p>
    </div>
  );
}

/* Yellow Icon SVGs for Business Stat Cards */
function HandCoinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e5a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" fill="#fffdf0" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e5a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="3" />
      <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#e5a800" />
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function ProfitChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e5a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 7l-5 5-4-4-4 4" />
      <path d="M14 7h4v4" />
    </svg>
  );
}

function PayoutTrayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e5a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v10H4z" />
      <path d="M4 14l4 4h8l4-4" />
      <path d="M12 8v5M9 11l3 3 3-3" />
    </svg>
  );
}

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNetworkView = location.pathname.includes("/network");
  const isBusinessView = !isNetworkView;

  const [timeframe, setTimeframe] = useState("week");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAdminDashboardData(timeframe).then((res) => {
      if (!isMounted) return;
      if (res.success) {
        setDashboardData(res.data);
        setErrorMsg("");
      } else {
        setDashboardData(null);
        setErrorMsg(res.error || "Failed to load dashboard data");
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  // Normalize API response shape (some responses return different keys or mock data)
  const apiData = dashboardData?.data || dashboardData || {};

  const kpis = apiData.kpis || { totalNetworkBonus: apiData.income?.level_income ?? 0, totalPayout: apiData.income?.referral_income ?? 0 };
  const chartData = apiData.chartData || defaultChartData;
  const usersSummary = apiData.usersSummary || {
    totalMembers: apiData.users?.total_users ?? 0,
    holdingTank: apiData.users?.today_users ?? 0,
    networkMembers: apiData.users?.active_users ?? 0,
  };
  const ticketsSummary = apiData.ticketsSummary || { totalTickets: 0, open: 0, closed: 0 };
  const registrations = apiData.latestRegistrations || [];

  // Additional direct mappings from admin /admin/dashboard response
  const investmentsSummary = apiData.investments || {};
  const incomeSummary = apiData.income || {};
  const walletSummary = apiData.wallet || {};

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Top Sub-section Switcher Tabs */}
        <div className="admin-dashboard-tabs">
          <button
            type="button"
            className={`dashboard-tab ${isBusinessView ? "dashboard-tab--active" : ""}`}
            onClick={() => navigate("/admin/dashboard/business")}
          >
            <FiBriefcase className="tab-icon" />
            <span>Business</span>
          </button>
          <button
            type="button"
            className={`dashboard-tab ${isNetworkView ? "dashboard-tab--active" : ""}`}
            onClick={() => navigate("/admin/dashboard/network")}
          >
            <FiUsers className="tab-icon" />
            <span>Network</span>
          </button>
        </div>

        {/* Render Business View vs Network View */}
        {isBusinessView ? (
          <>
            {errorMsg && (
              <div className="dashboard-error">
                {errorMsg}
              </div>
            )}
            <div className="admin-biz-dashboard">
            {/* Main Top Grid (Left: Stat cards + Sales Overview; Right: Sales Graph) */}
            <div className="biz-layout-main">
              {/* Left Column */}
              <div className="biz-left-col">
                {/* 6 Stat Cards Grid */}
                <div className="biz-stat-cards-grid">
                  {/* 1. Sales Performance Banner Card */}
                  <div className="biz-sales-banner-card">
                    <div className="banner-card-header">
                      <span className="banner-card-title">Sales Performance</span>
                      <select className="banner-card-select">
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                      </select>
                    </div>
                    <div className="banner-card-body">
                      <div className="banner-values">
                        <h2 className="banner-main-val">₹{(investmentsSummary.total_amount ?? 0).toLocaleString()}</h2>
                        <div className="banner-badges">
                          <span className="badge-income">▲ + ₹0 Income</span>
                          <span className="badge-expense">▼ - ₹0 Expense</span>
                        </div>
                      </div>
                      <SalesPerformanceGraphic />
                    </div>
                  </div>

                  {/* 2. Invest Card */}
                  <div className="biz-stat-card">
                    <div className="stat-card-text">
                      <span className="stat-card-title">Invest</span>
                      <h3 className="stat-card-val">₹{(investmentsSummary.total_amount ?? 0).toLocaleString()}</h3>
                      <span className="stat-card-lbl">Total Invest</span>
                    </div>
                    <div className="stat-card-icon">
                      <HandCoinIcon />
                    </div>
                  </div>

                  {/* 3. Expense Card */}
                  <div className="biz-stat-card">
                    <div className="stat-card-text">
                      <span className="stat-card-title">Expense</span>
                      <h3 className="stat-card-val">₹{(incomeSummary.level_income ?? 0).toLocaleString()}</h3>
                      <span className="stat-card-lbl">Total Expense</span>
                    </div>
                    <div className="stat-card-icon">
                      <WalletIcon />
                    </div>
                  </div>

                  {/* 4. Profit Card */}
                  <div className="biz-stat-card">
                    <div className="stat-card-text">
                      <span className="stat-card-title">Profit</span>
                      <h3 className="stat-card-val">₹{((incomeSummary.level_income ?? 0) + (incomeSummary.referral_income ?? 0)).toLocaleString()}</h3>
                      <span className="stat-card-lbl">Total Profit</span>
                    </div>
                    <div className="stat-card-icon">
                      <ProfitChartIcon />
                    </div>
                  </div>

                  {/* 5. Payout Card */}
                  <div className="biz-stat-card">
                    <div className="stat-card-text">
                      <span className="stat-card-title">Payout</span>
                      <h3 className="stat-card-val">₹{(incomeSummary.referral_income ?? 0).toLocaleString()}</h3>
                      <span className="stat-card-lbl">Total Payout</span>
                    </div>
                    <div className="stat-card-icon">
                      <PayoutTrayIcon />
                    </div>
                  </div>

                  {/* 6. Balance Card */}
                  <div className="biz-stat-card">
                    <div className="stat-card-text">
                      <span className="stat-card-title">Balance</span>
                      <h3 className="stat-card-val">₹{(walletSummary.total_balance ?? 0).toLocaleString()}</h3>
                      <span className="stat-card-lbl">Total Balance</span>
                    </div>
                    <div className="stat-card-icon">
                      <WalletIcon />
                    </div>
                  </div>
                </div>

                {/* Sales Over View Card */}
                <div className="biz-card sales-overview-card">
                  <h3 className="biz-card-header-title">Sales Over View</h3>
                  <div className="sales-periods-grid">
                    {/* Today */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">Today</span>
                          <span className="period-date">03 Aug 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>

                    {/* This Month */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">This Month</span>
                          <span className="period-date">01 Aug 2026 - 31 Aug 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>

                    {/* This Week */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">This Week</span>
                          <span className="period-date">02 Aug 2026 - 08 Aug 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>

                    {/* Past Month */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">Past Month</span>
                          <span className="period-date">01 Jul 2026 - 31 Jul 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>

                    {/* Past Week */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">Past Week</span>
                          <span className="period-date">26 Jul 2026 - 01 Aug 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>

                    {/* This Year */}
                    <div className="period-box">
                      <div className="period-header">
                        <div className="period-icon">
                          <FiCalendar />
                        </div>
                        <div className="period-title-block">
                          <span className="period-name">This Year</span>
                          <span className="period-date">01 Jan 2026 - 31 Dec 2026</span>
                        </div>
                      </div>
                      <span className="period-amount">₹0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sales Graph Card */}
              <div className="biz-right-col">
                <div className="biz-card sales-graph-card">
                  <div className="graph-card-header">
                    <h3 className="biz-card-header-title">Sales Graph</h3>
                    <div className="date-picker-group">
                      <div className="date-field">
                        <span className="date-field-lbl">From</span>
                        <div className="date-input-wrap">
                          <input type="text" readOnly value="02 Aug 2026" />
                          <FiCalendar className="date-icon" />
                        </div>
                      </div>
                      <div className="date-field">
                        <span className="date-field-lbl">To</span>
                        <div className="date-input-wrap">
                          <input type="text" readOnly value="03 Aug 2026" />
                          <FiCalendar className="date-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <SalesGraphChart />
                </div>
              </div>
            </div>

            {/* Bottom Row: Tables Grid */}
            <div className="biz-bottom-grid">
              {/* Left Card: Latest Sales */}
              <div className="biz-card">
                <h3 className="biz-card-header-title">Latest Sales</h3>
                <div className="biz-table-wrapper">
                  <table className="biz-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Order ID</th>
                        <th>Amount Paid</th>
                      </tr>
                    </thead>
                  </table>
                  <EmptyStateGraphic />
                </div>
              </div>

              {/* Right Card: Top Selling Products */}
              <div className="biz-card">
                <h3 className="biz-card-header-title">Top Selling Products</h3>
                <div className="biz-table-wrapper">
                  <table className="biz-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Name/package/product</th>
                        <th>Total Sold Out</th>
                      </tr>
                    </thead>
                  </table>
                  <EmptyStateGraphic />
                </div>
              </div>
            </div>
          </div>
          </>
        ) : (
          /* Network Sub-section View */
          <div className="dashboard-grid">
            <div className="alert-banner" style={{ gridColumn: "1 / -1", marginBottom: "16px" }}>
              <FiInfo className="alert-icon" />
              <p>
                Heads up! You are now logged in as <strong>aurumfx</strong>{" "}
                <button type="button" className="alert-link">
                  Click Here
                </button>
                , to go back admin account.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid-kpi">
              <div className="kpi-card">
                <div className="kpi-icon">
                  <FiGift />
                </div>
                <div className="kpi-content">
                  <span className="kpi-value">
                    {loading ? "..." : `₹${kpis.totalNetworkBonus.toLocaleString()}`}
                  </span>
                  <span className="kpi-label">Total Network Bonus</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">
                  <FiCreditCard />
                </div>
                <div className="kpi-content">
                  <span className="kpi-value">
                    {loading ? "..." : `₹${kpis.totalPayout.toLocaleString()}`}
                  </span>
                  <span className="kpi-label">Total Payout</span>
                </div>
              </div>
            </div>

            {/* Network Bonus Chart */}
            <div className="grid-chart card">
              <div className="card-header">
                <h3>Network Bonus</h3>
                <select
                  className="card-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <NetworkBonusChart data={chartData} />
            </div>

            {/* Users Widget */}
            <div className="grid-users card">
              <div className="card-header">
                <h3>Users</h3>
                <select
                  className="card-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div className="users-summary">
                <div className="users-total">
                  <FiUsers className="users-icon" />
                  <div>
                    <span className="users-count">{usersSummary.totalMembers}</span>
                    <span className="users-label">Total Members</span>
                  </div>
                </div>
                <div className="users-gauges">
                  <CircularGauge value={usersSummary.holdingTank} label="Holding Tank" />
                  <CircularGauge value={usersSummary.networkMembers} label="Network Members" active />
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="grid-tickets card">
              <h3>Support Tickets</h3>
              <div className="tickets-content">
                <div className="tickets-stat">
                  <span className="tickets-value">{ticketsSummary.totalTickets}</span>
                  <span className="tickets-label">Total Tickets</span>
                </div>
                <div className="tickets-legend">
                  <div className="legend-item">
                    <span className="legend-dot legend-dot--open" />
                    Open ({ticketsSummary.open})
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot legend-dot--closed" />
                    Closed ({ticketsSummary.closed})
                  </div>
                </div>
              </div>
            </div>

            {/* Members Map */}
            <div className="grid-map card">
              <h3>Members Map</h3>
              <MembersMap />
            </div>

            {/* Latest Registrations */}
            <div className="grid-table card">
              <h3>Latest Registrations</h3>
              <div className="table-wrapper">
                <table className="registrations-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Enroller</th>
                      <th>Date Joined</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>
                          <div className="user-cell">
                            <span className="user-id">{row.userId}</span>
                            <span className="user-email">{row.email}</span>
                          </div>
                        </td>
                        <td>{row.enroller}</td>
                        <td>{row.dateJoined}</td>
                        <td>{row.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
