import { useState, useEffect } from "react";
import { FiArrowUpRight, FiPhone, FiCamera } from "react-icons/fi";
import {
  getProfileApi,
  updateProfileApi,
  updateProfileBankDetailsApi,
  changePasswordApi,
  uploadProfileImageApi,
} from "../../api/auth";
import UserLayout from "../../components/User/UserLayout";
import { NAV_ITEMS, normalizeStatus } from "./profileTabs/shared";
import OverviewTab from "./profileTabs/OverviewTab";
import EditInfoTab from "./profileTabs/EditInfoTab";
import SettingsTab from "./profileTabs/SettingsTab";
import BankDetailsTab from "./profileTabs/BankDetailsTab";
import KycTab from "./profileTabs/KycTab";
import "./Profile.css";

function Profile({ defaultTab = "profile" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const [profileData, setProfileData] = useState({
    userId: localStorage.getItem("userId") || "",
    userName: localStorage.getItem("userName") || "",
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    dateJoined: "",
    zipCode: "",
    city: "",
    country: "",
    dateOfBirth: "",
    avatar: "",
    aadharNo: "",
    pan: "",
  });

  const [savingMsg, setSavingMsg] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  // ---- Bank details + nominee state -------------------------------------
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    bank_account: "",
    ifsc: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_gender: "",
    nominee_dob: "",
    nominee_address: "",
    nominee_aadhar: "",
    nominee_mobile: "",
  });
  const [bankStatus, setBankStatus] = useState("not_submitted");
  const [bankRejectionReason, setBankRejectionReason] = useState("");
  const [proofDocument, setProofDocument] = useState(null);
  const [proofDocumentName, setProofDocumentName] = useState("");
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSavingMsg, setBankSavingMsg] = useState("");
  const [bankError, setBankError] = useState("");

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingMsg("");
    setProfileError("");

    const [firstName, ...rest] = profileData.fullName.trim().split(" ");
    const lastName = rest.join(" ") || "";

    // Matches the PUT /auth/profile schema exactly. Bank account number and
    // password are never part of this payload — those live on their own
    // dedicated tabs/endpoints. Aadhaar/PAN numbers are saved from the KYC
    // tab, alongside their document uploads.
    const payload = {
      email: profileData.email,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: profileData.dateOfBirth,
      country: profileData.country,
      city: profileData.city,
      zip_code: profileData.zipCode,
      mobile: profileData.mobile,
      gender: profileData.gender,
      aadhar_no: profileData.aadharNo || "",
      pan: profileData.pan || "",
    };

    const res = await updateProfileApi(payload);
    if (res.success) {
      setSavingMsg("Profile updated successfully!");
      setTimeout(() => setSavingMsg(""), 3000);
    } else {
      setProfileError(res.error || "Failed to update profile");
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankSavingMsg("");
    setBankError("");

    // Mandatory fields per backend schema.
    const missing = [];
    if (!bankDetails.bank_name) missing.push("Bank Name");
    if (!bankDetails.bank_account) missing.push("Account Number");
    if (!bankDetails.ifsc) missing.push("IFSC Code");
    if (!bankDetails.nominee_name) missing.push("Nominee Name");
    if (!bankDetails.nominee_aadhar) missing.push("Nominee Aadhaar");
    if (!bankDetails.nominee_mobile) missing.push("Nominee Mobile");
    if (!proofDocument && bankStatus === "not_submitted") missing.push("Passbook Photo");

    if (missing.length > 0) {
      setBankError(`Please fill required fields: ${missing.join(", ")}`);
      return;
    }

    setBankSaving(true);
    const res = await updateProfileBankDetailsApi({
      ...bankDetails,
      proof_document: proofDocument,
    });
    setBankSaving(false);

    if (res.success) {
      setBankStatus("pending");
      setBankRejectionReason("");
      setBankSavingMsg("Bank details submitted for review!");
      setTimeout(() => setBankSavingMsg(""), 3000);
    } else {
      setBankError(res.error || "Failed to update bank details");
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    const res = await changePasswordApi(payload);
    if (res.success) {
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3000);
    } else {
      setPasswordError(res.error || "Failed to change password");
    }
  };

  const handleUploadImage = async (file) => {
    setImageError("");
    setImageSuccess("");

    const uploadFile = file || profileImage;
    if (!uploadFile) {
      setImageError("Please select an image to upload.");
      return;
    }

    const res = await uploadProfileImageApi(uploadFile);
    if (res.success) {
      setImageSuccess("Profile image uploaded successfully!");
      if (res.data?.data?.avatar || res.data?.avatar) {
        setProfileData((prev) => ({
          ...prev,
          avatar: res.data?.data?.avatar || res.data?.avatar,
        }));
      }
      setProfileImage(null);
    } else {
      setImageError(res.error || "Failed to upload profile image");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");

      const res = await getProfileApi();
      if (res.success) {
        const data = res.data?.data || res.data || {};
        const firstName = data.first_name || data.firstName || "";
        const lastName = data.last_name || data.lastName || "";

        setProfileData((prev) => ({
          ...prev,
          userId: data.user_id || data.userId || prev.userId,
          userName: data.name || data.userName || prev.userName,
          fullName: `${firstName} ${lastName}`.trim() || data.full_name || data.fullName || "",
          email: data.email || prev.email || "",
          mobile: data.mobile || prev.mobile || "",
          gender: data.gender || prev.gender || "",
          dateJoined: data.joined_date || data.date_joined || prev.dateJoined || "",
          dateOfBirth: data.date_of_birth || data.dateOfBirth || prev.dateOfBirth || "",
          zipCode: data.zip_code || prev.zipCode || "",
          city: data.city || prev.city || "",
          country: data.country || prev.country || "",
          avatar: data.avatar || data.profile_image || prev.avatar || "",
          aadharNo: data.aadhar_no || data.aadharNo || prev.aadharNo || "",
          pan: data.pan || prev.pan || "",
        }));

        // Bank details, when the backend includes them on the profile
        // payload (e.g. data.bank_details), pre-fill the form and lock it
        // once approved.
        const bd = data.bank_details || data.bankDetails || null;
        if (bd) {
          setBankDetails({
            bank_name: bd.bank_name || "",
            bank_account: bd.bank_account || bd.account_number || "",
            ifsc: bd.ifsc || "",
            nominee_name: bd.nominee_name || "",
            nominee_relation: bd.nominee_relation || "",
            nominee_gender: bd.nominee_gender || "",
            nominee_dob: bd.nominee_dob || "",
            nominee_address: bd.nominee_address || "",
            nominee_aadhar: bd.nominee_aadhar || "",
            nominee_mobile: bd.nominee_mobile || "",
          });
          setBankStatus(normalizeStatus(bd.status));
          setBankRejectionReason(bd.rejection_reason || "");
          setProofDocumentName(bd.proof_document_name || bd.proof_document || "");
        }
      } else {
        setProfileError(res.error || "Unable to load profile");
      }

      setLoadingProfile(false);
    };

    loadProfile();
  }, []);

  return (
    <UserLayout user={{ name: profileData.userName, userId: profileData.userId }}>
      <div className="profile-page">
        <div className="profile-shell">
          {/* Identity panel */}
          <aside className="identity-panel">
            <div className="identity-photo-wrap">
              <div className="identity-photo">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt={profileData.userName} />
                ) : (
                  <span>{profileData.userName.charAt(0)}</span>
                )}
              </div>
              <label
                className="identity-photo-edit-btn"
                htmlFor="profile-image-upload"
                title="Change photo"
              >
                <FiCamera />
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) return;
                    setProfileImage(file);
                    setImageSuccess("");
                    setImageError("");
                    await handleUploadImage(file);
                  }}
                />
              </label>
            </div>
            {profileImage && (
              <span className="identity-upload-filename">{profileImage.name}</span>
            )}

            <div>
              <div className="identity-name">{profileData.userName}</div>
              <div className="identity-code">{profileData.userId}</div>
              {profileData.mobile && (
                <div className="identity-phone">
                  <FiPhone size={12} />
                  {profileData.mobile}
                </div>
              )}
            </div>

            <hr className="identity-divider" />

            <nav className="identity-nav">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`identity-nav-item ${activeTab === id ? "is-active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="identity-footer">
              {profileData.dateJoined && (
                <span className="identity-footer-joined">
                  Member since {profileData.dateJoined}
                </span>
              )}
              <a className="identity-admin-link" href="/admin/login">
                Back to admin <FiArrowUpRight size={12} />
              </a>
            </div>
          </aside>

          {/* Content column */}
          <div className="content-column">
            {imageError && <div className="form-error-msg">{imageError}</div>}
            {imageSuccess && <div className="form-success-msg">{imageSuccess}</div>}

            {activeTab === "profile" && (
              <OverviewTab
                loadingProfile={loadingProfile}
                profileError={profileError}
                profileData={profileData}
              />
            )}

            {activeTab === "edit" && (
              <EditInfoTab
                profileData={profileData}
                setProfileData={setProfileData}
                handleEditSubmit={handleEditSubmit}
                savingMsg={savingMsg}
                profileError={profileError}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleChangePasswordSubmit={handleChangePasswordSubmit}
                passwordSuccess={passwordSuccess}
                passwordError={passwordError}
              />
            )}

            {activeTab === "bank" && (
              <BankDetailsTab
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
                bankStatus={bankStatus}
                bankRejectionReason={bankRejectionReason}
                proofDocument={proofDocument}
                setProofDocument={setProofDocument}
                proofDocumentName={proofDocumentName}
                setProofDocumentName={setProofDocumentName}
                bankSaving={bankSaving}
                bankSavingMsg={bankSavingMsg}
                bankError={bankError}
                handleBankSubmit={handleBankSubmit}
              />
            )}

            {activeTab === "kyc" && (
              <KycTab profileData={profileData} setProfileData={setProfileData} />
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;