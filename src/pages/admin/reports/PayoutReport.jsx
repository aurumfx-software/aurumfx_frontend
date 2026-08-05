import { useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminReports.css";

const payoutReportData = [
  { no: 1,  username: "FX245", name: "Arumugam L",     email: "arumugamlalith3266@gmail.com", amount: 900,  adminFee: 45,  netPayable: 855,  date: "2026-08-10", status: "Approved" },
  { no: 2,  username: "FX179", name: "Jay Jith",        email: "jayjith1962@gmail.com",        amount: 400,  adminFee: 20,  netPayable: 380,  date: "2026-08-11", status: "Approved" },
  { no: 3,  username: "FX021", name: "Ajayakumar O K",  email: "ajayakumarok@gmail.com",       amount: 400,  adminFee: 20,  netPayable: 380,  date: "2026-08-12", status: "Pending"  },
  { no: 4,  username: "FX152", name: "Muralika R",      email: "muralika1983@gmail.com",       amount: 600,  adminFee: 30,  netPayable: 570,  date: "2026-08-14", status: "Approved" },
  { no: 5,  username: "FX001", name: "Praveen K",       email: "praveenxperience@yahoo.in",    amount: 8400, adminFee: 420, netPayable: 7980, date: "2026-08-15", status: "Approved" },
  { no: 6,  username: "FX011", name: "Praveen K",       email: "praveenxperience@yahoo.in",    amount: 9000, adminFee: 450, netPayable: 8550, date: "2026-08-16", status: "Rejected" },
];

const statusColor = { Approved: "#16a34a", Pending: "#d97706", Rejected: "#ef4444" };

function PayoutReport() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate,   setEndDate]   = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [rows, setRows] = useState(payoutReportData);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    setRows(searchUser ? payoutReportData.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase())) : payoutReportData);
    setPage(1);
  };
  const handleReset = () => { setSearchUser(""); setRows(payoutReportData); setPage(1); };
  const total = rows.filter(r => r.status === "Approved").reduce((s, r) => s + r.netPayable, 0);

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Payout</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span><span className="crumb-sep">•</span>
            <span>Reports</span><span className="crumb-sep">•</span>
            <span className="crumb-active">Payout</span>
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
            {payoutReportData.map(r => <option key={r.no} value={r.username}>{r.username}</option>)}
          </select>
          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          <div className="reports-total-badge">
            <div className="reports-total-amount">₹{total.toLocaleString()}</div>
            <div className="reports-total-label">Total Paid Out</div>
          </div>
        </form>

        <div className="reports-table-card">
          <table className="reports-table">
            <thead>
              <tr>
                <th>No</th><th>Username</th><th>Name</th><th>Email</th><th>Amount</th><th>Admin Fee</th><th>Net Payable</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td style={{ fontWeight: 600 }}>{row.username}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>₹{row.amount}</td>
                  <td style={{ color: "#ef4444" }}>₹{row.adminFee}</td>
                  <td style={{ fontWeight: 700, color: "#16a34a" }}>₹{row.netPayable}</td>
                  <td>{row.date}</td>
                  <td><span style={{ color: statusColor[row.status], fontWeight: 600 }}>{row.status}</span></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>No records found</td></tr>}
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

export default PayoutReport;
