import { useState } from "react";
import { FiCalendar, FiChevronDown, FiEye, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminKYCDetails.css";

const initialKYC = [
  { no: 1, username: "FX259", name: "Abhijay", email: "sreedharan1962@gmail.com", status: "Pending", date: "30 Jul 2026", panNumber: "TNTPS8613G", aadharNumber: "785633372449" },
  { no: 2, username: "FX258", name: "Aravind", email: "arumugamlali1232@gmail.com", status: "Pending", date: "29 Jul 2026", panNumber: "FURPA8972D", aadharNumber: "635741961916" },
  { no: 3, username: "FX256", name: "SUCHITHRA", email: "suchithrasatheesh007@gmail.com", status: "Pending", date: "29 Jul 2026", panNumber: "EJUPG0140L", aadharNumber: "692913103271" },
  { no: 4, username: "FX255", name: "Mohanan", email: "mobivivi@gmail.com", status: "Pending", date: "26 Jul 2026", panNumber: "EWIPP2897E", aadharNumber: "356022903905" }
];

function AdminKYCDetails() {
  const [kycList, setKycList] = useState(initialKYC);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleApprove = (username) => {
    setKycList(kycList.map(item => item.username === username ? { ...item, status: "Approved" } : item));
  };

  const handleReject = (username) => {
    setKycList(kycList.map(item => item.username === username ? { ...item, status: "Rejected" } : item));
  };

  const handleGetReport = () => {
    let filtered = initialKYC;
    if (filterUser) {
      filtered = filtered.filter(item => item.username === filterUser);
    }
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    setKycList(filtered);
  };

  return (
    <AdminLayout>
      <div className="admin-kyc-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">KYC Details</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">KYC Details</span>
          </div>
        </div>

        {/* Filters Card */}
        <div className="kyc-filters-card">
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
                <option value="">Username</option>
                {initialKYC.map(item => (
                  <option key={item.username} value={item.username}>{item.username}</option>
                ))}
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            <div className="filter-select-wrap">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            <button type="button" className="yellow-report-btn" onClick={handleGetReport}>
              Get Report
            </button>
          </div>
        </div>

        {/* List Content Card */}
        <div className="kyc-list-card">
          <div className="table-overflow-box">
            <table className="admin-kyc-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>PanCard</th>
                  <th>Pancard Number</th>
                  <th>Aadhar card front</th>
                  <th>Aadhar card back</th>
                  <th>Aadhar card number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {kycList.map((item, idx) => (
                  <tr key={item.username}>
                    <td>{idx + 1}</td>
                    <td className="fw-bold">{item.username}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <span className={`status-badge badge-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <div className="kyc-doc-actions">
                        <button type="button" className="btn-doc-view" title="View Document">
                          <FiEye />
                        </button>
                        <button type="button" className="btn-doc-edit" title="Edit/Verify">
                          <FiEdit2 />
                        </button>
                      </div>
                    </td>
                    <td>{item.panNumber}</td>
                    <td>
                      <div className="kyc-doc-actions">
                        <button type="button" className="btn-doc-view" title="View Document">
                          <FiEye />
                        </button>
                        <button type="button" className="btn-doc-edit" title="Edit/Verify">
                          <FiEdit2 />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="kyc-doc-actions">
                        <button type="button" className="btn-doc-view" title="View Document">
                          <FiEye />
                        </button>
                        <button type="button" className="btn-doc-edit" title="Edit/Verify">
                          <FiEdit2 />
                        </button>
                      </div>
                    </td>
                    <td>{item.aadharNumber}</td>
                    <td>
                      {item.status === "Pending" ? (
                        <div className="kyc-actions">
                          <button type="button" className="btn-approve" onClick={() => handleApprove(item.username)}>
                            <FiCheck /> Approve
                          </button>
                          <button type="button" className="btn-reject" onClick={() => handleReject(item.username)}>
                            <FiX /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="kyc-finalized-label">Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminKYCDetails;
