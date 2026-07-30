import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { login, DEMO_USERS } from "../utils/auth";
import logo from "../assets/logo.png";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const adminCred = DEMO_USERS.find((u) => u.role === "admin");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(userId, password, "admin");

    if (result.success) {
      navigate(result.redirect);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const fillAdminDemo = () => {
    if (adminCred) {
      setUserId(adminCred.userId);
      setPassword(adminCred.password);
      setError("");
    }
  };

  return (
    <div className="login-page">
      {/* <div className="top-right">
        <span>User Portal?</span>
        <Link to="/login" className="register-btn">
          User Login
        </Link>
      </div> */}

      <div className="login-card">
        <img src={logo} alt="AurumFX Admin" className="logo" />

        <div className="admin-pill">Admin Access</div>

        <h1>Admin Login</h1>
        <p>Sign in to AurumFX Control Center</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="adminUserId">Admin User ID</label>
            <input
              id="adminUserId"
              type="text"
              placeholder="Enter Admin ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="adminPassword">Admin Password</label>
            <div className="password-box">
              <input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="options">
            <label className="remember">
              <input type="checkbox" defaultChecked />
              Remember me
            </label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>

        {adminCred && (
          <div className="demo-credentials">
            <p className="demo-title">Admin demo credentials</p>
            <div className="demo-cards" style={{ gridTemplateColumns: "1fr" }}>
              <button
                type="button"
                className="demo-card"
                onClick={fillAdminDemo}
              >
                <span className="demo-role">admin</span>
                <span className="demo-id">{adminCred.userId}</span>
                <span className="demo-pass">{adminCred.password}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
