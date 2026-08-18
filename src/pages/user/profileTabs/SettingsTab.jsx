function SettingsTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePasswordSubmit,
  passwordSuccess,
  passwordError,
}) {
  return (
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
  );
}

export default SettingsTab;