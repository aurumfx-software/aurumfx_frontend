import { useState, useEffect } from "react";
import { FiInfo, FiDollarSign, FiCalendar, FiX } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  getWalletSummaryApi,
  getCommissionHistoryApi,
  getTodayCommissionApi,
  getCommissionDetailsApi,
} from "../../../api/wallet";
import "./EWallet.css";

function EWallet() {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);

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

      setTodayLoading(true);
      const todayRes = await getTodayCommissionApi();
      if (todayRes.success) setToday(todayRes.data);
      setTodayLoading(false);

      setTxLoading(true);
      const txRes = await getCommissionHistoryApi();
      if (txRes.success) {
        setTransactions(txRes.data);
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

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page">
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">Click Here</a>, to go back admin account.
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

        {/* 2 cards: Wallet Summary + Today Commission */}
        <div className="ewallet-stats-grid">
          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Wallet Summary</span>
              <h3 className="stat-card-value">
                {summaryLoading
                  ? "Loading..."
                  : summary
                  ? JSON.stringify(summary)
                  : "No data"}
              </h3>
            </div>
            <div className="stat-card-icon icon--balance">
              <FiDollarSign />
            </div>
          </div>

          <div className="ewallet-stat-card">
            <div className="stat-card-left">
              <span className="stat-card-label">Today's Commission</span>
              <h3 className="stat-card-value">
                {todayLoading
                  ? "Loading..."
                  : today
                  ? JSON.stringify(today)
                  : "No data"}
              </h3>
            </div>
            <div className="stat-card-icon icon--today">
              <FiCalendar />
            </div>
          </div>
        </div>

        {/* Commission history — click any row to see detail */}
        <div className="ewallet-table-card">
          <h2 className="section-title">Commission History</h2>
          <div className="table-responsive">
            <table className="ewallet-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Raw Data</th>
                </tr>
              </thead>
              <tbody>
                {txLoading ? (
                  <tr><td colSpan="2">Loading...</td></tr>
                ) : txError ? (
                  <tr><td colSpan="2">{txError}</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="2">No commission records found.</td></tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleRowClick(tx.id)}
                      style={{ cursor: tx.id !== undefined ? "pointer" : "default" }}
                    >
                      <td>{idx + 1}</td>
                      <td>{JSON.stringify(tx)}</td>
                    </tr>
                  ))
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
                <button className="modal-close-btn" onClick={() => setDetailOpen(false)}>
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading...</p>
                ) : detailData ? (
                  <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
                    {JSON.stringify(detailData, null, 2)}
                  </pre>
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

export default EWallet;