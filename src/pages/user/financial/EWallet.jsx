import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  getWalletSummaryApi,
  getWalletTransactionsApi,
} from "../../../api/wallet";
import "./EWallet.css";

function EWallet() {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setSummaryLoading(true);
      const res = await getWalletSummaryApi();
      if (res.success) setSummary(res.data);
      setSummaryLoading(false);

      setTxLoading(true);
      setTxError("");
      const txRes = await getWalletTransactionsApi();
      if (txRes.success) {
        setTransactions(txRes.data || []);
      } else {
        setTxError(txRes.error || "Unable to load history");
      }
      setTxLoading(false);
    };
    load();
  }, []);

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  const formatDate = (s) => {
    try {
      if (!s) return "-";
      const d = new Date(s);
      if (isNaN(d.getTime())) return s;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return s || "-";
    }
  };

  const handleSearch = () => {
    setActiveSearch(searchInput.trim().toLowerCase());
  };

  const handleReset = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const filteredTransactions = activeSearch
    ? transactions.filter((tx) => {
        const fromUserId = String(tx.from_user?.user_id || tx.from_user_id || tx.user_id || "").toLowerCase();
        const fromUserName = String(tx.from_user?.name || tx.from_user?.fullname || tx.user_name || "").toLowerCase();
        return fromUserId.includes(activeSearch) || fromUserName.includes(activeSearch);
      })
    : transactions;

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page">
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Earnings &amp; Payouts
          </span>

          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">
              💰
            </span>
            <div className="page-header-text">
              <h1 className="page-title">My Wallet</h1>
              <p className="page-subtitle">
                Track your balance, commissions, and payout history in one place
              </p>
            </div>
          </div>

        </div>

        {/* Balance card — flat, bordered, matches the rest of the cards */}
        <div className="balance-hero">
          <div className="balance-hero-left">
            <span className="balance-hero-label">
              <FiDollarSign /> Total Amount
            </span>
            <div className="balance-hero-value">
              {summaryLoading ? "—" : money(summary?.total_amount)}
            </div>
            <span className="balance-hero-sub">
              Amount:{" "}
              <strong>
                {summaryLoading ? "—" : money(summary?.amount)}
              </strong>
            </span>
          </div>
        </div>

        {/* Key metric cards */}
        <div className="ewallet-stats-grid">
          <div className="metric-card">
            <div className="metric-icon icon--pending">
              <FiClock />
            </div>
            <div className="metric-body">
              <span className="metric-label">Pending Balance</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.pending_balance)}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon icon--paid">
              <FiCheckCircle />
            </div>
            <div className="metric-body">
              <span className="metric-label">Amount</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.amount)}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon icon--gross">
              <FiTrendingUp />
            </div>
            <div className="metric-body">
              <span className="metric-label">Admin Fee</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.admin_fee)}
              </span>
            </div>
          </div>
        </div>

        <div className="ewallet-search-bar">
          <div className="ewallet-search-input-wrap">
            <FiSearch size={14} className="ewallet-search-icon" />
            <input
              type="text"
              className="ewallet-search-input"
              placeholder="Search by User ID or Name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <button type="button" className="ewallet-search-btn" onClick={handleSearch}>
            Search User
          </button>
          <button
            type="button"
            className="ewallet-search-reset"
            onClick={handleReset}
            disabled={!activeSearch && !searchInput}
          >
            <FiRefreshCw size={13} />
            Reset
          </button>
        </div>

        {/* Wallet transaction history */}
        <div className="ewallet-table-card">
          <h2 className="section-title">Transaction History</h2>
          <div className="table-responsive">
            <table className="ewallet-table ewallet-table--clean">
              <colgroup>
                <col /><col /><col /><col /><col /><col /><col />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From User (Name / ID)</th>
                  <th>Transaction Type</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {txLoading ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      Loading...
                    </td>
                  </tr>
                ) : txError ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      {txError}
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      {activeSearch
                        ? `No users found for “${searchInput.trim()}”.`
                        : "No wallet transactions found."}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, idx) => {
                    const status = (tx.status || "").toString();
                    const statusClass =
                      status.toUpperCase() === "PENDING"
                        ? "status--pending"
                        : status.toUpperCase() === "PAID" ||
                          status.toUpperCase() === "COMPLETED"
                        ? "status--paid"
                        : "";
                    return (
                      <tr
                        key={tx.id ?? idx}
                        className="transaction-row"
                      >
                        <td data-label="ID">{tx.id ?? "-"}</td>
                        <td className="investor-cell" data-label="From User">
                          <span className="investor-name">
                            Name: {tx.from_user?.name || tx.from_user?.fullname || tx.from_user?.full_name || tx.from_user_name || "-"}
                          </span>
                          <span className="investor-id">
                            ID: {tx.from_user?.user_id || tx.from_user?.id || tx.from_user_id || "-"}
                          </span>
                        </td>
                        <td data-label="Transaction Type">{tx.transaction_type || "-"}</td>
                        <td data-label="Payment Type">{tx.payment_type || "-"}</td>
                        <td className="cell-amount" data-label="Amount">{money(tx.amount)}</td>
                        <td data-label="Status">
                          <span className={`status-pill ${statusClass}`}>
                            {status || "-"}
                          </span>
                        </td>
                        <td className="date-cell" data-label="Date">
                          {formatDate(tx.date || tx.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default EWallet;