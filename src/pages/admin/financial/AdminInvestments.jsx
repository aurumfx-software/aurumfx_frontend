import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiChevronDown, FiFolder, FiX } from "react-icons/fi";
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

  const [confirmingId, setConfirmingId] = useState(null);
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvingReturnId, setApprovingReturnId] = useState(null);

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [returnModalId, setReturnModalId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const loadTabData = async () => {
    setLoading(true);
    setErrorMsg("");

    if (activeTab === "requests") {
      const res = await getPendingInvestmentsApi({
        user_id: usernameFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      if (res.success) setRequests(res.data);
      else setErrorMsg(res.error);
    } else if (activeTab === "active") {
      const res = await getActiveInvestmentsApi({
        user_id: usernameFilter || undefined,
        status: statusFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      if (res.success) setActiveList(res.data);
      else setErrorMsg(res.error);
    } else if (activeTab === "today") {
      const res = await getTodayReturnsApi();
      if (res.success) setTodayList(res.data);
      else setErrorMsg(res.error);
    } else {
      const res = await getAllAdminInvestmentsApi();
      if (res.success) setHistory(res.data);
      else setErrorMsg(res.error);
    }

    setLoading(false);
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
    if (!rejectionReason.trim()) return;
    const id = rejectModalId;
    setConfirmingId(id);
    const res = await approveRejectInvestmentApi(id, "Rejected", rejectionReason);
    if (res.success) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setRejectModalId(null);
      setRejectionReason("");
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

  const renderStandardTable = (dataList, showActions) => (
    <table className="admin-investments-table">
      <thead>
        <tr>
          <th>No</th>
          <th>User</th>
          <th>Plan</th>
          <th>Return Type</th>
          <th>Amount</th>
          <th>Lots</th>
          <th>Investment Status</th>
          <th>Approval Status</th>
          <th>Date</th>
          {showActions && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={showActions ? 10 : 9}>Loading...</td></tr>
        ) : errorMsg ? (
          <tr><td colSpan={showActions ? 10 : 9}>{errorMsg}</td></tr>
        ) : dataList.length === 0 ? (
          <tr>
            <td colSpan={showActions ? 10 : 9} style={{ padding: 0 }}>
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
                {item.user_name} ({item.user_id})
              </td>
              <td>{item.plan_name}</td>
              <td>{item.return_type}</td>
              <td>₹{Number(item.amount).toLocaleString()}</td>
              <td>{item.lots}</td>
              <td><span className="invest-status-green">{item.investment_status}</span></td>
              <td><span className="invest-status-green">{item.approval_status}</span></td>
              <td>{item.investment_date}</td>
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
            {(activeTab === "requests" || activeTab === "active") && (
              <form
                className="history-filter-row"
                onSubmit={(e) => { e.preventDefault(); loadTabData(); }}
              >
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
                <div className="filter-field-wrap">
                  <input
                    type="text"
                    placeholder="User ID"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    className="filter-input-field"
                  />
                </div>
                {activeTab === "active" && (
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">Status</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>
                )}
                <button type="submit" className="yellow-get-btn">Get Report</button>
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
                      <th>User</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Lots</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7">Loading...</td></tr>
                    ) : errorMsg ? (
                      <tr><td colSpan="7">{errorMsg}</td></tr>
                    ) : todayList.length === 0 ? (
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
                            <h4 className="empty-state-label">No Returns Due Today</h4>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      todayList.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td style={{ cursor: "pointer" }} onClick={() => handleRowClick(item.id)}>
                            {item.user_name} ({item.user_id})
                          </td>
                          <td>{item.plan_name}</td>
                          <td>₹{Number(item.amount).toLocaleString()}</td>
                          <td>{item.lots}</td>
                          <td>{item.investment_date}</td>
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

        {returnModalId && (
          <div className="modal-backdrop" onClick={() => setReturnModalId(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Approve Monthly Return</h3>
                <button className="modal-close-btn" onClick={() => setReturnModalId(null)}>
                  <FiX size={18} />
                </button>
              </div>
              <div className="modal-body">
                <label className="field-label">Remarks (optional)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="form-input"
                  style={{ width: "100%", marginTop: "8px" }}
                  placeholder="e.g. Return processed for August"
                />
                <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
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
          </div>
        )}

        {rejectModalId && (
          <div className="modal-backdrop" onClick={() => setRejectModalId(null)}>
            <div className="modal-container investment-reject-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reject Investment</h3>
                <button className="modal-close-btn" onClick={() => setRejectModalId(null)}><FiX size={18} /></button>
              </div>
              <div className="modal-body">
                <label className="field-label" htmlFor="investment-rejection-reason">Rejection reason</label>
                <textarea id="investment-rejection-reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} className="form-input" style={{ width: "100%", marginTop: "8px" }} placeholder="Enter the reason for rejecting this investment" />
                <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button type="button" className="cancel-btn" onClick={() => setRejectModalId(null)}>Cancel</button>
                  <button type="button" className="action-confirm-btn action-reject-btn" onClick={submitReject} disabled={confirmingId === rejectModalId || !rejectionReason.trim()}>{confirmingId === rejectModalId ? "Rejecting..." : "Confirm Reject"}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInvestments;