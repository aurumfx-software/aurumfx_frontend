import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard1</h1>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;