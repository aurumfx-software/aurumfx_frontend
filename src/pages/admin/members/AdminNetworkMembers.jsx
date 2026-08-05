import { useState } from "react";
import { FiChevronDown, FiMoreVertical } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminNetworkMembers.css";

const initialMembers = [
  { no: 1, name: "Aadhideve", username: "FX262", email: "muralika1983@gmail.com", rank: "Investor", createdDate: "31 Jul 2026", initial: "A", color: "#8b5cf6" },
  { no: 2, name: "MuhammedShuhail", username: "FX261", email: "parispnr@gmail.com", rank: "Investor", createdDate: "31 Jul 2026", initial: "M", color: "#ef4444" },
  { no: 3, name: "Premalatha", username: "FX260", email: "muralika1983@gmail.com", rank: "Investor", createdDate: "30 Jul 2026", initial: "P", color: "#10b981" },
  { no: 4, name: "Abhijay", username: "FX259", email: "sreedharan1962@gmail.com", rank: "Investor", createdDate: "30 Jul 2026", initial: "A", color: "#f59e0b" },
  { no: 5, name: "Aravind", username: "FX258", email: "arumugamlali1232@gmail.com", rank: "Investor", createdDate: "29 Jul 2026", initial: "A", color: "#3b82f6" },
  { no: 6, name: "KRISHNADAS", username: "FX257", email: "daspaleri@gmail.com", rank: "Investor", createdDate: "29 Jul 2026", initial: "K", color: "#6366f1" },
  { no: 7, name: "SUCHITHRA", username: "FX256", email: "suchithrasatheesh007@gmail.com", rank: "Investor", createdDate: "29 Jul 2026", initial: "S", color: "#ec4899" },
  { no: 8, name: "Mohanan", username: "FX255", email: "mobivivi@gmail.com", rank: "Investor", createdDate: "26 Jul 2026", initial: "M", color: "#14b8a6" }
];

function AdminNetworkMembers() {
  const [members, setMembers] = useState(initialMembers);
  const [searchUser, setSearchUser] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleGetReport = () => {
    let filtered = initialMembers;
    if (searchUser) {
      filtered = filtered.filter(m => m.username.toLowerCase().includes(searchUser.toLowerCase()) || m.name.toLowerCase().includes(searchUser.toLowerCase()));
    }
    if (searchEmail) {
      filtered = filtered.filter(m => m.email.toLowerCase().includes(searchEmail.toLowerCase()));
    }
    if (selectedRank) {
      filtered = filtered.filter(m => m.rank === selectedRank);
    }
    setMembers(filtered);
  };

  const handleToggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <AdminLayout>
      <div className="admin-network-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Network Members</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Network Members</span>
          </div>
        </div>

        {/* Outer Filters Card */}
        <div className="network-filters-card">
          <div className="filters-grid">
            
            {/* Username Select */}
            <div className="filter-select-wrap">
              <select
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Username</option>
                {initialMembers.map(m => (
                  <option key={m.username} value={m.username}>{m.username} ({m.name})</option>
                ))}
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            {/* Email Input */}
            <div className="filter-input-wrap">
              <input
                type="text"
                placeholder="Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="filter-input-field"
              />
            </div>

            {/* Rank Select */}
            <div className="filter-select-wrap">
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Rank</option>
                <option value="Investor">Investor</option>
                <option value="Associate">Associate</option>
                <option value="Manager">Manager</option>
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            {/* Account Status Select */}
            <div className="filter-select-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Account Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            {/* Get Report Button */}
            <button type="button" className="yellow-report-btn" onClick={handleGetReport}>
              Get Report
            </button>

          </div>
        </div>

        {/* Table List Card */}
        <div className="network-list-card">
          <div className="table-overflow-box">
            <table className="admin-network-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Rank</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, idx) => (
                  <tr key={member.username}>
                    <td>{idx + 1}</td>
                    <td className="user-profile-cell">
                      <div className="user-avatar-circle" style={{ backgroundColor: member.color }}>
                        {member.initial}
                      </div>
                      <div className="user-details-wrap">
                        <span className="user-fullname">{member.name}</span>
                        <span className="user-name-label">{member.username}</span>
                      </div>
                    </td>
                    <td className="user-email-text">{member.email}</td>
                    <td>{member.rank}</td>
                    <td>{member.createdDate}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn-more-options"
                        onClick={() => handleToggleMenu(member.username)}
                      >
                        <FiMoreVertical />
                      </button>

                      {activeMenuId === member.username && (
                        <div className="action-dropdown-menu">
                          <button type="button" onClick={() => setActiveMenuId(null)}>Block User</button>
                          <button type="button" onClick={() => setActiveMenuId(null)}>View Genealogy</button>
                          <button type="button" onClick={() => setActiveMenuId(null)}>Edit Profile</button>
                        </div>
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

export default AdminNetworkMembers;
