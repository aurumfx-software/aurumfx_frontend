import { useState } from "react";
import {
  FiCalendar,
  FiLogOut,
  FiLogIn,
  FiCreditCard,
  FiAward,
  FiDollarSign,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import "./AdminEWallet.css";

function AdminEWallet() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [amountType, setAmountType] = useState("All");

  const [walletStats] = useState({
    balance: 0,
    transferOut: 0,
    transferIn: 0,
    totalPayout: 0,
    bonus: 0,
  });

  const [transactions] = useState([]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <DashboardLayout>
      <div className="admin-ewallet-page">
        {/* Page Header & Breadcrumb */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">E-wallet</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">E-wallet</span>
          </div>
        </div>

        {/* 5 Stat Cards Row */}
        <div className="admin-ewallet-stats-grid">
          {/* 1. Balance Card */}
          <div className="ewallet-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Balance</span>
              <h3 className="stat-val">₹{walletStats.balance.toLocaleString()}</h3>
            </div>
            <div className="stat-icon-box icon-pink">
              <FiDollarSign />
            </div>
          </div>

          {/* 2. Transfer Out Card */}
          <div className="ewallet-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Transfer Out</span>
              <h3 className="stat-val">₹{walletStats.transferOut.toLocaleString()}</h3>
            </div>
            <div className="stat-icon-box icon-blue">
              <FiLogOut />
            </div>
          </div>

          {/* 3. Transfer In Card */}
          <div className="ewallet-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Transfer in</span>
              <h3 className="stat-val">₹{walletStats.transferIn.toLocaleString()}</h3>
            </div>
            <div className="stat-icon-box icon-green">
              <FiLogIn />
            </div>
          </div>

          {/* 4. Total Payout Card */}
          <div className="ewallet-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Total Payout</span>
              <h3 className="stat-val">₹{walletStats.totalPayout.toLocaleString()}</h3>
            </div>
            <div className="stat-icon-box icon-purple">
              <FiCreditCard />
            </div>
          </div>

          {/* 5. Bonus Card */}
          <div className="ewallet-stat-card">
            <div className="stat-meta">
              <span className="stat-lbl">Bonus</span>
              <h3 className="stat-val">₹{walletStats.bonus.toLocaleString()}</h3>
            </div>
            <div className="stat-icon-box icon-gold">
              <FiAward />
            </div>
          </div>
        </div>

        {/* History Filters Card */}
        <div className="admin-ewallet-card">
          <h3 className="card-section-title">History</h3>

          <form onSubmit={handleFilterSubmit} className="history-filter-row">
            {/* Pick Start Date */}
            <div className="filter-field-wrap">
              <input
                type="text"
                placeholder="Pick Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>

            {/* Pick End Date */}
            <div className="filter-field-wrap">
              <input
                type="text"
                placeholder="Pick End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>

            {/* Search User */}
            <div className="filter-field-wrap">
              <input
                type="text"
                placeholder="Search User"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="filter-input-field"
              />
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
                <option value="Bonus">Bonus</option>
                <option value="Transfer In">Transfer In</option>
                <option value="Transfer Out">Transfer Out</option>
                <option value="Payout">Payout</option>
              </select>
            </div>

            {/* Yellow Get Button */}
            <button type="submit" className="yellow-get-btn">
              Get
            </button>
          </form>
        </div>

        {/* Transactions Table & Oops Empty State */}
        <div className="admin-ewallet-card table-card-wrap">
          <div className="table-overflow-box">
            <table className="admin-ewallet-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>From User</th>
                  <th>Amount Type</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              {transactions.length > 0 && (
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={tx.id || idx}>
                      <td>{idx + 1}</td>
                      <td className="fw-bold">{tx.fromUser}</td>
                      <td>{tx.amountType}</td>
                      <td>{tx.paymentType}</td>
                      <td className="fw-bold">₹{tx.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`status-pill pill-${tx.status?.toLowerCase()}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Oops Empty State Box matching user screenshot */}
          {transactions.length === 0 && (
            <div className="oops-empty-container">
              <div className="oops-icon-circle">
                <FiInfo className="oops-icon" />
              </div>
              <h2 className="oops-title">Oops !!!</h2>
              <p className="oops-desc">Something went wrong. Please try again later</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminEWallet;
