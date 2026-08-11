import { useState } from "react";
import { FiCalendar, FiChevronDown, FiFolder, FiCheck, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminBankApprove.css";

function AdminBankApprove() {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterUser, setFilterUser] = useState("");

  const handleApprove = (id) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: "Approved" } : r));
  };

  const handleReject = (id) => {
    setRecords(records.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
  };

  return (
    <AdminLayout>
      <div className="admin-bank-approve-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Bank Approve</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Bank Approve</span>
          </div>
        </div>

        {/* Main Filters Card */}
        <div className="bank-filters-card">
          <div className="filters-grid">
            <div className="filter-input-wrap">
              <input
                type="date"
                placeholder="Pick Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="filter-date-field"
              />
              <FiCalendar className="field-date-icon" />
            </div>

            <div className="filter-input-wrap">
              <input
                type="date"
                placeholder="Pick End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="filter-date-field"
              />
              <FiCalendar className="field-date-icon" />
            </div>

            <div className="filter-select-wrap">
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="filter-select-field"
              >
                <option value="">User Name</option>
                <option value="FX262">FX262</option>
                <option value="FX261">FX261</option>
                <option value="FX260">FX260</option>
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            <button type="button" className="yellow-report-btn">
              Get Report
            </button>
          </div>
        </div>

        {/* List Content Card */}
        <div className="bank-list-card">
          <div className="table-overflow-box">
            <table className="admin-bank-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Status</th>
                  <th>Account ID</th>
                  <th>User Name</th>
                  <th>Bank Country</th>
                  <th>BIC</th>
                  <th>IBAN</th>
                  <th>Currency</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Postcode</th>
                  <th>Region</th>
                  <th>Sort Code</th>
                  <th>Account No</th>
                  <th>Address</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <span className={`status-badge badge-${r.status.toLowerCase().replace(" ", "")}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.accountId}</td>
                    <td className="fw-bold">{r.username}</td>
                    <td>{r.bankCountry}</td>
                    <td>{r.bic}</td>
                    <td>{r.iban}</td>
                    <td>{r.currency}</td>
                    <td>{r.firstName}</td>
                    <td>{r.lastName}</td>
                    <td>{r.phone}</td>
                    <td>{r.city}</td>
                    <td>{r.country}</td>
                    <td>{r.postcode}</td>
                    <td>{r.region}</td>
                    <td>{r.sortCode}</td>
                    <td>{r.accountNo}</td>
                    <td className="addr-cell">{r.address}</td>
                    <td>{r.createdAt}</td>
                    <td>
                      {r.status === "Pending" && (
                        <div className="bank-actions">
                          <button type="button" className="btn-approve" onClick={() => handleApprove(r.id)}>
                            <FiCheck /> Approve
                          </button>
                          <button type="button" className="btn-reject" onClick={() => handleReject(r.id)}>
                            <FiX /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="20" style={{ padding: 0 }}>
                      <div className="docs-empty-state">
                        <div className="empty-magnifier-box">
                          <div className="magnifier-art">
                            <FiFolder className="folder-back-art" />
                            <div className="glass-lens-art">
                              <span className="glass-quest">?</span>
                            </div>
                          </div>
                        </div>
                        <h4 className="empty-state-label">No Data Available</h4>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="table-pagination-footer">
            <button type="button" className="page-nav-btn" disabled>
              <FiChevronLeft />
            </button>
            <button type="button" className="page-number-btn page-number-btn--active">
              1
            </button>
            <button type="button" className="page-nav-btn" disabled>
              <FiChevronRight />
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminBankApprove;
