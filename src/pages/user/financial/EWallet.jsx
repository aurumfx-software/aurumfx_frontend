import { useState, useEffect } from "react";
import {
  FiInfo,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  getWalletSummaryApi,
  getCommissionHistoryApi,
  getCommissionDetailsApi,
} from "../../../api/wallet";
import "./EWallet.css";

function EWallet() {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setSummaryLoading(true);
      const res = await getWalletSummaryApi();
      if (res.success) setSummary(res.data);
      setSummaryLoading(false);

      setTxLoading(true);
      const txRes = await getCommissionHistoryApi();
      if (txRes.success) {
        setTransactions(txRes.data || []);
      } else {
        setTxError(txRes.error || "Unable to load history");
      }
      setTxLoading(false);
    };
    load();
  }, []);

  const handleRowClick = async (id) => {
    if (id === undefined || id === null) return;
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const res = await getCommissionDetailsApi(id);
    if (res.success) setDetailData(res.data);
    setDetailLoading(false);
  };

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

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page">
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>
            , to go back admin account.
          </span>
        </div>

        <div className="page-header">
          <h1 className="page-title">My Wallet</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">My Wallet</span>
          </div>
        </div>

        {/* Hero balance card */}
        <div className="balance-hero">
          <div className="balance-hero-left">
            <span className="balance-hero-label">
              <FiDollarSign /> Available Balance
            </span>
            <div className="balance-hero-value">
              {summaryLoading ? "—" : money(summary?.available_balance)}
            </div>
            <span className="balance-hero-sub">
              Today's earning:{" "}
              <strong>
                {summaryLoading
                  ? "—"
                  : money(summary?.today_generated_commission)}
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
              <span className="metric-label">Pending Commission</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.pending_commission)}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon icon--paid">
              <FiCheckCircle />
            </div>
            <div className="metric-body">
              <span className="metric-label">Paid Commission</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.paid_commission)}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon icon--gross">
              <FiTrendingUp />
            </div>
            <div className="metric-body">
              <span className="metric-label">Gross Commission</span>
              <span className="metric-value">
                {summaryLoading ? "—" : money(summary?.gross_commission)}
              </span>
              <span className="metric-footnote">
                Admin fee: {summaryLoading ? "—" : money(summary?.admin_fee)}
              </span>
            </div>
          </div>
        </div>

        {/* Commission history */}
        <div className="ewallet-table-card">
          <h2 className="section-title">Commission History</h2>
          <div className="table-responsive">
            <table className="ewallet-table ewallet-table--clean">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Investment</th>
                  <th>Commission</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {txLoading ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Loading...
                    </td>
                  </tr>
                ) : txError ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      {txError}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No commission records found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => {
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
                        onClick={() => handleRowClick(tx.id)}
                        className={tx.id !== undefined ? "row--clickable" : ""}
                      >
                        <td className="investor-cell">
                          <span className="investor-name">
                            {tx.investor_name ?? "-"}
                          </span>
                          <span className="investor-id">
                            {tx.investor_id ?? ""}
                          </span>
                        </td>
                        <td className="cell-amount">
                          {money(tx.investment_amount)}
                        </td>
                        <td className="cell-gross">
                          {money(tx.gross_commission)}
                        </td>
                        <td className="cell-paid">
                          {money(tx.paid_amount)}
                        </td>
                        <td>
                          <span className={`status-pill ${statusClass}`}>
                            {status || "-"}
                          </span>
                        </td>
                        <td className="date-cell">
                          {formatDate(tx.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail popup */}
        {detailOpen && (
          <div className="modal-backdrop" onClick={() => setDetailOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Commission Detail</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setDetailOpen(false)}
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading...</p>
                ) : detailData ? (
                  <div className="detail-grid">
                    <DetailRow label="Investor" value={detailData.investor_name} />
                    <DetailRow
                      label="Investment Amount"
                      value={money(detailData.investment_amount)}
                    />
                    <DetailRow
                      label="Commission %"
                      value={`${detailData.commission_percentage ?? "-"}%`}
                    />
                    <DetailRow
                      label="Gross Commission"
                      value={money(detailData.gross_commission)}
                    />
                    <DetailRow
                      label="Admin Fee"
                      value={`${money(detailData.admin_fee_amount)} (${
                        detailData.admin_fee_percentage ?? "-"
                      }%)`}
                    />
                    <DetailRow
                      label="Paid Amount"
                      value={money(detailData.paid_amount)}
                    />
                    <DetailRow label="Status" value={detailData.status} />
                    <DetailRow
                      label="Date"
                      value={formatDate(detailData.created_at)}
                    />
                  </div>
                ) : (
                  <p>Unable to load detail.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value ?? "-"}</span>
    </div>
  );
}

export default EWallet;