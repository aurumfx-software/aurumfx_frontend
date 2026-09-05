import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi, checkEnrollerApi } from "../api/auth";
import { getAllStatesWithDistricts } from "india-state-district";
import "./Register.css";
import logo from "../assets/logo.png";

const indianDistrictsByState = Object.fromEntries(
  getAllStatesWithDistricts().map(({ name, districts }) => [name, districts])
);

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
    registration_date: "",
    gender: "",
    country: "",
    state: "",
    district: "",
    city: "",
    zip_code: "",
    building_no: "",
    street: "",
    mobile: "",
    aadhar_no: "",
    pan: "",
    bank_account: "",
    bank_name: "",
    ifsc: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_relation_other: "",
    nominee_gender: "",
    nominee_dob: "",
    nominee_address: "",
    nominee_aadhar: "",
    nominee_mobile: "",
  });

  const [errors, setErrors] = useState({});

  // timer ref for debounced enroller lookup
  const enrollerTimer = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref") || params.get("enroller_id") || "";

    if (refId) {
      setFormData((prev) => ({ ...prev, enroller_id: refId }));
      setTimeout(() => {
        verifyEnroller(refId.trim());
      }, 200);
    }

    return () => {
      if (enrollerTimer.current) clearTimeout(enrollerTimer.current);
    };
  }, []);

  const formatDateInput = (value) => {
    const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  };

  const parseDisplayDate = (dateStr) => {
    const match = String(dateStr || "").match(/^(\d{2})[-/]([\d]{2})[-/](\d{4})$/);
    if (!match) return null;

    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return `${year}-${month}-${day}`;
  };

  const formatDateForApi = (dateStr) => {
    const isoDate = parseDisplayDate(dateStr) || dateStr;
    const match = String(isoDate || "").match(/^(\d{4})[-/]([\d]{2})[-/]([\d]{2})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
  };

  // Shared age calculator used by validate() and immediate field checks
  const calcAge = (dateStr) => {
    try {
      if (!dateStr) return null;
      const d = new Date(parseDisplayDate(dateStr) || dateStr);
      if (isNaN(d.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isDateField = ["date_of_birth", "registration_date", "nominee_dob"].includes(name);
    const nextValue = isDateField ? formatDateInput(value) : value;
    // clear general api/form error when user starts editing
    if (apiError) setApiError("");

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
      ...(name === "country" ? { state: "", district: "" } : {}),
      ...(name === "state" ? { district: "" } : {}),
    }));

    if (name === "enroller_id") {
      setEnrollerName("");
      if (enrollerTimer.current) clearTimeout(enrollerTimer.current);
      const v = value;
      enrollerTimer.current = setTimeout(() => {
        if (v && String(v).trim()) {
          verifyEnroller(v.trim());
        } else {
          setEnrollerName("");
        }
      }, 600);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Immediate DOB validation while user types or selects
    if (name === "date_of_birth") {
      const userAge = calcAge(nextValue);
      if (userAge === null) {
        setErrors((prev) => ({ ...prev, date_of_birth: "Please enter a valid Date of Birth" }));
      } else if (userAge < 18) {
        setErrors((prev) => ({ ...prev, date_of_birth: "You must be at least 18 years old to register" }));
      } else {
        setErrors((prev) => ({ ...prev, date_of_birth: "" }));
      }
    }

    if (name === "nominee_dob") {
      if (!nextValue) {
        setErrors((prev) => ({ ...prev, nominee_dob: "" }));
      } else {
        const nomAge = calcAge(nextValue);
        if (nomAge === null) {
          setErrors((prev) => ({ ...prev, nominee_dob: "Please enter a valid Nominee Date of Birth" }));
        } else if (nomAge < 18) {
          setErrors((prev) => ({ ...prev, nominee_dob: "Nominee must be at least 18 years old" }));
        } else {
          setErrors((prev) => ({ ...prev, nominee_dob: "" }));
        }
      }
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
      { key: "password", label: "Password" },
      { key: "confirm_password", label: "Confirm Password" },
      { key: "enroller_id", label: "Enroller ID" },
      { key: "date_of_birth", label: "Date of Birth" },
      { key: "registration_date", label: "Joining Date" },
      { key: "country", label: "Country" },
      { key: "state", label: "State" },
      { key: "mobile", label: "Mobile" },
      { key: "aadhar_no", label: "Aadhaar Number" },
      { key: "gender", label: "Gender" },
    ];

    mandatoryFields.forEach(({ key, label }) => {
      if (!formData[key] || !String(formData[key]).trim()) {
        e[key] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Please enter a valid email address";
    }

    const userAge = calcAge(formData.date_of_birth);
    if (userAge === null) {
      e.date_of_birth = "Please enter a valid Date of Birth";
    } else if (userAge < 18) {
      e.date_of_birth = "You must be at least 18 years old to register";
    }

    if (formData.registration_date && !parseDisplayDate(formData.registration_date)) {
      e.registration_date = "Please enter Joining Date as DD-MM-YYYY";
    }

    if (formData.nominee_dob) {
      const nomAge = calcAge(formData.nominee_dob);
      if (nomAge === null) {
        e.nominee_dob = "Please enter a valid Nominee Date of Birth";
      } else if (nomAge < 18) {
        e.nominee_dob = "Nominee must be at least 18 years old";
      }
    }

    if (
      formData.nominee_relation === "Other" &&
      (!formData.nominee_relation_other || !String(formData.nominee_relation_other).trim())
    ) {
      e.nominee_relation_other = "Please specify nominee relationship";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validate()) {
      setApiError("Please correct the highlighted fields and try again.");
      return;
    }

    const isEnrollerValid = await verifyEnroller(formData.enroller_id.trim());
    if (!isEnrollerValid) return;

    setLoading(true);
    try {
      const payload = { ...formData };
      payload.date_of_birth = formatDateForApi(payload.date_of_birth);
      payload.registration_date = formatDateForApi(payload.registration_date);
      if (payload.nominee_dob) {
        payload.nominee_dob = formatDateForApi(payload.nominee_dob);
      }
      if (payload.nominee_relation === "Other") {
        payload.nominee_relation = payload.nominee_relation_other || "";
      }
      // Remove helper field before sending
      delete payload.nominee_relation_other;

      // Ensure state is always included as required by backend
      if (!payload.state || !String(payload.state).trim()) {
        payload.state = "";
      }

      // Remove empty optional fields to prevent backend validation errors
      const optionalFields = [
        "city",
        "zip_code",
        "building_no",
        "street",
        "pan",
        "bank_account",
        "bank_name",
        "ifsc",
        "nominee_name",
        "nominee_relation",
        "nominee_gender",
        "nominee_dob",
        "nominee_address",
        "nominee_aadhar",
        "nominee_mobile",
      ];

      optionalFields.forEach((field) => {
        if (!payload[field] || String(payload[field]).trim() === "") {
          delete payload[field];
        }
      });

      const result = await registerApi(payload);
      if (result.success) {
        // Save user ID to localStorage
        const userId = result.data?.user_id || result.user_id || formData.email;
        localStorage.setItem("registeredUserId", userId);
        
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
        inputMode={name === "date_of_birth" || name === "registration_date" || name === "nominee_dob" ? "numeric" : undefined}
        maxLength={name === "date_of_birth" || name === "registration_date" || name === "nominee_dob" ? 10 : undefined}
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
        <option value="" disabled hidden>Select {label}</option>
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

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];

  const uaeStates = [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain"
  ];

  const stateSuggestions =
    formData.country === "India"
      ? indianStates
      : formData.country === "UAE"
        ? uaeStates
        : [];

  const districtSuggestions =
    formData.country === "India"
      ? indianDistrictsByState[formData.state] || []
      : [];

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
          {renderInput("last_name", "Last Name")}

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
          {renderInput("date_of_birth", "Date of Birth", "text", true, "DD-MM-YYYY")}
          {renderInput("registration_date", "Joining Date", "text", true, "DD-MM-YYYY")}
          {renderSelect("gender", "Gender", ["Male", "Female", "Other"], true)}
          {renderSelect(
            "country",
            "Country",
            ["India", "UAE", "USA", "UK", "Canada", "Australia", "Other"],
            true
          )}
          <div className="field-group">
            <label htmlFor="state">
              State <span className="required">*</span>
            </label>
            <input
              id="state"
              name="state"
              list={stateSuggestions.length ? "state-options" : undefined}
              placeholder={
                formData.country === "India"
                  ? "Type state name e.g. Kerala"
                  : formData.country === "UAE"
                    ? "Type emirate name e.g. Dubai"
                    : "Type your state or region"
              }
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "input-error" : ""}
            />
            {stateSuggestions.length > 0 && (
              <datalist id="state-options">
                {stateSuggestions.map((stateName) => (
                  <option key={stateName} value={stateName} />
                ))}
              </datalist>
            )}
            {errors.state && <small className="error">{errors.state}</small>}
          </div>
          <div className="field-group">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              list={districtSuggestions.length ? "district-options" : undefined}
              placeholder={
                formData.country === "India" && formData.state
                  ? "Type district name"
                  : "District"
              }
              value={formData.district}
              onChange={handleChange}
              className={errors.district ? "input-error" : ""}
            />
            {districtSuggestions.length > 0 && (
              <datalist id="district-options">
                {districtSuggestions.map((districtName) => (
                  <option key={districtName} value={districtName} />
                ))}
              </datalist>
            )}
            {errors.district && <small className="error">{errors.district}</small>}
          </div>
          {renderInput("city", "City", "text", false)}
          {renderInput("street", "Street", "text", false)}
          {renderInput("building_no", "Building No.", "text", false)}
          {renderInput("zip_code", "ZIP Code", "text", false)}
          {renderInput("mobile", "Mobile", "tel", true)}
          {renderInput("aadhar_no", "Aadhaar Number", "text", true)}
          {renderInput("pan", "PAN Number", "text", false)}

          <h3 className="form-section-title">Bank Details</h3>
          {renderInput("bank_name", "Bank Name", "text", false)}
          {renderInput("bank_account", "Bank Account Number", "text", false)}
          {renderInput("ifsc", "IFSC Code", "text", false)}

          <h3 className="form-section-title">Nominee Details</h3>
          {renderInput("nominee_name", "Nominee Name", "text", false)}
          {renderSelect(
            "nominee_relation",
            "Nominee Relationship",
            ["Mother", "Father", "Daughter", "Son", "Husband", "Wife", "Brother", "Sister", "Friend", "Other"],
            false
          )}
          {formData.nominee_relation === "Other" && renderInput("nominee_relation_other", "Please specify relationship", "text", false)}
          {renderSelect(
            "nominee_gender",
            "Nominee Gender",
            ["Male", "Female", "Other"],
            false
          )}
          {renderInput("nominee_dob", "Nominee DOB", "text", false, "DD-MM-YYYY")}
          {renderTextArea("nominee_address", "Nominee Address", false)}
          {renderInput("nominee_aadhar", "Nominee Aadhaar", "text", false)}
          {renderInput("nominee_mobile", "Nominee Mobile", "tel", false)}

          {apiError && (
            <div className="form-error-banner" style={{ color: "#e74c3c", marginTop: "15px", textAlign: "center" }}>
              {apiError}
            </div>
          )}
          {successMessage && (
            <div className="form-success-banner" style={{ color: "#27ae60", marginTop: "15px", textAlign: "center" }}>
              {successMessage}
            </div>
          )}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;


