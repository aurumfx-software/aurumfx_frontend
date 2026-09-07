import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiShield } from "react-icons/fi";
import logo from "../assets/logo.png";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <main className="privacy-page">
      <header className="privacy-header">
        <Link to="/" className="privacy-logo" aria-label="AurumFX home">
          <img src={logo} alt="AurumFX" />
        </Link>
        <ThemeToggle variant="nav" />
      </header>

      <section className="privacy-hero">
        <div className="privacy-hero-icon"><FiShield /></div>
        <p className="privacy-eyebrow">AURUMFX PVT LTD</p>
        <h1>Privacy Policy</h1>
        <p className="privacy-intro">
          Your privacy matters to us. This policy explains what information AURUMFX
          collects, why it is needed, and the choices available to you.
        </p>
        <p className="privacy-updated">Effective date: September 7, 2026</p>
      </section>

      <article className="privacy-content">
        <section className="privacy-section">
          <h2>About AURUMFX</h2>
          <p>
            AURUMFX (com.aurumfx.mobile) is published by AURUMFX PVT LTD.
            For privacy questions or account requests, contact us at{" "}
            <a href="mailto:support@aurumfx.org">support@aurumfx.org</a>.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Information We Collect</h2>
          <div className="privacy-grid">
            <div className="privacy-card">
              <h3>Account and personal data</h3>
              <p>Name, email address, phone number, full address (state, district, city, and zip), and nominee details.</p>
            </div>
            <div className="privacy-card">
              <h3>KYC and financial data</h3>
              <p>PAN, Aadhaar, bank details including account number and IFSC, and KYC verification document uploads.</p>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <h2>Device Permissions and Biometrics</h2>
          <p>
            Camera and photo gallery permissions are requested strictly for KYC
            verification and profile uploads. Face ID and fingerprint authentication
            operate only within your device&apos;s local Secure Enclave through
            expo-local-authentication. Biometric data is never sent to AURUMFX servers.
          </p>
        </section>

        <section className="privacy-section">
          <h2>How We Use Your Information</h2>
          <p>
            We use this information to create and manage your account, verify your
            identity, process financial and withdrawal-related services, maintain
            nominee and bank records, provide support, and protect the security of
            the AURUMFX platform.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Your Choices and Rights</h2>
          <ul>
            <li>Request deletion of your AURUMFX account and associated personal data.</li>
            <li>Ask us to update or correct your profile information.</li>
            <li>Manage camera and photo gallery permissions from your device settings.</li>
            <li>Contact our support team with questions about your information.</li>
          </ul>
          <div className="privacy-contact">
            <FiMail />
            <span>To request account deletion or an update, email <a href="mailto:support@aurumfx.org">support@aurumfx.org</a>.</span>
          </div>
        </section>

        <section className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            AURUMFX PVT LTD<br />
            Email: <a href="mailto:support@aurumfx.org">support@aurumfx.org</a>
          </p>
        </section>

        <Link to="/" className="privacy-back-link">
          <FiArrowLeft />
          Back to AURUMFX
        </Link>
      </article>
    </main>
  );
};

export default PrivacyPolicy;
