import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiEye, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllAdminMembersKycApi,
  getAdminMemberKycApi,
  updateAdminMemberKycStatusApi,
} from "../../../api/admin-kyc";
import "./AdminKYCDetails.css";
import "./AdminBankApprove.css";

const statusLabel = (value) => String(value || "NOT SUBMITTED").replace(/_/g, " ").toUpperCase();
const fields = [["Aadhaar Number", "aadhar_no"], ["PAN Number", "pan_no"], ["Uploaded At", "uploaded_at"], ["Last Updated", "updated_at"]];
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

function AdminKYCDetails() {
  const [members, setMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMembers = async () => {
    setLoading(true);
    setError("");
    const result = await getAllAdminMembersKycApi();
    if (result.success) setMembers(result.data);
    else setError(result.error || "Unable to load KYC details.");
    setLoading(false);
  };

  useEffect(() => { loadMembers(); }, []);

  const openDetails = async (member) => {
    setSelectedUserId(member.user_id);
    setDetails(null);
    setRejectionReason(member.kyc?.rejection_reason || "");
    setError("");
    setLoadingDetails(true);
    const result = await getAdminMemberKycApi(member.user_id);
    setDetails(result.success ? { ...member, ...result.data, kyc: { ...member.kyc, ...result.data?.kyc, ...result.data } } : member);
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
      setMembers((current) => current.map((member) => member.user_id === selectedUserId ? { ...member, kyc: { ...member.kyc, ...updated, status } } : member));
      setDetails((current) => ({ ...current, kyc: { ...current.kyc, ...updated, status } }));
      setMessage(updated.message || `KYC ${status.toLowerCase()} successfully.`);
    } else setError(result.error || "Unable to update KYC status.");
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
        <section className="bank-details-card admin-bank-list-card">
          <div className="admin-bank-list-heading"><div><h2>Member KYC Details</h2><p>Review submitted identity documents and verification status.</p></div><span>{members.length} members</span></div>
          <div className="admin-bank-list-table-wrap"><table className="admin-bank-list-table"><thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Aadhaar Number</th><th>PAN Number</th><th>Status</th><th>Action</th></tr></thead><tbody>
            {loading ? <tr><td colSpan="7" className="bank-state">Loading KYC details...</td></tr> : error ? <tr><td colSpan="7" className="bank-state">{error}</td></tr> : members.length === 0 ? <tr><td colSpan="7" className="bank-state">No KYC details submitted.</td></tr> : members.map((member, index) => <tr key={member.user_id}><td>{index + 1}</td><td className="bank-member-id">{member.user_id || "-"}</td><td>{member.fullname || "-"}</td><td>{member.kyc?.aadhar_no || "-"}</td><td>{member.kyc?.pan_no || "-"}</td><td><span className={`bank-status bank-status--${String(member.kyc?.status || "not-submitted").toLowerCase()}`}>{statusLabel(member.kyc?.status)}</span></td><td><button type="button" className="bank-view-btn" onClick={() => openDetails(member)}><FiEye /> View</button></td></tr>)}
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
