import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginApi } from "../../api/auth";
import logo from "../../assets/logo.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const isAdminSession = localStorage.getItem("role") === "admin";
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [shake, setShake] = useState(false);
  const passwordInputRef = useRef(null);

  // Load user ID from localStorage on component mount
  useEffect(() => {
    const registeredUserId = localStorage.getItem("registeredUserId");
    if (registeredUserId) {
      setUserId(registeredUserId);
      setIsAutoFilled(true);
      // Focus on password field after a brief delay
      setTimeout(() => {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }, 100);
    }
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi(userId, password, "user");

      if (result.success) {
        // Clear the registered user ID after successful login
        localStorage.removeItem("registeredUserId");
        navigate(result.redirect);
      } else {
        const msg = result.error || "User Not Found";
        setError(msg.includes("status code") || msg.includes("Request failed") ? "User Not Found" : msg);
        triggerShake();
      }
    } catch (requestError) {
      const detail = requestError.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).filter(Boolean).join(", ")
        : detail || requestError.response?.data?.message || requestError.response?.data?.error;
      setError(message || "User Not Found");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="orb orb-top" aria-hidden="true" />
      <div className="orb orb-bottom" aria-hidden="true" />

      <div className={`login-card ${shake ? "shake" : ""}`}>
        <img src={logo} alt="AurumFX Logo" className="logo" />

        <h1>Hi, Welcome Back!</h1>
        <p>Sign in to AurumFX Trading Platform</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group field-1">
            <label htmlFor="user_id">User ID</label>
            <input
              id="user_id"
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              aria-label="Editable User ID"
              className="user-id-input"
              required
            />
          </div>

          <div className="input-group field-2">
            <label htmlFor="password">Password</label>
            <div className="password-box">
              <input
                ref={passwordInputRef}
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

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <div className="options field-3">
            <label className="remember">
              <input type="checkbox" defaultChecked />
              Remember me
            </label>
            {isAutoFilled && (
              <button
                type="button"
                className="clear-user-btn"
                onClick={() => {
                  localStorage.removeItem("registeredUserId");
                  setUserId("");
                  setIsAutoFilled(false);
                  setPassword("");
                }}
              >
                Use Different Account
              </button>
            )}
          </div>

          <button type="submit" className="login-btn field-4" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" aria-hidden="true" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-register-prompt">
          <span>Don't have an account?</span>
          <Link to="/user/register" className="login-register-link">
            Register
          </Link>
        </div>

        {isAdminSession && (
          <Link to="/admin/dashboard" className="login-admin-link">
            Back to Admin
          </Link>
        )}
      </div>
    </div>
  );
}

export default Login;