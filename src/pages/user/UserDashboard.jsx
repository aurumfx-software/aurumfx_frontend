import { useState, useEffect } from "react";
import {
  FiInfo,
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
    name: dashboardData?.name || "PRAVEEN",
    fullName: dashboardData?.name || "PRAVEEN DINESH",
    userId:
      dashboardData?.user?.userId ||
      dashboardData?.user?.user_id ||
      localStorage.getItem("userId") ||
      "FX001",
    rank: dashboardData?.user?.rank || "FX Hero",
    nextRank:
      dashboardData?.user?.nextRank ||
      dashboardData?.user?.next_rank ||
      "FX Legend",
    totalLots:
      dashboardData?.user?.totalLots ?? dashboardData?.user?.total_lots ?? 1,
    avatar: dashboardData?.user?.avatar || null,
  };

  const financials = {
    income: Number(dashboardData?.financials?.income ?? 241550),
    withdrawals: Number(dashboardData?.financials?.withdrawals ?? 233900),
    balance: Number(dashboardData?.financials?.balance ?? 7650),
  };

  const networkStats = {
    downlineClubUserCount: Number(
      dashboardData?.networkStats?.downlineClubUserCount ??
        dashboardData?.network_stats?.downline_club_user_count ??
        258
    ),
    totalEnrolments: Number(
      dashboardData?.networkStats?.totalEnrolments ??
        dashboardData?.network_stats?.total_enrolments ??
        9
    ),
  };

  const enrolments = Array.isArray(dashboardData?.enrolments)
    ? dashboardData.enrolments
    : [
        {
          id: 1,
          user: "SUSHI",
          userId: "FX150",
          date: "17 Mar 2026",
          avatarBg: "#3498db",
        },
        {
          id: 2,
          user: "MANUJA",
          userId: "FX144",
          date: "09 Mar 2026",
          avatarBg: "#2c3e50",
        },
        {
          id: 3,
          user: "BINDU",
          userId: "FX125",
          date: "11 Feb 2026",
          avatarBg: "#7f8c8d",
        },
        {
          id: 4,
          user: "SURESHKUMAR",
          userId: "FX056",
          date: "29 Dec 2025",
          avatarBg: "#e67e22",
        },
        {
          id: 5,
          user: "VIMAL",
          userId: "FX055",
          date: "29 Dec 2025",
          avatarBg: "#8e44ad",
        },
      ];

  const teamPerformance = Array.isArray(dashboardData?.teamPerformance)
    ? dashboardData.teamPerformance
    : [
        {
          id: 1,
          user: "AJAYAKUMAR",
          userId: "FX021",
          enrolments: 20,
          earnings: 72500,
        },
        {
          id: 2,
          user: "SAVITHAMOL",
          userId: "FX011",
          enrolments: 8,
          earnings: 127000,
        },
        {
          id: 3,
          user: "BINDU",
          userId: "FX125",
          enrolments: 2,
          earnings: 15000,
        },
        { id: 4, user: "SOBHANA", userId: "FX018", enrolments: 0, earnings: 0 },
        { id: 5, user: "AKSHAYA", userId: "FX023", enrolments: 0, earnings: 0 },
      ];

  return (
    <UserLayout user={user}>
      <div className="user-dashboard-container">
        {/* Top Heads-up Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{user.userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="user-dashboard-grid">
          {/* Main Left Content Column */}
          <div className="grid-main-column">
            {/* Top Row: Metric Cards & Income Payout Donut */}
            <div className="top-metrics-row">
              {/* Income / Investments Card */}
              <div className="metric-card" style={{ position: "relative" }}>
                <div className="metric-card-icon icon--income">
                  <FiTrendingUp style={{ color: "#d97706" }} />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Total Investment</span>

                  <h3 className="metric-value">
                    {loading ? "..." : `₹${financials.income.toLocaleString()}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvestModalOpen(true)}
                  title="Do Investment"
                  style={{
                    marginLeft: "auto",
                    background: "#fff8e6",
                    color: "#d97706",
                    border: "1px solid #fde68a",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <FiPlusCircle size={13} />
                  <span>Split</span>
                </button>

              </div>


              {/* Withdrawals Card */}
              <div className="metric-card">
                <div className="metric-card-icon icon--withdraw">
                  <FiArrowUpRight style={{ color: "#ef4444" }} />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Withdrawals</span>
                  <h3 className="metric-value">
                    {loading
                      ? "..."
                      : `₹${financials.withdrawals.toLocaleString()}`}
                  </h3>
                </div>
              </div>

              {/* Balance Card */}
              <div className="metric-card">
                <div className="metric-card-icon icon--balance">
                  <FiBriefcase style={{ color: "#3b82f6" }} />
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Balance</span>
                  <h3 className="metric-value">
                    {loading
                      ? "..."
                      : `₹${financials.balance.toLocaleString()}`}
                  </h3>
                </div>
              </div>

              {/* Income Payout Donut Chart */}
              <div className="donut-card">
                <h4 className="card-title">Income Payout Overview</h4>
                <IncomePayoutDonutChart
                  income={financials.income}
                  payout={financials.withdrawals}
                />
              </div>
            </div>

            {/* Middle Row: Network Join Area Chart & Count Widgets */}
            <div className="middle-network-row">
              {/* Network Chart Card */}
              <div className="network-chart-card">
                <h4 className="card-title">Network</h4>
                <p className="card-subtitle">Overview of user join</p>
                <NetworkAreaChart data={dashboardData?.networkChartData} />
              </div>

              {/* Downline Count Summary Card */}
              <div className="counts-summary-card">
                <div className="count-stat-item">
                  <div className="count-stat-icon">
                    <FiUsers />
                  </div>
                  <div className="count-stat-text">
                    <span className="count-lbl">Downline Club User Count</span>
                    <span className="count-num">
                      {networkStats.downlineClubUserCount}
                    </span>
                  </div>
                </div>

                <div className="count-stat-item">
                  <div className="count-stat-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="count-stat-text">
                    <span className="count-lbl">Total Enrolments</span>
                    <span className="count-num">
                      {networkStats.totalEnrolments}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Enrolments & Team Performance Tables */}
            <div className="tables-row">
              {/* Enrolments Table */}
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
                      {enrolments.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="user-table-cell">
                              <div
                                className="user-table-avatar"
                                style={{
                                  background: item.avatarBg || "#3498db",
                                }}
                              >
                                {String(item.user || "U").charAt(0)}
                              </div>
                              <div className="user-table-meta">
                                <span className="meta-name">{item.user}</span>
                                <span className="meta-id">{item.userId}</span>
                              </div>
                            </div>
                          </td>
                          <td className="date-cell">{item.date}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Performance Table */}
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
                      {teamPerformance.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="user-table-cell">
                              <div className="user-table-avatar dark-avatar">
                                {String(item.user || "U").charAt(0)}
                              </div>
                              <div className="user-table-meta">
                                <span className="meta-name">{item.user}</span>
                                <span className="meta-id">{item.userId}</span>
                              </div>
                            </div>
                          </td>
                          <td>{item.enrolments}</td>
                          <td className="text-right earnings-val">
                            ₹{Number(item.earnings || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: User VIP Rank & Trophy Card */}
          <div className="grid-side-column">
            <UserRankCard user={user} />
          </div>
        </div>
      </div>

      {/* Investment Popup Modal */}
      <DoInvestmentModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
      />
    </UserLayout>
  );
}

export default UserDashboard;

