import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminEnrollersApi } from "../../../api/admin-genealogy";
import "./GenealogyPage.css";

const formatDate = (value) => {
  if (!value && value !== 0) return "-";

  const raw = String(value).trim();
  const match = raw.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);

  if (match) {
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = String(parsed.getFullYear());
    return `${day}-${month}-${year}`;
  }

  return raw;
};

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
    const baseList = normalizedQuery
      ? enrollers.filter((item) => [
          item.user_id,
          item.fullname,
          item.full_name,
          item.enroller_id,
          item.enroller_name,
        ].some((value) => String(value || "").toLowerCase().includes(normalizedQuery)))
      : [...enrollers];

    return baseList.sort((a, b) => {
      const getUserOrderValue = (value) => {
        const parsed = Number(String(value || "").replace(/[^0-9]/g, ""));
        return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
      };

      return getUserOrderValue(a.user_id) - getUserOrderValue(b.user_id);
    });
  }, [enrollers, query]);

  return (
    <AdminLayout>
      <div className="genealogy-page admin-genealogy-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Business Overview</span>
          <div className="agen-page-header-top">
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
                    <tr key={item.user_id || item.fullname || "enroller-row"}>
                      <td className="agen-user-id">{item.user_id || "-"}</td>
                      <td>{item.fullname || item.full_name || "-"}</td>
                      <td>{formatDate(item.date_of_joining)}</td>
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
