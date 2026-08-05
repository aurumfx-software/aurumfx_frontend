import { useState } from "react";
import { FiCalendar, FiChevronDown, FiFolder } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminFundCredits.css";

function AdminFundCredits() {
  // Form Fields
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [note, setNote] = useState("");

  // Filter Fields
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [walletType, setWalletType] = useState("");

  const [records] = useState([]);

  const handleGetReport = (e) => {
    e.preventDefault();
  };

  return (
    <AdminLayout>
      <div className="admin-fund-credits-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Fund Credits</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Fund Credits</span>
          </div>
        </div>

        {/* Top Transaction Form Card */}
        <div className="list-page-card form-card-padding">
          <form className="fund-transaction-form" onSubmit={(e) => e.preventDefault()}>
            {/* Search User Select */}
            <div className="form-input-wrap select-field-wrap">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="form-select-field"
              >
                <option value="">Search User</option>
                <option value="FX245">FX245</option>
                <option value="FX001">FX001</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Amount Field */}
            <div className="form-input-wrap">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input-field"
              />
            </div>

            {/* To Select */}
            <div className="form-input-wrap select-field-wrap">
              <select
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
                className="form-select-field"
              >
                <option value="">To</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="Deposit Wallet">Deposit Wallet</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Note Textarea */}
            <div className="form-input-wrap">
              <textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-textarea-field"
                rows="4"
              />
            </div>

            {/* Form Buttons */}
            <div className="form-actions-row">
              <button type="button" className="btn-deduct-fund">
                Deduct Fund
              </button>
              <button type="button" className="btn-add-amount">
                Add Amount
              </button>
            </div>
          </form>
        </div>

        {/* Filters & History List Card */}
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

            {/* Payment Type Select */}
            <div className="filter-field-wrap select-field-wrap">
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Payment Type</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Wallet Type Select */}
            <div className="filter-field-wrap select-field-wrap">
              <select
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Wallet Type</option>
                <option value="E-Wallet">E-Wallet</option>
                <option value="Deposit Wallet">Deposit Wallet</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Get Report Button */}
            <button type="submit" className="yellow-get-btn">
              Get Report
            </button>
          </form>

          {/* Table Container */}
          <div className="table-overflow-box" style={{ marginTop: "10px" }}>
            <table className="admin-credits-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Wallet Type</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              {records.length > 0 && (
                <tbody>
                  {records.map((r, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className="username-cell">{r.username}</td>
                      <td>₹{r.amount}</td>
                      <td>{r.paymentType}</td>
                      <td>{r.walletType}</td>
                      <td>{r.notes}</td>
                      <td>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State Illustration */}
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

export default AdminFundCredits;
