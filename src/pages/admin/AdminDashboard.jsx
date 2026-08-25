import { useEffect, useState } from "react";
import { FiActivity, FiCalendar, FiDollarSign, FiRefreshCw, FiTrendingUp, FiUsers } from "react-icons/fi";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getAdminDashboardData } from "../../api/dashboard";
import "./AdminDashboard.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const number = (value) => Number(value || 0).toLocaleString("en-IN");
const dateValue = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const displayDate = (value) => value ? value.split("-").reverse().join("-") : "DD-MM-YYYY";
const field = (row, ...keys) => keys.reduce((value, key) => value ?? row?.[key], undefined);

// key, label, icon, format, accent color, is this the headline "hero" metric
const summaryCards = [
  ["total_active_investment", "Active Investment", FiTrendingUp, "money", "gold", true],
  ["total_users", "Total Users", FiUsers, "count", "teal", false],
  ["active_users", "Active Users", FiActivity, "count", "blue", false],
  ["total_wallet_balance", "Wallet Balance", FiDollarSign, "money", "violet", false],
  ["total_pending_balance", "Pending Balance", FiDollarSign, "money", "amber", false],
  ["total_payout", "Total Payout", FiDollarSign, "money", "rose", false],
  ["total_income", "Total Income", FiTrendingUp, "money", "teal", false],
  ["total_admin_fee", "Admin Fee", FiDollarSign, "money", "blue", false],
];

function AdminDashboard() {
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async (activeFilters = filters) => {
    setLoading(true);
    setError("");
    const result = await getAdminDashboardData(activeFilters);
    if (result.success) setDashboard(result.data || {});
    else setError(result.error || "Unable to load admin dashboard.");
    setLoading(false);
  };

  useEffect(() => { loadDashboard(); }, []);

  const summary = dashboard?.summary || {};
  const currentMonth = dashboard?.current_month || {};
  const chart = dashboard?.income_chart || [];
  const topUsers = dashboard?.top_users || [];
  const investments = dashboard?.recent_investments || [];
  const payouts = dashboard?.recent_payouts || [];
  const maxIncome = Math.max(...chart.map((item) => Number(item.total_income || 0)), 1);
  const periodLabel = dashboard?.filter?.start_date || dashboard?.filter?.end_date ? "Filtered period" : "All time";
  const adminName = localStorage.getItem("userName") || "Admin";

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-heading">
          <div>
            <span className="admin-dashboard-eyebrow">Overview</span>
            <div className="admin-dashboard-welcome">Welcome back, <strong>{adminName}</strong> <span aria-hidden="true">👋</span></div>
            <h1>Admin Dashboard</h1>
            <p>Platform performance and financial overview</p>
          </div>
          <form className="admin-dashboard-filters" onSubmit={(event) => { event.preventDefault(); loadDashboard(); }}>
            <label><span>From</span><div className="admin-date-input"><input type="date" value={filters.start_date} aria-label="From date" onChange={(event) => setFilters((current) => ({ ...current, start_date: event.target.value }))} /><span>{displayDate(filters.start_date)}</span></div></label>
            <label><span>To</span><div className="admin-date-input"><input type="date" value={filters.end_date} aria-label="To date" onChange={(event) => setFilters((current) => ({ ...current, end_date: event.target.value }))} /><span>{displayDate(filters.end_date)}</span></div></label>
            <button type="submit"><FiRefreshCw /> Apply</button>
          </form>
        </div>

        {error && <div className="admin-dashboard-message admin-dashboard-message--error">{error}</div>}
        {loading && !dashboard ? <DashboardSkeleton /> : (
          <>
            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <h2>Summary</h2>
                <span className="dashboard-pill">{periodLabel}</span>
              </div>
              <div className="admin-summary-grid">
                {summaryCards.map(([key, label, Icon, format, accent, hero]) => (
                  <div className={`admin-summary-card admin-summary-card--${accent}${hero ? " admin-summary-card--hero" : ""}`} key={key}>
                    <div className="admin-summary-card-top">
                      <div className={`admin-summary-icon admin-summary-icon--${accent}`}><Icon /></div>
                    </div>
                    <span>{label}</span>
                    <strong>{format === "money" ? money(summary[key]) : number(summary[key])}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section-heading"><h2>Current Month</h2><FiCalendar /></div>
              <div className="month-metrics-grid">
                <Metric label="Investment" value={money(currentMonth.investment)} />
                <Metric label="Lots" value={number(currentMonth.lots)} />
                <Metric label="Total Income" value={money(currentMonth.total_income)} />
                <Metric label="Referral Income" value={money(currentMonth.referral_income)} />
                <Metric label="Level Income" value={money(currentMonth.level_income)} />
                <Metric label="Rank Income" value={money(currentMonth.rank_income)} />
                <Metric label="Admin Fee" value={money(currentMonth.admin_fee)} />
                <Metric label="Net Payable" value={money(currentMonth.net_payable)} />
              </div>
            </section>

            <section className="dashboard-main-grid">
              <div className="dashboard-panel">
                <div className="dashboard-section-heading">
                  <div className="dashboard-panel-title"><span className="dashboard-panel-icon"><FiTrendingUp /></span><div><h2>Income Chart</h2><span>Monthly total income</span></div></div>
                </div>
                <div className="income-chart">
                  {chart.length ? chart.map((item) => (
                    <div className="income-column" key={`${item.year}-${item.month}`}>
                      <div className="income-bar-wrap"><div className="income-bar" style={{ height: `${Math.max(4, Number(item.total_income || 0) / maxIncome * 100)}%` }} title={money(item.total_income)} /></div>
                      <span>{item.month_name || item.label}</span>
                    </div>
                  )) : <Empty text="No income chart data" />}
                </div>
              </div>
              <div className="dashboard-panel">
                <div className="dashboard-section-heading"><h2>Rank Distribution</h2><span>Members by rank</span></div>
                {dashboard?.rank_distribution?.length ? (
                  <div className="rank-list">
                    {dashboard.rank_distribution.map((item, index) => (
                      <div className="rank-row" key={item.rank || item.name || index}>
                        <span className="rank-row-label"><span className={`rank-dot rank-dot--${index % 5}`} />{item.rank || item.name || "Unranked"}</span>
                        <strong>{number(item.count ?? item.total_users ?? 0)}</strong>
                      </div>
                    ))}
                  </div>
                ) : <Empty text="No rank distribution data" />}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section-heading"><h2>Top Users</h2><span>Highest investment accounts</span></div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>User</th><th>Rank</th><th>Investment</th><th>Lots</th></tr></thead>
                  <tbody>
                    {topUsers.length ? topUsers.map((user) => (
                      <tr key={user.user_id}>
                        <td><div className="dashboard-user"><span>{String(user.user_name || user.user_id || "U").charAt(0).toUpperCase()}</span><div><strong>{user.user_name || "-"}</strong><small>{user.user_id}</small></div></div></td>
                        <td><span className="rank-badge">{user.rank || "Unranked"}</span></td>
                        <td>{money(user.total_investment)}</td>
                        <td>{number(user.total_lots)}</td>
                      </tr>
                    )) : <tr><td colSpan="4"><Empty text="No top users" compact /></td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-main-grid">
              <ActivityTable title="Recent Investments" rows={investments} amountKeys={["amount", "investment_amount"]} />
              <ActivityTable title="Recent Payouts" rows={payouts} amountKeys={["amount", "payout_amount", "net_payable"]} />
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function Metric({ label, value }) { return <div className="month-metric"><span>{label}</span><strong>{value}</strong></div>; }
function Empty({ text, compact }) { return <div className={`dashboard-empty ${compact ? "dashboard-empty--compact" : ""}`}>{text}</div>; }
function ActivityTable({ title, rows, amountKeys }) {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-section-heading"><h2>{title}</h2><span className="dashboard-pill">{rows.length} records</span></div>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead><tr><th>User</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={row.id || index}>
                <td>{field(row, "user_name", "userName", "user_id", "userId") || "-"}</td>
                <td>{money(field(row, ...amountKeys))}</td>
                <td>{dateValue(field(row, "created_at", "date", "payout_date", "investment_date"))}</td>
              </tr>
            )) : <tr><td colSpan="3"><Empty text="No records" compact /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function DashboardSkeleton() { return <div className="dashboard-loading"><FiRefreshCw /> Loading dashboard...</div>; }

export default AdminDashboard;