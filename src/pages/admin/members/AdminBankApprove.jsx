import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiEye, FiRefreshCw, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllAdminMembersBankDetailsApi,
  getAdminMemberBankDetailsApi,
  updateAdminMemberBankStatusApi,
} from "../../../api/admin-bankdetails";
import "./AdminBankApprove.css";

const statusLabel = (value) => String(value || "NOT SUBMITTED").replace(/_/g, " ").toUpperCase();
const detailFields = [
  ["Bank Name", "bank_name"], ["Account Number", "bank_account"], ["IFSC Code", "ifsc"],
  ["Nominee Name", "nominee_name"], ["Nominee Relation", "nominee_relation"], ["Nominee Gender", "nominee_gender"],
  ["Nominee Date of Birth", "nominee_dob"], ["Nominee Address", "nominee_address"], ["Nominee Aadhaar", "nominee_aadhar"], ["Nominee Mobile", "nominee_mobile"],
];
const rankOptions = ["No Rank", "Investor", "Associate", "Manager"];

function AdminBankApprove() {
  const [members, setMembers] = useState([]);
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
  const [rank, setRank] = useState("");

  const loadMembers = async () => {
    setLoading(true);
    setError("");
    const result = await getAllAdminMembersBankDetailsApi();
    if (result.success) setMembers(result.data);
    else setError(result.error || "Unable to load bank details.");
    setLoading(false);
  };

  useEffect(() => { loadMembers(); }, []);

  const handleReport = (event) => {
    event.preventDefault();
    loadMembers();
  };

  const filteredMembers = members.filter((member) => {
    const memberDate = member.date_of_joining || member.date_of_join || member.created_at || "";
    const memberRank = member.rank || member.rank_name || "";
    return (!filterUserId || String(member.user_id || "").toLowerCase().includes(filterUserId.toLowerCase()))
      && (!rank || memberRank === rank)
      && (!startDate || !memberDate || String(memberDate).slice(0, 10) >= startDate)
      && (!endDate || !memberDate || String(memberDate).slice(0, 10) <= endDate);
  });

  const openDetails = async (member) => {
    setSelectedUserId(member.user_id);
    setDetails(null);
    setRejectionReason(member.bank_details?.rejection_reason || "");
    setError("");
    setLoadingDetails(true);
    const result = await getAdminMemberBankDetailsApi(member.user_id);
    if (result.success) {
      const response = result.data || {};
      setDetails({
        ...member,
        ...response,
        bank_details: {
          ...member.bank_details,
          ...response.bank_details,
          bank_name: response.bank_name ?? response.bank_details?.bank_name,
          bank_account: response.bank_account ?? response.bank_details?.bank_account,
          ifsc: response.ifsc ?? response.bank_details?.ifsc,
          bank_proof: response.bank_proof ?? response.bank_details?.bank_proof,
          status: response.bank_status ?? response.status ?? response.bank_details?.status,
          rejection_reason: response.rejection_reason ?? response.bank_details?.rejection_reason,
        },
        nominee_details: { ...member.nominee_details, ...response.nominee_details },
      });
    } else setDetails(member);
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
      setMembers((current) => current.map((member) => member.user_id === selectedUserId ? { ...member, bank_details: { ...member.bank_details, ...result.data, status } } : member));
      setDetails((current) => ({ ...current, bank_details: { ...current.bank_details, ...result.data, status } }));
      setMessage(result.data.message || `Bank details ${status.toLowerCase()} successfully.`);
    } else setError(result.error || "Unable to update bank status.");
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="admin-bank-approve-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow">
            <span className="agen-eyebrow-dot" />
            Member Verification
          </span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Bank Account Details</h1>
              <p className="agen-page-subtitle">Review and manage submitted member bank information</p>
            </div>
          </div>
          <div className="agen-breadcrumb">
            <span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Bank Account Details</span>
          </div>
        </div>

        <form className="bank-filters-card" onSubmit={handleReport}>
          <div className="filters-grid">
            <div className="filter-input-wrap"><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="filter-date-field" aria-label="Start date" /></div>
            <div className="filter-input-wrap"><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="filter-date-field" aria-label="End date" /></div>
            <div className="filter-select-wrap"><select value={filterUserId} onChange={(event) => setFilterUserId(event.target.value)} className="filter-select-field" aria-label="Select member"><option value="">All members</option>{members.map((member) => <option key={member.user_id} value={member.user_id}>{member.user_id} - {member.fullname}</option>)}</select></div>
            <div className="filter-select-wrap"><select value={rank} onChange={(event) => setRank(event.target.value)} className="filter-select-field" aria-label="Filter by rank"><option value="">All ranks</option>{rankOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
            <button type="submit" className="yellow-report-btn">Get Report</button>
          </div>
        </form>

        <section className="bank-details-card admin-bank-list-card">
          <div className="admin-bank-list-heading"><div><h2>Member Bank Details</h2><p>Review submitted bank information and verification status.</p></div><span>{filteredMembers.length} members</span></div>
          <div className="admin-bank-list-table-wrap">
            <table className="admin-bank-list-table"><thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Bank Name</th><th>Account Number</th><th>IFSC</th><th>Status</th><th>Action</th></tr></thead><tbody>
              {loading ? <tr><td colSpan="8" className="bank-state">Loading bank details...</td></tr> : error ? <tr><td colSpan="8" className="bank-state">{error}</td></tr> : filteredMembers.length === 0 ? <tr><td colSpan="8" className="bank-state">No bank details submitted.</td></tr> : filteredMembers.map((member, index) => { const bank = member.bank_details || {}; return <tr key={member.user_id}><td>{index + 1}</td><td className="bank-member-id">{member.user_id || "-"}</td><td>{member.fullname || "-"}</td><td>{bank.bank_name || "-"}</td><td>{bank.bank_account || "-"}</td><td>{bank.ifsc || "-"}</td><td><span className={`bank-status bank-status--${String(bank.status || "not-submitted").toLowerCase()}`}>{statusLabel(bank.status)}</span></td><td><button type="button" className="bank-view-btn" onClick={() => openDetails(member)}><FiEye /> View</button></td></tr>; })}
            </tbody></table>
          </div>
        </section>

        {details && createPortal(<div className="admin-bank-modal-backdrop" onClick={closeDetails}>
          <div className="admin-bank-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-bank-modal-header"><div><span className="bank-details-eyebrow">Member Bank Verification</span><h2>{details.fullname || selectedUserId}</h2><span className="bank-member-id">{details.user_id || selectedUserId}</span></div><button type="button" onClick={closeDetails} aria-label="Close"><FiX /></button></div>
            {loadingDetails ? <div className="bank-state"><FiRefreshCw className="bank-spinner" /> Loading details...</div> : <>
              <div className="admin-bank-modal-body"><div className="admin-bank-modal-status"><span>Status</span><strong>{statusLabel(details.bank_details?.status || details.bank_status)}</strong></div><div className="bank-details-section"><h3>Bank and Nominee Information</h3><div className="bank-details-grid">{detailFields.map(([label, key]) => <div className="bank-detail-item" key={key}><span>{label}</span><strong>{details.bank_details?.[key] || details.nominee_details?.[key] || "Not provided"}</strong></div>)}</div></div><div className="bank-details-section"><h3>Uploaded Documents</h3><div className="admin-bank-document-grid">{[ ["Bank Proof", details.bank_details?.bank_proof], ["Nominee Aadhaar Front", details.nominee_details?.nominee_aadhar_front], ["Nominee Aadhaar Back", details.nominee_details?.nominee_aadhar_back] ].map(([label, url]) => url ? <a className="bank-document-link" href={url} target="_blank" rel="noreferrer" key={label}><img src={url} alt={label} /><span>{label}</span></a> : <span className="bank-documents-empty" key={label}>{label}: Not provided</span>)}</div></div></div>
              {error && <div className="bank-feedback bank-feedback--error">{error}</div>}{message && <div className="bank-feedback bank-feedback--success">{message}</div>}
              <div className="bank-status-actions"><div className="rejection-field"><label htmlFor="bank-rejection-reason">Rejection reason</label><textarea id="bank-rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Required when rejecting" rows="3" /></div><div className="bank-action-buttons"><button type="button" className="btn-approve" onClick={() => handleStatusUpdate("Approved")} disabled={saving}><FiCheck /> Approve</button><button type="button" className="btn-reject" onClick={() => handleStatusUpdate("Rejected")} disabled={saving}><FiX /> Reject</button></div></div>
            </>}
          </div>
        </div>, document.body)}
      </div>
    </AdminLayout>
  );
}

export default AdminBankApprove;
