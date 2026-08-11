import { useState } from "react";
import { FiInfo, FiBriefcase } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./FundTransfer.css";

function FundTransfer() {
  const [walletType, setWalletType] = useState("E-Wallet");
  const [targetUser, setTargetUser] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [walletBalance] = useState(0);
  const [transfers, setTransfers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!targetUser.trim()) {
      setErrorMsg("Please select or enter a recipient User ID.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newTransfer = {
        id: Date.now(),
        toUser: targetUser.trim().toUpperCase(),
        paymentType: "Transfer Out",
        walletType: walletType,
        paymentAmount: Number(amount),
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        note: note.trim() || "-",
      };

      setTransfers([newTransfer, ...transfers]);
      setSuccessMsg(`Successfully transferred ₹${Number(amount).toLocaleString()} to ${targetUser.toUpperCase()}`);
      setTargetUser("");
      setAmount("");
      setNote("");
      setLoading(false);
    }, 800);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="fund-transfer-page">
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
          <h1 className="page-title">Fund Transfer</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Fund Transfer</span>
          </div>
        </div>

        {/* Main Content Form Card */}
        <div className="transfer-card">
          {/* E-Wallet Balance Card */}
          <div className="balance-badge-card">
            <div className="balance-badge-info">
              <span className="balance-badge-label">E-Wallet Balance</span>
              <h3 className="balance-badge-val">₹{walletBalance.toLocaleString()}</h3>
            </div>
            <div className="balance-badge-icon">
              <FiBriefcase />
            </div>
          </div>

          {/* Send Form Section */}
          <div className="send-form-section">
            <h2 className="section-title">Send Form</h2>

            <form onSubmit={handleSubmit} className="send-form">
              {/* Row 1: Wallet Type & Search User */}
              <div className="form-row-2">
                <div className="form-group">
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="form-select"
                  >
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Bonus Wallet">Bonus Wallet</option>
                  </select>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Search User"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Row 2: Amount */}
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                  min="1"
                />
              </div>

              {/* Row 3: Note */}
              <div className="form-group">
                <textarea
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {/* Status Notifications */}
              {errorMsg && <p className="form-error-msg">{errorMsg}</p>}
              {successMsg && <p className="form-success-msg">{successMsg}</p>}

              {/* Send Button */}
              <button type="submit" className="send-submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>

        {/* Transfer History Table Card */}
        <div className="transfer-table-card">
          <div className="table-responsive">
            <table className="transfer-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>To Users</th>
                  <th>Payment Type</th>
                  <th>Wallet Type</th>
                  <th>Payment Amount</th>
                  <th>Date</th>
                  <th>Note</th>
                </tr>
              </thead>
              {transfers.length > 0 && (
                <tbody>
                  {transfers.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td className="user-cell">{item.toUser}</td>
                      <td>{item.paymentType}</td>
                      <td>{item.walletType}</td>
                      <td className="amount-cell">₹{item.paymentAmount?.toLocaleString()}</td>
                      <td>{item.date}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State Illustration */}
          {transfers.length === 0 && (
            <div className="transfer-empty-state">
              <div className="empty-illustration">
                <svg
                  width="140"
                  height="110"
                  viewBox="0 0 140 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="20" y="15" width="100" height="70" rx="10" fill="#F1F5F9" />
                  <path
                    d="M35 35H105"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M35 48H90"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M35 61H70"
                    stroke="#CBD5E1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  {/* Empty Box/Search Graphic */}
                  <circle
                    cx="85"
                    cy="65"
                    r="20"
                    fill="white"
                    stroke="#94A3B8"
                    strokeWidth="3"
                  />
                  <path
                    d="M98 78L112 92"
                    stroke="#64748B"
                    strokeWidth="5"
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

export default FundTransfer;
