import { Link } from "react-router-dom";

function Register() {
  return (
    <div>
      <h2>Register</h2>

      <button>Register</button>

      <br />

      <Link to="/login">
        Already have an account?
      </Link>
    </div>
  );
}

export default Register;