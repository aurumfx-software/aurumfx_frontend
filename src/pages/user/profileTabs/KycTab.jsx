import { useEffect, useState } from "react";
import { FiUpload, FiTrash2, FiEye, FiLock } from "react-icons/fi";
import {
  uploadKycDocumentApi,
  getMyKycApi,
  deleteKycDocumentApi,
  viewKycDocumentApi,
  updateProfileApi,
} from "../../../api/auth";
import {
  StatusBadge,
  normalizeStatus,
  formatDocType,
  buildProfilePayload,
  KYC_DOC_TYPE_AADHAAR_FRONT,
  KYC_DOC_TYPE_AADHAAR_BACK,
  KYC_DOC_TYPE_PAN,
} from "./shared";

function KycTab({ profileData, setProfileData }) {
  const [aadhaarNumber, setAadhaarNumber] = useState(profileData?.aadharNo || "");
  const [panNumber, setPanNumber] = useState(profileData?.pan || "");
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const isAadhaarComplete = !!aadhaarNumber.trim() && !!aadhaarFront && !!aadhaarBack;
  const isPanComplete = !!panNumber.trim() && !!panFile;
  const isBothRequiredDocsComplete = isAadhaarComplete && isPanComplete;

  const [kycDocs, setKycDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const loadKyc = async () => {
    setLoadingDocs(true);
    const res = await getMyKycApi();
    if (res.success) {
      const list = res.data?.data || res.data || [];
      setKycDocs(Array.isArray(list) ? list : []);
    }
    setLoadingDocs(false);
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");

    if (!isAadhaarComplete || !isPanComplete) {
      setUploadError("Both Aadhaar and PAN documents are required. Please fill in both document details and upload both files.");
      return;
    }

    const uploads = [
      { type: KYC_DOC_TYPE_AADHAAR_FRONT, file: aadhaarFront },
      { type: KYC_DOC_TYPE_AADHAAR_BACK, file: aadhaarBack },
      { type: KYC_DOC_TYPE_PAN, file: panFile },
    ];

    setUploading(true);

    const profileRes = await updateProfileApi(
      buildProfilePayload(profileData, {
        aadhar_no: aadhaarNumber,
        pan: panNumber,
      })
    );

    if (!profileRes.success) {
      setUploadError(profileRes.error || "Failed to save document number");
      setUploading(false);
      return;
    }

    for (const item of uploads) {
      const res = await uploadKycDocumentApi(item.type, item.file);
      if (!res.success) {
        setUploadError(res.error || "Failed to upload document");
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    setUploadSuccess("Aadhaar and PAN documents submitted for review!");
    setAadhaarFront(null);
    setAadhaarBack(null);
    setPanFile(null);
    setProfileData((prev) => ({
      ...prev,
      aadharNo: aadhaarNumber,
      pan: panNumber,
    }));
    setTimeout(() => setUploadSuccess(""), 3000);
    loadKyc();
  };

  const handleDelete = async (kycId) => {
    const res = await deleteKycDocumentApi(kycId);
    if (res.success) loadKyc();
  };

  const handleView = async (kycId) => {
    const res = await viewKycDocumentApi(kycId);
    const url = res.data?.data?.url || res.data?.url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <span className="content-eyebrow">Verification</span>
      <h1 className="content-title">KYC Documents</h1>
      <p className="content-intro">
        Both Aadhaar and PAN documents are required before your KYC can be reviewed.
      </p>

      <form onSubmit={handleUpload} className="doc-form kyc-upload-form">
        <div className="field-group">
          <label className="field-label">
            Aadhaar Number<span className="field-required-mark">*</span>
          </label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="XXXX XXXX XXXX"
            className="field-input"
          />
        </div>

        <div className="kyc-photo-row">
          <div className="field-group">
            <span className="kyc-photo-slot-label">Front Side</span>
            <label
              className={`upload-dropzone ${aadhaarFront ? "is-filled" : ""}`}
              htmlFor="aadhaar-front-upload"
            >
              <FiUpload />
              <span>{aadhaarFront ? aadhaarFront.name : "Choose front photo"}</span>
              <input
                id="aadhaar-front-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setAadhaarFront(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="field-group">
            <span className="kyc-photo-slot-label">Back Side</span>
            <label
              className={`upload-dropzone ${aadhaarBack ? "is-filled" : ""}`}
              htmlFor="aadhaar-back-upload"
            >
              <FiUpload />
              <span>{aadhaarBack ? aadhaarBack.name : "Choose back photo"}</span>
              <input
                id="aadhaar-back-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setAadhaarBack(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">
            PAN Number<span className="field-required-mark">*</span>
          </label>
          <input
            type="text"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            className="field-input"
          />
        </div>

        <div className="kyc-photo-row single">
          <div className="field-group">
            <span className="kyc-photo-slot-label">PAN Card Photo</span>
            <label className={`upload-dropzone ${panFile ? "is-filled" : ""}`} htmlFor="pan-upload">
              <FiUpload />
              <span>{panFile ? panFile.name : "Choose PAN card photo"}</span>
              <input
                id="pan-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setPanFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        {uploadSuccess && <p className="form-success-msg">{uploadSuccess}</p>}
        {uploadError && <p className="form-error-msg">{uploadError}</p>}

        <button type="submit" className="field-submit-btn" disabled={uploading || !isBothRequiredDocsComplete}>
          {uploading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>

      <div className="kyc-doc-list">
        {loadingDocs ? (
          <p className="loading-state">Loading documents…</p>
        ) : kycDocs.length === 0 ? (
          <div className="empty-kyc">No documents uploaded yet.</div>
        ) : (
          kycDocs.map((doc) => {
            const status = normalizeStatus(doc.status);
            const locked = status === "approved";
            return (
              <div className="kyc-doc-row" key={doc.id || doc.kyc_id}>
                <div className="kyc-doc-info">
                  <span className="kyc-doc-type">{formatDocType(doc.document_type)}</span>
                  <span className="kyc-doc-name">{doc.file_name || doc.filename || ""}</span>
                  {status === "rejected" && doc.rejection_reason && (
                    <span className="kyc-doc-reason">{doc.rejection_reason}</span>
                  )}
                </div>
                <StatusBadge status={status} />
                <div className="kyc-doc-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleView(doc.id || doc.kyc_id)}
                    title="View"
                  >
                    <FiEye />
                  </button>
                  {locked ? (
                    <span className="kyc-lock-icon" title="Locked">
                      <FiLock />
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => handleDelete(doc.id || doc.kyc_id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default KycTab;