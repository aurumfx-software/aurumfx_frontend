import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginApi } from "../../api/auth";
import { DEMO_USERS } from "../../utils/auth";
import logo from "../../assets/logo.png";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const adminCred = DEMO_USERS.find((u) => u.role === "admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi(userId, password);

      if (result.success) {
        navigate(result.redirect);
      } else {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
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
    <div className="login-page admin-login-page">
      <div className="login-card">
        <img src={logo} alt="AurumFX Logo" className="logo" />

        <h1>Admin Portal</h1>
        <p>Sign in to AurumFX Administration Dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="admin_user_id">Admin User ID / Username</label>
            <input
              id="admin_user_id"
              type="text"
              placeholder="Enter Admin Username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="admin_password">Password</label>
            <div className="password-box">
              <input
                id="admin_password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
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
