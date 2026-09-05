import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiArrowLeft, FiCompass } from "react-icons/fi";
import logo from "../assets/logo.png";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      {/* Glow Orbs background */}
      <div className="notfound-bg-glow glow--1" />
      <div className="notfound-bg-glow glow--2" />

      <div className="notfound-container">
        {/* Logo */}
        <Link to="/" className="notfound-logo-link">
          <img src={logo} alt="AurumFX Logo" className="notfound-logo" />
        </Link>

        {/* 404 Graphic badge */}
        <div className="notfound-badge">
          <FiCompass className="compass-icon" />
          <span>Error 404</span>
        </div>

        {/* 404 Number Graphic */}
        <h1 className="notfound-code">
          4<span className="gold-zero">0</span>4
        </h1>

        {/* Title & Description */}
        <h2 className="notfound-title">Lost in the Financial Markets?</h2>
        <p className="notfound-description">
          The page or route you are looking for doesn't exist, has been removed,
          or is temporarily unavailable.
        </p>

        {/* Navigation Action Buttons */}
        <div className="notfound-actions">
          <button
            type="button"
            className="notfound-btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>

          <Link to="/" className="notfound-btn btn-primary">
            <FiHome />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
