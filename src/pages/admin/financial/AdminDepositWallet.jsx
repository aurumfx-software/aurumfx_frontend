import { useState } from "react";
import { FiCalendar, FiChevronDown, FiFolder } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminDepositWallet.css";

function AdminDepositWallet() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [amountType, setAmountType] = useState("All");

  const [records] = useState([]);

  // Stats matching screenshot: Balance: ₹0, Expense: ₹0, Total Credits: ₹0
  const [stats] = useState({
    balance: 0,
    expense: 0,
    totalCredits: 0,
  });

  const handleGetReport = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="admin-deposit-wallet-page">
        {/* Page Breadcrumbs */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Deposit Wallet</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Deposit Wallet</span>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="deposit-stats-grid">
          {/* Balance Card */}
          <div className="deposit-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Balance</span>
              <h3 className="stat-val">₹{stats.balance}</h3>
            </div>
            <div className="stat-circle bg-light-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <circle cx="16" cy="16" r="6" />
                <line x1="8" y1="5" x2="8" y2="11" />
                <line x1="16" y1="13" x2="16" y2="19" />
              </svg>
            </div>
          </div>

          {/* Expense Card */}
          <div className="deposit-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Expense</span>
              <h3 className="stat-val">₹{stats.expense}</h3>
            </div>
            <div className="stat-circle bg-light-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <circle cx="16" cy="16" r="6" />
                <line x1="8" y1="5" x2="8" y2="11" />
                <line x1="16" y1="13" x2="16" y2="19" />
              </svg>
            </div>
          </div>

          {/* Total Credits Card */}
          <div className="deposit-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Total Credits</span>
              <h3 className="stat-val">₹{stats.totalCredits}</h3>
            </div>
            <div className="stat-circle bg-light-red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <circle cx="16" cy="16" r="6" />
                <line x1="8" y1="5" x2="8" y2="11" />
                <line x1="16" y1="13" x2="16" y2="19" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter and Table Card */}
        <div className="list-page-card">
          <form onSubmit={handleGetReport} className="history-filter-row">
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

            {/* Username selector */}
            <div className="filter-field-wrap select-field-wrap">
              <select
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Username</option>
                <option value="FX245">FX245</option>
                <option value="FX001">FX001</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Amount Type Select */}
            <div className="filter-field-wrap select-field-wrap">
              <span className="floating-top-label">Amount Type</span>
              <select
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
                className="filter-select-field"
              >
                <option value="All">All</option>
                <option value="Club Bonus">Club Bonus</option>
                <option value="Enrolment Bonus">Enrolment Bonus</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Get Report Button positioned below in toolbar */}
            <button type="submit" className="yellow-get-btn">
              Get Report
            </button>
          </form>

          {/* Table Container */}
          <div className="table-overflow-box" style={{ marginTop: "10px" }}>
            <table className="admin-deposit-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>From User</th>
                  <th>Payment Amount</th>
                  <th>Payment Type</th>
                  <th>Amount Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              {records.length > 0 && (
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className="username-cell">{r.username}</td>
                      <td>{r.fromUser}</td>
                      <td>₹{r.paymentAmount}</td>
                      <td>{r.paymentType}</td>
                      <td>{r.amountType}</td>
                      <td>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Precise Empty State Magnifier Box */}
          {records.length === 0 && (
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDepositWallet;
