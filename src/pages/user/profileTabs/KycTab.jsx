import { useEffect, useState } from "react";
import { FiUpload, FiLock, FiDownload } from "react-icons/fi";
import {
  uploadKycDocumentApi,
  getMyKycApi,
} from "../../../api/auth";
import {
  StatusBadge,
  normalizeStatus,
  KYC_DOC_TYPE_AADHAAR_FRONT,
  KYC_DOC_TYPE_AADHAAR_BACK,
  KYC_DOC_TYPE_PAN,
} from "./shared";

const shortFileName = (value) => {
  const name = String(value || "");
  if (name.length <= 24) return name;
  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex > 0 ? name.slice(extensionIndex) : "";
  return `${name.slice(0, Math.max(10, 21 - extension.length))}...${extension}`;
};

function KycTab({ profileData, setProfileData }) {
  const [aadhaarNumber, setAadhaarNumber] = useState(profileData?.aadharNo || "");
  const [panNumber, setPanNumber] = useState(profileData?.pan || "");
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [panFile, setPanFile] = useState(null);

  const [kycDocs, setKycDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const getDocument = (type) => kycDocs.find((doc) => {
    if (doc.document_type === type) return true;
    return (type === KYC_DOC_TYPE_AADHAAR_FRONT || type === KYC_DOC_TYPE_AADHAAR_BACK) &&
      ["aadhar", "aadhaar"].includes(String(doc.document_type).toLowerCase());
  });

  const requiredKycTypes = [
    KYC_DOC_TYPE_AADHAAR_FRONT,
    KYC_DOC_TYPE_AADHAAR_BACK,
    KYC_DOC_TYPE_PAN,
  ];
  const kycLocked = requiredKycTypes.every((type) =>
    normalizeStatus(getDocument(type)?.status) === "approved"
  );

  const kycStatus = kycDocs.length === 0
    ? "not_submitted"
    : kycLocked
      ? "approved"
      : kycDocs.some((doc) => normalizeStatus(doc.status) === "rejected")
        ? "rejected"
        : "pending";

  const getDocumentUrl = (type) => {
    const doc = getDocument(type);
    if (!doc) return "";
    if (type === KYC_DOC_TYPE_AADHAAR_FRONT) {
      return doc.front_url || doc.front_file_url || doc.aadhar_front_url || doc.aadhaar_front_url || doc.front_photo || doc.front_image || doc.front_file || doc.url || doc.file_url || doc.file_path || doc.path || "";
    }
    if (type === KYC_DOC_TYPE_AADHAAR_BACK) {
      return doc.back_url || doc.back_file_url || doc.aadhar_back_url || doc.aadhaar_back_url || doc.back_photo || doc.back_image || doc.back_file || doc.url || doc.file_url || doc.file_path || doc.path || "";
    }
    return doc.front_url || doc.url || doc.file_url || doc.document_url || doc.image_url || doc.pan_photo || doc.pan_image || doc.file || doc.file_path || doc.path || "";
  };

  const getDocumentStatus = (type) => normalizeStatus(getDocument(type)?.status);
  const getDocumentFileName = (type, side = "front") => {
    const doc = getDocument(type);
    if (!doc) return "";
    return side === "back"
      ? doc.back_file_name || doc.back_filename || ""
      : doc.front_file_name || doc.file_name || doc.filename || "";
  };

  const loadKyc = async () => {
    setLoadingDocs(true);
    const res = await getMyKycApi();
    if (res.success) {
      const payload = res.data?.data || res.data || [];
      const list = Array.isArray(payload)
        ? payload
        : payload?.documents || payload?.kyc_documents || (payload?.document_type ? [payload] : []);
      const docs = Array.isArray(list) ? list : [];
      setKycDocs(docs);

      const aadhaarDoc = docs.find((doc) => ["aadhar", "aadhaar", KYC_DOC_TYPE_AADHAAR_FRONT].includes(String(doc.document_type).toLowerCase()));
      const panDoc = docs.find((doc) => doc.document_type === KYC_DOC_TYPE_PAN);
      const loadedAadhaar = payload?.aadhar_no || payload?.aadhaar_no || aadhaarDoc?.aadhar_no || aadhaarDoc?.aadhar_number || aadhaarDoc?.aadhaar_number;
      const loadedPan = payload?.pan || panDoc?.pan || panDoc?.pan_number;
      if (loadedAadhaar) {
        setAadhaarNumber(String(loadedAadhaar));
        setProfileData((prev) => ({ ...prev, aadharNo: String(loadedAadhaar) }));
      }
      if (loadedPan) {
        setPanNumber(String(loadedPan));
        setProfileData((prev) => ({ ...prev, pan: String(loadedPan) }));
      }
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

    if (kycLocked) {
      setUploadError("Approved KYC documents are locked. Contact support to make changes.");
      return;
    }

    const existingFront = getDocument(KYC_DOC_TYPE_AADHAAR_FRONT);
    const existingBack = getDocument(KYC_DOC_TYPE_AADHAAR_BACK);
    const existingPan = getDocument(KYC_DOC_TYPE_PAN);
    if (!aadhaarNumber.trim() || (!aadhaarFront && !existingFront) || (!aadhaarBack && !existingBack) || !panNumber.trim() || (!panFile && !existingPan)) {
      setUploadError("Aadhaar number, Aadhaar front photo, Aadhaar back photo, PAN number, and PAN photo are required.");
      return;
    }
    if (!/^\d{12}$/.test(aadhaarNumber.replace(/\s/g, ""))) {
      setUploadError("Aadhaar number must contain exactly 12 digits.");
      return;
    }
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(panNumber.trim().toUpperCase())) {
      setUploadError("Please enter a valid PAN number, for example ABCDE1234F.");
      return;
    }
    if (!aadhaarFront && !aadhaarBack && !panFile) {
      setUploadError("Choose at least one document photo to submit an update.");
      return;
    }

    setUploading(true);

    const uploadRes = await uploadKycDocumentApi({
      aadharNumber: aadhaarNumber.trim(),
      aadhaarFront,
      aadhaarBack,
      panNumber: panNumber.trim().toUpperCase(),
      panImage: panFile,
    });
    if (!uploadRes.success) {
      setUploadError(uploadRes.error || "Failed to upload KYC documents");
      setUploading(false);
      return;
    }

    setUploading(false);
    setUploadSuccess("Aadhaar and PAN documents submitted for review!");
    setAadhaarFront(null);
    setAadhaarBack(null);
    setPanFile(null);
    setProfileData((prev) => ({
      ...prev,
      aadharNo: aadhaarNumber.replace(/\s/g, ""),
      pan: panNumber.trim().toUpperCase(),
    }));
    setTimeout(() => setUploadSuccess(""), 3000);
    await loadKyc();
  };

  return (
    <>
      <span className="content-eyebrow">Verification</span>
      <h1 className="content-title">KYC Documents</h1>
      <p className="content-intro">
        Both Aadhaar and PAN documents are required before your KYC can be reviewed.
      </p>

      <div className="status-banner-row kyc-document-status-row">
        <div className="kyc-status-items">
          <span className="kyc-status-item">Aadhaar & PAN <StatusBadge status={kycStatus} /></span>
        </div>
      </div>

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
            disabled={kycLocked}
          />
        </div>

        <div className="kyc-photo-row">
          <div className="field-group">
            <span className="kyc-photo-slot-label">Aadhaar Card Front Photo</span>
            <label
              className={`upload-dropzone ${aadhaarFront ? "is-filled" : ""} ${kycLocked ? "is-disabled" : ""}`}
              htmlFor="aadhaar-front-upload"
            >
              <FiUpload />
              <span className="upload-file-name" title={aadhaarFront?.name || getDocumentFileName(KYC_DOC_TYPE_AADHAAR_FRONT)}>{shortFileName(aadhaarFront?.name || getDocumentFileName(KYC_DOC_TYPE_AADHAAR_FRONT) || "Choose front photo")}</span>
              <input
                id="aadhaar-front-upload"
                type="file"
                accept="image/*"
                disabled={kycLocked}
                onChange={(e) => setAadhaarFront(e.target.files?.[0] || null)}
              />
            </label>
            {getDocumentUrl(KYC_DOC_TYPE_AADHAAR_FRONT) && (
              <div className="kyc-photo-preview">
                <img src={getDocumentUrl(KYC_DOC_TYPE_AADHAAR_FRONT)} alt="Aadhaar front" />
                <a href={getDocumentUrl(KYC_DOC_TYPE_AADHAAR_FRONT)} download title="Download Aadhaar front"><FiDownload /></a>
              </div>
            )}
          </div>
          <div className="field-group">
            <span className="kyc-photo-slot-label">Aadhaar Card Back Photo</span>
            <label
              className={`upload-dropzone ${aadhaarBack ? "is-filled" : ""} ${kycLocked ? "is-disabled" : ""}`}
              htmlFor="aadhaar-back-upload"
            >
              <FiUpload />
              <span className="upload-file-name" title={aadhaarBack?.name || getDocumentFileName(KYC_DOC_TYPE_AADHAAR_BACK, "back")}>{shortFileName(aadhaarBack?.name || getDocumentFileName(KYC_DOC_TYPE_AADHAAR_BACK, "back") || "Choose back photo")}</span>
              <input
                id="aadhaar-back-upload"
                type="file"
                accept="image/*"
                disabled={kycLocked}
                onChange={(e) => setAadhaarBack(e.target.files?.[0] || null)}
              />
            </label>
            {getDocumentUrl(KYC_DOC_TYPE_AADHAAR_BACK) && (
              <div className="kyc-photo-preview">
                <img src={getDocumentUrl(KYC_DOC_TYPE_AADHAAR_BACK)} alt="Aadhaar back" />
                <a href={getDocumentUrl(KYC_DOC_TYPE_AADHAAR_BACK)} download title="Download Aadhaar back"><FiDownload /></a>
              </div>
            )}
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
            disabled={kycLocked}
          />
        </div>

        <div className="kyc-photo-row single">
          <div className="field-group">
            <span className="kyc-photo-slot-label">PAN Card Photo</span>
            <label className={`upload-dropzone ${panFile ? "is-filled" : ""} ${kycLocked ? "is-disabled" : ""}`} htmlFor="pan-upload">
              <FiUpload />
              <span className="upload-file-name" title={panFile?.name || getDocumentFileName(KYC_DOC_TYPE_PAN)}>{shortFileName(panFile?.name || getDocumentFileName(KYC_DOC_TYPE_PAN) || "Choose PAN card photo")}</span>
              <input
                id="pan-upload"
                type="file"
                accept="image/*"
                disabled={kycLocked}
                onChange={(e) => setPanFile(e.target.files?.[0] || null)}
              />
            </label>
            {getDocumentUrl(KYC_DOC_TYPE_PAN) && (
              <div className="kyc-photo-preview">
                <img src={getDocumentUrl(KYC_DOC_TYPE_PAN)} alt="PAN card" />
                <a href={getDocumentUrl(KYC_DOC_TYPE_PAN)} download title="Download PAN card"><FiDownload /></a>
              </div>
            )}
          </div>
        </div>

        {uploadSuccess && <p className="form-success-msg">{uploadSuccess}</p>}
        {uploadError && <p className="form-error-msg">{uploadError}</p>}

        {kycLocked && (
          <div className="locked-note">
            <FiLock />
            <span>Approved KYC documents are locked. Contact support to make changes.</span>
          </div>
        )}

        <button type="submit" className="field-submit-btn" disabled={kycLocked || uploading}>
          {uploading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>

      {loadingDocs && <p className="loading-state">Loading KYC details...</p>}
    </>
  );
}

export default KycTab;