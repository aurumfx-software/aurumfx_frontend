import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminEnrollersApi } from "../../../api/admin-genealogy";
import "./GenealogyPage.css";

function AdminEnrollersPage() {
  const [enrollers, setEnrollers] = useState([]);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminEnrollersApi().then((res) => {
      if (res.success) {
        setEnrollers(res.data.enrollers);
        setTotal(res.data.total);
      } else {
        setError(res.error || "Unable to load enrollers.");
      }
      setLoading(false);
    });
  }, []);

  const filteredEnrollers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return enrollers;
    return enrollers.filter((item) => [
      item.user_id,
      item.fullname,
      item.full_name,
      item.enroller_id,
      item.enroller_name,
    ].some((value) => String(value || "").toLowerCase().includes(normalizedQuery)));
  }, [enrollers, query]);

  return (
    <AdminLayout>
      <div className="genealogy-page admin-genealogy-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Business Overview</span>
          <div className="agen-page-header-top">
            <span className="agen-title-icon" aria-hidden="true"><FiUsers /></span>
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Enrolment</h1>
              <p className="agen-page-subtitle">View every member and their sponsor relationship</p>
            </div>
          </div>
        </div>

        <div className="agen-panel">
          <div className="agen-header-row">
            <h2>All Enrollers <span className="agen-count">{total}</span></h2>
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

          {loading ? <div className="agen-empty">Loading enrollers...</div> : error ? <div className="agen-error">{error}</div> : (
            <div className="agen-list-table-wrapper">
              <table className="agen-list-table agen-enrollers-table">
                <thead><tr><th>User ID</th><th>Full Name</th><th>Date of Joining</th><th>Rank</th><th>Total Investment</th><th>Total Lots</th><th>Enroller ID</th><th>Enroller Name</th></tr></thead>
                <tbody>
                  {filteredEnrollers.length === 0 ? <tr><td colSpan="8" className="agen-empty-cell">No enrollers found.</td></tr> : filteredEnrollers.map((item) => (
                    <tr key={item.user_id}>
                      <td className="agen-user-id">{item.user_id || "-"}</td>
                      <td>{item.fullname || item.full_name || "-"}</td>
                      <td>{item.date_of_joining || "-"}</td>
                      <td>{item.rank || "-"}</td>
                      <td>₹{Number(item.total_investment_amount || 0).toLocaleString("en-IN")}</td>
                      <td>{Number(item.total_lots || 0)}</td>
                      <td className="agen-user-id">{item.enroller_id || "-"}</td>
                      <td>{item.enroller_name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminEnrollersPage;
