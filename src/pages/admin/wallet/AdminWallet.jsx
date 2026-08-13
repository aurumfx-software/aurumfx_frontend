import { useState, useEffect } from "react";
import { FiCalendar, FiDollarSign, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAdminWalletSummaryApi,
  getAdminFeeHistoryApi,
  getTodayAdminFeeApi,
  getAdminFeeDetailsApi,
} from "../../../api/admin-wallet";
import "./AdminWallet.css";

function AdminWallet() {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [today, setToday] = useState([]);
  const [todayLoading, setTodayLoading] = useState(true);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError("");
    const res = await getAdminFeeHistoryApi({ start_date: startDate, end_date: endDate });
    if (res.success) setHistory(res.data);
    else setHistoryError(res.error);
    setHistoryLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      setSummaryLoading(true);
      const res = await getAdminWalletSummaryApi();
      if (res.success) setSummary(res.data);
      setSummaryLoading(false);

      setTodayLoading(true);
      const todayRes = await getTodayAdminFeeApi();
      if (todayRes.success) setToday(Array.isArray(todayRes.data) ? todayRes.data : []);
      setTodayLoading(false);

      await loadHistory();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = async (id) => {
    if (id === undefined || id === null) return;
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const res = await getAdminFeeDetailsApi(id);
    if (res.success) setDetailData(res.data);
    setDetailLoading(false);
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString()}`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "-");

  return (
    <AdminLayout>
      <div className="admin-wallet-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Admin Wallet</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Admin Wallet</span>
          </div>
        </div>

        {/* 3 summary cards */}
        <div className="admin-wallet-stats-grid">
          <div className="admin-wallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Total Admin Fee</span>
              <h3 className="stat-card-value">
                {summaryLoading ? "..." : fmt(summary?.total_admin_fee)}
              </h3>
            </div>
            <div className="stat-card-icon icon--balance"><FiDollarSign /></div>
          </div>

          <div className="admin-wallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Today's Admin Fee</span>
              <h3 className="stat-card-value">
                {summaryLoading ? "..." : fmt(summary?.today_admin_fee)}
              </h3>
            </div>
            <div className="stat-card-icon icon--today"><FiCalendar /></div>
          </div>

          <div className="admin-wallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Total Referral Commissions</span>
              <h3 className="stat-card-value">
                {summaryLoading ? "..." : fmt(summary?.total_referral_commissions)}
              </h3>
            </div>
            <div className="stat-card-icon icon--balance"><FiDollarSign /></div>
          </div>
        </div>

        {/* Today's Fee Transactions — clean table now */}
        <div className="admin-wallet-history-card">
          <h2 className="section-title">Today's Fee Transactions</h2>
          <div className="table-overflow-box">
            <table className="admin-wallet-table admin-wallet-table--clean">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Investment ID</th>
                  <th>Investor ID</th>
                  <th>Enroller ID</th>
                  <th>Investment Amount</th>
                  <th>Commission</th>
                  <th>Admin Fee</th>
                  <th>Paid Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {todayLoading ? (
                  <tr><td colSpan="10">Loading...</td></tr>
                ) : today.length === 0 ? (
                  <tr><td colSpan="10">No fee earned today.</td></tr>
                ) : (
                  today.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.id}</td>
                      <td>{item.investment_id}</td>
                      <td>{item.investor_id}</td>
                      <td>{item.enroller_id}</td>
                      <td className="amount-cell">{fmt(item.investment_amount)}</td>
                      <td>{fmt(item.commission_amount)} ({item.commission_percentage}%)</td>
                      <td>{fmt(item.admin_fee_amount)} ({item.admin_fee_percentage}%)</td>
                      <td className="amount-cell">{fmt(item.paid_amount)}</td>
                      <td>
                        <span className={`status-pill status--${(item.status || "").toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{fmtDate(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Fee History — clean table now */}
        <div className="admin-wallet-history-card">
          <h2 className="section-title">Admin Fee History</h2>

          <form
            className="history-filter-row"
            onSubmit={(e) => { e.preventDefault(); loadHistory(); }}
          >
            <div className="filter-field-wrap">
              <span className="floating-top-label">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>
            <div className="filter-field-wrap">
              <span className="floating-top-label">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>
            <button type="submit" className="yellow-get-btn">Get Report</button>
          </form>

          <div className="table-overflow-box" style={{ marginTop: "16px" }}>
            <table className="admin-wallet-table admin-wallet-table--clean">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Investment ID</th>
                  <th>Investor</th>
                  <th>Enroller</th>
                  <th>Investment Amount</th>
                  <th>Commission</th>
                  <th>Admin Fee</th>
                  <th>Paid Amount</th>
                  <th>Washout</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {historyLoading ? (
                  <tr><td colSpan="10">Loading...</td></tr>
                ) : historyError ? (
                  <tr><td colSpan="10">{historyError}</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan="10">No fee records found.</td></tr>
                ) : (
                  history.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{item.id}</td>
                      <td>{item.investment_id}</td>
                      <td>{item.investor}</td>
                      <td>{item.enroller}</td>
                      <td className="amount-cell">{fmt(item.investment_amount)}</td>
                      <td>{fmt(item.commission_amount)} ({item.commission_percentage}%)</td>
                      <td>{fmt(item.admin_fee_amount)} ({item.admin_fee_percentage}%)</td>
                      <td className="amount-cell">{fmt(item.paid_amount)}</td>
                      <td>{fmt(item.washout_amount)}</td>
                      <td>{fmtDate(item.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail popup — clean labeled fields */}
        {detailOpen && (
          <div className="modal-backdrop" onClick={() => setDetailOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Admin Fee Detail</h3>
                <button className="modal-close-btn" onClick={() => setDetailOpen(false)}>
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading...</p>
                ) : detailData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <p><strong>Investment ID:</strong> {detailData.investment_id}</p>
                    <p><strong>Investor:</strong> {detailData.investor}</p>
                    <p><strong>Enroller:</strong> {detailData.enroller}</p>
                    <p><strong>Investment Amount:</strong> {fmt(detailData.investment_amount)}</p>
                    <p><strong>Commission:</strong> {fmt(detailData.commission_amount)} ({detailData.commission_percentage}%)</p>
                    <p><strong>Admin Fee:</strong> {fmt(detailData.admin_fee_amount)} ({detailData.admin_fee_percentage}%)</p>
                    <p><strong>Paid Amount:</strong> {fmt(detailData.paid_amount)}</p>
                    <p><strong>Washout Amount:</strong> {fmt(detailData.washout_amount)}</p>
                    <p><strong>Status:</strong> {detailData.status}</p>
                    <p><strong>Created At:</strong> {fmtDate(detailData.created_at)}</p>
                  </div>
                ) : (
                  <p>Unable to load detail.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminWallet;