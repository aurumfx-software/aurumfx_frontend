import { useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import logoImg from "../../../assets/logo.png";
import faviconImg from "/favicon.svg";
import "./AdminSettings.css";

function BrandSettings() {
  const [companyName, setCompanyName] = useState("cloudlumen");
  const [companyAddress, setCompanyAddress] = useState("info.address");
  const [email, setEmail] = useState("info@cloudlumen.com");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Brand Settings</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Brand Settings</span>
          </div>
        </div>

        {/* Main Settings Card */}
        <div className="settings-main-card">
          {/* Change Logo Section */}
          <h3 className="settings-section-title">Change Logo</h3>

          <div className="logo-upload-grid">
            {/* Change Your Logo Box */}
            <div className="logo-drop-box">
              <span className="logo-drop-title">Change Your Logo</span>
              <label className="logo-circle-area">
                <img src={logoImg} alt="Logo Preview" className="logo-preview-img" style={{ padding: "10px" }} />
                <input type="file" accept="image/*" style={{ display: "none" }} />
              </label>
              <span className="logo-drop-hint">
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br />
                max size of 1.1 MB
              </span>
            </div>

            {/* Change Your Fav Icon Box */}
            <div className="logo-drop-box">
              <span className="logo-drop-title">Change Your Fav Icon</span>
              <label className="logo-circle-area">
                <img src={faviconImg} alt="Favicon Preview" className="logo-preview-img" style={{ width: "50px", height: "50px" }} />
                <input type="file" accept="image/*" style={{ display: "none" }} />
              </label>
              <span className="logo-drop-hint">
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br />
                max size of 1.1 MB
              </span>
            </div>
          </div>

          {/* Form Fields Section matching Screenshot 1 & 2 */}
          <form onSubmit={handleSubmit} className="settings-form-stack">
            {/* Company Name */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Company Address */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Company Address</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Email */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="settings-actions-bar">
              <button type="submit" className="settings-save-btn">
                Save Changes
              </button>
              {saveSuccess && (
                <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600", alignSelf: "center", marginLeft: "12px" }}>
                  ✓ Settings saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default BrandSettings;
