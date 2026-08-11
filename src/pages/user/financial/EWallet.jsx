import { useState } from "react";
import {
  FiInfo,
  FiCalendar,
  FiLogOut,
  FiLogIn,
  FiCreditCard,
  FiAward,
  FiDollarSign,
  FiSearch,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./EWallet.css";

function EWallet() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [amountType, setAmountType] = useState("All");

  // Stat metrics matching screenshot structure
  const [walletStats] = useState({
    balance: 0,
    transferOut: 0,
    transferIn: 0,
    totalPayout: 0,
    bonus: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const handleFilter = (e) => {
    e.preventDefault();
    // Filters transactions if needed (defaults to empty list as per screenshot design)
    setTransactions([]);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page">
        {/* Top Heads-up Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumb */}
        <div className="page-header">
          <h1 className="page-title">E-wallet</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">E-wallet</span>
          </div>
        </div>

        {/* 5 Stat Cards Row */}
        <div className="ewallet-stats-grid">
          {/* Card 1: Balance */}
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Balance</span>
              <h3 className="stat-card-value">₹{walletStats.balance.toLocaleString()}</h3>
            </div>
            <div className="stat-card-icon icon--balance">
              <FiDollarSign />
            </div>
          </div>

          {/* Card 2: Transfer Out */}
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Transfer Out</span>
              <h3 className="stat-card-value">₹{walletStats.transferOut.toLocaleString()}</h3>
            </div>
            <div className="stat-card-icon icon--transfer-out">
              <FiLogOut />
            </div>
          </div>

          {/* Card 3: Transfer In */}
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Transfer in</span>
              <h3 className="stat-card-value">₹{walletStats.transferIn.toLocaleString()}</h3>
            </div>
            <div className="stat-card-icon icon--transfer-in">
              <FiLogIn />
            </div>
          </div>

          {/* Card 4: Total Payout */}
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Total Payout</span>
              <h3 className="stat-card-value">₹{walletStats.totalPayout.toLocaleString()}</h3>
            </div>
            <div className="stat-card-icon icon--payout">
              <FiCreditCard />
            </div>
          </div>

          {/* Card 5: Bonus */}
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Bonus</span>
              <h3 className="stat-card-value">₹{walletStats.bonus.toLocaleString()}</h3>
            </div>
            <div className="stat-card-icon icon--bonus">
              <FiAward />
            </div>
          </div>
        </div>

        {/* History Filters Section */}
        <div className="ewallet-history-card">
          <h2 className="section-title">History</h2>

          <form onSubmit={handleFilter} className="history-filter-form">
            {/* Start Date */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="date"
                  placeholder="Pick Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="filter-input"
                />
                <FiCalendar className="field-icon" />
              </div>
            </div>

            {/* End Date */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="date"
                  placeholder="Pick End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="filter-input"
                />
                <FiCalendar className="field-icon" />
              </div>
            </div>

            {/* Search User */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="filter-input"
                />
                <FiSearch className="field-icon" />
              </div>
            </div>

            {/* Amount Type */}
            <div className="filter-input-group select-group">
              <label className="floating-label">Amount Type</label>
              <select
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
                className="filter-select"
              >
                <option value="All">All</option>
                <option value="Bonus">Bonus</option>
                <option value="Transfer In">Transfer In</option>
                <option value="Transfer Out">Transfer Out</option>
                <option value="Payout">Payout</option>
              </select>
            </div>

            {/* Get Button */}
            <button type="submit" className="get-filter-btn">
              Get
            </button>
          </form>
        </div>

        {/* Transactions Table & Empty State */}
        <div className="ewallet-table-card">
          <div className="table-responsive">
            <table className="ewallet-table">
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
                      <td>{tx.fromUser}</td>
                      <td>{tx.amountType}</td>
                      <td>{tx.paymentType}</td>
                      <td className="amount-cell">₹{tx.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge status--${tx.status?.toLowerCase()}`}>
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

          {/* Empty State Illustration matching screenshot */}
          {transactions.length === 0 && (
            <div className="ewallet-empty-state">
              <div className="empty-illustration">
                <svg
                  width="150"
                  height="130"
                  viewBox="0 0 150 130"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="25" y="15" width="90" height="75" rx="12" fill="#F1F5F9" />
                  <path
                    d="M40 38H95"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M40 52H80"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M40 66H65"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  {/* Magnifying Glass */}
                  <circle
                    cx="90"
                    cy="72"
                    r="24"
                    fill="white"
                    stroke="#94A3B8"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M83 72H97"
                    stroke="#94A3B8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M90 65V79"
                    stroke="#94A3B8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M107 89L122 104"
                    stroke="#64748B"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Sparkle accents */}
                  <path
                    d="M20 25L24 21"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M130 20L134 24"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default EWallet;
