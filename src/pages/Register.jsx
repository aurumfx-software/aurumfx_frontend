import { useState } from "react";
import "./Register.css";
import logo from "../assets/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-page">
      <div className="register-card">
        <img src={logo} alt="AurumFX Logo" className="logo" />

        <h1>Hi, Welcome!</h1>
        <p>Sign up with AurumFX</p>

        <form className="register-form">
          <input type="email" placeholder="Email" />

          <input type="text" placeholder="First Name" />

          <input type="text" placeholder="Last Name" />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={() => setShowPassword(!showPassword)}>👁</span>
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              👁
            </span>
          </div>

          <input type="text" placeholder="Enroller ID" />

          <input type="date" />

          <select>
            <option>Country</option>
            <option>India</option>
            <option>UAE</option>
            <option>USA</option>
          </select>

          <input type="text" placeholder="City" />

          <input type="text" placeholder="Zip Code" />

          <input type="tel" placeholder="Mobile" />

          <input type="text" placeholder="Aadhar No" />

          <select>
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select>
            <option>Club</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Diamond</option>
          </select>
        </form>

        <div className="terms">
          <a href="/">Terms of Service</a>
          <span>&nbsp;&nbsp;&amp;&nbsp;&nbsp;</span>
          <a href="/">Privacy Policy</a>
        </div>

        <button className="register-btn">Register</button>
      </div>
    </div>
  );
};

export default Register;
