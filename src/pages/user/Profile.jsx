import { useState, useEffect } from "react";
import { FiPhone, FiCamera, FiCheckCircle } from "react-icons/fi";
import {
  getProfileApi,
  updateProfileApi,
  updateProfileBankDetailsApi,
  getProfileBankDetailsApi,
  changePasswordApi,
  uploadProfileImageApi,
  getProfileImageApi,
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
    nominee_relation_other: "",
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
  const [proofDocumentUrl, setProofDocumentUrl] = useState("");
  const [nomineeAadharFront, setNomineeAadharFront] = useState(null);
  const [nomineeAadharBack, setNomineeAadharBack] = useState(null);
  const [nomineeAadharFrontUrl, setNomineeAadharFrontUrl] = useState("");
  const [nomineeAadharBackUrl, setNomineeAadharBackUrl] = useState("");
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSavingMsg, setBankSavingMsg] = useState("");
  const [bankError, setBankError] = useState("");

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const month = today.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < date.getDate())) age -= 1;
    return age;
  };

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
    if (!bankDetails.nominee_relation) missing.push("Nominee Relation");
    if (
      bankDetails.nominee_relation === "Other" &&
      !bankDetails.nominee_relation_other.trim()
    ) {
      missing.push("Please specify Nominee Relation");
    }
    if (!bankDetails.nominee_dob) missing.push("Nominee Date of Birth");
    if (!bankDetails.nominee_aadhar) missing.push("Nominee Aadhaar");
    if (!bankDetails.nominee_mobile) missing.push("Nominee Mobile");
    if (!proofDocument && !proofDocumentUrl) missing.push("Passbook Photo");
    if (!nomineeAadharFront && !nomineeAadharFrontUrl) missing.push("Nominee Aadhaar Front Photo");
    if (!nomineeAadharBack && !nomineeAadharBackUrl) missing.push("Nominee Aadhaar Back Photo");

    if (missing.length > 0) {
      setBankError(`Please fill required fields: ${missing.join(", ")}`);
      return;
    }

    const nomineeAge = calculateAge(bankDetails.nominee_dob);
    if (nomineeAge === null) {
      setBankError("Please enter a valid Nominee Date of Birth.");
      return;
    }
    if (nomineeAge < 18) {
      setBankError("Nominee must be at least 18 years old.");
      return;
    }

    setBankSaving(true);
    const bankPayload = {
      ...bankDetails,
      nominee_relation:
        bankDetails.nominee_relation === "Other"
          ? bankDetails.nominee_relation_other.trim()
          : bankDetails.nominee_relation,
      proof_document: proofDocument,
      nominee_aadhar_front: nomineeAadharFront,
      nominee_aadhar_back: nomineeAadharBack,
    };
    delete bankPayload.nominee_relation_other;

    const res = await updateProfileBankDetailsApi(bankPayload);
    setBankSaving(false);

    if (res.success) {
      setBankStatus("pending");
      setBankRejectionReason("");
      setProofDocumentUrl("");
      setNomineeAadharFrontUrl("");
      setNomineeAadharBackUrl("");
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
      const uploadedAvatar = res.data?.data?.avatar || res.data?.avatar;
      if (uploadedAvatar) {
        localStorage.setItem("userProfileImage", uploadedAvatar);
        setProfileData((prev) => ({
          ...prev,
          avatar: uploadedAvatar,
        }));
      }
      const imageRes = await getProfileImageApi();
      if (imageRes.success && imageRes.data) {
        localStorage.setItem("userProfileImage", imageRes.data);
        setProfileData((prev) => ({ ...prev, avatar: imageRes.data }));
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

        const loadedFullName = `${firstName} ${lastName}`.trim() || data.full_name || data.fullName || "";
        if (loadedFullName) localStorage.setItem("userFullName", loadedFullName);

        // Bank details, when the backend includes them on the profile
        // payload (e.g. data.bank_details), pre-fill the form and lock it
        // once approved.
        const bd = data.bank_details || data.bankDetails || null;
        const nd = data.nominee_details || data.nomineeDetails || {};
        if (bd || Object.keys(nd).length > 0) {
          setBankDetails({
            bank_name: bd?.bank_name || "",
            bank_account: bd?.bank_account || bd?.account_number || "",
            ifsc: bd?.ifsc || "",
            nominee_name: nd.nominee_name || "",
            nominee_relation: [
              "Mother",
              "Father",
              "Daughter",
              "Son",
              "Husband",
              "Wife",
              "Brother",
              "Sister",
              "Friend",
              "Other",
            ].includes(bd.nominee_relation)
              ? nd.nominee_relation || ""
              : nd.nominee_relation
                ? "Other"
                : "",
            nominee_relation_other:
              nd.nominee_relation &&
              ![
                "Mother",
                "Father",
                "Daughter",
                "Son",
                "Husband",
                "Wife",
                "Brother",
                "Sister",
                "Friend",
                "Other",
                ].includes(nd.nominee_relation)
                ? nd.nominee_relation
                : "",
            nominee_gender: nd.nominee_gender || "",
            nominee_dob: nd.nominee_dob || "",
            nominee_address: nd.nominee_address || "",
            nominee_aadhar: nd.nominee_aadhar || "",
            nominee_mobile: nd.nominee_mobile || "",
          });
          setBankStatus(normalizeStatus(bd?.bank_status || bd?.status));
          setBankRejectionReason(bd?.rejection_reason || "");
          setProofDocumentName(bd?.proof_document_name || bd?.proof_document || (bd?.bank_proof ? "Existing passbook proof" : ""));
          setProofDocumentUrl(bd?.bank_proof || bd?.proof_document || "");
          setNomineeAadharFrontUrl(nd.nominee_aadhar_front || "");
          setNomineeAadharBackUrl(nd.nominee_aadhar_back || "");
        }
      } else {
        setProfileError(res.error || "Unable to load profile");
      }

      setLoadingProfile(false);
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadBankDetails = async () => {
      const res = await getProfileBankDetailsApi();
      if (!res.success) return;

      const data = res.data?.data || res.data || {};
      const bd = data.bank_details || {};
      const nd = data.nominee_details || {};
      setBankDetails((prev) => ({
        ...prev,
        bank_name: bd.bank_name || prev.bank_name,
        bank_account: bd.bank_account || prev.bank_account,
        ifsc: bd.ifsc || prev.ifsc,
        nominee_name: nd.nominee_name || prev.nominee_name,
        nominee_relation: nd.nominee_relation || prev.nominee_relation,
        nominee_gender: nd.nominee_gender || prev.nominee_gender,
        nominee_dob: nd.nominee_dob || prev.nominee_dob,
        nominee_address: nd.nominee_address || prev.nominee_address,
        nominee_aadhar: nd.nominee_aadhar || prev.nominee_aadhar,
        nominee_mobile: nd.nominee_mobile || prev.nominee_mobile,
      }));
      setBankStatus(normalizeStatus(bd.bank_status || bd.status));
      setProofDocumentName(bd.bank_proof ? "Existing passbook proof" : "");
      setProofDocumentUrl(bd.bank_proof || "");
      setNomineeAadharFrontUrl(nd.nominee_aadhar_front || "");
      setNomineeAadharBackUrl(nd.nominee_aadhar_back || "");
    };

    loadBankDetails();
  }, []);

  useEffect(() => {
    let active = true;

    getProfileImageApi().then((res) => {
      if (active && res.success && res.data) {
        setProfileData((prev) => ({ ...prev, avatar: res.data }));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <UserLayout
      user={{
        name: profileData.userName,
        fullName: profileData.fullName,
        userId: profileData.userId,
        avatar: profileData.avatar,
      }}
    >
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
              <div className="identity-name">
                {profileData.fullName || profileData.userName || "User"}
              </div>
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
            </div>
          </aside>

          {/* Content column */}
          <div className="content-column">
            {imageError && <div className="form-error-msg">{imageError}</div>}
            {imageSuccess && (
              <div className="profile-image-success" role="status">
                <span className="profile-image-success-icon" aria-hidden="true">
                  <FiCheckCircle />
                </span>
                <span className="profile-image-success-copy">
                  <strong>Profile photo updated</strong>
                  <small>Your new profile image is now visible across your account.</small>
                </span>
              </div>
            )}

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
                proofDocumentUrl={proofDocumentUrl}
                setProofDocumentName={setProofDocumentName}
                nomineeAadharFront={nomineeAadharFront}
                setNomineeAadharFront={setNomineeAadharFront}
                nomineeAadharBack={nomineeAadharBack}
                setNomineeAadharBack={setNomineeAadharBack}
                nomineeAadharFrontUrl={nomineeAadharFrontUrl}
                nomineeAadharBackUrl={nomineeAadharBackUrl}
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