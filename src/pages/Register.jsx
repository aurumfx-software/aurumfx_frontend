import { useState } from "react";
import "./Register.css";
import logo from "../assets/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    enrollerId: "",
    dob: "",
    country: "",
    city: "",
    zipCode: "",
    mobile: "",
    aadhar: "",
    pan: "",
    gender: "",
    club: "",
    bankName: "",
    bankAccount: "",
    confirmBankAccount: "",
    ifsc: "",
    nomineeName: "",
    nomineeDob: "",
    nomineeGender: "",
    nomineeRelation: "",
    nomineeAddress: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const e = {};

    // Personal Details Validation
    if (!formData.email || !formData.email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Valid email required";
    }

    if (!formData.firstName || !formData.firstName.trim()) {
      e.firstName = "First name is required";
    }

    if (!formData.lastName || !formData.lastName.trim()) {
      e.lastName = "Last name is required";
    }

    if (!formData.password) {
      e.password = "Password is required";
    } else if (formData.password.length < 8) {
      e.password = "Minimum 8 characters required";
    }

    if (!formData.confirmPassword) {
      e.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (!formData.enrollerId || !formData.enrollerId.trim()) {
      e.enrollerId = "Enroller ID is required";
    }

    if (!formData.dob) {
      e.dob = "Date of birth is required";
    }

    if (!formData.country) {
      e.country = "Country selection is required";
    }

    if (!formData.city || !formData.city.trim()) {
      e.city = "City is required";
    }

    if (!formData.zipCode || !formData.zipCode.trim()) {
      e.zipCode = "ZIP code is required";
    }

    if (!formData.mobile || !formData.mobile.trim()) {
      e.mobile = "Mobile number is required";
    }

    if (!formData.aadhar || !formData.aadhar.trim()) {
      e.aadhar = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhar.trim())) {
      e.aadhar = "Aadhaar must be 12 digits";
    }

    if (!formData.pan || !formData.pan.trim()) {
      e.pan = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.pan.trim())) {
      e.pan = "Invalid PAN format (e.g. ABCDE1234F)";
    }

    if (!formData.gender) {
      e.gender = "Gender selection is required";
    }

    if (!formData.club) {
      e.club = "Club selection is required";
    }

    // Bank Details Validation
    if (!formData.bankName || !formData.bankName.trim()) {
      e.bankName = "Bank name is required";
    }

    if (!formData.bankAccount || !formData.bankAccount.trim()) {
      e.bankAccount = "Account number is required";
    } else if (!/^\d{9,18}$/.test(formData.bankAccount.trim())) {
      e.bankAccount = "Invalid account number (9-18 digits)";
    }

    if (!formData.confirmBankAccount || !formData.confirmBankAccount.trim()) {
      e.confirmBankAccount = "Confirm account number is required";
    } else if (formData.bankAccount !== formData.confirmBankAccount) {
      e.confirmBankAccount = "Accounts do not match";
    }

    if (!formData.ifsc || !formData.ifsc.trim()) {
      e.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifsc.trim())) {
      e.ifsc = "Invalid IFSC format (e.g. SBIN0001234)";
    }

    // Nominee Details Validation
    if (!formData.nomineeName || !formData.nomineeName.trim()) {
      e.nomineeName = "Nominee name is required";
    }

    if (!formData.nomineeDob) {
      e.nomineeDob = "Nominee DOB is required";
    }

    if (!formData.nomineeGender) {
      e.nomineeGender = "Nominee gender selection is required";
    }

    if (!formData.nomineeRelation || !formData.nomineeRelation.trim()) {
      e.nomineeRelation = "Relationship is required";
    }

    if (!formData.nomineeAddress || !formData.nomineeAddress.trim()) {
      e.nomineeAddress = "Nominee address is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) {
      alert("Registration Successful");
      console.log(formData);
    }
  };

  const renderInput = (name, placeholder, type = "text") => (
    <div className="field-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  const renderSelect = (name, options, placeholder) => (
    <div className="field-group">
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "input-error" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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
          {renderInput("email", "Email", "email")}
          {renderInput("firstName", "First Name", "text")}
          {renderInput("lastName", "Last Name", "text")}

          <div className="field-group">
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <span onClick={() => setShowPassword(!showPassword)}>👁</span>
            </div>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <div className="field-group">
            <div className="password-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </span>
            </div>
            {errors.confirmPassword && (
              <small className="error">{errors.confirmPassword}</small>
            )}
          </div>

          {renderInput("enrollerId", "Enroller ID")}
          {renderInput("dob", "Date of Birth", "date")}
          {renderSelect("country", ["India", "UAE", "USA"], "Country")}
          {renderInput("city", "City")}
          {renderInput("zipCode", "ZIP Code")}
          {renderInput("mobile", "Mobile Number")}
          {renderInput("aadhar", "Aadhaar Number")}
          {renderInput("pan", "PAN Number")}
          {renderSelect("gender", ["Male", "Female", "Other"], "Gender")}
          {renderSelect("club", ["Silver", "Gold", "Diamond"], "Club")}

          <h3 className="form-section-title">Bank Details</h3>
          {renderInput("bankName", "Bank Name")}
          {renderInput("bankAccount", "Account Number")}
          {renderInput("confirmBankAccount", "Confirm Account Number")}
          {renderInput("ifsc", "IFSC Code")}

          <h3 className="form-section-title">Nominee Details</h3>
          {renderInput("nomineeName", "Nominee Name")}
          {renderInput("nomineeDob", "Nominee DOB", "date")}
          {renderSelect(
            "nomineeGender",
            ["Male", "Female", "Other"],
            "Nominee Gender"
          )}
          {renderInput("nomineeRelation", "Relationship")}

          <div className="field-group full-width">
            <textarea
              name="nomineeAddress"
              placeholder="Nominee Address"
              value={formData.nomineeAddress}
              onChange={handleChange}
              className={errors.nomineeAddress ? "input-error" : ""}
            />
            {errors.nomineeAddress && (
              <small className="error">{errors.nomineeAddress}</small>
            )}
          </div>

          <button className="register-btn" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;


