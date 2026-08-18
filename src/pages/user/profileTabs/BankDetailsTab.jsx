import { FiUpload, FiLock } from "react-icons/fi";
import { StatusBadge, DocRow, maskAccount } from "./shared";

function BankDetailsTab({
  bankDetails,
  setBankDetails,
  bankStatus,
  bankRejectionReason,
  proofDocument,
  setProofDocument,
  proofDocumentName,
  setProofDocumentName,
  bankSaving,
  bankSavingMsg,
  bankError,
  handleBankSubmit,
}) {
  const bankLocked = bankStatus === "approved";

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
          <DocRow label="Passbook Proof" value={proofDocumentName || "Uploaded"} />
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
                <span>{proofDocument ? proofDocument.name : "Choose passbook photo"}</span>
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
              <label className="field-label">Nominee Relation</label>
              <input
                type="text"
                value={bankDetails.nominee_relation}
                onChange={(e) => setBankDetails({ ...bankDetails, nominee_relation: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

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
              <label className="field-label">Nominee Date of Birth</label>
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