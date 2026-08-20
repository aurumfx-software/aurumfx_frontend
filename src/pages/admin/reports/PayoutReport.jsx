import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getPendingPayoutsApi, payUserPayoutApi } from "../../../api/admin-payout";
import "./AdminReports.css";
import "./FundTransfer.css";

const money = (value) => `₹${Number(value || 0).toLocaleString()}`;
const getUserId = (row) => row.user_id ?? row.userId ?? row.id;
const getUserName = (row) => row.user_name ?? row.username ?? row.userName ?? "-";
const getIncome = (row, key) => Number(row[key] ?? row.income?.[key] ?? 0);
const getGrossIncome = (row) => Number(row.gross_income ?? row.grossIncome ?? getIncome(row, "referral_income") + getIncome(row, "level_income") + getIncome(row, "rank_income"));
const getAdminFee = (row) => Number(row.admin_fee ?? row.admin_fee_amount ?? row.adminFee ?? 0);
const getNetPayable = (row) => Number(row.net_payable ?? row.netPayable ?? getGrossIncome(row) - getAdminFee(row));

function PayoutReport() {
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingUserId, setPayingUserId] = useState(null);
  const [page, setPage]             = useState(1);

  const pageSize = 10;
  const loadPayouts = async () => {
    setLoading(true);
    setError("");
    const result = await getPendingPayoutsApi();
    if (result.success) {
      setRows(result.data.items);
      setTotal(result.data.total);
    } else {
      setRows([]);
      setError(result.error || "Unable to load pending payouts");
    }
    setLoading(false);
  };

  useEffect(() => { loadPayouts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadPayouts();
  };

  const handleReset = () => {
    setSearchUser("");
    loadPayouts();
    setPage(1);
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

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        {/* Page Header */}
        <div className="ft-page-header">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Payout Report</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Payout Report</span>
            </div>
          </div>
        </div>

        {/* Filter Section with Yellow Close Icon */}
        {(
          <div style={{ position: "relative" }}>
            <form className="reports-filter-bar" onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
              <input className="reports-user-select" placeholder="Search User ID" value={searchUser} onChange={e => setSearchUser(e.target.value)} />

              <button type="submit" className="reports-search-btn">Search</button>
              <button type="button" className="reports-reset-btn" onClick={handleReset}>
                Reset <FiRefreshCw size={13} />
              </button>

              <div className="reports-total-badge">
                <div className="reports-total-amount" style={{ color: "#16a34a" }}>{total}</div>
                <div className="reports-total-label">Pending Users</div>
              </div>
            </form>
          </div>
        )}

        {/* Table Card */}
        <div className="reports-table-card">
          <div className="ft-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Status</th>
                  <th>Referral Income</th>
                  <th>Level Income</th>
                  <th>Rank Income</th>
                  <th>Gross Income</th>
                  <th>Admin Fee</th>
                  <th>Net Payable</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11}>Loading pending payouts...</td></tr>
                ) : error ? (
                  <tr><td colSpan={11}>{error}</td></tr>
                ) : visibleRows.length > 0 ? (
                  visibleRows.map((row, index) => (
                    <tr key={getUserId(row)}>
                      <td>{(page - 1) * pageSize + index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{getUserId(row)}</td>
                      <td>{getUserName(row)}</td>
                      <td>
                        <span style={{ color: "#475569", fontWeight: 500 }}>
                          Pending
                        </span>
                      </td>
                      <td>{money(getIncome(row, "referral_income"))}</td>
                      <td>{money(getIncome(row, "level_income"))}</td>
                      <td>{money(getIncome(row, "rank_income"))}</td>
                      <td>{money(getGrossIncome(row))}</td>
                      <td>{money(getAdminFee(row))}</td>
                      <td>{money(getNetPayable(row))}</td>
                      <td>
                        <button type="button" className="reports-search-btn" disabled={payingUserId === getUserId(row)} onClick={() => handlePayUser(getUserId(row))}>
                          {payingUserId === getUserId(row) ? "Paying..." : "Pay User"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="reports-empty-cell">No pending payout records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="reports-pagination">
            <button className="reports-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={`reports-page-btn ${page === idx + 1 ? "reports-page-btn--active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button className="reports-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PayoutReport;
