import { useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "../../../components/Admin/AdminLayout";
import "./AdminReports.css";

const topEarnersData = [
  { no: 1,  username: "FX011", email: "praveenxperience@yahoo.in",       amount: 9000 },
  { no: 2,  username: "FX001", email: "praveenxperience@yahoo.in",       amount: 8400 },
  { no: 3,  username: "FX002", email: "arunlalkokkur@gmail.com",         amount: 4000 },
  { no: 4,  username: "FX033", email: "sajini6002@gmail.com",            amount: 4000 },
  { no: 5,  username: "FX034", email: "sajini6002@gmail.com",            amount: 4000 },
  { no: 6,  username: "FX167", email: "muralika1983@gmail.com",          amount: 4000 },
  { no: 7,  username: "FX245", email: "arumugamlalith3266@gmail.com",    amount: 900  },
  { no: 8,  username: "FX152", email: "muralika1983@gmail.com",          amount: 600  },
  { no: 9,  username: "FX021", email: "ajayakumarok@gmail.com",          amount: 400  },
  { no: 10, username: "FX179", email: "jayjith1962@gmail.com",           amount: 400  },
];

const totalAmount = topEarnersData.reduce((s, r) => s + r.amount, 0);

function TopEarners() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate,   setEndDate]   = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState(topEarnersData);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUser) {
      setRows(topEarnersData.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase()) || r.email.toLowerCase().includes(searchUser.toLowerCase())));
    } else {
      setRows(topEarnersData);
    }
    setPage(1);
  };

  const handleReset = () => { setSearchUser(""); setRows(topEarnersData); setPage(1); };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Top Earners</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span>Reports</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Top Earners</span>
          </div>
        </div>

        {/* Filter Bar */}
        <form className="reports-filter-bar" onSubmit={handleSearch}>
          <div className="reports-date-field">
            <span className="reports-date-label">Pick Start Date</span>
            <div className="reports-date-row">
              <input type="date" className="reports-date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <FiCalendar className="reports-date-icon" />
            </div>
          </div>

          <div className="reports-date-field">
            <span className="reports-date-label">Pick End Date</span>
            <div className="reports-date-row">
              <input type="date" className="reports-date-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
              <FiCalendar className="reports-date-icon" />
            </div>
          </div>

          <select className="reports-user-select" value={searchUser} onChange={e => setSearchUser(e.target.value)}>
            <option value="">Search User</option>
            {topEarnersData.map(r => <option key={r.no} value={r.username}>{r.username}</option>)}
          </select>

          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>
            Reset <FiRefreshCw size={13} />
          </button>

          <div className="reports-total-badge">
            <div className="reports-total-amount">₹{totalAmount.toLocaleString()}</div>
            <div className="reports-total-label">Total Amount</div>
          </div>
        </form>

        {/* Table */}
        <div className="reports-table-card">
          <table className="reports-table">
            <thead>
              <tr>
                <th>No</th>
                <th>User name</th>
                <th>Email</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.username}</td>
                  <td>{row.email}</td>
                  <td style={{ fontWeight: "700", color: "#16a34a" }}>₹{row.amount}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>No records found</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="reports-pagination">
            <button className="reports-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
            <button className="reports-page-btn reports-page-btn--active">{page}</button>
            <button className="reports-page-btn" onClick={() => setPage(p => p+1)}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default TopEarners;
