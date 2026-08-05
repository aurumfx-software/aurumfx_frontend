import { useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminSettings.css";

function AdvancedSettings() {
  const [currency, setCurrency] = useState("INR");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [apiKey, setApiKey] = useState("aurum_live_sec_984f9102847a");
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
          <h1 className="admin-page-title">Advanced Settings</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Advanced Settings</span>
          </div>
        </div>

        {/* Main Settings Card */}
        <div className="settings-main-card">
          <h3 className="settings-section-title">System & Security Configuration</h3>

          <form onSubmit={handleSubmit} className="settings-form-stack">
            {/* System Currency */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">System Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="settings-select-control"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* API Secret Key */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Gateway API Live Secret Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="settings-toggle-row">
              <div>
                <div className="toggle-info-title">System Maintenance Mode</div>
                <div className="toggle-info-desc">Restrict user portal access during system upgrades</div>
              </div>
              <button
                type="button"
                className={`switch-btn ${maintenanceMode ? "active" : ""}`}
                onClick={() => setMaintenanceMode(!maintenanceMode)}
              >
                <div className="switch-thumb" />
              </button>
            </div>

            {/* Enforce 2FA Toggle */}
            <div className="settings-toggle-row">
              <div>
                <div className="toggle-info-title">Enforce 2FA for Admin Actions</div>
                <div className="toggle-info-desc">Require OTP verification for high-privilege operations</div>
              </div>
              <button
                type="button"
                className={`switch-btn ${enforce2FA ? "active" : ""}`}
                onClick={() => setEnforce2FA(!enforce2FA)}
              >
                <div className="switch-thumb" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="settings-actions-bar">
              <button type="submit" className="settings-save-btn">
                Save System Settings
              </button>
              {saveSuccess && (
                <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600", alignSelf: "center", marginLeft: "12px" }}>
                  ✓ Advanced settings saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdvancedSettings;
