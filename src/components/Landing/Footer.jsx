import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-column">
          <h2 className="footer-logo">AurumFX</h2>

          <p>
            Empowering investors through secure gold trading opportunities and
            consistent monthly returns.
          </p>

          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/">Investment Plans</a>
            </li>
            <li>
              <a href="/">About Us</a>
            </li>
            <li>
              <a href="/">Contact</a>
            </li>
            <li>
              <a href="/">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Investment */}
        <div className="footer-column">
          <h3>Investment</h3>

          <ul>
            <li>
              <a>Minimum Investment : ₹5,000</a>
            </li>
            <li>
              <a>Monthly Return : 14%</a>
            </li>
            <li>
              <a>Duration : 10 Months</a>
            </li>
            <li>
              <a>Secure Gold Trading</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>
            <FaMapMarkerAlt /> Dubai, UAE
          </p>

          <p>
            <FaEnvelope /> info@aurumfx.com
          </p>

          <p>
            <FaPhoneAlt /> +971 55 123 4567
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AurumFX. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
