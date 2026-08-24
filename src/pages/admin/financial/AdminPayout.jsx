import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getPendingPayoutsApi,
  getPaidPayoutsApi,
  getPayoutHistoryApi,
  payUserPayoutApi,
} from "../../../api/admin-payout";
import "../reports/AdminReports.css";
import "../reports/FundTransfer.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const getUserId = (row) => row.user_id ?? row.userId ?? row.id;
const getUserName = (row) => row.user_name ?? row.username ?? row.userName ?? "-";
const getIncome = (row, key) => Number(row[key] ?? row.income?.[key] ?? 0);
const getGrossIncome = (row) => Number(row.gross_income ?? row.grossIncome ?? getIncome(row, "referral_income") + getIncome(row, "level_income") + getIncome(row, "rank_income"));
const getAdminFee = (row) => Number(row.admin_fee ?? row.admin_fee_amount ?? row.adminFee ?? 0);
const getNetPayable = (row) => Number(row.net_payable ?? row.netPayable ?? getGrossIncome(row) - getAdminFee(row));

function AdminPayout() {
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingUserId, setPayingUserId] = useState(null);
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
        : await getPayoutHistoryApi({ user_id: searchUser });
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

  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const visibleRows = searchUser
    ? paginatedRows.filter((row) => String(getUserId(row)).toLowerCase().includes(searchUser.toLowerCase()) || getUserName(row).toLowerCase().includes(searchUser.toLowerCase()))
    : paginatedRows;
  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const columnCount = activeTab === "pending" ? 11 : 10;

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="ft-page-header">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Payout</h1>
            <div className="admin-breadcrumb"><span>Dashboard</span><span className="crumb-sep">•</span><span className="crumb-active">Payout</span></div>
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

        <div className="reports-table-card"><div className="ft-table-wrapper"><table className="reports-table"><thead><tr><th>No</th><th>User ID</th><th>User Name</th><th>Status</th><th>Referral Income</th><th>Level Income</th><th>Rank Income</th><th>Gross Income</th><th>Admin Fee</th><th>Net Payable</th>{activeTab === "pending" && <th>Action</th>}</tr></thead><tbody>
          {loading ? <tr><td colSpan={columnCount}>Loading {activeTab} payouts...</td></tr> : error ? <tr><td colSpan={columnCount}>{error}</td></tr> : visibleRows.length > 0 ? visibleRows.map((row, index) => <tr key={getUserId(row)}><td>{(page - 1) * pageSize + index + 1}</td><td>{getUserId(row)}</td><td>{getUserName(row)}</td><td>{activeTab === "pending" ? "Pending" : row.status || "Paid"}</td><td>{money(getIncome(row, "referral_income"))}</td><td>{money(getIncome(row, "level_income"))}</td><td>{money(getIncome(row, "rank_income"))}</td><td>{money(getGrossIncome(row))}</td><td>{money(getAdminFee(row))}</td><td>{money(getNetPayable(row))}</td>{activeTab === "pending" && <td><button type="button" className="reports-search-btn" disabled={payingUserId === getUserId(row)} onClick={() => handlePayUser(getUserId(row))}>{payingUserId === getUserId(row) ? "Paying..." : "Pay User"}</button></td>}</tr>) : <tr><td colSpan={columnCount} className="reports-empty-cell">No {activeTab} payout records found.</td></tr>}
        </tbody></table></div><div className="reports-pagination"><button className="reports-page-btn" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>‹</button>{Array.from({ length: totalPages }, (_, index) => <button key={index + 1} className={`reports-page-btn ${page === index + 1 ? "reports-page-btn--active" : ""}`} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button className="reports-page-btn" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>›</button></div></div>
      </div>
    </AdminLayout>
  );
}

export default AdminPayout;
