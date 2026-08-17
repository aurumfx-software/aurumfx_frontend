import { useState, useEffect } from "react";
import {
  FiUser,
  FiEdit,
  FiSettings,
  FiCreditCard,
  FiFileText,
  FiPhone,
  FiCamera,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import {
  getProfileApi,
  updateProfileApi,
  updateProfileBankDetailsApi,
  changePasswordApi,
  uploadProfileImageApi,
} from "../../api/auth";
import UserLayout from "../../components/User/UserLayout";
import "./Profile.css";

const NAV_ITEMS = [
  { id: "profile", label: "Overview", icon: FiUser },
  { id: "edit", label: "Edit Info", icon: FiEdit },
  { id: "settings", label: "Settings", icon: FiSettings },
  { id: "bank", label: "Bank Details", icon: FiCreditCard },
  { id: "kyc", label: "KYC", icon: FiFileText },
];

const KYC_STAMP = {
  approved: { label: "Verified", Icon: FiCheckCircle },
  pending: { label: "Pending", Icon: FiClock },
  rejected: { label: "Rejected", Icon: FiXCircle },
};

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
  }, []);

  // Normalize whatever the API sends into one of three known KYC states.
  const kycStatusKey = (() => {
    const raw = (profileData.kycStatus || "").toLowerCase();
    if (raw.includes("approv") || raw.includes("verified")) return "approved";
    if (raw.includes("reject") || raw.includes("fail")) return "rejected";
    return "pending";
  })();

  const stamp = KYC_STAMP[kycStatusKey];

  const activeNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  const DocRow = ({ label, value }) => (
    <div className="doc-row">
      <span className="doc-row-label">{label}</span>
      <span className={`doc-row-value ${!value ? "is-empty" : ""}`}>
        {value || "Not provided"}
      </span>
    </div>
  );

  return (
    <UserLayout user={{ name: profileData.userName, userId: profileData.userId }}>
      <div className="profile-page">
        <div className="profile-shell">
          {/* Identity panel */}
          <aside className="identity-panel">
            <div className="identity-photo">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.userName} />
              ) : (
                <span>{profileData.userName.charAt(0)}</span>
              )}
            </div>

            <div className="identity-photo-actions">
              <label className="identity-photo-link" htmlFor="profile-image-upload">
                <FiCamera />
                <span>Change photo</span>
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
              {profileImage && (
                <span className="identity-upload-filename">{profileImage.name}</span>
              )}
            </div>

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
              <>
                <span className="content-eyebrow">Account</span>
                <h1 className="content-title">Overview</h1>
                <p className="content-intro">
                  Your personal details on file. Use Edit Info to make changes.
                </p>

                {loadingProfile ? (
                  <div className="loading-state">Loading profile...</div>
                ) : profileError ? (
                  <div className="error-state">{profileError}</div>
                ) : (
                  <div className="doc-section">
                    <DocRow label="Full Name" value={profileData.fullName} />
                    <DocRow label="Email" value={profileData.email} />
                    <DocRow label="Mobile" value={profileData.mobile} />
                    <DocRow label="Gender" value={profileData.gender} />
                    <DocRow label="Date of Birth" value={profileData.dateOfBirth} />
                    <DocRow label="City" value={profileData.city} />
                    <DocRow label="Country" value={profileData.country} />
                    <DocRow label="ZIP Code" value={profileData.zipCode} />
                  </div>
                )}
              </>
            )}

            {activeTab === "edit" && (
              <>
                <span className="content-eyebrow">Account</span>
                <h1 className="content-title">Edit Info</h1>
                <p className="content-intro">Keep your personal information up to date.</p>

                <form onSubmit={handleEditSubmit} className="doc-form">
                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Date of Birth</label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) =>
                          setProfileData({ ...profileData, dateOfBirth: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Gender</label>
                      <select
                        value={profileData.gender}
                        onChange={(e) =>
                          setProfileData({ ...profileData, gender: e.target.value })
                        }
                        className="field-input"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Mobile Number</label>
                      <input
                        type="tel"
                        value={profileData.mobile}
                        onChange={(e) =>
                          setProfileData({ ...profileData, mobile: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({ ...profileData, city: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">ZIP Code</label>
                      <input
                        type="text"
                        value={profileData.zipCode}
                        onChange={(e) =>
                          setProfileData({ ...profileData, zipCode: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Country</label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) =>
                          setProfileData({ ...profileData, country: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Aadhaar Number</label>
                      <input
                        type="text"
                        value={profileData.aadhar}
                        onChange={(e) =>
                          setProfileData({ ...profileData, aadhar: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">PAN Number</label>
                      <input
                        type="text"
                        value={profileData.pan}
                        onChange={(e) =>
                          setProfileData({ ...profileData, pan: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  {savingMsg && <p className="form-success-msg">{savingMsg}</p>}

                  <button type="submit" className="field-submit-btn">
                    Save Changes
                  </button>
                </form>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <span className="content-eyebrow">Security</span>
                <h1 className="content-title">Settings</h1>
                <p className="content-intro">Update the password used to sign in.</p>

                <form onSubmit={handleChangePasswordSubmit} className="doc-form">
                  <div className="field-group">
                    <label className="field-label">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="field-input"
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="field-input"
                      />
                    </div>
                  </div>

                  {passwordSuccess && <p className="form-success-msg">{passwordSuccess}</p>}
                  {passwordError && <p className="form-error-msg">{passwordError}</p>}

                  <button type="submit" className="field-submit-btn">
                    Update Password
                  </button>
                </form>
              </>
            )}

            {activeTab === "bank" && (
              <>
                <span className="content-eyebrow">Payouts</span>
                <h1 className="content-title">Bank Details</h1>
                <p className="content-intro">
                  Where your withdrawals and payouts are sent.
                </p>

                <form onSubmit={handleBankSubmit} className="doc-form">
                  <div className="field-group">
                    <label className="field-label">Bank Name</label>
                    <input
                      type="text"
                      value={profileData.bankName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bankName: e.target.value })
                      }
                      className="field-input"
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Account Number</label>
                      <input
                        type="text"
                        value={profileData.bankAccount}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bankAccount: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">IFSC Code</label>
                      <input
                        type="text"
                        value={profileData.ifsc}
                        onChange={(e) =>
                          setProfileData({ ...profileData, ifsc: e.target.value })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  {bankSavingMsg && <p className="form-success-msg">{bankSavingMsg}</p>}
                  {bankError && <p className="form-error-msg">{bankError}</p>}

                  <button type="submit" className="field-submit-btn">
                    Update Bank Details
                  </button>
                </form>
              </>
            )}

            {activeTab === "kyc" && (
              <>
                <span className="content-eyebrow">Verification</span>
                <h1 className="content-title">KYC</h1>
                <p className="content-intro">
                  Identity documents on file for your account.
                </p>

                <div className="kyc-block">
                  <div className="kyc-fields">
                    <div className="field-group">
                      <label className="field-label">Aadhaar Number</label>
                      <input
                        type="text"
                        value={profileData.aadhar}
                        readOnly
                        className="field-input is-readonly"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">PAN Number</label>
                      <input
                        type="text"
                        value={profileData.pan}
                        readOnly
                        className="field-input is-readonly"
                      />
                    </div>
                  </div>

                  <div className={`kyc-stamp status--${kycStatusKey}`}>
                    <div className="kyc-stamp-inner">
                      <stamp.Icon />
                      <span className="kyc-stamp-label">{stamp.label}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;