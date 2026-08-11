import { useState } from "react";
import { FiCalendar, FiRefreshCw, FiUpload, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminReports.css";
import "./FundTransfer.css";

const payoutReportData = [
  { no: 1,  username: "FX152", fullName: "Muraleedharan K",  status: "Approved", walletAddress: "", requestedAmount: 3400,  adminFee: 170,    amountReleased: 3400,  coin: "", date: "01 Aug 2026" },
  { no: 2,  username: "FX155", fullName: "Hima V V",         status: "Approved", walletAddress: "", requestedAmount: 4500,  adminFee: 225,    amountReleased: 4500,  coin: "", date: "01 Aug 2026" },
  { no: 3,  username: "FX167", fullName: "Namitha E",        status: "Approved", walletAddress: "", requestedAmount: 10800, adminFee: 540,    amountReleased: 10800, coin: "", date: "01 Aug 2026" },
  { no: 4,  username: "FX179", fullName: "Abhijith S",       status: "Approved", walletAddress: "", requestedAmount: 4500,  adminFee: 225,    amountReleased: 4500,  coin: "", date: "01 Aug 2026" },
  { no: 5,  username: "FX180", fullName: "Sreedharan M",     status: "Approved", walletAddress: "", requestedAmount: 6000,  adminFee: 300,    amountReleased: 6000,  coin: "", date: "01 Aug 2026" },
  { no: 6,  username: "FX245", fullName: "Arumugam Krishnan",status: "Approved", walletAddress: "", requestedAmount: 900,   adminFee: 45,     amountReleased: 900,   coin: "", date: "01 Aug 2026" },
  { no: 7,  username: "FX002", fullName: "ARUNLAL K",        status: "Approved", walletAddress: "", requestedAmount: 14000, adminFee: 700,    amountReleased: 14000, coin: "", date: "01 Aug 2026" },
  { no: 8,  username: "FX034", fullName: "RATHIKUMARI A V",  status: "Approved", walletAddress: "", requestedAmount: 30500, adminFee: 1525,   amountReleased: 30500, coin: "", date: "01 Aug 2026" },
  { no: 9,  username: "FX033", fullName: "HARISHNA",         status: "Approved", walletAddress: "", requestedAmount: 13000, adminFee: 650,    amountReleased: 13000, coin: "", date: "01 Aug 2026" },
  { no: 10, username: "FX041", fullName: "SALIHA P S",       status: "Approved", walletAddress: "", requestedAmount: 40850, adminFee: 2042.5, amountReleased: 40850, coin: "", date: "01 Aug 2026" },
  { no: 11, username: "FX070", fullName: "SARIBABEEGAMP K K",status: "Approved", walletAddress: "", requestedAmount: 11500, adminFee: 575,    amountReleased: 11500, coin: "", date: "01 Aug 2026" },
  { no: 12, username: "FX042", fullName: "ABOOTHWAHIR T",   status: "Approved", walletAddress: "", requestedAmount: 11600, adminFee: 580,    amountReleased: 11600, coin: "", date: "01 Aug 2026" },
  { no: 13, username: "FX043", fullName: "SULAIKHA P S",     status: "Approved", walletAddress: "", requestedAmount: 17000, adminFee: 850,    amountReleased: 17000, coin: "", date: "01 Aug 2026" },
  { no: 14, username: "FX021", fullName: "AJAYAKUMAR O K",   status: "Approved", walletAddress: "", requestedAmount: 20700, adminFee: 1035,   amountReleased: 20700, coin: "", date: "01 Aug 2026" },
  { no: 15, username: "FX011", fullName: "SAVITHAMOL E S",   status: "Approved", walletAddress: "", requestedAmount: 5000,  adminFee: 250,    amountReleased: 5000,  coin: "", date: "01 Aug 2026" },
  { no: 16, username: "FX001", fullName: "PRAVEEN DINESH",   status: "Approved", walletAddress: "", requestedAmount: 15250, adminFee: 762.5,  amountReleased: 15250, coin: "", date: "01 Aug 2026" },
];

function PayoutReport() {
  const [startDate,  setStartDate]  = useState("2026-08-01");
  const [endDate,    setEndDate]    = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [rows, setRows]             = useState(payoutReportData);
  const [page, setPage]             = useState(1);

  const pageSize = 10;
  const totalAmount = rows.reduce((acc, r) => acc + r.amountReleased, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUser) {
      setRows(payoutReportData.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase()) || r.fullName.toLowerCase().includes(searchUser.toLowerCase())));
    } else {
      setRows(payoutReportData);
    }
    setPage(1);
  };

  const handleReset = () => {
    setSearchUser("");
    setRows(payoutReportData);
    setPage(1);
  };

  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize) || 1;

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        {/* Page Header */}
        <div className="ft-page-header">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Payout Report</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Payout Report</span>
            </div>
          </div>
          <button className="ft-export-btn">
            <FiUpload size={14} /> Export
          </button>
        </div>

        {/* Filter Section with Yellow Close Icon */}
        {showFilter && (
          <div style={{ position: "relative" }}>
            <button
              className="ft-close-btn"
              onClick={() => setShowFilter(false)}
              title="Close filter"
              style={{
                position: "absolute",
                top: "-28px",
                right: "0px",
                color: "#f59e0b",
                fontSize: "18px",
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >
              <FiX size={20} />
            </button>

            <form className="reports-filter-bar" onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
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
                {Array.from(new Set(payoutReportData.map(r => r.username))).map(uname => (
                  <option key={uname} value={uname}>{uname}</option>
                ))}
              </select>

              <button type="submit" className="reports-search-btn">Search</button>
              <button type="button" className="reports-reset-btn" onClick={handleReset}>
                Reset <FiRefreshCw size={13} />
              </button>

              <div className="reports-total-badge">
                <div className="reports-total-amount" style={{ color: "#16a34a" }}>₹{totalAmount}</div>
                <div className="reports-total-label">Total Amount</div>
              </div>
            </form>
          </div>
        )}

        {/* Table Card */}
        <div className="reports-table-card">
          <div className="ft-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User name</th>
                  <th>Full Name</th>
                  <th>Status</th>
                  <th>Wallet Address</th>
                  <th>Requested Amount</th>
                  <th>Admin Fee Deducted</th>
                  <th>Amount Released</th>
                  <th>Coin</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row) => (
                    <tr key={row.no}>
                      <td>{row.no}</td>
                      <td style={{ fontWeight: 600 }}>{row.username}</td>
                      <td>{row.fullName}</td>
                      <td>
                        <span style={{ color: "#475569", fontWeight: 500 }}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.walletAddress}</td>
                      <td>₹{row.requestedAmount}</td>
                      <td>₹{row.adminFee}</td>
                      <td style={{ color: "#334155" }}>₹{row.amountReleased}</td>
                      <td>{row.coin}</td>
                      <td>{row.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="ft-empty-state">
                        <div className="ft-empty-icon">
                          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <ellipse cx="40" cy="58" rx="28" ry="6" fill="#f1f5f9" />
                            <circle cx="34" cy="34" r="20" fill="#e2e8f0" />
                            <circle cx="34" cy="34" r="15" fill="#f8fafc" />
                            <text x="28" y="40" fontSize="18" fill="#94a3b8" fontWeight="bold">?</text>
                            <line x1="48" y1="48" x2="62" y2="62" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="ft-empty-text">No Data Available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="reports-pagination">
            <button className="reports-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={`reports-page-btn ${page === idx + 1 ? "reports-page-btn--active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button className="reports-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PayoutReport;
