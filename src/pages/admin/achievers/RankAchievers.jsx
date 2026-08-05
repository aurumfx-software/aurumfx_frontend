import { useState } from "react";
import { FiEye, FiX, FiUser } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminAchievers.css";

function AdminRankAchievers() {
  const [selectedRank, setSelectedRank] = useState(null);

  const ranks = [
    { id: 1, name: "Investor" },
    { id: 2, name: "FX Starter" },
    { id: 3, name: "FX Explorer" },
    { id: 4, name: "FX Creator" },
    { id: 5, name: "FX Innovator" },
    { id: 6, name: "FX Hero" },
    { id: 7, name: "FX Legend" },
    { id: 8, name: "FX Elite Member" },
    { id: 9, name: "FX Champion" },
    { id: 10, name: "FX Royal" },
  ];

  // Sample achievers list data for modal matching Screenshot 4
  const sampleAchievers = [
    { id: "FX262", name: "Aadhideve", email: "muralika1983@gmail.com", avatarText: "A", avatarBg: "#94a3b8" },
    { id: "FX261", name: "MuhammedShuhail M T P", email: "parispnr@gmail.com", avatarText: "M", avatarBg: "#b45309" },
    { id: "FX260", name: "Premalatha V V", email: "muralika1983@gmail.com", avatarText: "P", avatarBg: "#0f766e" },
    { id: "FX259", name: "Abhijay S", email: "sreedharan1962@gmail.com", avatarText: "A", avatarBg: "#4338ca" },
    { id: "FX258", name: "Aravind Arumugam", email: "arumugamlali1232@gmail.com", avatarText: "A", avatarBg: "#1d4ed8" },
    { id: "FX257", name: "KRISHNADAS P", email: "daspaleri@gmail.com", photo: true },
    { id: "FX256", name: "SUCHITHRA EG", email: "suchithrasatheesh007@gmail.com", avatarText: "S", avatarBg: "#0369a1" },
    { id: "FX255", name: "Mohanan P", email: "mobivivi@gmail.com", avatarText: "M", avatarBg: "#6d28d9" },
    { id: "FX254", name: "Satheesan U", email: "muralika1983@gmail.com", avatarText: "S", avatarBg: "#be185d" },
    { id: "FX253", name: "Anoop P V", email: "muralika1983@gmail.com", avatarText: "A", avatarBg: "#b91c1c" },
    { id: "FX252", name: "ANILKUMAR P S", email: "anilkumarps1969@gmail.com", photo: true },
  ];

  return (
    <AdminLayout>
      <div className="admin-achievers-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Rank Achievers</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Rank Achievers</span>
          </div>
        </div>

        {/* Rank Achievers Table Card */}
        <div className="achievers-list-card">
          <div className="table-overflow-box">
            <table className="admin-achievers-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>No</th>
                  <th>Rank Name</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td className="rank-name-cell">{r.name}</td>
                    <td>
                      <button
                        type="button"
                        className="action-eye-btn"
                        onClick={() => setSelectedRank(r.name)}
                        title="View Achievers"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rank Achievers Modal Popup matching Screenshot 4 */}
        {selectedRank && (
          <div className="achievers-modal-overlay">
            <div className="achievers-modal-card">
              <div className="modal-header">
                <h3 className="modal-title">Rank Achievers</h3>
              </div>

              <div className="modal-body-table">
                <table className="modal-achievers-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Photo</th>
                      <th style={{ width: "120px" }}>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleAchievers.map((ach) => (
                      <tr key={ach.id}>
                        <td>
                          {ach.photo ? (
                            <div className="user-photo-avatar" style={{ background: "#f1f5f9", color: "#64748b" }}>
                              <FiUser style={{ fontSize: "18px" }} />
                            </div>
                          ) : (
                            <div className="user-photo-avatar" style={{ background: ach.avatarBg || "#e2e8f0", color: "#ffffff" }}>
                              {ach.avatarText}
                            </div>
                          )}
                        </td>
                        <td className="user-id-cell">{ach.id}</td>
                        <td className="user-name-cell">{ach.name}</td>
                        <td className="user-email-cell">{ach.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-close-yellow-btn"
                  onClick={() => setSelectedRank(null)}
                >
                  <FiX /> <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRankAchievers;
