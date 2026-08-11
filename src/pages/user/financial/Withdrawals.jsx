import { useState } from "react";
import { FiInfo, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserLayout from "../../../components/User/UserLayout";
import "./Withdrawals.css";

function Withdrawals() {
  const [availableBalance] = useState(0);
  const [withdrawalHistory] = useState([]);

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="withdrawals-page">
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
          <h1 className="page-title">Withdrawal history</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Withdrawal history</span>
          </div>
        </div>

        {/* Blue Bank Details Info Alert Banner */}
        <div className="bank-info-banner">
          <div className="bank-info-left">
            <div className="bank-info-icon-badge">
              <FiInfo />
            </div>
            <span>
              Please update your bank details{" "}
              <Link to="/user/profile" className="bank-link">
                here here
              </Link>{" "}
              .
            </span>
          </div>
        </div>

        {/* Available Balance Card */}
        <div className="balance-badge-card">
          <div className="balance-badge-info">
            <span className="balance-badge-label">Available Balance</span>
            <h3 className="balance-badge-val">₹{availableBalance.toLocaleString()}</h3>
          </div>
          <div className="balance-badge-icon">
            <FiBriefcase />
          </div>
        </div>

        {/* Withdrawal History Table Card */}
        <div className="withdrawals-table-card">
          <div className="table-responsive">
            <table className="withdrawals-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Amount</th>
                  <th>Payout Method</th>
                  <th>Payout Information</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              {withdrawalHistory.length > 0 && (
                <tbody>
                  {withdrawalHistory.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{idx + 1}</td>
                      <td className="amount-cell">₹{item.amount?.toLocaleString()}</td>
                      <td>{item.payoutMethod}</td>
                      <td>{item.payoutInfo}</td>
                      <td>
                        <span className={`status-badge status--${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State Illustration matching screenshot */}
          {withdrawalHistory.length === 0 && (
            <div className="withdrawals-empty-state">
              <div className="empty-illustration">
                <svg
                  width="150"
                  height="125"
                  viewBox="0 0 150 125"
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
              <p className="empty-text">No Data Available</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default Withdrawals;
