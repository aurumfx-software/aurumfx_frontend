import { useState } from "react";
import { FiCalendar, FiChevronDown, FiPlus, FiFolder, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminHoldingTank.css";

function AdminHoldingTank() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterUser, setFilterUser] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newEmail) return;

    const newUser = {
      id: Date.now(),
      username: newUsername,
      email: newEmail,
      joinedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    setUsers([...users, newUser]);
    setNewUsername("");
    setNewEmail("");
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-holding-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Holding Tank</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Holding Tank</span>
          </div>
        </div>

        {/* Main Filters Card */}
        <div className="holding-filters-card">
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
                {users.map(u => (
                  <option key={u.id} value={u.username}>{u.username}</option>
                ))}
              </select>
              <FiChevronDown className="field-arrow" />
            </div>

            <button type="button" className="yellow-report-btn">
              Get Report
            </button>
          </div>
        </div>

        {/* List Content Card */}
        <div className="holding-list-card">
          <div className="card-top-header">
            <h3 className="card-header-title">Holding Tank</h3>
            <button
              type="button"
              className="add-user-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add User
            </button>
          </div>

          <div className="table-overflow-box">
            <table className="admin-holding-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Joined At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-bold">{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.joinedAt}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action-delete-btn"
                        onClick={() => handleDelete(u.id)}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 0 }}>
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
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="holding-modal-overlay">
            <div className="holding-modal-card">
              <h3>Add User to Holding Tank</h3>
              <form onSubmit={handleAddUser}>
                <div className="modal-input-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter Email Address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminHoldingTank;
