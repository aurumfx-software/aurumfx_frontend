import { useState } from "react";
import { FiInfo, FiEye, FiX } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./Achievers.css";

function RankAchievers() {
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
  ];

  // Sample achievers list data for modal matching screenshot 2
  const sampleAchievers = [
    { id: "FX262", name: "Aadhideve", email: "xxxxxxxxxxxxxxx" },
    { id: "FX261", name: "MuhammedShuhail M T P", email: "xxxxxxxxxxxxxxx" },
    { id: "FX260", name: "Premalatha V V", email: "xxxxxxxxxxxxxxx" },
    { id: "FX259", name: "Abhijay S", email: "xxxxxxxxxxxxxxx" },
    { id: "FX258", name: "Aravind Arumugam", email: "xxxxxxxxxxxxxxx" },
    { id: "FX257", name: "KRISHNADAS P", email: "xxxxxxxxxxxxxxx" },
    { id: "FX256", name: "SUCHITHRA EG", email: "xxxxxxxxxxxxxxx" },
    { id: "FX255", name: "Mohanan P", email: "xxxxxxxxxxxxxxx" },
    { id: "FX254", name: "Satheesan U", email: "xxxxxxxxxxxxxxx" },
    { id: "FX253", name: "Anoop P V", email: "xxxxxxxxxxxxxxx" },
    { id: "FX252", name: "ANILKUMAR P S", email: "xxxxxxxxxxxxxxx" },
  ];

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="achievers-page">
        {/* Top Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumb */}
        <div className="page-header">
          <h1 className="page-title">Rank Achievers</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Rank Achievers</span>
          </div>
        </div>

        {/* Rank Achievers Main Card & Table */}
        <div className="achievers-table-card">
          <div className="table-responsive">
            <table className="achievers-table">
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

        {/* Rank Achievers Modal Popup matching screenshot 2 */}
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
                      <th style={{ width: "70px" }}>Photo</th>
                      <th style={{ width: "110px" }}>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleAchievers.map((ach) => (
                      <tr key={ach.id}>
                        <td>
                          <div className="user-photo-avatar">
                            {ach.name.charAt(0)}
                          </div>
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
    </UserLayout>
  );
}

export default RankAchievers;
