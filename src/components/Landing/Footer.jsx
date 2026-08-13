import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-column">
          <img src={logo} alt="AurumFX" className="footer-logo" />
          <p>
            Professional gold and forex trading platform with real-time markets,
            secure wallets, and transparent returns.
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Platform</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#markets">Markets</a></li>
            <li><a href="#features">Features</a></li>
            <li><Link to="/user/login">Sign In</Link></li>
            <li><Link to="/user/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Trading</h3>
          <ul>
            <li><span>Min. Deposit: ₹5,000</span></li>
            <li><span>Monthly Return: 8% / 14%</span></li>
            <li><span>Gold &amp; FX Pairs</span></li>
            <li><span>24/7 Market Access</span></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <p><FaMapMarkerAlt /> Dubai, UAE</p>
          <p><FaEnvelope /> info@aurumfx.com</p>
          <p><FaPhoneAlt /> +971 55 123 4567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AurumFX. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;