import { FiUpload, FiLock } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { API_BASE_URL } from "../../../api/axios";
import { StatusBadge, DocRow, maskAccount } from "./shared";

const shortFileName = (value) => {
  const name = String(value || "");
  if (name.length <= 24) return name;
  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : "";
  return `${name.slice(0, Math.max(10, 21 - extension.length))}...${extension}`;
};

function BankDetailsTab({
  bankDetails,
  setBankDetails,
  bankStatus,
  bankRejectionReason,
  proofDocument,
  setProofDocument,
  proofDocumentName,
  proofDocumentUrl,
  setProofDocumentName,
  nomineeAadharFront,
  setNomineeAadharFront,
  nomineeAadharBack,
  setNomineeAadharBack,
  nomineeAadharFrontUrl,
  nomineeAadharBackUrl,
  bankSaving,
  bankSavingMsg,
  bankError,
  handleBankSubmit,
}) {
  const bankLocked = bankStatus === "approved";
  const resolveDocumentUrl = (path) => {
    if (!path || path instanceof File || String(path).startsWith("blob:")) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL.replace(/\/api\/?$/, "")}/${String(path).replace(/^\//, "")}`;
  };
  const proofUrl = resolveDocumentUrl(proofDocumentUrl);
  const frontUrl = resolveDocumentUrl(nomineeAadharFrontUrl);
  const backUrl = resolveDocumentUrl(nomineeAadharBackUrl);
  const getFileLabel = (path, fallback) => {
    if (!path) return fallback;
    try {
      const fileName = decodeURIComponent(new URL(path).pathname.split("/").pop() || "");
      return fileName || fallback;
    } catch {
      return String(path).split("/").pop() || fallback;
    }
  };

  const documentPreview = (url, label, showLabel = false) => url && (
    <div className="bank-document-preview-wrap">
      {showLabel && <span className="document-preview-label">{label}</span>}
      <div className="bank-document-preview">
        <img src={url} alt={label} />
        <a href={url} download title={`Download ${label}`}><FiDownload /></a>
      </div>
    </div>
  );

  return (
    <>
      <span className="content-eyebrow">Payouts</span>
      <h1 className="content-title">Bank Details</h1>
      <p className="content-intro">
        Where your withdrawals are sent. Nominee details are mandatory for compliance.
      </p>

      <div className="status-banner-row">
        <StatusBadge status={bankStatus} />
        {bankStatus === "rejected" && bankRejectionReason && (
          <span className="status-reason">{bankRejectionReason}</span>
        )}
      </div>

      {bankLocked ? (
        <div className="doc-section">
          <DocRow label="Bank Name" value={bankDetails.bank_name} />
          <DocRow label="Account Number" value={maskAccount(bankDetails.bank_account)} />
          <DocRow label="IFSC Code" value={bankDetails.ifsc} />
          <DocRow label="Nominee Name" value={bankDetails.nominee_name} />
          <DocRow label="Nominee Relation" value={bankDetails.nominee_relation} />
          <DocRow label="Nominee Gender" value={bankDetails.nominee_gender} />
          <DocRow label="Nominee Date of Birth" value={bankDetails.nominee_dob} />
          <DocRow label="Nominee Address" value={bankDetails.nominee_address} />
          <DocRow label="Nominee Aadhaar" value={bankDetails.nominee_aadhar} />
          <DocRow label="Nominee Mobile" value={bankDetails.nominee_mobile} />
          <DocRow label="Passbook Proof" value={proofUrl ? "Uploaded" : proofDocumentName || "Uploaded"} />
          <div className="bank-document-gallery">
            {documentPreview(proofUrl, "Bank Passbook Photo", true)}
            {documentPreview(frontUrl, "Nominee Aadhaar Card Front Photo", true)}
            {documentPreview(backUrl, "Nominee Aadhaar Card Back Photo", true)}
          </div>
          <div className="locked-note">
            <FiLock />
            <span>Approved bank details are locked. Contact support to make changes.</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBankSubmit} className="doc-form">
          <div className="form-divider-label">Account Details</div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">
                Bank Name<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.bank_name}
                onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">
                Account Number<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.bank_account}
                onChange={(e) => setBankDetails({ ...bankDetails, bank_account: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">
                IFSC Code<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.ifsc}
                onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">
                Bank Passbook Photo<span className="field-required-mark">*</span>
              </label>
              <label className={`upload-dropzone ${proofDocument ? "is-filled" : ""}`} htmlFor="bank-proof-upload">
                <FiUpload />
                <span className="upload-file-name" title={proofDocument?.name || proofDocumentName}>{shortFileName(proofDocument?.name || proofDocumentName || "Choose passbook photo")}</span>
                <input
                  id="bank-proof-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setProofDocument(file);
                    if (file) setProofDocumentName(file.name);
                  }}
                />
              </label>
              {documentPreview(proofUrl, "Passbook proof")}
            </div>
          </div>

          <div className="form-divider-label">Nominee Details</div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">
                Nominee Name<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.nominee_name}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_name: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">
                Nominee Relation<span className="field-required-mark">*</span>
              </label>
              <select
                value={bankDetails.nominee_relation}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_relation: e.target.value })}
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

          {bankDetails.nominee_relation === "Other" && (
            <div className="field-group">
              <label className="field-label">
                Specify Nominee Relationship<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.nominee_relation_other}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    nominee_relation_other: e.target.value,
                  })
                }
                className="field-input"
                placeholder="Enter relationship"
              />
            </div>
          )}

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Nominee Gender</label>
              <select
                value={bankDetails.nominee_gender}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_gender: e.target.value })}
                className="field-input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">
                Nominee Date of Birth<span className="field-required-mark">*</span>
              </label>
              <input
                type="date"
                value={bankDetails.nominee_dob}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_dob: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">
                Nominee Aadhaar<span className="field-required-mark">*</span>
              </label>
              <input
                type="text"
                value={bankDetails.nominee_aadhar}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_aadhar: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">
                Nominee Mobile<span className="field-required-mark">*</span>
              </label>
              <input
                type="tel"
                value={bankDetails.nominee_mobile}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_mobile: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="kyc-photo-row">
            <div className="field-group">
              <span className="kyc-photo-slot-label">
                Aadhaar Card Front<span className="field-required-mark">*</span>
              </span>
              <label
                className={`upload-dropzone ${nomineeAadharFront ? "is-filled" : ""}`}
                htmlFor="nominee-aadhar-front-upload"
              >
                <FiUpload />
                <span className="upload-file-name" title={nomineeAadharFront?.name || getFileLabel(nomineeAadharFrontUrl, "Existing front photo")}>{shortFileName(nomineeAadharFront?.name || getFileLabel(nomineeAadharFrontUrl, "Existing front photo"))}</span>
                <input
                  id="nominee-aadhar-front-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNomineeAadharFront(e.target.files?.[0] || null)}
                />
              </label>
              {documentPreview(frontUrl, "Nominee Aadhaar front")}
            </div>
            <div className="field-group">
              <span className="kyc-photo-slot-label">
                Aadhaar Card Back<span className="field-required-mark">*</span>
              </span>
              <label
                className={`upload-dropzone ${nomineeAadharBack ? "is-filled" : ""}`}
                htmlFor="nominee-aadhar-back-upload"
              >
                <FiUpload />
                <span className="upload-file-name" title={nomineeAadharBack?.name || getFileLabel(nomineeAadharBackUrl, "Existing back photo")}>{shortFileName(nomineeAadharBack?.name || getFileLabel(nomineeAadharBackUrl, "Existing back photo"))}</span>
                <input
                  id="nominee-aadhar-back-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNomineeAadharBack(e.target.files?.[0] || null)}
                />
              </label>
              {documentPreview(backUrl, "Nominee Aadhaar back")}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Nominee Address</label>
            <input
              type="text"
              value={bankDetails.nominee_address}
              onChange={(e) => setBankDetails({ ...bankDetails, nominee_address: e.target.value })}
              className="field-input"
            />
          </div>

          {bankSavingMsg && <p className="form-success-msg">{bankSavingMsg}</p>}
          {bankError && <p className="form-error-msg">{bankError}</p>}

          <button type="submit" className="field-submit-btn" disabled={bankSaving}>
            {bankSaving
              ? "Submitting..."
              : bankStatus === "pending" || bankStatus === "rejected"
              ? "Resubmit for Review"
              : "Submit for Review"}
          </button>
        </form>
      )}
    </>
  );
}

export default BankDetailsTab;