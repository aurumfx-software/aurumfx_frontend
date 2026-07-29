
import { useState } from "react";
import "./Register.css";
import logo from "../assets/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email:"",
    firstName:"",
    lastName:"",
    password:"",
    confirmPassword:"",
    enrollerId:"",
    dob:"",
    country:"",
    city:"",
    zipCode:"",
    mobile:"",
    aadhar:"",
    pan:"",
    gender:"",
    club:"",
    bankName:"",
    bankAccount:"",
    confirmBankAccount:"",
    ifsc:"",
    nomineeName:"",
    nomineeDob:"",
    nomineeGender:"",
    nomineeRelation:"",
    nomineeAddress:"",
  });

  const [errors,setErrors]=useState({});

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({...prev,[name]:value}));
  };

  const validate=()=>{
    const e={};
    if(!/\S+@\S+\.\S+/.test(formData.email)) e.email="Valid email required";
    if(!formData.firstName) e.firstName="Required";
    if(!formData.lastName) e.lastName="Required";
    if(formData.password.length<8) e.password="Minimum 8 characters";
    if(formData.password!==formData.confirmPassword) e.confirmPassword="Passwords do not match";
    if(!/^\d{12}$/.test(formData.aadhar)) e.aadhar="Aadhaar must be 12 digits";
    if(!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.toUpperCase())) e.pan="Invalid PAN";
    if(!/^\d{9,18}$/.test(formData.bankAccount)) e.bankAccount="Invalid account";
    if(formData.bankAccount!==formData.confirmBankAccount) e.confirmBankAccount="Accounts do not match";
    if(!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.toUpperCase())) e.ifsc="Invalid IFSC";
    ["enrollerId","dob","country","city","zipCode","mobile","gender","club","bankName","nomineeName","nomineeDob","nomineeGender","nomineeRelation","nomineeAddress"].forEach(f=>{
      if(!formData[f]) e[f]="Required";
    });
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSubmit=(ev)=>{
    ev.preventDefault();
    if(validate()){
      alert("Registration Successful");
      console.log(formData);
    }
  };

  const input=(name,ph,type="text")=>(
    <>
      <input type={type} name={name} placeholder={ph} value={formData[name]} onChange={handleChange}/>
      {errors[name] && <small className="error">{errors[name]}</small>}
    </>
  );

  return (
    <div className="register-page">
      <div className="register-card">
        <img src={logo} className="logo" alt="logo"/>
        <h1>Hi, Welcome!</h1>
        <p>Sign up with AurumFX</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <h3>Personal Details</h3>
          {input("email","Email","email")}
          {input("firstName","First Name")}
          {input("lastName","Last Name")}

          <div className="password-box">
            <input type={showPassword?"text":"password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
            <span onClick={()=>setShowPassword(!showPassword)}>👁</span>
          </div>
          {errors.password && <small className="error">{errors.password}</small>}

          <div className="password-box">
            <input type={showConfirmPassword?"text":"password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}/>
            <span onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>👁</span>
          </div>
          {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}

          {input("enrollerId","Enroller ID")}
          {input("dob","Date of Birth","date")}

          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Country</option><option>India</option><option>UAE</option><option>USA</option>
          </select>
          {errors.country && <small className="error">{errors.country}</small>}

          {input("city","City")}
          {input("zipCode","ZIP Code")}
          {input("mobile","Mobile")}
          {input("aadhar","Aadhaar Number")}
          {input("pan","PAN Number")}

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
          {errors.gender && <small className="error">{errors.gender}</small>}

          <select name="club" value={formData.club} onChange={handleChange}>
            <option value="">Club</option><option>Silver</option><option>Gold</option><option>Diamond</option>
          </select>
          {errors.club && <small className="error">{errors.club}</small>}

          <h3>Bank Details</h3>
          {input("bankName","Bank Name")}
          {input("bankAccount","Account Number")}
          {input("confirmBankAccount","Confirm Account Number")}
          {input("ifsc","IFSC Code")}

          <h3>Nominee Details</h3>
          {input("nomineeName","Nominee Name")}
          {input("nomineeDob","Nominee DOB","date")}
          <select name="nomineeGender" value={formData.nomineeGender} onChange={handleChange}>
            <option value="">Nominee Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
          {errors.nomineeGender && <small className="error">{errors.nomineeGender}</small>}
          {input("nomineeRelation","Relationship")}
          <textarea name="nomineeAddress" placeholder="Nominee Address" value={formData.nomineeAddress} onChange={handleChange}/>
          {errors.nomineeAddress && <small className="error">{errors.nomineeAddress}</small>}

          <button className="register-btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
