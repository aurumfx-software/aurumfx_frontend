import { useState, useEffect } from "react";
import {
  FiInfo,
  FiMoreVertical,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import UserLayout from "../components/User/UserLayout";
import { IncomePayoutDonutChart, NetworkAreaChart } from "../components/User/UserCharts";
import UserRankCard from "../components/User/UserRankCard";
import { getUserDashboardData } from "../api/dashboard";
import incomeIcon from "../assets/logo.png"; // Fallback/styled icons
import "./UserDashboard.css";

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getUserDashboardData().then((res) => {
      if (isMounted && res.success) {
        setDashboardData(res.data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const user = dashboardData?.user || {
    name: "PRAVEEN",
    fullName: "PRAVEEN DINESH",
    userId: "FX001",
    rank: "FX Hero",
    nextRank: "FX Legend",
    totalLots: 1,
  };

  const financials = dashboardData?.financials || {
    income: 241550,
    withdrawals: 233900,
    balance: 7650,
  };

  const networkStats = dashboardData?.networkStats || {
    downlineClubUserCount: 258,
    totalEnrolments: 9,
  };

  const enrolments = dashboardData?.enrolments || [];
  const teamPerformance = dashboardData?.teamPerformance || [];

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
              {/* Income Card */}
              <div className="metric-card">
                <div className="metric-card-icon icon--income">
                  💰
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Income</span>
                  <h3 className="metric-value">
                    {loading ? "..." : `₹${financials.income.toLocaleString()}`}
                  </h3>
                </div>
              </div>

              {/* Withdrawals Card */}
              <div className="metric-card">
                <div className="metric-card-icon icon--withdraw">
                  🧮
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Withdrawals</span>
                  <h3 className="metric-value">
                    {loading ? "..." : `₹${financials.withdrawals.toLocaleString()}`}
                  </h3>
                </div>
              </div>

              {/* Balance Card */}
              <div className="metric-card">
                <div className="metric-card-icon icon--balance">
                  👛
                </div>
                <div className="metric-card-info">
                  <span className="metric-label">Balance</span>
                  <h3 className="metric-value">
                    {loading ? "..." : `₹${financials.balance.toLocaleString()}`}
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
                                style={{ background: item.avatarBg || "#3498db" }}
                              >
                                {item.user.charAt(0)}
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
                                {item.user.charAt(0)}
                              </div>
                              <div className="user-table-meta">
                                <span className="meta-name">{item.user}</span>
                                <span className="meta-id">{item.userId}</span>
                              </div>
                            </div>
                          </td>
                          <td>{item.enrolments}</td>
                          <td className="text-right earnings-val">
                            ₹{item.earnings.toLocaleString()}
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
    </UserLayout>
  );
}

export default UserDashboard;
