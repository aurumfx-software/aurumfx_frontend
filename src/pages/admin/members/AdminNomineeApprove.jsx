import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiEye, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllAdminMembersNomineeDetailsApi,
  getAdminMemberNomineeDetailsApi,
  getPendingAdminMembersNomineeDetailsApi,
  updateAdminMemberNomineeStatusApi,
} from "../../../api/admin-nominee-details";
import "./AdminBankApprove.css";

const statusLabel = (value) => String(value || "NOT SUBMITTED").replace(/_/g, " ").toUpperCase();
const detailFields = [
  ["Nominee Name", "nominee_name"],
  ["Relation", "nominee_relation"],
  ["Gender", "nominee_gender"],
  ["Date of Birth", "nominee_dob"],
  ["Address", "nominee_address"],
  ["Aadhaar Number", "nominee_aadhar"],
  ["Mobile Number", "nominee_mobile"],
];
const pendingDetailFields = [
  ["Nominee Name", "nominee_name"],
  ["Relation", "nominee_relation"],
  ["Gender", "nominee_gender"],
  ["Date of Birth", "nominee_dob"],
  ["Address", "nominee_address"],
  ["Aadhaar Number", "nominee_aadhar"],
  ["Mobile Number", "nominee_mobile"],
  ["Status", "status"],
  ["Rejection Reason", "rejection_reason"],
];
const isNoDataMessage = (message = "") => {
  const value = String(message || "").trim().toLowerCase();
  return /^(no\s+)?(nominee|records|data|members|results)\s+found\.?$/.test(value)
    || /not found/i.test(value)
    || /no\s+(nominee|records|data|members|results)/i.test(value)
    || /^nominee\s+details\s+found\.?$/i.test(value);
};

const normalizePendingRow = (row = {}) => {
  const nominee = row.nominee_details || row.nomineeDetails || {};
  const nomineeStatus = nominee.nominee_status ?? nominee.status ?? row.nominee_status ?? row.status ?? "PENDING";
  const rejectionReason = nominee.nominee_rejection_reason ?? nominee.rejection_reason ?? row.nominee_rejection_reason ?? row.rejection_reason ?? null;

  return {
    ...row,
    user_id: row.user_id || row.userId || "-",
    fullname: row.fullname || row.full_name || row.name || "-",
    nominee_details: {
      ...nominee,
      nominee_name: nominee.nominee_name ?? row.nominee_name ?? "-",
      nominee_relation: nominee.nominee_relation ?? row.nominee_relation ?? "-",
      nominee_gender: nominee.nominee_gender ?? row.nominee_gender ?? "-",
      nominee_dob: nominee.nominee_dob ?? row.nominee_dob ?? "-",
      nominee_address: nominee.nominee_address ?? row.nominee_address ?? "-",
      nominee_aadhar: nominee.nominee_aadhar ?? row.nominee_aadhar ?? "-",
      nominee_mobile: nominee.nominee_mobile ?? row.nominee_mobile ?? "-",
      nominee_aadhar_front: nominee.nominee_aadhar_front ?? row.nominee_aadhar_front ?? "",
      nominee_aadhar_back: nominee.nominee_aadhar_back ?? row.nominee_aadhar_back ?? "",
      nominee_status: nomineeStatus,
      status: nomineeStatus,
      nominee_rejection_reason: rejectionReason,
      rejection_reason: rejectionReason,
    },
  };
};

const normalizeHistoryRow = (row = {}) => normalizePendingRow(row);

function AdminNomineeApprove() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingMembers, setPendingMembers] = useState([]);
  const [historyMembers, setHistoryMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterUserId, setFilterUserId] = useState("");

  const loadPendingMembers = async () => {
    const result = await getPendingAdminMembersNomineeDetailsApi();
    if (result.success) {
      setPendingMembers((result.data || []).map(normalizePendingRow));
    } else if (isNoDataMessage(result.error)) {
      setPendingMembers([]);
      setError("");
    } else {
      setError(result.error || "Unable to load pending nominee details.");
    }
  };

  const loadHistoryMembers = async () => {
    const result = await getAllAdminMembersNomineeDetailsApi();
    if (result.success) {
      setHistoryMembers((result.data || []).map(normalizeHistoryRow));
    } else if (isNoDataMessage(result.error)) {
      setHistoryMembers([]);
      setError("");
    } else {
      setError(result.error || "Unable to load nominee detail history.");
    }
  };

  const loadMembers = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    await Promise.all([loadPendingMembers(), loadHistoryMembers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleReport = (event) => {
    event.preventDefault();
    loadMembers();
  };

  const currentMembers = activeTab === "pending" ? pendingMembers : historyMembers;

  const filteredMembers = useMemo(() => currentMembers.filter((member) => {
    const nominee = member.nominee_details || {};
    const memberDate = member.date_of_joining || member.date_of_join || member.created_at || "";
    return (!filterUserId || String(member.user_id || "").toLowerCase().includes(filterUserId.toLowerCase()))
      && (!startDate || !memberDate || String(memberDate).slice(0, 10) >= startDate)
      && (!endDate || !memberDate || String(memberDate).slice(0, 10) <= endDate)
      && (activeTab === "pending" ? String(nominee.status || "PENDING").toUpperCase() === "PENDING" : true);
  }), [currentMembers, filterUserId, startDate, endDate, activeTab]);

  const shouldShowEmptyState = !loading && !error && filteredMembers.length === 0;
  const displayError = error && !isNoDataMessage(error) ? error : "";

  const openDetails = async (member) => {
    const userId = member.user_id;
    setSelectedUserId(userId);
    setDetails(null);
    setRejectionReason(member.nominee_details?.nominee_rejection_reason ?? member.nominee_details?.rejection_reason ?? "");
    setError("");
    setLoadingDetails(true);

    if (activeTab === "pending") {
      const normalizedMember = normalizePendingRow(member);
      setDetails({
        ...normalizedMember,
        nominee_details: normalizedMember.nominee_details,
      });
      setLoadingDetails(false);
      return;
    }

    const result = await getAdminMemberNomineeDetailsApi(userId);
    if (result.success) {
      const response = result.data || {};
      const responseNominee = response.nominee_details || {};
      const nomineeData = {
        ...member.nominee_details,
        ...responseNominee,
        nominee_name: responseNominee.nominee_name ?? member.nominee_details?.nominee_name,
        nominee_relation: responseNominee.nominee_relation ?? member.nominee_details?.nominee_relation,
        nominee_gender: responseNominee.nominee_gender ?? member.nominee_details?.nominee_gender,
        nominee_dob: responseNominee.nominee_dob ?? member.nominee_details?.nominee_dob,
        nominee_address: responseNominee.nominee_address ?? member.nominee_details?.nominee_address,
        nominee_aadhar: responseNominee.nominee_aadhar ?? member.nominee_details?.nominee_aadhar,
        nominee_mobile: responseNominee.nominee_mobile ?? member.nominee_details?.nominee_mobile,
        nominee_aadhar_front: responseNominee.nominee_aadhar_front ?? member.nominee_details?.nominee_aadhar_front,
        nominee_aadhar_back: responseNominee.nominee_aadhar_back ?? member.nominee_details?.nominee_aadhar_back,
        nominee_status: responseNominee.nominee_status ?? responseNominee.status ?? member.nominee_details?.nominee_status ?? member.nominee_details?.status,
        status: responseNominee.nominee_status ?? responseNominee.status ?? member.nominee_details?.nominee_status ?? member.nominee_details?.status,
        nominee_rejection_reason: responseNominee.nominee_rejection_reason ?? responseNominee.rejection_reason ?? member.nominee_details?.nominee_rejection_reason ?? member.nominee_details?.rejection_reason,
        rejection_reason: responseNominee.nominee_rejection_reason ?? responseNominee.rejection_reason ?? member.nominee_details?.nominee_rejection_reason ?? member.nominee_details?.rejection_reason,
      };
      setDetails({ ...member, ...response, nominee_details: nomineeData });
    } else {
      setDetails(member);
    }
    setLoadingDetails(false);
  };

  const closeDetails = () => {
    if (!saving) {
      setDetails(null);
      setSelectedUserId("");
      setError("");
      setMessage("");
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedUserId) return;
    if (status === "Rejected" && !rejectionReason.trim()) {
      setError("Please enter a reason before rejecting nominee details.");
      return;
    }

    setSaving(true);
    setError("");

    const result = await updateAdminMemberNomineeStatusApi(selectedUserId, status, rejectionReason.trim());
    if (result.success) {
      const responseData = result.data || {};
      const updatedStatus = responseData.nominee_status || responseData.status || status;
      const updatedReason = responseData.nominee_rejection_reason ?? responseData.rejection_reason ?? rejectionReason.trim();

      setPendingMembers((current) => current.filter((member) => member.user_id !== selectedUserId));
      setHistoryMembers((current) => current.map((member) => member.user_id === selectedUserId
        ? {
            ...member,
            nominee_details: {
              ...member.nominee_details,
              nominee_status: updatedStatus,
              status: updatedStatus,
              nominee_rejection_reason: updatedReason,
              rejection_reason: updatedReason,
            },
          }
        : member));
      setDetails((current) => current ? {
        ...current,
        nominee_details: {
          ...current.nominee_details,
          nominee_status: updatedStatus,
          status: updatedStatus,
          nominee_rejection_reason: updatedReason,
          rejection_reason: updatedReason,
        },
      } : current);

      setMessage(typeof result.data === "string" ? result.data : `Nominee details ${status.toLowerCase()} successfully.`);
      setTimeout(() => {
        setDetails(null);
        setSelectedUserId("");
        setError("");
        setMessage("");
      }, 1200);
    } else {
      setError(result.error || "Unable to update nominee status.");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="admin-bank-approve-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Member Verification</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Nominee Details</h1>
              <p className="agen-page-subtitle">Review and manage submitted member nominee information</p>
            </div>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Nominee Details</span></div>
        </div>

        <div className="bank-tab-strip">
          <button type="button" className={`bank-tab-btn ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>Pending Nominee Details</button>
          <button type="button" className={`bank-tab-btn ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>Nominee Details History</button>
        </div>

        <form className="bank-filters-card" onSubmit={handleReport}>
          <div className="filters-grid">
            <div className="filter-input-wrap"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="filter-date-field" aria-label="Start date" /></div>
            <div className="filter-input-wrap"><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="filter-date-field" aria-label="End date" /></div>
            <div className="filter-input-wrap">
              <input
                type="text"
                value={filterUserId}
                onChange={(event) => setFilterUserId(event.target.value)}
                className="filter-date-field"
                aria-label="User ID"
                placeholder="Type user ID"
              />
            </div>
            <button type="submit" className="yellow-report-btn">Get Report</button>
          </div>
        </form>

        <section className="bank-details-card admin-bank-list-card">
          <div className="admin-bank-list-heading"><div><h2>{activeTab === "pending" ? "Pending Requests" : "Nominee Details History"}</h2><p>{activeTab === "pending" ? "Review nominee proofs awaiting approval." : "View previously verified nominee details."}</p></div><span>{filteredMembers.length} {activeTab === "pending" ? "pending" : "records"}</span></div>
          <div className="admin-bank-list-table-wrap">
            <table className="admin-bank-list-table">
              <thead>
                <tr>
                  <th>No</th><th>User ID</th><th>Name</th><th>Nominee Name</th><th>Relation</th><th>Aadhaar</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="8" className="bank-state">Loading nominee details...</td></tr> : displayError ? <tr><td colSpan="8" className="bank-state">No nominee details found.</td></tr> : shouldShowEmptyState ? <tr><td colSpan="8" className="bank-state">No nominee details found.</td></tr> : filteredMembers.map((member, index) => {
                  const nominee = member.nominee_details || {};
                  return <tr key={`${activeTab}-${member.user_id}`}>
                    <td>{index + 1}</td>
                    <td className="bank-member-id">{member.user_id || "-"}</td>
                    <td>{member.fullname || member.full_name || "-"}</td>
                    <td>{nominee.nominee_name || "-"}</td>
                    <td>{nominee.nominee_relation || "-"}</td>
                    <td>{nominee.nominee_aadhar || "-"}</td>
                    <td><span className={`bank-status bank-status--${String(nominee.status || "not-submitted").toLowerCase()}`}>{statusLabel(nominee.status)}</span></td>
                    <td><button type="button" className="bank-view-btn" onClick={() => openDetails(member)}><FiEye /> View</button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>

        {details && createPortal(
          <div className="admin-bank-modal-backdrop" onClick={closeDetails}>
            <div className="admin-bank-modal" onClick={(event) => event.stopPropagation()}>
              <div className="admin-bank-modal-header">
                <div>
                  <span className="bank-details-eyebrow">Member Nominee Verification</span>
                  <h2>{details.fullname || selectedUserId}</h2>
                  <span className="bank-member-id">{details.user_id || selectedUserId}</span>
                </div>
                <button type="button" onClick={closeDetails} aria-label="Close"><FiX /></button>
              </div>

              {loadingDetails ? (
                <div className="bank-state"><FiRefreshCw className="bank-spinner" /> Loading details...</div>
              ) : (
                <>
                  <div className="admin-bank-modal-body">
                    <div className="admin-bank-modal-status">
                      <span>Status</span>
                      <strong>{statusLabel(details.nominee_details?.status || details.nominee_details?.nominee_status)}</strong>
                    </div>

                    {activeTab === "pending" ? (
                      <div className="bank-details-section">
                        <h3>Nominee Details</h3>
                        <div className="bank-details-grid">
                          {pendingDetailFields.map(([label, key]) => (
                            <div className="bank-detail-item" key={key}>
                              <span>{label}</span>
                              <strong>{
                                key === "rejection_reason"
                                  ? (details.nominee_details?.[key] || "-")
                                  : (details.nominee_details?.[key] || "Not provided")
                              }</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bank-details-section">
                        <h3>Nominee Information</h3>
                        <div className="bank-details-grid">
                          {detailFields.map(([label, key]) => (
                            <div className="bank-detail-item" key={key}>
                              <span>{label}</span>
                              <strong>{details.nominee_details?.[key] || "Not provided"}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bank-details-section">
                      <h3>Uploaded Documents</h3>
                      <div className="admin-bank-document-grid">
                        {[
                          ["Nominee Aadhaar Front", details.nominee_details?.nominee_aadhar_front],
                          ["Nominee Aadhaar Back", details.nominee_details?.nominee_aadhar_back],
                        ].map(([label, url]) => url ? (
                          <a
                            className="bank-document-link"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            key={label}
                          >
                            <img src={url} alt={label} />
                            <span>{label}</span>
                          </a>
                        ) : <span className="bank-documents-empty" key={label}>{label}: Not provided</span>)}
                      </div>
                    </div>
                  </div>

                  {error && <div className="bank-feedback bank-feedback--error">{error}</div>}
                  {message && <div className="bank-feedback bank-feedback--success">{message}</div>}

                  {(activeTab === "pending" || activeTab === "history") && (
                    <div className="bank-status-actions">
                      <div className="rejection-field">
                        <label htmlFor="nominee-rejection-reason">Rejection reason</label>
                        <textarea id="nominee-rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Required when rejecting" rows="3" />
                      </div>
                      <div className="bank-action-buttons">
                        <button type="button" className="btn-approve" onClick={() => handleStatusUpdate("Approved")} disabled={saving}><FiCheck /> Approve</button>
                        <button type="button" className="btn-reject" onClick={() => handleStatusUpdate("Rejected")} disabled={saving}><FiX /> Reject</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminNomineeApprove;
