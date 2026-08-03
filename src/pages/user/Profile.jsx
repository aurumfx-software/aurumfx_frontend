import { useState } from "react";
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
  FiCamera,
} from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import "./Profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form States
  const [profileData, setProfileData] = useState({
    userId: localStorage.getItem("userId") || "FX256",
    userName: localStorage.getItem("userName") || "SUCHITHRA",
    fullName: "SUCHITHRA EG",
    email: "suchithrasatheesh007@gmail.com",
    mobile: "9747064065",
    gender: "female",
    dateJoined: "29 Jul 2026",
    zipCode: "680586",
    city: "THRISSUR",
    country: "India",
    bankName: "State Bank of India",
    bankAccount: "38920194829",
    ifsc: "SBIN0001234",
    aadhar: "987654321012",
    pan: "ABCDE1234F",
    kycStatus: "Approved",
  });

  const [savingMsg, setSavingMsg] = useState("");

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSavingMsg("Profile updated successfully!");
    setTimeout(() => setSavingMsg(""), 3000);
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

        {/* Header Cover Banner Card */}
        <div className="profile-hero-card">
          <div className="cover-banner">
            <button type="button" className="cover-cam-btn" title="Change Cover Photo">
              <FiCamera />
            </button>
          </div>

          <div className="profile-hero-info">
            <div className="avatar-overlap">
              <span>{profileData.userName.charAt(0)}</span>
            </div>
            <div className="hero-text">
              <h2 className="hero-name">{profileData.userName}</h2>
              <span className="hero-phone">📱 {profileData.mobile}</span>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="profile-tabs-bar">
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
                <span className="info-row-val">{profileData.dateJoined}</span>
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

              <div className="activity-list-empty">
                <div className="empty-state-space" />
              </div>

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
            <form onSubmit={handleEditSubmit} className="tab-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="form-input"
                />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="form-input"
                  />
                </div>
              </div>

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
            <form onSubmit={handleEditSubmit} className="tab-form">
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

              {savingMsg && <p className="form-success-msg">{savingMsg}</p>}

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
