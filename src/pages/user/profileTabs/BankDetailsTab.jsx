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
  onRefresh,
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
        <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${label} in full size`}>
          <img src={url} alt={label} />
        </a>
        <a href={url} download title={`Download ${label}`} className="download-link"><FiDownload /></a>
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
        <button type="button" className="field-refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {bankLocked ? (
        <div className="doc-section">
          <DocRow label="Bank Name" value={bankDetails.bank_name} />
          <DocRow label="Account Number" value={bankDetails.bank_account || bankDetails.account_number || ""} />
          <DocRow label="IFSC Code" value={bankDetails.ifsc} />
          <DocRow label="Passbook Proof" value={proofUrl ? "Uploaded" : proofDocumentName || "Uploaded"} />
          <div className="bank-document-gallery">
            {documentPreview(proofUrl, "Bank Passbook Photo", true)}
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