import { FiUser, FiEdit, FiSettings, FiCreditCard, FiFileText, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
export const NAV_ITEMS = [
  { id: "profile", label: "Overview", icon: FiUser },
  { id: "bank", label: "Bank Details", icon: FiCreditCard },
  { id: "kyc", label: "KYC", icon: FiFileText },
  { id: "edit", label: "Edit Info", icon: FiEdit },
  { id: "settings", label: "Settings", icon: FiSettings },
];

// ---------------------------------------------------------------------------
// Status vocabulary shared by Bank Details and every KYC document
// ---------------------------------------------------------------------------
export const STATUS_META = {
  approved: { label: "Approved", Icon: FiCheckCircle, tone: "approved" },
  pending: { label: "Pending Review", Icon: FiClock, tone: "pending" },
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

// Builds the full PUT /auth/profile payload from the shared profileData
// state, with optional field overrides (e.g. aadhar_no, pan) merged in.
// Centralized here so EditInfoTab and KycTab never drift out of sync with
// the backend schema.
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
    aadhar_no: profileData.aadharNo || "",
    pan: profileData.pan || "",
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