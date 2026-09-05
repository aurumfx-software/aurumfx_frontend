import { useEffect, useState, useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { approveReturnApi, getTodayReturnsApi } from "../../../api/admin-investments";
import "./AdminInvestments.css";

const formatDate = (value) => {
  if (!value && value !== 0) return "-";

  const raw = String(value).trim();
  const match = raw.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);

  if (match) {
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = String(parsed.getFullYear());
    return `${day}-${month}-${year}`;
  }

  return raw;
};

function MonthlyReturnPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [filterUserId, setFilterUserId] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const itemUserId = String(item.user_id || "").toLowerCase();
      const matchesUser = !filterUserId || itemUserId.includes(filterUserId.toLowerCase());
      return matchesUser;
    });
  }, [rows, filterUserId]);

  const loadReturns = async (filters = {}) => {
    setLoading(true);
    setError("");
    const result = await getTodayReturnsApi();

    if (result.success) {
      setRows(result.data || []);
    } else {
      setError(result.error || "Unable to load monthly returns");
      setRows([]);
    }

    setLoading(false);
  };

  const handleReport = (event) => {
    event.preventDefault();
    loadReturns();
  };

  const handleRefresh = () => {
    setFilterUserId("");
    loadReturns();
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleApproveReturn = async (id) => {
    setApprovingId(id);
    const result = await approveReturnApi(id, "Monthly return approved.");

    if (result.success) {
      setRows((prev) => prev.filter((item) => item.id !== id));
    } else {
      setError(result.error || "Failed to approve return");
    }

    setApprovingId(null);
  };

  return (
    <AdminLayout>
      <div className="admin-investments-page">
        <div className="admin-page-header">
          <span className="admin-eyebrow">
            <span className="admin-eyebrow-dot" />
            Finance
          </span>
          <h1 className="admin-page-title">Monthly Return</h1>
          <p className="admin-page-subtitle">Review and approve returns due for today without changing the investment section.</p>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Monthly Return</span>
          </div>
        </div>

        <div className="investments-content-card monthly-return-card">
          <form className="bank-filters-card" onSubmit={handleReport}>
            <div className="filters-grid">
              <div className="filter-input-wrap">
                <input
                  type="text"
                  value={filterUserId}
                  onChange={(event) => setFilterUserId(event.target.value)}
                  className="filter-date-field"
                  aria-label="User ID"
                  placeholder="Filter by user ID"
                />
              </div>
              <button type="submit" className="yellow-report-btn">Get Report</button>
              <button type="button" className="investments-refresh-btn monthly-return-refresh" onClick={handleRefresh}>
                <FiRefreshCw size={14} /> Refresh
              </button>
            </div>
          </form>

          <div className="table-overflow-box monthly-return-table-panel">
            <table className="admin-investments-table monthly-return-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7">Loading monthly returns...</td></tr>
                ) : error ? (
                  <tr><td colSpan="7">{error}</td></tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: 0 }}>
                      <div className="docs-empty-state">
                        <h4 className="empty-state-label">No Returns Found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((item, index) => (
                    <tr key={item.id ?? `${item.user_id ?? "user"}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.user_id || "-"}</td>
                      <td>{item.user_name || "-"}</td>
                      <td>{item.plan_name || "-"}</td>
                      <td>₹{Number(item.amount || 0).toLocaleString()}</td>
                      <td>{formatDate(item.investment_date || item.date || item.created_at)}</td>
                      <td>
                        <button
                          type="button"
                          className="action-confirm-btn"
                          onClick={() => handleApproveReturn(item.id)}
                          disabled={approvingId === item.id}
                        >
                          {approvingId === item.id ? "Approving..." : "Approve Return"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default MonthlyReturnPage;
