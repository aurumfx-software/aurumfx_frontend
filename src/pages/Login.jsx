import "./Login.css";
import logo from "../assets/logo.png";

function Login() {
  return (
    <div className="login-page">
      <div className="top-right">
        <span>Don't have an account?</span>
        <button className="register-btn">Get Started</button>
      </div>

      <div className="login-card">
        <img src={logo} alt="AurumFX Logo" className="logo" />

        <h1>Hi, Welcome Back!</h1>
        <p>Sign in to AurumFx</p>

        <div className="input-group">
          <label>User ID</label>
          <input
            type="text"
            placeholder="Enter User ID"
            defaultValue="aurumfx"
          />
        </div>

        <div className="input-group">
          <label>Password</label>

          <div className="password-box">
            <input placeholder="Enter Password" />

            <button className="eye-btn">👁</button>
          </div>
        </div>

        <div className="options">
          <label className="remember">
            <input type="checkbox" defaultChecked />
            Remember me
          </label>

          <a href="/">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
