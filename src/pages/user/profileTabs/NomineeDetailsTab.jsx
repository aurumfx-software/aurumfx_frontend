import { FiUpload, FiLock } from "react-icons/fi";
import { API_BASE_URL } from "../../../api/axios";
import { StatusBadge, DocRow, maskAccount } from "./shared";

const shortFileName = (value) => {
  const name = String(value || "");
  if (name.length <= 24) return name;
  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : "";
  return `${name.slice(0, Math.max(10, 21 - extension.length))}...${extension}`;
};

function NomineeDetailsTab({
  nomineeDetails,
  setNomineeDetails,
  nomineeStatus,
  nomineeRejectionReason,
  nomineeAadharFront,
  setNomineeAadharFront,
  nomineeAadharBack,
  setNomineeAadharBack,
  nomineeAadharFrontUrl,
  nomineeAadharBackUrl,
  saving,
  savingMsg,
  error,
  handleNomineeSubmit,
  onRefresh,
}) {
  const locked = nomineeStatus === "approved";
  const resolveDocumentUrl = (path) => {
    if (!path || path instanceof File || String(path).startsWith("blob:")) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL.replace(/\/api\/?$/, "")}/${String(path).replace(/^\//, "")}`;
  };

  const frontUrl = resolveDocumentUrl(nomineeAadharFrontUrl);
  const backUrl = resolveDocumentUrl(nomineeAadharBackUrl);

  const documentPreview = (url, label, showLabel = false) => url && (
    <div className="bank-document-preview-wrap">
      {showLabel && <span className="document-preview-label">{label}</span>}
      <div className="bank-document-preview">
        <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${label} in full size`}>
          <img src={url} alt={label} />
        </a>
      </div>
    </div>
  );

  return (
    <>
      <span className="content-eyebrow">Compliance</span>
      <h1 className="content-title">Nominee Details</h1>
      <p className="content-intro">
        Nominee information is maintained separately from bank details and is required for approval.
      </p>

      <div className="status-banner-row">
        <StatusBadge status={nomineeStatus} />
        {nomineeStatus === "rejected" && nomineeRejectionReason && (
          <span className="status-reason">{nomineeRejectionReason}</span>
        )}
        <button type="button" className="field-refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {locked ? (
        <div className="doc-section">
          <DocRow label="Nominee Name" value={nomineeDetails.nominee_name} />
          <DocRow label="Relation" value={nomineeDetails.nominee_relation} />
          <DocRow label="Gender" value={nomineeDetails.nominee_gender} />
          <DocRow label="Date of Birth" value={nomineeDetails.nominee_dob} />
          <DocRow label="Address" value={nomineeDetails.nominee_address} />
          <DocRow label="Aadhaar Number" value={nomineeDetails.nominee_aadhar} />
          <DocRow label="Mobile Number" value={nomineeDetails.nominee_mobile} />
          <div className="bank-document-gallery">
            {documentPreview(frontUrl, "Nominee Aadhaar Card Front Photo", true)}
            {documentPreview(backUrl, "Nominee Aadhaar Card Back Photo", true)}
          </div>
          <div className="locked-note">
            <FiLock />
            <span>Approved nominee details are locked. Contact support to make changes.</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleNomineeSubmit} className="doc-form">
          <div className="form-divider-label">Nominee Details</div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Nominee Name</label>
              <input
                type="text"
                value={nomineeDetails.nominee_name}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_name: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Nominee Relation</label>
              <select
                value={nomineeDetails.nominee_relation}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_relation: e.target.value })}
                className="field-input"
              >
                <option value="">Select relationship</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Husband">Husband</option>
                <option value="Wife">Wife</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {nomineeDetails.nominee_relation === "Other" && (
            <div className="field-group">
              <label className="field-label">Specify Nominee Relationship</label>
              <input
                type="text"
                value={nomineeDetails.nominee_relation_other || ""}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_relation_other: e.target.value })}
                className="field-input"
                placeholder="Enter relationship"
              />
            </div>
          )}

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Nominee Gender</label>
              <select
                value={nomineeDetails.nominee_gender}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_gender: e.target.value })}
                className="field-input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Nominee Date of Birth</label>
              <input
                type="date"
                value={nomineeDetails.nominee_dob}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_dob: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Nominee Address</label>
            <input
              type="text"
              value={nomineeDetails.nominee_address}
              onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_address: e.target.value })}
              className="field-input"
            />
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Nominee Aadhaar</label>
              <input
                type="text"
                value={nomineeDetails.nominee_aadhar}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_aadhar: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Nominee Mobile</label>
              <input
                type="tel"
                value={nomineeDetails.nominee_mobile}
                onChange={(e) => setNomineeDetails({ ...nomineeDetails, nominee_mobile: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="kyc-photo-row">
            <div className="field-group">
              <span className="kyc-photo-slot-label">Aadhaar Card Front</span>
              <label className={`upload-dropzone ${nomineeAadharFront ? "is-filled" : ""}`} htmlFor="nominee-front-upload">
                <FiUpload />
                <span className="upload-file-name" title={nomineeAadharFront?.name || "Existing front photo"}>{shortFileName(nomineeAadharFront?.name || "Existing front photo")}</span>
                <input
                  id="nominee-front-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNomineeAadharFront(e.target.files?.[0] || null)}
                />
              </label>
              {documentPreview(frontUrl, "Nominee Aadhaar front")}
            </div>

            <div className="field-group">
              <span className="kyc-photo-slot-label">Aadhaar Card Back</span>
              <label className={`upload-dropzone ${nomineeAadharBack ? "is-filled" : ""}`} htmlFor="nominee-back-upload">
                <FiUpload />
                <span className="upload-file-name" title={nomineeAadharBack?.name || "Existing back photo"}>{shortFileName(nomineeAadharBack?.name || "Existing back photo")}</span>
                <input
                  id="nominee-back-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNomineeAadharBack(e.target.files?.[0] || null)}
                />
              </label>
              {documentPreview(backUrl, "Nominee Aadhaar back")}
            </div>
          </div>

          {savingMsg && <p className="form-success-msg">{savingMsg}</p>}
          {error && <p className="form-error-msg">{error}</p>}

          <button type="submit" className="field-submit-btn" disabled={saving}>
            {saving ? "Submitting..." : nomineeStatus === "pending" || nomineeStatus === "rejected" ? "Resubmit Nominee Details" : "Submit Nominee Details"}
          </button>
        </form>
      )}
    </>
  );
}

export default NomineeDetailsTab;
