import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminGenealogyListApi } from "../../../api/admin-genealogy";
import "./GenealogyPage.css";

const formatDate = (value) => {
  if (!value) return "-";
  const [datePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  return year && month && day ? `${day}-${month}-${year}` : datePart;
};

function GenealogyListPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminGenealogyListApi().then((res) => {
      if (res.success) setUsers(res.data);
      else setError(res.error || "Unable to load genealogy list.");
      setLoading(false);
    });
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) =>
      [user.user_id, user.fullname, user.full_name, user.name]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery))
    );
  }, [users, query]);

  return (
    <AdminLayout>
      <div className="genealogy-page admin-genealogy-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Network Overview</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Family List</h1>
              <p className="agen-page-subtitle">All members in the network with investment status</p>
            </div>
          </div>
        </div>

        <div className="agen-panel">
          <div className="agen-header-row">
            <h2>All Members</h2>
            <div className="agen-actions">
              <div className="agen-search-input-wrap">
                <FiSearch size={14} className="agen-search-icon" />
                <input
                  className="agen-input"
                  placeholder="Search by user ID or name"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? <div className="agen-empty">Loading genealogy list...</div> : error ? <div className="agen-error">{error}</div> : (
            <div className="agen-list-table-wrapper">
              <table className="agen-list-table">
                <thead><tr><th>User ID</th><th>Full Name</th><th>Date of Joining</th><th>Rank</th><th>Total Investment</th><th>Total Lots</th><th>Investment Status</th><th>Level</th></tr></thead>
                <tbody>
                  {filteredUsers.length === 0 ? <tr><td colSpan="8" className="agen-empty-cell">No members found.</td></tr> : filteredUsers.map((user) => {
                    const status = String(user.investment_status || "INACTIVE").toUpperCase();
                    return <tr key={user.user_id}>
                      <td className="agen-user-id">{user.user_id || "-"}</td>
                      <td>{user.fullname || user.full_name || user.name || "-"}</td>
                      <td>{formatDate(user.date_of_joining || user.date_of_join)}</td>
                      <td>{user.rank || "-"}</td>
                      <td>₹{Number(user.total_investment || 0).toLocaleString("en-IN")}</td>
                      <td>{Number(user.total_lots || 0)}</td>
                      <td><span className={`agen-status ${status === "ACTIVE" ? "is-active" : "is-inactive"}`}>{status}</span></td>
                      <td>{user.level ?? "-"}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default GenealogyListPage;
