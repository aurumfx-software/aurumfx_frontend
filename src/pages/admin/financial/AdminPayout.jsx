import { useEffect, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getPendingPayoutsApi,
  getPaidPayoutsApi,
  getPayoutHistoryApi,
  payUserPayoutApi,
  rejectUserPayoutApi,
} from "../../../api/admin-payout";
import "../reports/AdminReports.css";
import "../reports/FundTransfer.css";
import "./AdminPayout.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const getUserId = (row) => row.user_id ?? row.userId ?? row.id;
const getUserCode = (row) => row.user_code ?? row.userCode ?? "";
const getUserName = (row) => row.user_name ?? row.username ?? row.userName ?? "-";
const getIncome = (row, key) => Number(row[key] ?? row.income?.[key] ?? 0);
const getGrossIncome = (row) => Number(row.gross_income ?? row.grossIncome ?? getIncome(row, "referral_income") + getIncome(row, "level_income") + getIncome(row, "rank_income"));
const getAdminFee = (row) => Number(row.admin_fee ?? row.admin_fee_amount ?? row.adminFee ?? 0);
const getNetPayable = (row) => Number(row.net_payable ?? row.netPayable ?? getGrossIncome(row) - getAdminFee(row));
const getBankDetails = (row) => row.bank_details || row.bankDetails || {};
const formatDate = (value) => value ? new Date(value).toLocaleString() : "-";

function AdminPayout() {
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingUserId, setPayingUserId] = useState(null);
  const [rejectingUserId, setRejectingUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const pageSize = 10;

  const loadPayouts = async () => {
    setLoading(true);
    setError("");
    const result = activeTab === "pending"
      ? await getPendingPayoutsApi()
      : activeTab === "paid"
        ? await getPaidPayoutsApi()
        : await getPayoutHistoryApi();
    if (result.success) {
      setRows(result.data.items);
      setTotal(result.data.total);
    } else {
      setRows([]);
      setError(result.error || "Unable to load payouts");
    }
    setLoading(false);
  };

  useEffect(() => { loadPayouts(); }, [activeTab]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadPayouts();
  };

  const handleReset = () => {
    setSearchUser("");
    setPage(1);
    loadPayouts();
  };

  const handlePayUser = async (userId) => {
    if (!window.confirm("Pay all pending income for this user?")) return;
    setPayingUserId(userId);
    const result = await payUserPayoutApi(userId);
    if (result.success) await loadPayouts();
    else setError(result.error || "Unable to pay user");
    setPayingUserId(null);
  };

  const handleRejectUser = (userId) => {
    setRejectionReason("");
    setRejectingUserId(userId);
  };

  const submitReject = async () => {
    if (!rejectionReason.trim()) return;
    const userId = rejectingUserId;
    setPayingUserId(userId);
    const result = await rejectUserPayoutApi(userId, rejectionReason);
    if (result.success) {
      setRejectingUserId(null);
      setRejectionReason("");
      await loadPayouts();
    } else {
      setError(result.error || "Unable to reject payout");
    }
    setPayingUserId(null);
  };

  const searchTerm = searchUser.trim().toLowerCase();
  const filteredRows = searchTerm
    ? rows.filter((row) => String(getUserCode(row)).toLowerCase().includes(searchTerm) || String(getUserId(row)).toLowerCase().includes(searchTerm) || getUserName(row).toLowerCase().includes(searchTerm))
    : rows;
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const columnCount = activeTab === "pending" ? 14 : activeTab === "paid" || activeTab === "history" ? 18 : 13;

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="ft-page-header">
           <div className="admin-page-header">
              <span className="admin-eyebrow">
                <span className="admin-eyebrow-dot" />
                Finance
              </span>
              <h1 className="admin-page-title">Payout</h1>
              <p className="admin-page-subtitle">Review and process pending, paid, and historical payouts</p>
              <div className="admin-breadcrumb">
                <span>Dashboard</span>
                <span className="crumb-sep">•</span>
                <span className="crumb-active">Payout</span>
              </div>
            </div>
        </div>

        <div className="investments-tabs-header" style={{ marginBottom: "20px" }}>
          {["pending", "paid", "history"].map((tab) => (
            <button key={tab} type="button" className={`investments-tab-btn ${activeTab === tab ? "investments-tab-btn--active" : ""}`} onClick={() => { setActiveTab(tab); setPage(1); }}>
              {tab === "pending" ? "Pending Payout" : tab === "paid" ? "Paid Payout" : "Payout History"}
            </button>
          ))}
        </div>

        <form className="reports-filter-bar" onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <input className="reports-user-select" placeholder="Search User ID" value={searchUser} onChange={(event) => setSearchUser(event.target.value)} />
          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          <div className="reports-total-badge"><div className="reports-total-amount" style={{ color: "#16a34a" }}>{total}</div><div className="reports-total-label">{activeTab === "pending" ? "Pending Users" : activeTab === "paid" ? "Paid Users" : "History Records"}</div></div>
        </form>

        <div className="reports-table-card"><div className="ft-table-wrapper"><table className="reports-table"><thead><tr>{activeTab === "paid" || activeTab === "history" ? <><th>No</th><th>User ID</th><th>User Name</th><th>Referral Income</th><th>Level Income</th><th>Rank Income</th><th>Total Income</th><th>Admin Fee %</th><th>Admin Fee</th><th>Net Payable</th><th>Bank Details</th><th>Bank Status</th><th>Payout Method</th><th>Payout Information</th><th>Status</th><th>Paid At</th><th>Created At</th></> : <><th>No</th><th>User ID</th><th>User Name</th><th>Investment Plan</th><th>Duration</th><th>Status</th><th>Referral Income</th><th>Level Income</th><th>Rank Income</th><th>Gross Income</th><th>Admin Fee</th><th>Net Payable</th><th>Bank Details</th>{activeTab === "pending" && <th>Action</th>}</>}</tr></thead><tbody>
          {loading ? <tr><td colSpan={columnCount}>Loading {activeTab} payouts...</td></tr> : error ? <tr><td colSpan={columnCount}>{error}</td></tr> : visibleRows.length > 0 ? visibleRows.map((row, index) => { const bankDetails = getBankDetails(row); return activeTab === "paid" || activeTab === "history" ? <tr key={row.payout_history_id || getUserId(row)}><td>{(page - 1) * pageSize + index + 1}</td><td>{row.user_code || "-"}</td><td>{row.user_name || "-"}</td><td>{money(row.referral_income)}</td><td>{money(row.level_income)}</td><td>{money(row.rank_income)}</td><td>{money(row.total_income)}</td><td>{row.admin_fee_percentage != null ? `${row.admin_fee_percentage}%` : "-"}</td><td>{money(row.admin_fee)}</td><td>{money(row.net_payable)}</td><td>{bankDetails.bank_name || "-"}<br />Account: {bankDetails.bank_account || "-"}<br />IFSC: {bankDetails.ifsc || "-"}</td><td>{bankDetails.status || "-"}</td><td>{row.payout_method || "-"}</td><td>{row.payout_information || "-"}</td><td><span className="payout-status-paid">{row.status || "-"}</span></td><td>{formatDate(row.paid_at)}</td><td>{formatDate(row.created_at)}</td></tr> : <tr key={getUserId(row)}><td>{(page - 1) * pageSize + index + 1}</td><td>{row.user_code ?? row.userCode ?? "-"}</td><td>{getUserName(row)}</td><td>{row.investment_plan || row.investmentPlan || "-"}</td><td>{row.duration_months != null ? `${row.duration_months} months` : "-"}</td><td>{activeTab === "pending" ? "Pending" : row.status || "Paid"}</td><td>{money(getIncome(row, "referral_income"))}</td><td>{money(getIncome(row, "level_income"))}</td><td>{money(getIncome(row, "rank_income"))}</td><td>{money(getGrossIncome(row))}</td><td>{money(getAdminFee(row))}</td><td>{money(getNetPayable(row))}</td><td>{bankDetails.bank_name || "-"}<br />Account: {bankDetails.bank_account || "-"}<br />IFSC: {bankDetails.ifsc || "-"}</td>{activeTab === "pending" && <td><div className="payout-action-buttons"><button type="button" className="reports-search-btn" disabled={payingUserId === getUserId(row)} onClick={() => handlePayUser(getUserId(row))}>{payingUserId === getUserId(row) ? "Paying..." : "Pay User"}</button><button type="button" className="payout-reject-btn" disabled={payingUserId === getUserId(row)} onClick={() => handleRejectUser(getUserId(row))}>Reject</button></div></td>}</tr>; }) : <tr><td colSpan={columnCount} className="reports-empty-cell">No {activeTab} payout records found.</td></tr>}
        </tbody></table></div><div className="reports-pagination"><button className="reports-page-btn" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>‹</button>{Array.from({ length: totalPages }, (_, index) => <button key={index + 1} className={`reports-page-btn ${page === index + 1 ? "reports-page-btn--active" : ""}`} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button className="reports-page-btn" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>›</button></div></div>
      </div>
      {rejectingUserId && <div className="payout-modal-backdrop" onClick={() => setRejectingUserId(null)}><div className="payout-modal-container" onClick={(event) => event.stopPropagation()}><div className="payout-modal-header"><h3>Reject Payout</h3><button type="button" className="payout-modal-close" onClick={() => setRejectingUserId(null)} aria-label="Close rejection dialog"><FiX size={18} /></button></div><div className="payout-modal-body"><label className="payout-modal-label" htmlFor="payout-rejection-reason">Rejection reason</label><textarea id="payout-rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} rows={4} className="payout-modal-input" placeholder="Enter the reason for rejecting this payout" /><div className="payout-modal-actions"><button type="button" className="payout-cancel-btn" onClick={() => setRejectingUserId(null)}>Cancel</button><button type="button" className="payout-confirm-reject-btn" onClick={submitReject} disabled={payingUserId === rejectingUserId || !rejectionReason.trim()}>{payingUserId === rejectingUserId ? "Rejecting..." : "Confirm Reject"}</button></div></div></div></div>}
    </AdminLayout>
  );
}

export default AdminPayout;
