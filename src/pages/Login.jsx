import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginApi } from "../api/auth";
import { DEMO_USERS } from "../utils/auth";
import logo from "../assets/logo.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userCred = DEMO_USERS.filter((u) => u.role === "user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi(userId, password, "user");

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

  const fillDemo = (cred) => {
    setUserId(cred.userId);
    setPassword(cred.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="top-right">
        <span style={{ marginTop: "15px" }}>Don't have an account?</span>
        <Link to="/user/register" className="register-btn">
          Get Started
        </Link>
      </div>
      <div className="login-card">
        <img src={logo} alt="AurumFX Logo" className="logo" />

        <h1>Hi, Welcome Back!</h1>
        <p>Sign in to AurumFX Trading Platform</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-box">
              <input
                id="password"
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
            <Link to="/admin/login" className="admin-portal-link">
              Admin Portal
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo user credentials</p>
          <div className="demo-cards">
            {userCred.map((cred) => (
              <button
                key={cred.userId}
                type="button"
                className="demo-card"
                onClick={() => fillDemo(cred)}
              >
                <span className="demo-role">{cred.role}</span>
                <span className="demo-id">{cred.userId}</span>
                <span className="demo-pass">{cred.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}

export default Login;
