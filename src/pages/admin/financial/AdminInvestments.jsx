import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiChevronDown, FiFolder, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getPendingInvestmentsApi,
  getAllAdminInvestmentsApi,
  getActiveInvestmentsApi,
  getTodayReturnsApi,
  approveRejectInvestmentApi,
  approveReturnApi,
  getAdminInvestmentDetailsApi,
} from "../../../api/admin-investments";
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

function AdminInvestments() {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;
  const activeTab = path.includes("/active")
    ? "active"
    : path.includes("/today")
    ? "today"
    : path.includes("/history")
    ? "history"
    : "requests";

  const [requests, setRequests] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [todayList, setTodayList] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [confirmingId, setConfirmingId] = useState(null);
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvingReturnId, setApprovingReturnId] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [returnModalId, setReturnModalId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const sortByApprovedDate = (items = [], newestFirst = true) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.approval_status_updated_at || a.investment_date || a.date || a.created_at || 0).getTime();
      const dateB = new Date(b.approval_status_updated_at || b.investment_date || b.date || b.created_at || 0).getTime();
      return newestFirst ? dateB - dateA : dateA - dateB;
    });
  };

  const filterInvestments = (items, filterValues = {}) => {
    const activeUserFilter = filterValues.usernameFilter ?? usernameFilter;
    const activeStartDate = filterValues.startDate ?? startDate;
    const activeEndDate = filterValues.endDate ?? endDate;
    const userSearch = activeUserFilter.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const itemUserId = String(item.user_id ?? item.userId ?? "").toLowerCase();
      const itemDate = String(
        item.investment_date ?? item.approval_status_updated_at ?? item.date ?? item.created_at ?? ""
      ).slice(0, 10);
      const matchesUser = !userSearch || itemUserId.includes(userSearch);
      const matchesStartDate = !activeStartDate || itemDate >= activeStartDate;
      const matchesEndDate = !activeEndDate || itemDate <= activeEndDate;
      return matchesUser && matchesStartDate && matchesEndDate;
    });

    if (activeTab === "requests") {
      return sortByApprovedDate(filtered, true);
    }

    if (activeTab === "history") {
      return sortByApprovedDate(filtered, true);
    }

    return filtered;
  };

  const loadTabData = async (filterValues = {}) => {
    setLoading(true);
    setErrorMsg("");
    const activeStartDate = filterValues.startDate ?? startDate;
    const activeEndDate = filterValues.endDate ?? endDate;
    const activeUserFilter = filterValues.usernameFilter ?? usernameFilter;
    const activeStatusFilter = filterValues.statusFilter ?? statusFilter;

    if (activeTab === "requests") {
      const res = await getPendingInvestmentsApi({
        user_id: activeUserFilter || undefined,
        start_date: activeStartDate || undefined,
        end_date: activeEndDate || undefined,
      });
      if (res.success) setRequests(filterInvestments(res.data, filterValues));
      else setErrorMsg(res.error);
    } else if (activeTab === "active") {
      const res = await getActiveInvestmentsApi({
        user_id: activeUserFilter || undefined,
        status: activeStatusFilter || undefined,
        start_date: activeStartDate || undefined,
        end_date: activeEndDate || undefined,
      });
      if (res.success) setActiveList(filterInvestments(res.data, filterValues));
      else setErrorMsg(res.error);
    } else if (activeTab === "today") {
      const res = await getTodayReturnsApi();
      if (res.success) setTodayList(filterInvestments(res.data, filterValues));
      else setErrorMsg(res.error);
    } else {
      const res = await getAllAdminInvestmentsApi({
        user_id: activeUserFilter || undefined,
        start_date: activeStartDate || undefined,
        end_date: activeEndDate || undefined,
      });
      if (res.success) setHistory(filterInvestments(res.data, filterValues));
      else setErrorMsg(res.error);
    }

    setLoading(false);
  };

  const handleRefresh = () => {
    const clearedFilters = { startDate: "", endDate: "", usernameFilter: "", statusFilter: "" };
    setStartDate("");
    setEndDate("");
    setUsernameFilter("");
    setStatusFilter("");
    loadTabData(clearedFilters);
  };

  useEffect(() => {
    loadTabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleConfirm = async (id) => {
    setConfirmingId(id);
    const res = await approveRejectInvestmentApi(id, "Approved");
    if (res.success) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSuccessMsg("Investment confirmed successfully");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      alert(res.error || "Failed to approve investment");
    }
    setConfirmingId(null);
  };

  const handleReject = async (id) => {
    setRejectionReason("");
    setRejectModalId(id);
  };

  const submitReject = async () => {
    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) return;
    const id = rejectModalId;
    setConfirmingId(id);
    const res = await approveRejectInvestmentApi(id, "Rejected", trimmedReason);
    if (res.success) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setRejectModalId(null);
      setRejectionReason("");
      setSuccessMsg("Investment rejected successfully");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      alert(res.error || "Failed to reject investment");
    }
    setConfirmingId(null);
  };

  const handleRowClick = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const res = await getAdminInvestmentDetailsApi(id);
    if (res.success) setDetailData(res.data);
    setDetailLoading(false);
  };

  const handleApproveReturn = async (id) => {
    setApprovingReturnId(id);
    const res = await approveReturnApi(id, remarks);
    if (res.success) {
      setTodayList((prev) => prev.filter((t) => t.id !== id));
      setReturnModalId(null);
      setRemarks("");
    } else {
      alert(res.error || "Failed to approve return");
    }
    setApprovingReturnId(null);
  };

  const renderStandardTable = (dataList, showActions) => {
    const isHistoryTab = activeTab === "history";
    const isRequestTab = activeTab === "requests";
    const dateLabel = isRequestTab ? "Date" : "Approved Date";
    const approvedDateValue = (item) => formatDate(item.approval_status_updated_at);
    const investmentDateValue = (item) => formatDate(item.investment_date);

    return (
      <table className="admin-investments-table">
        <thead>
          <tr>
            <th>No</th>
            <th>User ID</th>
            <th>User Name</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Approval Status</th>
            <th>{dateLabel}</th>
            {isHistoryTab && <th>Investment Date</th>}
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={showActions ? 9 : isHistoryTab ? 9 : 8}>Loading...</td></tr>
          ) : errorMsg ? (
            <tr><td colSpan={showActions ? 9 : isHistoryTab ? 9 : 8}>{errorMsg}</td></tr>
          ) : dataList.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 9 : isHistoryTab ? 9 : 8} style={{ padding: 0 }}>
                <div className="docs-empty-state">
                  <div className="empty-magnifier-box">
                    <div className="magnifier-art">
                      <FiFolder className="folder-back-art" />
                      <div className="glass-lens-art">
                        <span className="glass-quest">?</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="empty-state-label">No Data Available</h4>
                </div>
              </td>
            </tr>
          ) : (
            dataList.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(item.id)}>
                  {item.user_id || "-"}
                </td>
                <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(item.id)}>
                  {item.user_name || "-"}
                </td>
                <td>{item.plan_name}</td>
                <td>₹{Number(item.amount).toLocaleString()}</td>
                <td><span className="invest-status-green">{item.approval_status}</span></td>
                <td>{isRequestTab ? investmentDateValue(item) : approvedDateValue(item)}</td>
                {isHistoryTab && <td>{investmentDateValue(item)}</td>}
                {showActions && (
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="action-confirm-btn"
                        onClick={() => handleConfirm(item.id)}
                        disabled={confirmingId === item.id}
                      >
                        {confirmingId === item.id ? "..." : "Confirm"}
                      </button>
                      <button
                        type="button"
                        className="action-confirm-btn action-reject-btn"
                        onClick={() => handleReject(item.id)}
                        disabled={confirmingId === item.id}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-investments-page">
        <div className="admin-page-header">
          <span className="admin-eyebrow">
            <span className="admin-eyebrow-dot" />
            Finance
          </span>
          <h1 className="admin-page-title">Investments</h1>
          <p className="admin-page-subtitle">Manage and review investment requests, active plans, returns, and history.</p>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Investments</span>
          </div>
        </div>

        {successMsg && <div className="investment-success-banner" role="status">{successMsg}</div>}

        <div className="investments-content-card">
          <div className="investments-tabs-header">
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "requests" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/request")}
            >
              Investment Request
            </button>
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "active" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/active")}
            >
              Active Investments
            </button>
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "today" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/today")}
            >
              Today Returns
            </button>
            <button
              type="button"
              className={`investments-tab-btn ${activeTab === "history" ? "investments-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/investments/history")}
            >
              Investment History
            </button>
          </div>

          <div className="investments-tab-content">
            {(activeTab === "requests" || activeTab === "active" || activeTab === "history" || activeTab === "today") && (
              <form
                className="history-filter-row"
                onSubmit={(e) => { e.preventDefault(); loadTabData(); }}
              >
                {activeTab !== "today" && (
                  <>
                    <div className="filter-field-wrap">
                      <span className="floating-top-label">Pick Start Date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="filter-input-field"
                      />
                      <FiCalendar className="field-right-icon" />
                    </div>
                    <div className="filter-field-wrap">
                      <span className="floating-top-label">Pick End Date</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="filter-input-field"
                      />
                      <FiCalendar className="field-right-icon" />
                    </div>
                  </>
                )}
                <div className="filter-field-wrap">
                  <input
                    type="text"
                    placeholder="User ID"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    className="filter-input-field"
                  />
                </div>
                <button type="submit" className="yellow-get-btn">Get Report</button>
                <button type="button" className="investments-refresh-btn" onClick={handleRefresh}><FiRefreshCw size={14} /> Refresh</button>
              </form>
            )}

            <div className="table-overflow-box" style={{ marginTop: "16px" }}>
              {activeTab === "requests" && renderStandardTable(requests, true)}
              {activeTab === "active" && renderStandardTable(activeList, false)}
              {activeTab === "history" && renderStandardTable(history, false)}

              {activeTab === "today" && (
                <table className="admin-investments-table">
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
                      <tr><td colSpan="7">Loading...</td></tr>
                    ) : errorMsg ? (
                      <tr><td colSpan="7">{errorMsg}</td></tr>
                    ) : filterInvestments(todayList).length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: 0 }}>
                          <div className="docs-empty-state">
                            <div className="empty-magnifier-box">
                              <div className="magnifier-art">
                                <FiFolder className="folder-back-art" />
                                <div className="glass-lens-art">
                                  <span className="glass-quest">?</span>
                                </div>
                              </div>
                            </div>
                            <h4 className="empty-state-label">No Returns Found</h4>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filterInvestments(todayList).map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(item.id)}>
                            {item.user_id || "-"}
                          </td>
                          <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(item.id)}>
                            {item.user_name || "-"}
                          </td>
                          <td>{item.plan_name}</td>
                          <td>₹{Number(item.amount).toLocaleString()}</td>
                          <td>{formatDate(item.investment_date)}</td>
                          <td>
                            <button
                              type="button"
                              className="action-confirm-btn"
                              onClick={() => setReturnModalId(item.id)}
                            >
                              Approve Return
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {detailOpen && (
          <div className="modal-backdrop" onClick={() => setDetailOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Investment Detail</h3>
                <button className="modal-close-btn" onClick={() => setDetailOpen(false)}>
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading...</p>
                ) : detailData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p>Investment ID: {detailData.investment_id}</p>
                    <p>User: {detailData.user_name} ({detailData.user_id})</p>
                    <p>Plan: {detailData.plan_name}</p>
                    <p>Return Type: {detailData.return_type}</p>
                    <p>Amount: ₹{Number(detailData.amount).toLocaleString()}</p>
                    <p>Lots: {detailData.lots}</p>
                    <p>Investment Status: {detailData.investment_status}</p>
                    <p>Approval Status: {detailData.approval_status}</p>
                    <p>Investment Date: {detailData.investment_date}</p>
                  </div>
                ) : (
                  <p>Unable to load detail.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {returnModalId && createPortal(
          <div className="admin-return-modal-backdrop" onClick={() => setReturnModalId(null)}>
            <div className="admin-return-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-return-modal-header">
                <h3>Approve Monthly Return</h3>
                <button className="admin-return-modal-close" onClick={() => setReturnModalId(null)} aria-label="Close approval dialog">
                  <FiX size={18} />
                </button>
              </div>
              <div className="admin-return-modal-body">
                <label className="admin-return-field-label">Remarks (optional)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="admin-return-textarea"
                  placeholder="e.g. Return processed for August"
                />
                <div className="admin-return-modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setReturnModalId(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={() => handleApproveReturn(returnModalId)}
                    disabled={approvingReturnId === returnModalId}
                  >
                    {approvingReturnId === returnModalId ? "Approving..." : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

        {rejectModalId && createPortal(
          <div className="modal-backdrop" onClick={() => setRejectModalId(null)}>
            <div className="modal-container investment-reject-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reject Investment</h3>
                <button className="modal-close-btn" onClick={() => setRejectModalId(null)}><FiX size={18} /></button>
              </div>
              <div className="modal-body">
                <label className="field-label" htmlFor="investment-rejection-reason">Rejection reason</label>
                <textarea id="investment-rejection-reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} className="form-input investment-reject-textarea" placeholder="Enter the reason for rejecting this investment" />
                <div className="investment-reject-actions">
                  <button type="button" className="cancel-btn" onClick={() => setRejectModalId(null)}>Cancel</button>
                  <button type="button" className="action-confirm-btn action-reject-btn" onClick={submitReject} disabled={confirmingId === rejectModalId || !rejectionReason.trim()}>{confirmingId === rejectModalId ? "Rejecting..." : "Confirm Reject"}</button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInvestments;