import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiEye, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllAdminMembersBankDetailsApi,
  getAdminMemberBankDetailsApi,
  getPendingAdminMembersBankDetailsApi,
  updateAdminMemberBankStatusApi,
} from "../../../api/admin-bankdetails";
import "./AdminBankApprove.css";

const statusLabel = (value) => String(value || "NOT SUBMITTED").replace(/_/g, " ").toUpperCase();
const detailFields = [
  ["Bank Name", "bank_name"], ["Account Number", "bank_account"], ["IFSC Code", "ifsc"],
];
const nomineeDetailFields = [
  ["Nominee Name", "nominee_name"],
  ["Relation", "nominee_relation"],
  ["Gender", "nominee_gender"],
  ["Date of Birth", "nominee_dob"],
  ["Address", "nominee_address"],
  ["Aadhaar Number", "nominee_aadhar"],
  ["Mobile Number", "nominee_mobile"],
];
const pendingDetailFields = [
  ["Bank Name", "bank_name"], ["Account Number", "bank_account"], ["IFSC Code", "ifsc"], ["Status", "status"], ["Rejection Reason", "rejection_reason"],
];
const isNoDataMessage = (message = "") => {
  const value = String(message || "").trim().toLowerCase();
  return /^(no\s+)?(bank\s+details|records|data|members|results)\s+found\.?$/.test(value)
    || /not found/i.test(value)
    || /no\s+(bank\s+details|records|data|members|results)/i.test(value)
    || /^bank\s+details\s+found\.?$/i.test(value);
};

const normalizePendingRow = (row = {}) => {
  const bank = row.bank_details || row.bankDetails || {};
  return {
    ...row,
    user_id: row.user_id || row.userId || "-",
    fullname: row.fullname || row.full_name || row.name || "-",
    bank_details: {
      bank_name: bank.bank_name || row.bank_name || "-",
      bank_account: bank.bank_account || row.bank_account || "-",
      ifsc: bank.ifsc || row.ifsc || "-",
      bank_proof: bank.bank_proof || row.bank_proof || "",
      status: bank.status || row.status || "PENDING",
      rejection_reason: bank.rejection_reason || row.rejection_reason || null,
    },
  };
};

const normalizeHistoryRow = (row = {}) => {
  const bank = row.bank_details || row.bankDetails || {};
  const nominee = row.nominee_details || row.nomineeDetails || {};

  return {
    ...row,
    user_id: row.user_id || row.userId || "-",
    fullname: row.fullname || row.full_name || row.name || "-",
    bank_details: {
      bank_name: bank.bank_name || row.bank_name || "-",
      bank_account: bank.bank_account || row.bank_account || "-",
      ifsc: bank.ifsc || row.ifsc || "-",
      bank_proof: bank.bank_proof || row.bank_proof || "",
      status: bank.status || row.status || "NOT SUBMITTED",
      rejection_reason: bank.rejection_reason || row.rejection_reason || null,
    },
    nominee_details: {
      nominee_name: nominee.nominee_name || row.nominee_name || "-",
      nominee_relation: nominee.nominee_relation || row.nominee_relation || "-",
      nominee_aadhar: nominee.nominee_aadhar || row.nominee_aadhar || "-",
      nominee_mobile: nominee.nominee_mobile || row.nominee_mobile || "-",
      nominee_aadhar_front: nominee.nominee_aadhar_front || row.nominee_aadhar_front || "",
      nominee_aadhar_back: nominee.nominee_aadhar_back || row.nominee_aadhar_back || "",
    },
  };
};

function AdminBankApprove() {
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
    const result = await getPendingAdminMembersBankDetailsApi();
    if (result.success) {
      setPendingMembers((result.data || []).map(normalizePendingRow));
    } else if (isNoDataMessage(result.error)) {
      setPendingMembers([]);
      setError("");
    } else {
      setError(result.error || "Unable to load pending bank details.");
    }
  };

  const loadHistoryMembers = async () => {
    const result = await getAllAdminMembersBankDetailsApi();
    if (result.success) {
      setHistoryMembers((result.data || []).map(normalizeHistoryRow));
    } else if (isNoDataMessage(result.error)) {
      setHistoryMembers([]);
      setError("");
    } else {
      setError(result.error || "Unable to load bank detail history.");
    }
  };

  const loadMembers = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    await Promise.all([loadPendingMembers(), loadHistoryMembers()]);
    setLoading(false);
  };

  useEffect(() => { loadMembers(); }, []);

  const handleReport = (event) => {
    event.preventDefault();
    loadMembers();
  };

  const currentMembers = activeTab === "pending" ? pendingMembers : historyMembers;

  const filteredMembers = useMemo(() => currentMembers.filter((member) => {
    const bank = member.bank_details || {};
    const memberDate = member.date_of_joining || member.date_of_join || member.created_at || "";
    return (!filterUserId || String(member.user_id || "").toLowerCase().includes(filterUserId.toLowerCase()))
      && (!startDate || !memberDate || String(memberDate).slice(0, 10) >= startDate)
      && (!endDate || !memberDate || String(memberDate).slice(0, 10) <= endDate)
      && (activeTab === "pending" ? String(bank.status || "PENDING").toUpperCase() === "PENDING" : true);
  }), [currentMembers, filterUserId, startDate, endDate, activeTab]);

  const shouldShowEmptyState = !loading && !error && filteredMembers.length === 0;
  const displayError = error && !isNoDataMessage(error) ? error : "";

  const openDetails = async (member) => {
    const userId = member.user_id;
    setSelectedUserId(userId);
    setDetails(null);
    setRejectionReason(member.bank_details?.rejection_reason || "");
    setError("");
    setLoadingDetails(true);

    if (activeTab === "pending") {
      const normalizedMember = normalizePendingRow(member);
      setDetails({
        ...normalizedMember,
        bank_details: normalizedMember.bank_details,
      });
      setLoadingDetails(false);
      return;
    }

    const result = await getAdminMemberBankDetailsApi(userId);
    if (result.success) {
      const response = result.data || {};
      const bankDetails = {
        ...member.bank_details,
        ...response.bank_details,
        bank_name: response.bank_name ?? response.bank_details?.bank_name ?? member.bank_details?.bank_name,
        bank_account: response.bank_account ?? response.bank_details?.bank_account ?? member.bank_details?.bank_account,
        ifsc: response.ifsc ?? response.bank_details?.ifsc ?? member.bank_details?.ifsc,
        bank_proof: response.bank_proof ?? response.bank_details?.bank_proof ?? member.bank_details?.bank_proof,
        status: response.bank_status ?? response.status ?? response.bank_details?.status ?? member.bank_details?.status,
        rejection_reason: response.rejection_reason ?? response.bank_details?.rejection_reason ?? member.bank_details?.rejection_reason,
      };
      setDetails({ ...member, ...response, bank_details: bankDetails, nominee_details: { ...member.nominee_details, ...response.nominee_details } });
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
      setError("Please enter a reason before rejecting bank details.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await updateAdminMemberBankStatusApi(selectedUserId, status, rejectionReason.trim());
    if (result.success) {
      setPendingMembers((current) => current.filter((member) => member.user_id !== selectedUserId));
      setHistoryMembers((current) => current.map((member) => member.user_id === selectedUserId ? { ...member, bank_details: { ...member.bank_details, ...result.data, status } } : member));
      setDetails((current) => current ? { ...current, bank_details: { ...current.bank_details, ...result.data, status } } : current);
      setMessage(result.data.message || `Bank details ${status.toLowerCase()} successfully.`);
      setTimeout(() => {
        setDetails(null);
        setSelectedUserId("");
        setError("");
        setMessage("");
      }, 1200);
    } else {
      setError(result.error || "Unable to update bank status.");
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
              <h1 className="agen-page-title">Bank Account Details</h1>
              <p className="agen-page-subtitle">Review and manage submitted member bank information</p>
            </div>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Bank Account Details</span></div>
        </div>

        <div className="bank-tab-strip">
          <button type="button" className={`bank-tab-btn ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>Pending Bank Details</button>
          <button type="button" className={`bank-tab-btn ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>Nominee & Bank Details History</button>
        </div>

        <form className="bank-filters-card" onSubmit={handleReport}>
          <div className="filters-grid">
            <div className="filter-input-wrap"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="filter-date-field" aria-label="Start date" /></div>
            <div className="filter-input-wrap"><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="filter-date-field" aria-label="End date" /></div>
            <div className="filter-select-wrap"><select value={filterUserId} onChange={(event) => setFilterUserId(event.target.value)} className="filter-select-field" aria-label="Select member"><option value="">All members</option>{currentMembers.map((member) => <option key={member.user_id} value={member.user_id}>{member.user_id} - {member.fullname}</option>)}</select></div>
            <button type="submit" className="yellow-report-btn">Get Report</button>
          </div>
        </form>

        <section className="bank-details-card admin-bank-list-card">
          <div className="admin-bank-list-heading"><div><h2>{activeTab === "pending" ? "Pending Requests" : "Nominee & Bank Details History"}</h2><p>{activeTab === "pending" ? "Review bank proofs awaiting approval." : "View previously verified nominee and bank details."}</p></div><span>{filteredMembers.length} {activeTab === "pending" ? "pending" : "records"}</span></div>
          <div className="admin-bank-list-table-wrap">
            <table className="admin-bank-list-table">
              <thead>
                <tr>
                  <th>No</th><th>User ID</th><th>Name</th><th>Bank Name</th><th>Account Number</th><th>IFSC</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="8" className="bank-state">Loading bank details...</td></tr> : displayError ? <tr><td colSpan="8" className="bank-state">No bank details found.</td></tr> : shouldShowEmptyState ? <tr><td colSpan="8" className="bank-state">No bank details found.</td></tr> : filteredMembers.map((member, index) => {
                  const bank = member.bank_details || {};
                  return <tr key={`${activeTab}-${member.user_id}`}>
                    <td>{index + 1}</td>
                    <td className="bank-member-id">{member.user_id || "-"}</td>
                    <td>{member.fullname || member.full_name || "-"}</td>
                    <td>{bank.bank_name || "-"}</td>
                    <td>{bank.bank_account || "-"}</td>
                    <td>{bank.ifsc || "-"}</td>
                    <td><span className={`bank-status bank-status--${String(bank.status || "not-submitted").toLowerCase()}`}>{statusLabel(bank.status)}</span></td>
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
                  <span className="bank-details-eyebrow">Member Bank Verification</span>
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
                      <strong>{statusLabel(details.bank_details?.status || details.bank_status)}</strong>
                    </div>

                    {activeTab === "pending" ? (
                      <div className="bank-details-section">
                        <h3>Bank Details</h3>
                        <div className="bank-details-grid">
                          {pendingDetailFields.map(([label, key]) => (
                            <div className="bank-detail-item" key={key}>
                              <span>{label}</span>
                              <strong>{
                                key === "rejection_reason"
                                  ? (details.bank_details?.[key] || "-")
                                  : (details.bank_details?.[key] || "Not provided")
                              }</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bank-details-section">
                          <h3>Bank Information</h3>
                          <div className="bank-details-grid">
                            {detailFields.map(([label, key]) => (
                              <div className="bank-detail-item" key={key}>
                                <span>{label}</span>
                                <strong>{details.bank_details?.[key] || "Not provided"}</strong>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bank-details-section">
                          <h3>Nominee Information</h3>
                          <div className="bank-details-grid">
                            {nomineeDetailFields.map(([label, key]) => {
                              const value = details.nominee_details?.[key];
                              return (
                                <div className="bank-detail-item" key={key}>
                                  <span>{label}</span>
                                  <strong>{value && String(value).trim() ? value : "Not provided"}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="bank-details-section">
                      <h3>Uploaded Documents</h3>
                      <div className="admin-bank-document-grid">
                        {[
                          ["Bank Proof", details.bank_details?.bank_proof],
                          ...(activeTab !== "pending"
                            ? [
                                ["Nominee Aadhaar Front", details.nominee_details?.nominee_aadhar_front],
                                ["Nominee Aadhaar Back", details.nominee_details?.nominee_aadhar_back],
                              ]
                            : []),
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
                        <label htmlFor="bank-rejection-reason">Rejection reason</label>
                        <textarea id="bank-rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Required when rejecting" rows="3" />
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

export default AdminBankApprove;
