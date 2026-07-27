import { useNavigate } from "react-router-dom";
import { logout, getAuth } from "../utils/auth";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const { userId } = getAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-card">
        <h1>Welcome, {userId}</h1>
        <p>Your trading dashboard is coming soon.</p>
        <button type="button" className="user-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
