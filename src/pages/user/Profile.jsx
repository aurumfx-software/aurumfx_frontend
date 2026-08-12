import { useState, useEffect } from "react";
import {
  FiInfo,
  FiUser,
  FiEdit,
  FiSettings,
  FiCreditCard,
  FiFileText,
  FiMail,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiUpload,
} from "react-icons/fi";
import {
  getProfileApi,
  updateProfileApi,
  getProfileActivityHistoryApi,
  updateProfileBankDetailsApi,
  changePasswordApi,
  uploadProfileImageApi,
} from "../../api/auth";
import UserLayout from "../../components/User/UserLayout";
import "./Profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form States
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
    bankName: "",
    bankAccount: "",
    ifsc: "",
    aadhar: "",
    pan: "",
    kycStatus: "",
    avatar: "",
  });

  const [savingMsg, setSavingMsg] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [bankSavingMsg, setBankSavingMsg] = useState("");
  const [bankError, setBankError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const [activityHistory, setActivityHistory] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingMsg("");
    setProfileError("");

    const [firstName, ...rest] = profileData.fullName.trim().split(" ");
    const lastName = rest.join(" ") || "";

    const payload = {
      email: profileData.email,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: profileData.dateOfBirth,
      country: profileData.country,
      city: profileData.city,
      zip_code: profileData.zipCode,
      mobile: profileData.mobile,
      aadhar_no: profileData.aadhar,
      pan: profileData.pan,
      gender: profileData.gender,
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

    const payload = {
      bank_name: profileData.bankName,
      bank_account: profileData.bankAccount,
      ifsc: profileData.ifsc,
    };

    const res = await updateProfileBankDetailsApi(payload);
    if (res.success) {
      setBankSavingMsg("Bank details updated successfully!");
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
          bankName: data.bank_name || prev.bankName || "",
          bankAccount: data.bank_account || prev.bankAccount || "",
          ifsc: data.ifsc || prev.ifsc || "",
          aadhar: data.aadhar_no || data.aadhar || prev.aadhar || "",
          pan: data.pan || prev.pan || "",
          kycStatus: data.kyc_status || data.kycStatus || prev.kycStatus || "",
        }));
      } else {
        setProfileError(res.error || "Unable to load profile");
      }

      setLoadingProfile(false);
    };

    loadProfile();
    loadActivityHistory();
  }, []);

  const loadActivityHistory = async () => {
    setActivityLoading(true);
    setActivityError("");

    const res = await getProfileActivityHistoryApi();
    if (res.success) {
      const payload = res.data?.data || res.data || [];
      setActivityHistory(Array.isArray(payload) ? payload : [payload]);
    } else {
      setActivityError(res.error || "Unable to load activity history");
      setActivityHistory([]);
    }

    setActivityLoading(false);
  };

  const formatActivity = (item) => {
    if (!item) return { title: "Unknown activity", subtitle: "" };

    if (typeof item === "string") {
      try {
        const parsed = JSON.parse(item);
        item = parsed;
      } catch {
        return { title: item, subtitle: "" };
      }
    }

    const titleParts = [];
    if (item.activity_type) titleParts.push(item.activity_type.replace(/_/g, " "));    
    if (item.message) titleParts.push(item.message);
    if (item.description) titleParts.push(item.description);
    if (item.type) titleParts.push(item.type);

    const title = titleParts.length > 0 ? titleParts.join(" — ") : JSON.stringify(item);
    const subtitleParts = [];
    if (item.ip_address) subtitleParts.push(`IP: ${item.ip_address}`);
    if (item.created_at) subtitleParts.push(item.created_at);
    if (item.createdAt) subtitleParts.push(item.createdAt);
    if (item.timestamp) subtitleParts.push(item.timestamp);
    if (item.date) subtitleParts.push(item.date);

    return {
      title,
      subtitle: subtitleParts.join(" • "),
    };
  };

  return (
    <UserLayout user={{ name: profileData.userName, userId: profileData.userId }}>
      <div className="profile-page">
        {/* Top Heads-up Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{profileData.userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumb */}
        <div className="page-header">
          <h1 className="page-title">Profile</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">User</span>
          </div>
        </div>

        {loadingProfile ? (
          <div className="loading-state">Loading profile...</div>
        ) : profileError ? (
          <div className="error-state">{profileError}</div>
        ) : null}

        {/* Profile Header Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-info">
            <div className="avatar-overlap">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.userName} />
              ) : (
                <span>{profileData.userName.charAt(0)}</span>
              )}
            </div>
            <div className="hero-text">
              <h2 className="hero-name">{profileData.userName}</h2>
              <span className="hero-phone">📱 {profileData.mobile}</span>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="profile-tabs-bar">
            <label className="upload-image-btn" htmlFor="profile-image-upload">
              <FiUpload />
              <span>Upload Image</span>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0] || null;
                if (!file) return;
                setProfileImage(file);
                setImageSuccess("");
                setImageError("");
                await handleUploadImage(file);
              }}
            />
            {profileImage && (
              <span className="upload-avatar-filename">{profileImage.name}</span>
            )}
            <button
              type="button"
              className={`tab-btn ${activeTab === "profile" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FiUser /> <span>Profile</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "edit" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <FiEdit /> <span>Edit Info</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "settings" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <FiSettings /> <span>Settings</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "bank" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("bank")}
            >
              <FiCreditCard /> <span>Bank Details</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "kyc" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("kyc")}
            >
              <FiFileText /> <span>Kyc</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Profile Main Overview */}
        {activeTab === "profile" && (
          <div className="profile-content-grid">
            {/* Left Column: Personal Information List */}
            <div className="profile-info-card">
              <div className="info-row">
                <FiUser className="info-row-icon" />
                <span className="info-row-val">{profileData.userId}</span>
              </div>
              <div className="info-row">
                <FiMail className="info-row-icon" />
                <span className="info-row-val">{profileData.email}</span>
              </div>
              <div className="info-row">
                <FiCalendar className="info-row-icon" />
                <span className="info-row-val">{profileData.dateOfBirth || profileData.dateJoined}</span>
              </div>
              <div className="info-row">
                <FiUser className="info-row-icon" />
                <span className="info-row-val">{profileData.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-row-icon text-icon">♀</span>
                <span className="info-row-val">{profileData.gender}</span>
              </div>
              <div className="info-row">
                <FiPhone className="info-row-icon" />
                <span className="info-row-val">{profileData.mobile}</span>
              </div>
              <div className="info-row">
                <span className="info-row-icon text-icon">⌂</span>
                <span className="info-row-val">{profileData.zipCode}</span>
              </div>
              <div className="info-row">
                <FiMapPin className="info-row-icon" />
                <span className="info-row-val">{profileData.city}</span>
              </div>
            </div>

            {/* Right Column: Activity History Card */}
            <div className="activity-card">
              <div className="activity-user-header">
                <div className="activity-avatar">
                  {profileData.userName.charAt(0)}
                </div>
                <div className="activity-user-meta">
                  <h4 className="meta-id">{profileData.userId}</h4>
                  <span className="meta-last-seen">Last Seen: Just now</span>
                </div>
              </div>

              <h3 className="activity-section-title">Your Activity History</h3>

              {activityLoading ? (
                <div className="activity-loading">Loading activity...</div>
              ) : activityError ? (
                <div className="activity-error">{activityError}</div>
              ) : activityHistory.length > 0 ? (
                <ul className="activity-list">
                  {activityHistory.map((item, index) => {
                    const formatted = formatActivity(item);
                    return (
                      <li key={index} className="activity-list-item">
                        <span className="activity-item-label">{formatted.title}</span>
                        {formatted.subtitle && (
                          <span className="activity-item-time">{formatted.subtitle}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="activity-empty">No activity recorded yet.</div>
              )}

              {/* Pagination Bar */}
              <div className="pagination-bar">
                <button type="button" className="page-nav-btn" disabled>
                  &lt;
                </button>
                <span className="page-number active">1</span>
                <button type="button" className="page-nav-btn" disabled>
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {imageError && <div className="form-error-msg">{imageError}</div>}
        {imageSuccess && <div className="form-success-msg">{imageSuccess}</div>}

        {/* TAB 2: Edit Info Form */}
        {activeTab === "edit" && (
          <div className="tab-form-card">
            <h3 className="form-card-title">Edit Personal Information</h3>
            <form onSubmit={handleEditSubmit} className="tab-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, fullName: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData({ ...profileData, dateOfBirth: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) =>
                      setProfileData({ ...profileData, gender: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) =>
                      setProfileData({ ...profileData, mobile: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) =>
                      setProfileData({ ...profileData, zipCode: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({ ...profileData, country: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Aadhaar Number</label>
                  <input
                    type="text"
                    value={profileData.aadhar}
                    onChange={(e) =>
                      setProfileData({ ...profileData, aadhar: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    value={profileData.pan}
                    onChange={(e) =>
                      setProfileData({ ...profileData, pan: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              {savingMsg && <p className="form-success-msg">{savingMsg}</p>}

              <button type="submit" className="save-submit-btn">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Settings */}
        {activeTab === "settings" && (
          <div className="tab-form-card">
            <h3 className="form-card-title">Security & Password</h3>
            <form onSubmit={handleChangePasswordSubmit} className="tab-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {passwordSuccess && <p className="form-success-msg">{passwordSuccess}</p>}
              {passwordError && <p className="form-error-msg">{passwordError}</p>}

              <button type="submit" className="save-submit-btn">
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Bank Details */}
        {activeTab === "bank" && (
          <div className="tab-form-card">
            <h3 className="form-card-title">Bank Details</h3>
            <form onSubmit={handleBankSubmit} className="tab-form">
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  value={profileData.bankName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bankName: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    value={profileData.bankAccount}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bankAccount: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    value={profileData.ifsc}
                    onChange={(e) =>
                      setProfileData({ ...profileData, ifsc: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              {bankSavingMsg && <p className="form-success-msg">{bankSavingMsg}</p>}
              {bankError && <p className="form-error-msg">{bankError}</p>}

              <button type="submit" className="save-submit-btn">
                Update Bank Details
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: Kyc */}
        {activeTab === "kyc" && (
          <div className="tab-form-card">
            <h3 className="form-card-title">KYC Verification</h3>
            <div className="kyc-details">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Aadhaar Number</label>
                  <input
                    type="text"
                    value={profileData.aadhar}
                    readOnly
                    className="form-input read-only-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    value={profileData.pan}
                    readOnly
                    className="form-input read-only-input"
                  />
                </div>
              </div>
              <div className="kyc-status-row">
                <span>Verification Status:</span>
                <span className="kyc-badge status--approved">{profileData.kycStatus}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Profile;
