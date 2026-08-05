import { useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminSettings.css";

function WithdrawalSettings() {
  const [minWithdrawal, setMinWithdrawal] = useState("50");
  const [maxWithdrawal, setMaxWithdrawal] = useState("10000");
  const [adminFee, setAdminFee] = useState("5");
  const [autoApproveLimit, setAutoApproveLimit] = useState("100");
  const [allowWeekend, setAllowWeekend] = useState(false);
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
          <h1 className="admin-page-title">Withdrawal Settings</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Withdrawal Settings</span>
          </div>
        </div>

        {/* Main Settings Card */}
        <div className="settings-main-card">
          <h3 className="settings-section-title">Withdrawal & Payout Limits</h3>

          <form onSubmit={handleSubmit} className="settings-form-stack">
            {/* Minimum Withdrawal */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Minimum Payout Amount (₹ / $)</label>
                <input
                  type="text"
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Maximum Withdrawal */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Maximum Payout Amount (₹ / $)</label>
                <input
                  type="text"
                  value={maxWithdrawal}
                  onChange={(e) => setMaxWithdrawal(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Admin Fee (%) */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Admin Processing Fee (%)</label>
                <input
                  type="text"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Auto Approve Limit */}
            <div className="settings-field-group">
              <div className="settings-field-box">
                <label className="settings-field-label">Auto-Approve Threshold Amount (₹ / $)</label>
                <input
                  type="text"
                  value={autoApproveLimit}
                  onChange={(e) => setAutoApproveLimit(e.target.value)}
                  className="settings-input-control"
                />
              </div>
            </div>

            {/* Weekend Payout Toggle */}
            <div className="settings-toggle-row">
              <div>
                <div className="toggle-info-title">Allow Weekend Payout Requests</div>
                <div className="toggle-info-desc">Enable users to submit withdrawal requests on Saturdays & Sundays</div>
              </div>
              <button
                type="button"
                className={`switch-btn ${allowWeekend ? "active" : ""}`}
                onClick={() => setAllowWeekend(!allowWeekend)}
              >
                <div className="switch-thumb" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="settings-actions-bar">
              <button type="submit" className="settings-save-btn">
                Save Withdrawal Settings
              </button>
              {saveSuccess && (
                <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: "600", alignSelf: "center", marginLeft: "12px" }}>
                  ✓ Withdrawal settings updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default WithdrawalSettings;
