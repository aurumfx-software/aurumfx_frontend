import { DocRow } from "./shared";

function OverviewTab({ loadingProfile, profileError, profileData }) {
  return (
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
          <DocRow emoji="👤" label="Full Name" value={profileData.fullName} />
          <DocRow emoji="📧" label="Email" value={profileData.email} />
          <DocRow emoji="📱" label="Mobile" value={profileData.mobile} />
          <DocRow emoji="⚧️" label="Gender" value={profileData.gender} />
          <DocRow emoji="🎂" label="Date of Birth" value={profileData.dateOfBirth} />
          <DocRow emoji="📍" label="City" value={profileData.city} />
          <DocRow emoji="🌍" label="Country" value={profileData.country} />
          <DocRow emoji="📮" label="ZIP Code" value={profileData.zipCode} />
        </div>
      )}
    </>
  );
}

export default OverviewTab;