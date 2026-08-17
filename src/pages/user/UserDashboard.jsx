import { useState, useEffect } from "react";
import {
  FiShield,
  FiMoreVertical,
  FiUsers,
  FiTrendingUp,
  FiArrowUpRight,
  FiBriefcase,
  FiPlusCircle,
} from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import {
  IncomePayoutDonutChart,
  NetworkAreaChart,
} from "../../components/User/UserCharts";
import UserRankCard from "../../components/User/UserRankCard";
import DoInvestmentModal from "../../components/User/DoInvestmentModal";
import { getUserDashboardData } from "../../api/dashboard";
import "./UserDashboard.css";

// Deterministic initials avatar so the same user always renders the same way.
function getInitials(name) {
  const clean = String(name || "U").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getUserDashboardData()
      .then((res) => {
        if (isMounted) {
          if (res && res.success && res.data) {
            const dashData = res.data.data || res.data;
            setDashboardData(dashData);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const user = {
    name: dashboardData?.name || localStorage.getItem("userName") || "User",
    fullName: dashboardData?.name || localStorage.getItem("userName") || "User",
    userId: dashboardData?.user_id || localStorage.getItem("userId") || "FX000",
    rank: dashboardData?.rank || "FX Hero",
    nextRank: dashboardData?.next_rank || "FX Legend",
    totalLots: dashboardData?.total_lots ?? 0,
    avatar: null,
  };

  const financials = {
    totalInvestment: Number(dashboardData?.total_investment ?? 0),
    walletBalance: Number(dashboardData?.wallet_balance ?? 0),
    activeInvestments: Number(dashboardData?.active_investments ?? 0),
    levelIncome: Number(dashboardData?.level_income ?? 0),
    referralIncome: Number(dashboardData?.referral_income ?? 0),
    teamMembers: Number(dashboardData?.team_members ?? 0),
  };

  const enrolments = Array.isArray(dashboardData?.enrolments)
    ? dashboardData.enrolments
    : [];

  const teamPerformance = Array.isArray(dashboardData?.team_performance)
    ? dashboardData.team_performance
    : [];

  const fmt = (n) => `₹${Number(n || 0).toLocaleString()}`;

  return (
    <UserLayout user={user}>
      <div className="user-dashboard-container">
        {/* Header */}
        <div className="udb-header">
          <div>
            <div className="udb-header-title">Welcome back, {user.name}</div>
            <div className="udb-header-sub">
              Here's how your portfolio is performing today.
            </div>
          </div>

          <div className="udb-admin-pill">
            <FiShield className="udb-admin-icon" />
            <span>
              Signed in as <strong>{user.userId}</strong>
            </span>
            <a href="/admin/login">Back to admin</a>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="user-dashboard-grid">
          <div className="grid-main-column">
            {/* Hero row: Total Investment (primary) + secondary metrics */}
            <div className="hero-row">
              <div className="hero-card">
                <div className="hero-top">
                  <span className="hero-eyebrow">
                    <span className="dot" />
                    Portfolio
                  </span>
                </div>
                <div>
                  <div className="hero-value">
                    {loading ? "…" : fmt(financials.totalInvestment)}
                  </div>
                  <div className="hero-label">Total Investment</div>
                </div>
                <button
                  type="button"
                  className="hero-invest-btn"
                  onClick={() => setIsInvestModalOpen(true)}
                  title="Add a new investment"
                >
                  <FiPlusCircle size={15} />
                  <span>Add Investment</span>
                </button>
              </div>

              <div className="metric-card">
                <div className="metric-card-icon icon--withdraw">
                  <FiArrowUpRight />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Wallet Balance</span>
                  <h3 className="metric-value">
                    {loading ? "…" : fmt(financials.walletBalance)}
                  </h3>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-card-icon icon--balance">
                  <FiBriefcase />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Active Investments</span>
                  <h3 className="metric-value">
                    {loading ? "…" : fmt(financials.activeInvestments)}
                  </h3>
                </div>
              </div>

              <div className="metric-card team-card">
                <div className="metric-card-icon icon--team">
                  <FiUsers />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Team Members</span>
                  <h3 className="metric-value">
                    {loading ? "…" : financials.teamMembers.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>

            {/* Insights row: network growth + income breakdown */}
            <div className="insights-row">
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <h4 className="card-title">Network Growth</h4>
                    <p className="card-subtitle">New members joining over time</p>
                  </div>
                </div>
                <NetworkAreaChart data={dashboardData?.networkChartData} />
              </div>

              <div className="panel-card income-panel">
                <div>
                  <h4 className="card-title">Income Breakdown</h4>
                  <p className="card-subtitle">Earned vs. paid out</p>
                </div>

                <div className="income-chart-wrap">
                  <IncomePayoutDonutChart
                    income={financials.levelIncome + financials.referralIncome}
                    payout={financials.walletBalance}
                  />
                </div>

                <div className="income-stats">
                  <div className="income-stat-row">
                    <span className="income-stat-dot gold" />
                    <div className="income-stat-text">
                      <span className="income-stat-lbl">Level Income</span>
                    </div>
                    <span className="income-stat-val">
                      {fmt(financials.levelIncome)}
                    </span>
                  </div>
                  <div className="income-stat-row">
                    <span className="income-stat-dot info" />
                    <div className="income-stat-text">
                      <span className="income-stat-lbl">Referral Income</span>
                    </div>
                    <span className="income-stat-val">
                      {fmt(financials.referralIncome)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tables row: Enrolments & Team Performance */}
            <div className="tables-row">
              <div className="table-card">
                <h4 className="card-title">Enrolments</h4>
                <div className="table-container">
                  <table className="user-dash-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolments.length > 0 ? (
                        enrolments.map((item) => {
                          const name = item.user || item.name || "User";
                          return (
                            <tr key={item.id || item.user_id || name + Math.random()}>
                              <td>
                                <div className="user-table-cell">
                                  <div className="user-table-avatar">
                                    {getInitials(name)}
                                  </div>
                                  <div className="user-table-meta">
                                    <span className="meta-name">{name}</span>
                                    <span className="meta-id">
                                      {item.userId || item.user_id || "-"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="date-cell">{item.date || "-"}</td>
                              <td className="text-right">
                                <button
                                  type="button"
                                  className="table-action-btn"
                                  aria-label="More options"
                                >
                                  <FiMoreVertical />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center muted-row">
                            No enrolments yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="table-card">
                <h4 className="card-title">Team Performance</h4>
                <div className="table-container">
                  <table className="user-dash-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Enrolments</th>
                        <th className="text-right">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPerformance.length > 0 ? (
                        teamPerformance.map((item) => {
                          const name = item.user || item.name || "User";
                          return (
                            <tr key={item.id || item.user_id || name + Math.random()}>
                              <td>
                                <div className="user-table-cell">
                                  <div className="user-table-avatar">
                                    {getInitials(name)}
                                  </div>
                                  <div className="user-table-meta">
                                    <span className="meta-name">{name}</span>
                                    <span className="meta-id">
                                      {item.userId || item.user_id || "-"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>{item.enrolments ?? 0}</td>
                              <td className="text-right earnings-val">
                                {fmt(item.earnings)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center muted-row">
                            No team performance data yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rank Card */}
          <div className="grid-side-column">
            <UserRankCard user={user} />
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <DoInvestmentModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
      />
    </UserLayout>
  );
}

export default UserDashboard;