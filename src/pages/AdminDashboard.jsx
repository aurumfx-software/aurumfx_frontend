import { useState, useEffect } from "react";
import { FiGift, FiCreditCard, FiUsers, FiInfo } from "react-icons/fi";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { getAdminDashboardData } from "../api/dashboard";
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

function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("week");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAdminDashboardData(timeframe).then((res) => {
      if (isMounted && res.success) {
        setDashboardData(res.data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const kpis = dashboardData?.kpis || { totalNetworkBonus: 3629460, totalPayout: 3436610 };
  const chartData = dashboardData?.chartData || defaultChartData;
  const usersSummary = dashboardData?.usersSummary || { totalMembers: 2, holdingTank: 0, networkMembers: 2 };
  const ticketsSummary = dashboardData?.ticketsSummary || { totalTickets: 0, open: 0, closed: 0 };
  const registrations = dashboardData?.latestRegistrations || [];

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="alert-banner">
          <FiInfo className="alert-icon" />
          <p>
            Heads up! You are now logged in as <strong>aurumfx</strong>{" "}
            <button type="button" className="alert-link">
              Click Here
            </button>
            , to go back admin account.
          </p>
        </div>

        <div className="dashboard-grid">
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
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
