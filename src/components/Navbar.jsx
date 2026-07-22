import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="header">
      <div className="navbar">

        <div className="logo">
          <img src={logo} alt="AurumFX" />
        </div>

        <nav className="nav-menu">
          <Link className="active" to="/">Home</Link>
          <Link to="/plans">Investment Plans</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-btn">
          <button>Login</button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;