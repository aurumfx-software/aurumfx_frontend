import { useState } from "react";
import { FiCalendar, FiRefreshCw, FiUpload, FiX, FiCreditCard, FiArrowUpRight } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminReports.css";
import "./FundTransfer.css";

const TABS = [
  { id: "credit", label: "Fund Credit", icon: FiCreditCard },
  { id: "debit",  label: "Fund Debit",  icon: FiArrowUpRight },
];

// Sample data — start empty to match screenshot "No Data Available"
const creditData = [];
const debitData  = [];

function FundTransfer() {
  const [activeTab,  setActiveTab]  = useState("credit");
  const [startDate,  setStartDate]  = useState("2026-08-01");
  const [endDate,    setEndDate]    = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [rows, setRows] = useState(creditData);
  const [page, setPage] = useState(1);

  const allData = activeTab === "credit" ? creditData : debitData;
  const total   = rows.reduce((s, r) => s + (r.amount || 0), 0);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setRows(id === "credit" ? creditData : debitData);
    setSearchUser("");
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const src = activeTab === "credit" ? creditData : debitData;
    setRows(searchUser ? src.filter(r => r.username?.toLowerCase().includes(searchUser.toLowerCase())) : src);
    setPage(1);
  };

  const handleReset = () => {
    setSearchUser("");
    setRows(activeTab === "credit" ? creditData : debitData);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        {/* Page Header */}
        <div className="ft-page-header">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Fund Transfer Report</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Fund Transfer Report</span>
            </div>
          </div>
          <button className="ft-export-btn">
            <FiUpload size={14} /> Export
          </button>
        </div>

        {/* White card wrapper */}
        <div className="ft-card">
          {/* Sub-tabs */}
          <div className="ft-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`ft-tab-btn ${activeTab === tab.id ? "ft-tab-btn--active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <tab.icon size={15} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Filter bar */}
          {showFilter && (
            <div className="ft-filter-section">
              <button className="ft-close-btn" onClick={() => setShowFilter(false)} title="Close filter">
                <FiX size={16} />
              </button>

              <form className="ft-filter-bar" onSubmit={handleSearch}>
                <div className="reports-date-field">
                  <span className="reports-date-label">Pick Start Date</span>
                  <div className="reports-date-row">
                    <input type="date" className="reports-date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <FiCalendar className="reports-date-icon" />
                  </div>
                </div>

                <div className="reports-date-field">
                  <span className="reports-date-label">Pick End Date</span>
                  <div className="reports-date-row">
                    <input type="date" className="reports-date-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <FiCalendar className="reports-date-icon" />
                  </div>
                </div>

                <select className="reports-user-select" value={searchUser} onChange={e => setSearchUser(e.target.value)}>
                  <option value="">Search User</option>
                  {allData.map((r, i) => <option key={i} value={r.username}>{r.username}</option>)}
                </select>

                <button type="submit" className="reports-search-btn">Search</button>
                <button type="button" className="reports-reset-btn" onClick={handleReset}>
                  Reset <FiRefreshCw size={13} />
                </button>

                <div className="reports-total-badge">
                  <div className="reports-total-amount" style={{ color: "#16a34a" }}>₹{total}</div>
                  <div className="reports-total-label">Total Amount</div>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="ft-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? rows.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{row.username}</td>
                    <td>{row.email}</td>
                    <td style={{ fontWeight: 700, color: "#16a34a" }}>₹{row.amount}</td>
                    <td>{row.paymentMethod}</td>
                    <td style={{ color: "#64748b" }}>{row.note}</td>
                    <td>{row.date}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="ft-empty-state">
                        <div className="ft-empty-icon">
                          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <ellipse cx="40" cy="58" rx="28" ry="6" fill="#f1f5f9" />
                            <circle cx="34" cy="34" r="20" fill="#e2e8f0" />
                            <circle cx="34" cy="34" r="15" fill="#f8fafc" />
                            <text x="28" y="40" fontSize="18" fill="#94a3b8" fontWeight="bold">?</text>
                            <line x1="48" y1="48" x2="62" y2="62" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="ft-empty-text">No Data Available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="reports-pagination">
            <button className="reports-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <button className="reports-page-btn reports-page-btn--active">{page}</button>
            <button className="reports-page-btn" onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default FundTransfer;
