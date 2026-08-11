import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi, checkEnrollerApi } from "../api/auth";
import "./Register.css";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingEnroller, setCheckingEnroller] = useState(false);
  const [enrollerName, setEnrollerName] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password:"",
    enroller_id: "",
    date_of_birth: "",
    country: "",
    city: "",
    zip_code: "",
    mobile: "",
    aadhar_no: "",
    pan: "",
    gender: "",
    bank_account: "",
    bank_name: "",
    ifsc: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_gender: "",
    nominee_dob: "",
    nominee_address: "",
    nominee_aadhar: "",
    nominee_mobile: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "enroller_id") {
      setEnrollerName("");
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const verifyEnroller = async (idToVerify) => {
    const id = idToVerify !== undefined ? idToVerify : formData.enroller_id;
    if (!id || !String(id).trim()) {
      setEnrollerName("");
      return false;
    }
    setCheckingEnroller(true);
    try {
      const res = await checkEnrollerApi(id.trim());
      if (res.success && res.exists) {
        setEnrollerName(res.name ? `Enroller: ${res.name}` : "Enroller ID verified ✓");
        setErrors((prev) => ({ ...prev, enroller_id: "" }));
        return true;
      } else {
        setEnrollerName("");
        setErrors((prev) => ({
          ...prev,
          enroller_id: res.error || "Enroller ID does not exist",
        }));
        return false;
      }
    } catch {
      setEnrollerName("");
      setErrors((prev) => ({
        ...prev,
        enroller_id: "Failed to verify Enroller ID",
      }));
      return false;
    } finally {
      setCheckingEnroller(false);
    }
  };

  const handleEnrollerBlur = () => {
    if (formData.enroller_id && formData.enroller_id.trim()) {
      verifyEnroller(formData.enroller_id.trim());
    }
  };

  const validate = () => {
    const e = {};

    const mandatoryFields = [
      { key: "email", label: "Email" },
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "password", label: "Password" },
      { key: "confirm_password", label: "Confirm Password" },
      { key: "enroller_id", label: "Enroller ID" },
      { key: "date_of_birth", label: "Date of Birth" },
      { key: "country", label: "Country" },
      { key: "zip_code", label: "ZIP Code" },
      { key: "mobile", label: "Mobile" },
      { key: "aadhar_no", label: "Aadhaar Number" },
      { key: "pan", label: "PAN" },
      { key: "nominee_name", label: "Nominee Name" },
      { key: "nominee_aadhar", label: "Nominee Aadhaar" },
      { key: "nominee_mobile", label: "Nominee Mobile" },
    ];

    mandatoryFields.forEach(({ key, label }) => {
      if (!formData[key] || !String(formData[key]).trim()) {
        e[key] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Please enter a valid email address";
    }

    if (formData.password && formData.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }

    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
      e.confirm_password = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validate()) return;

    const isEnrollerValid = await verifyEnroller(formData.enroller_id.trim());
    if (!isEnrollerValid) return;

    setLoading(true);
    try {
      const result = await registerApi(formData);
      if (result.success) {
        setSuccessMessage(result.message || "Registration Successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/user/login");
        }, 1500);
      } else {
        setApiError(result.error);
      }
    } catch {
      setApiError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    name,
    label,
    type = "text",
    required = false,
    placeholder = "",
    onBlur = null,
    extraInfo = null
  ) => (
    <div className="field-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder || label}
        value={formData[name]}
        onChange={handleChange}
        onBlur={onBlur}
        className={errors[name] ? "input-error" : ""}
      />
      {extraInfo && <small className="info-text" style={{ color: "#27ae60", marginTop: "2px", fontWeight: 500 }}>{extraInfo}</small>}
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  const renderSelect = (name, label, options, required = false) => (
    <div className="field-group">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "input-error" : ""}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  const renderTextArea = (
    name,
    label,
    required = false,
    placeholder = ""
  ) => (
    <div className="field-group field-group-full">
      <label htmlFor={name}>
        {label} {required && <span className="required">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder || label}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "input-error" : ""}
        rows={3}
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  return (
    <div className="register-page">
      <div className="register-card">
        <img src={logo} className="logo" alt="logo" />
        <h1>Hi, Welcome!</h1>
        <p>Sign up with AurumFX</p>

        <form className="register-form" noValidate onSubmit={handleSubmit}>
          <h3 className="form-section-title">Personal Details</h3>
          {renderInput("email", "Email", "email", true)}
          {renderInput("first_name", "First Name", "text", true)}
          {renderInput("last_name", "Last Name", "text", true)}

          <div className="field-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="password-box">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <div className="field-group">
            <label htmlFor="confirm_password">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-box">
              <input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={errors.confirm_password ? "input-error" : ""}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "🙈" : "👁"}
              </span>
            </div>
            {errors.confirm_password && (
              <small className="error">{errors.confirm_password}</small>
            )}
          </div>

          {renderInput(
            "enroller_id",
            "Enroller ID",
            "text",
            true,
            "",
            handleEnrollerBlur,
            checkingEnroller ? "Checking Enroller ID..." : enrollerName
          )}
          {renderInput("date_of_birth", "Date of Birth", "date", true)}
          {renderSelect(
            "country",
            "Country",
            ["India", "UAE", "USA", "UK", "Canada", "Australia", "Other"],
            true
          )}
          {renderInput("city", "City", "text", false)}
          {renderInput("zip_code", "ZIP Code", "text", true)}
          {renderInput("mobile", "Mobile", "tel", true)}
          {renderInput("aadhar_no", "Aadhaar Number", "text", true)}
          {renderInput("pan", "PAN Number", "text", true)}
          {renderSelect("gender", "Gender", ["Male", "Female", "Other"], false)}

          <h3 className="form-section-title">Bank Details</h3>
          {renderInput("bank_name", "Bank Name", "text", false)}
          {renderInput("bank_account", "Bank Account Number", "text", false)}
          {renderInput("ifsc", "IFSC Code", "text", false)}

          <h3 className="form-section-title">Nominee Details</h3>
          {renderInput("nominee_name", "Nominee Name", "text", true)}
          {renderInput("nominee_relation", "Nominee Relationship", "text", false)}
          {renderSelect(
            "nominee_gender",
            "Nominee Gender",
            ["Male", "Female", "Other"],
            false
          )}
          {renderInput("nominee_dob", "Nominee DOB", "date", false)}
          {renderTextArea("nominee_address", "Nominee Address", false)}
          {renderInput("nominee_aadhar", "Nominee Aadhaar", "text", true)}
          {renderInput("nominee_mobile", "Nominee Mobile", "tel", true)}

          {apiError && <p className="register-error" style={{ color: "#e74c3c", marginTop: "15px", textAlign: "center" }}>{apiError}</p>}
          {successMessage && <p className="register-success" style={{ color: "#27ae60", marginTop: "15px", textAlign: "center" }}>{successMessage}</p>}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;


