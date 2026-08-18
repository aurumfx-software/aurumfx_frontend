function EditInfoTab({ profileData, setProfileData, handleEditSubmit, savingMsg, profileError }) {
  return (
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
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
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
              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Gender</label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
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
              onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">City</label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
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
              onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Country</label>
            <input
              type="text"
              value={profileData.country}
              onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
              className="field-input"
            />
          </div>
        </div>

        <p className="content-intro" style={{ marginTop: 0 }}>
          Aadhaar and PAN numbers are managed on the KYC tab, alongside the required document photos.
        </p>

        {savingMsg && <p className="form-success-msg">{savingMsg}</p>}
        {profileError && <p className="form-error-msg">{profileError}</p>}

        <button type="submit" className="field-submit-btn">
          Save Changes
        </button>
      </form>
    </>
  );
}

export default EditInfoTab;