import { useState } from "react";
import { FiCalendar, FiRefreshCw, FiUpload, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminReports.css";
import "./FundTransfer.css";

const tradeAmountData = [
  { no: 1,  username: "FX001", club: "R", ta: 100000, date: "04 Aug 2026" },
  { no: 2,  username: "FX011", club: "L", ta: 100000, date: "04 Aug 2026" },
  { no: 3,  username: "FX115", club: "L", ta: 100000, date: "04 Aug 2026" },
  { no: 4,  username: "FX001", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 5,  username: "FX011", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 6,  username: "FX018", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 7,  username: "FX021", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 8,  username: "FX023", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 9,  username: "FX125", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 10, username: "FX143", club: "R", ta: 10000,  date: "04 Aug 2026" },
  { no: 11, username: "FX144", club: "R", ta: 10000,  date: "04 Aug 2026" },
];

function PointHistory() {
  const [startDate,  setStartDate]  = useState("2026-08-01");
  const [endDate,    setEndDate]    = useState("2026-08-31");
  const [searchUser, setSearchUser] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [rows, setRows]             = useState(tradeAmountData);
  const [page, setPage]             = useState(1);

  const pageSize = 10;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUser) {
      setRows(tradeAmountData.filter(r => r.username.toLowerCase().includes(searchUser.toLowerCase())));
    } else {
      setRows(tradeAmountData);
    }
    setPage(1);
  };

  const handleReset = () => {
    setSearchUser("");
    setRows(tradeAmountData);
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
            <h1 className="admin-page-title">Trade Amount Report</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Trade Amount Report</span>
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
                {Array.from(new Set(tradeAmountData.map(r => r.username))).map(uname => (
                  <option key={uname} value={uname}>{uname}</option>
                ))}
              </select>

              <button type="submit" className="reports-search-btn">Search</button>
              <button type="button" className="reports-reset-btn" onClick={handleReset}>
                Reset <FiRefreshCw size={13} />
              </button>
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
                  <th>Club</th>
                  <th>TA</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row) => (
                    <tr key={row.no}>
                      <td>{row.no}</td>
                      <td style={{ fontWeight: 600 }}>{row.username}</td>
                      <td>{row.club}</td>
                      <td style={{ color: "#334155" }}>{row.ta}</td>
                      <td>{row.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
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

export default PointHistory;
