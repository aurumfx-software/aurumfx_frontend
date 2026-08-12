import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiArrowRight, FiLogIn } from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#mt5-chart", label: "MT5 Chart" },
  { href: "#calculator", label: "Calculator" },
  { href: "#plans", label: "Plans" },
  { href: "#why-choose", label: "Why AurumFX" },
  { href: "#faq", label: "FAQ" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="landing-header">
      <div className="landing-nav">
        <a href="#hero" className="landing-logo" onClick={closeMenu}>
          <img src={logo} alt="AurumFX" />
        </a>

        <nav className={`landing-nav-menu ${menuOpen ? "menu-open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}

          <div className="landing-mobile-actions">
            <Link to="/user/login" className="nav-login" onClick={closeMenu}>
              <FiLogIn className="nav-login-icon" />
              Log In
            </Link>
            <Link to="/user/register" className="nav-signup" onClick={closeMenu}>
              Start Trading
              <FiArrowRight className="nav-signup-icon" />
            </Link>
          </div>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/user/login" className="nav-login">
            <FiLogIn className="nav-login-icon" />
            Log In
          </Link>
          <Link to="/user/register" className="nav-signup">
            Start Trading
            <FiArrowRight className="nav-signup-icon" />
          </Link>
        </div>

        <button
          type="button"
          className="landing-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="landing-menu-overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </header>
  );
};

export default Navbar;