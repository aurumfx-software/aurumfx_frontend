import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiEye, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllAdminMembersKycApi,
  getAdminMemberKycApi,
  getPendingAdminMembersKycApi,
  updateAdminMemberKycStatusApi,
} from "../../../api/admin-kyc";
import "./AdminKYCDetails.css";
import "./AdminBankApprove.css";

const statusLabel = (value) => String(value || "NOT SUBMITTED").replace(/_/g, " ").toUpperCase();
const fields = [["Aadhaar Number", "aadhar_no"], ["PAN Number", "pan_no"], ["Uploaded At", "uploaded_at"], ["Last Updated", "updated_at"]];
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

function AdminKYCDetails() {
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

  const loadPendingMembers = async () => {
    const result = await getPendingAdminMembersKycApi();
    if (result.success) {
      setPendingMembers((result.data || []).map((member) => ({
        ...member,
        kyc: member.kyc || {},
      })));
    } else {
      setError(result.error || "Unable to load pending KYC details.");
    }
  };

  const loadHistoryMembers = async () => {
    const result = await getAllAdminMembersKycApi();
    if (result.success) {
      setHistoryMembers((result.data || []).map((member) => ({
        ...member,
        kyc: member.kyc || {},
      })));
    } else {
      setError(result.error || "Unable to load KYC history.");
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

  const currentMembers = activeTab === "pending" ? pendingMembers : historyMembers;
  const filteredMembers = useMemo(() => currentMembers.filter((member) => {
    const kycRecord = member.kyc || {};
    if (activeTab === "pending") return String(kycRecord.status || "PENDING").toUpperCase() === "PENDING";
    return true;
  }), [currentMembers, activeTab]);

  const openDetails = async (member) => {
    setSelectedUserId(member.user_id);
    setDetails(null);
    setRejectionReason(member.kyc?.rejection_reason || "");
    setError("");
    setLoadingDetails(true);
    const result = await getAdminMemberKycApi(member.user_id);
    if (result.success) {
      const payload = result.data || {};
      const mergedKyc = { ...member.kyc, ...payload.kyc, ...payload };
      setDetails({ ...member, ...payload, kyc: mergedKyc });
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
      setError("Please enter a reason before rejecting KYC.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await updateAdminMemberKycStatusApi(selectedUserId, status, rejectionReason.trim());
    if (result.success) {
      const updated = result.data || {};
      setPendingMembers((current) => current.filter((member) => member.user_id !== selectedUserId));
      setHistoryMembers((current) => current.map((member) => member.user_id === selectedUserId ? { ...member, kyc: { ...member.kyc, ...updated, status } } : member));
      setDetails((current) => current ? { ...current, kyc: { ...current.kyc, ...updated, status } } : current);
      setMessage(updated.message || `KYC ${status.toLowerCase()} successfully.`);
    } else {
      setError(result.error || "Unable to update KYC status.");
    }
    setSaving(false);
  };

  const kyc = details?.kyc || {};
  return (
    <AdminLayout>
      <div className="admin-bank-approve-page admin-kyc-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow">
            <span className="agen-eyebrow-dot" />
            Member Verification
          </span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">KYC Details</h1>
              <p className="agen-page-subtitle">Review submitted identity documents and verification status</p>
            </div>
          </div>
          <div className="agen-breadcrumb">
            <span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">KYC Details</span>
          </div>
        </div>

        <div className="bank-tab-strip">
          <button type="button" className={`bank-tab-btn ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>Pending KYC</button>
          <button type="button" className={`bank-tab-btn ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>KYC History</button>
        </div>

        <section className="bank-details-card admin-bank-list-card">
          <div className="admin-bank-list-heading"><div><h2>{activeTab === "pending" ? "Pending Requests" : "KYC History"}</h2><p>{activeTab === "pending" ? "Review submitted KYC documents awaiting approval." : "View KYC records from previous verification cycles."}</p></div><span>{filteredMembers.length} {activeTab === "pending" ? "pending" : "records"}</span></div>
          <div className="admin-bank-list-table-wrap"><table className="admin-bank-list-table"><thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Aadhaar Number</th><th>PAN Number</th><th>Status</th><th>Action</th></tr></thead><tbody>
            {loading ? <tr><td colSpan="7" className="bank-state">Loading KYC details...</td></tr> : error ? <tr><td colSpan="7" className="bank-state">{error}</td></tr> : filteredMembers.length === 0 ? <tr><td colSpan="7" className="bank-state">No KYC details found.</td></tr> : filteredMembers.map((member, index) => <tr key={`${activeTab}-${member.user_id}`}><td>{index + 1}</td><td className="bank-member-id">{member.user_id || "-"}</td><td>{member.fullname || "-"}</td><td>{member.kyc?.aadhar_no || "-"}</td><td>{member.kyc?.pan_no || "-"}</td><td><span className={`bank-status bank-status--${String(member.kyc?.status || "not-submitted").toLowerCase()}`}>{statusLabel(member.kyc?.status)}</span></td><td><button type="button" className="bank-view-btn" onClick={() => openDetails(member)}><FiEye /> View</button></td></tr>)}
          </tbody></table></div>
        </section>

        {details && createPortal(<div className="admin-bank-modal-backdrop" onClick={closeDetails}><div className="admin-bank-modal" onClick={(event) => event.stopPropagation()}>
          <div className="admin-bank-modal-header"><div><span className="bank-details-eyebrow">Member KYC Verification</span><h2>{details.fullname || selectedUserId}</h2><span className="bank-member-id">{details.user_id || selectedUserId}</span></div><button type="button" onClick={closeDetails} aria-label="Close"><FiX /></button></div>
          {loadingDetails ? <div className="bank-state"><FiRefreshCw className="bank-spinner" /> Loading details...</div> : <><div className="admin-bank-modal-body"><div className="admin-bank-modal-status"><span>Status</span><strong>{statusLabel(kyc.status)}</strong></div><div className="bank-details-section"><h3>Identity Information</h3><div className="bank-details-grid">{fields.map(([label, key]) => <div className="bank-detail-item" key={key}><span>{label}</span><strong>{key === "uploaded_at" || key === "updated_at" ? formatDate(kyc[key]) : kyc[key] || "Not provided"}</strong></div>)}</div></div><div className="bank-details-section"><h3>Uploaded Documents</h3><div className="admin-bank-document-grid">{[["Aadhaar Front", kyc.aadhar_front], ["Aadhaar Back", kyc.aadhar_back], ["PAN Card", kyc.pan_image]].map(([label, url]) => url ? <a className="bank-document-link" href={url} target="_blank" rel="noreferrer" key={label}><img src={url} alt={label} /><span>{label}</span></a> : <span className="bank-documents-empty" key={label}>{label}: Not provided</span>)}</div></div></div>{error && <div className="bank-feedback bank-feedback--error">{error}</div>}{message && <div className="bank-feedback bank-feedback--success">{message}</div>}<div className="bank-status-actions"><div className="rejection-field"><label htmlFor="kyc-rejection-reason">Rejection reason</label><textarea id="kyc-rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Required when rejecting" rows="3" /></div><div className="bank-action-buttons"><button type="button" className="btn-approve" onClick={() => handleStatusUpdate("Approved")} disabled={saving}><FiCheck /> Approve</button><button type="button" className="btn-reject" onClick={() => handleStatusUpdate("Rejected")} disabled={saving}><FiX /> Reject</button></div></div></>}
        </div></div>, document.body)}
      </div>
    </AdminLayout>
  );
}

export default AdminKYCDetails;
