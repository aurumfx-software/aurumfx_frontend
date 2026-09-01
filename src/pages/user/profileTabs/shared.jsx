import { FiUser, FiEdit, FiSettings, FiCreditCard, FiFileText, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
export const NAV_ITEMS = [
  { id: "profile", label: "Overview", icon: FiUser },
  { id: "bank", label: "Bank Details", icon: FiCreditCard },
  { id: "nominee", label: "Nominee Details", icon: FiUser },
  { id: "kyc", label: "KYC", icon: FiFileText },
  { id: "edit", label: "Edit Info", icon: FiEdit },
  { id: "settings", label: "Settings", icon: FiSettings },
];

// ---------------------------------------------------------------------------
// Status vocabulary shared by Bank Details and every KYC document
// ---------------------------------------------------------------------------
export const STATUS_META = {
  approved: { label: "Approved", Icon: FiCheckCircle, tone: "approved" },
  pending: { label: "Pending", Icon: FiClock, tone: "pending" },
  rejected: { label: "Rejected", Icon: FiXCircle, tone: "rejected" },
  not_submitted: { label: "Not Submitted", Icon: FiAlertCircle, tone: "muted" },
};

// Aadhaar and PAN are handled as dedicated, mandatory documents (see
// KycTab.jsx), so they're intentionally left out of this generic list.
export const KYC_DOC_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "bank_passbook", label: "Bank Passbook" },
  { value: "other", label: "Other Document" },
];

export const KYC_DOC_TYPE_AADHAAR_FRONT = "aadhar_front";
export const KYC_DOC_TYPE_AADHAAR_BACK = "aadhar_back";
export const KYC_DOC_TYPE_PAN = "pan";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Normalize whatever status string the backend sends into one of four
// known states so the UI never has to guess.
export const normalizeStatus = (raw) => {
  const s = (raw || "").toString().toLowerCase();
  if (s.includes("approv") || s.includes("verified")) return "approved";
  if (s.includes("reject") || s.includes("fail")) return "rejected";
  if (s.includes("pending") || s.includes("review") || s.includes("submit"))
    return "pending";
  return "not_submitted";
};

const isFilled = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

// KYC counts as "submitted" only once all 3 mandatory docs are uploaded.
// Never trust `status` for this — backend can send "PENDING" by default
// even when nothing has been uploaded yet.
export const hasKycSubmission = (kyc = {}) =>
  isFilled(kyc.aadhar_front_url) &&
  isFilled(kyc.aadhar_back_url) &&
  isFilled(kyc.pan_url);

// Bank counts as "submitted" only once every required bank + nominee field
// (including bank proof and nominee Aadhaar front/back) is actually filled.
export const hasBankSubmission = (bankDetails = {}, nomineeDetails = {}) => {
  const requiredFields = [
    bankDetails.bank_name,
    bankDetails.bank_account,
    bankDetails.ifsc,
    bankDetails.bank_proof,
  ];
  return requiredFields.every(isFilled);
};

export const hasNomineeSubmission = (nomineeDetails = {}) => {
  const requiredFields = [
    nomineeDetails.nominee_name,
    nomineeDetails.nominee_relation,
    nomineeDetails.nominee_gender,
    nomineeDetails.nominee_dob,
    nomineeDetails.nominee_address,
    nomineeDetails.nominee_aadhar,
    nomineeDetails.nominee_mobile,
    nomineeDetails.nominee_aadhar_front,
    nomineeDetails.nominee_aadhar_back,
  ];
  return requiredFields.every(isFilled);
};

// Combines "is it actually submitted" with the backend status. If not
// submitted, it's "not_submitted" no matter what status says. If submitted
// but status is missing/unrecognized, default to "pending" (never
// "not_submitted") since the user did upload something.
export const deriveSectionStatus = (isSubmitted, rawStatus) => {
  if (!isSubmitted) return "not_submitted";
  const normalized = normalizeStatus(rawStatus);
  return normalized === "not_submitted" ? "pending" : normalized;
};

export const formatDocType = (value) => {
  const match = [
    ...KYC_DOC_TYPES,
    { value: KYC_DOC_TYPE_AADHAAR_FRONT, label: "Aadhaar Card (Front)" },
    { value: KYC_DOC_TYPE_AADHAAR_BACK, label: "Aadhaar Card (Back)" },
    { value: KYC_DOC_TYPE_PAN, label: "PAN Card" },
  ].find((t) => t.value === value);
  if (match) return match.label;
  if (!value) return "Document";
  return value
    .toString()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const maskAccount = (value) => {
  if (!value) return "";
  const str = String(value);
  if (str.length <= 4) return str;
  return `${"•".repeat(str.length - 4)}${str.slice(-4)}`;
};

// Builds the full PUT /auth/profile payload from the shared profileData state.
// The backend contract does not include profile image, Aadhaar, or PAN here.
export const buildProfilePayload = (profileData, overrides = {}) => {
  const [firstName, ...rest] = (profileData.fullName || "").trim().split(" ");
  const lastName = rest.join(" ") || "";

  return {
    email: profileData.email,
    first_name: firstName || "",
    last_name: lastName,
    date_of_birth: profileData.dateOfBirth,
    country: profileData.country,
    city: profileData.city,
    zip_code: profileData.zipCode,
    mobile: profileData.mobile,
    gender: profileData.gender,
    ...overrides,
  };
};

// ---------------------------------------------------------------------------
// Small shared presentational components
// ---------------------------------------------------------------------------
export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.not_submitted;
  const Icon = meta.Icon;
  return (
    <div className={`status-pill status-pill--${meta.tone}`}>
      <Icon />
      <span>{meta.label}</span>
    </div>
  );
}

export function DocRow({ label, value, emoji }) {
  return (
    <div className="doc-row">
      <span className="doc-row-label">
        {emoji ? <span className="doc-row-emoji">{emoji}</span> : null}
        {label}
      </span>
      <span className={`doc-row-value ${!value ? "is-empty" : ""}`}>
        {value || "Not provided"}
      </span>
    </div>
  );
}