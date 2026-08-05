import { useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminReports.css";

const pointHistoryData = [
  { no: 1,  username: "FX011", email: "praveenxperience@yahoo.in",    points: 900,  type: "Earned",   description: "Referral Bonus",      date: "2026-08-02" },
  { no: 2,  username: "FX001", email: "praveenxperience@yahoo.in",    points: 840,  type: "Earned",   description: "Matching Bonus",      date: "2026-08-03" },
  { no: 3,  username: "FX002", email: "arunlalkokkur@gmail.com",      points: 400,  type: "Earned",   description: "Monthly Interest",    date: "2026-08-05" },
  { no: 4,  username: "FX033", email: "sajini6002@gmail.com",         points: 200,  type: "Redeemed", description: "Wallet Withdrawal",   date: "2026-08-07" },
  { no: 5,  username: "FX034", email: "sajini6002@gmail.com",         points: 400,  type: "Earned",   description: "Weekly Interest",     date: "2026-08-08" },
  { no: 6,  username: "FX167", email: "muralika1983@gmail.com",       points: 400,  type: "Earned",   description: "Club Matching Bonus", date: "2026-08-10" },
  { no: 7,  username: "FX245", email: "arumugamlalith3266@gmail.com", points: 90,   type: "Redeemed", description: "Wallet Withdrawal",   date: "2026-08-12" },
  { no: 8,  username: "FX152", email: "muralika1983@gmail.com",       points: 60,   type: "Earned",   description: "Referral Bonus",      date: "2026-08-14" },
  { no: 9,  username: "FX021", email: "ajayakumarok@gmail.com",       points: 40,   type: "Earned",   description: "Monthly Interest",    date: "2026-08-15" },
  { no: 10, username: "FX179", email: "jayjith1962@gmail.com",        points: 40,   type: "Redeemed", description: "Wallet Withdrawal",   date: "2026-08-16" },
];

function PointHistory() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate,   setEndDate]   = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState(pointHistoryData);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    setRows(searchUser ? pointHistoryData.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase())) : pointHistoryData);
    setPage(1);
  };
  const handleReset = () => { setSearchUser(""); setRows(pointHistoryData); setPage(1); };
  const totalEarned   = rows.filter(r => r.type === "Earned").reduce((s, r) => s + r.points, 0);

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Point History</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span><span className="crumb-sep">•</span>
            <span>Reports</span><span className="crumb-sep">•</span>
            <span className="crumb-active">Point History</span>
          </div>
        </div>

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
            {pointHistoryData.map(r => <option key={r.no} value={r.username}>{r.username}</option>)}
          </select>
          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          <div className="reports-total-badge">
            <div className="reports-total-amount">{totalEarned.toLocaleString()} pts</div>
            <div className="reports-total-label">Total Points Earned</div>
          </div>
        </form>

        <div className="reports-table-card">
          <table className="reports-table">
            <thead>
              <tr>
                <th>No</th><th>Username</th><th>Email</th><th>Type</th><th>Description</th><th>Points</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td style={{ fontWeight: 600 }}>{row.username}</td>
                  <td>{row.email}</td>
                  <td>
                    <span style={{
                      background: row.type === "Earned" ? "#f0fdf4" : "#fff1f2",
                      color: row.type === "Earned" ? "#16a34a" : "#ef4444",
                      borderRadius: "6px", padding: "3px 10px", fontSize: "12px", fontWeight: 600
                    }}>{row.type}</span>
                  </td>
                  <td style={{ color: "#64748b" }}>{row.description}</td>
                  <td style={{ fontWeight: 700, color: row.type === "Earned" ? "#16a34a" : "#ef4444" }}>
                    {row.type === "Earned" ? "+" : "-"}{row.points}
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>No records found</td></tr>}
            </tbody>
          </table>
          <div className="reports-pagination">
            <button className="reports-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <button className="reports-page-btn reports-page-btn--active">{page}</button>
            <button className="reports-page-btn" onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PointHistory;
