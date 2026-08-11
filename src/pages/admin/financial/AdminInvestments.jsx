import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiCalendar, FiChevronDown, FiFolder } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminInvestments.css";

const initialHistoryData = [
  {
    no: 1,
    name: "SANOOP E S",
    username: "FX128",
    avatarText: "S",
    avatarBg: "#8b5cf6",
    enrollerName: "FX011",
    details: {
      amount: 100000,
      monthlyReturn: 14000,
      lots: 20,
      duration: 10,
    },
    transactionId: "621557554080",
    investmentStatus: "Active",
    periodsInvested: 0,
    totalMonthlyReturn: 0,
    status: "Approved",
    date: "03 Aug 2026",
  },
  {
    no: 2,
    name: "Lalitha A",
    username: "FX247",
    avatarText: "L",
    avatarBg: "#f59e0b",
    enrollerName: "FX245",
    details: {
      amount: 10000,
      monthlyReturn: 1400,
      lots: 2,
      duration: 10,
    },
    transactionId: "621578943771",
    investmentStatus: "Active",
    periodsInvested: 0,
    totalMonthlyReturn: 0,
    status: "Approved",
    date: "03 Aug 2026",
  },
];

function AdminInvestments() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state matches path pattern
  const activeTab = location.pathname.includes("/history") ? "history" : "requests";

  const [requests] = useState([]);
  const [history] = useState(initialHistoryData);

  // Filters for History Tab
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <AdminLayout>
      <div className="admin-investments-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Investments</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Investments</span>
          </div>
        </div>

        {/* Card Content Wrapper */}
        <div className="investments-content-card">
          {/* Tab Headers */}
          <div className="investments-tabs-header">
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "requests" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/request")}
            >
              Investment Request
            </button>
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "history" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/history")}
            >
              Investment History
            </button>
          </div>

          {/* Tab Panel Content */}
          <div className="investments-tab-content">
            {activeTab === "requests" ? (
              <div className="requests-panel">
                <div className="table-overflow-box">
                  <table className="admin-investments-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Username</th>
                        <th>Enroller Name</th>
                        <th>Invest Amount</th>
                        <th>Bank Transaction ID</th>
                        <th>Monthly Return</th>
                        <th>Return Duration</th>
                        <th>Total Monthly Return</th>
                        <th>Payment Proof</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{req.username}</td>
                          <td>{req.enrollerName}</td>
                          <td>₹{req.investAmount}</td>
                          <td>{req.bankTransactionId}</td>
                          <td>₹{req.monthlyReturn}</td>
                          <td>{req.returnDuration}</td>
                          <td>₹{req.totalMonthlyReturn}</td>
                          <td>
                            <button type="button" className="view-doc-btn">
                              <FiEye />
                            </button>
                          </td>
                          <td>{req.status}</td>
                          <td>{req.date}</td>
                          <td>
                            <button type="button" className="action-confirm-btn">
                              Confirm
                            </button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan="12" style={{ padding: 0 }}>
                            <div className="docs-empty-state">
                              <div className="empty-magnifier-box">
                                <div className="magnifier-art">
                                  <FiFolder className="folder-back-art" />
                                  <div className="glass-lens-art">
                                    <span className="glass-quest">?</span>
                                  </div>
                                </div>
                              </div>
                              <h4 className="empty-state-label">No Data Available</h4>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination styling matching screenshot 1 */}
                <div className="investments-pagination-wrap">
                  <button type="button" className="pager-arrow" disabled>
                    &lt;
                  </button>
                  <button type="button" className="pager-number pager-number--active">
                    1
                  </button>
                  <button type="button" className="pager-arrow" disabled>
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              /* History Tab Panel with Filters and data table */
              <div className="history-panel">
                <form className="history-filter-row" onSubmit={(e) => e.preventDefault()}>
                  {/* Pick Start Date */}
                  <div className="filter-field-wrap">
                    <span className="floating-top-label">Pick Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="filter-input-field"
                    />
                    <FiCalendar className="field-right-icon" />
                  </div>

                  {/* Pick End Date */}
                  <div className="filter-field-wrap">
                    <span className="floating-top-label">Pick End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="filter-input-field"
                    />
                    <FiCalendar className="field-right-icon" />
                  </div>

                  {/* User selector */}
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={usernameFilter}
                      onChange={(e) => setUsernameFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">User</option>
                      <option value="FX128">FX128</option>
                      <option value="FX247">FX247</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>

                  {/* Status selector */}
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>

                  {/* Get Report Button */}
                  <button type="button" className="yellow-get-btn">
                    Get Report
                  </button>
                </form>

                <div className="table-overflow-box" style={{ marginTop: "24px" }}>
                  <table className="admin-investments-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>User</th>
                        <th>Enroller Name</th>
                        <th>Investment Details</th>
                        <th>Bank Transaction ID</th>
                        <th>Investment Status</th>
                        <th>Periods Invested</th>
                        <th>Total Monthly Return</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((hist) => (
                        <tr key={hist.no}>
                          <td>{hist.no}</td>
                          {/* User Avatar Circle and Details */}
                          <td>
                            <div className="invest-user-cell">
                              <div className="invest-user-avatar" style={{ background: hist.avatarBg }}>
                                {hist.avatarText}
                              </div>
                              <div className="invest-user-meta">
                                <span className="invest-user-fullname">{hist.name}</span>
                                <span className="invest-user-idsub">{hist.username}</span>
                              </div>
                            </div>
                          </td>
                          <td>{hist.enrollerName}</td>
                          {/* Investment Details List block */}
                          <td>
                            <div className="invest-details-block">
                              <div><strong>Invest Amount:</strong> ₹{hist.details.amount}</div>
                              <div><strong>Monthly Return:</strong> ₹{hist.details.monthlyReturn}</div>
                              <div><strong>Lots:</strong> {hist.details.lots}</div>
                              <div><strong>Duration:</strong> {hist.details.duration}</div>
                            </div>
                          </td>
                          {/* Transaction ID copy/view */}
                          <td>
                            <div className="tx-id-row">
                              <span>{hist.transactionId}</span>
                              <button type="button" className="tx-eye-btn" title="View Proof">
                                <FiEye />
                              </button>
                            </div>
                          </td>
                          {/* Investment Status: Active (Green) */}
                          <td>
                            <span className="invest-status-green">{hist.investmentStatus}</span>
                          </td>
                          <td>{hist.periodsInvested}</td>
                          <td>₹{hist.totalMonthlyReturn}</td>
                          {/* Status: Approved (Green) */}
                          <td>
                            <span className="invest-status-green">{hist.status}</span>
                          </td>
                          <td>{hist.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminInvestments;
