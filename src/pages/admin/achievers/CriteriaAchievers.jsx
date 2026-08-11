import { useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminAchievers.css";

function AdminCriteriaAchievers() {
  // Mock data matching Screenshot 2 and 3
  const [achievers] = useState([
    { no: 1, rollNo: "N/A", username: "FX220", name: "USMAN P P", rank: "FX Innovator", email: "usmanpp@gmail.com" },
    { no: 2, rollNo: "N/A", username: "FX152", name: "Muraleedharan K", rank: "FX Explorer", email: "muralika1983@gmail.com" },
    { no: 3, rollNo: "N/A", username: "FX097", name: "SHIBINJITH T", rank: "FX Explorer", email: "shibin@gmail.com" },
    { no: 4, rollNo: "N/A", username: "FX080", name: "ARUN RAJ", rank: "FX Creator", email: "arun24raj55@gmail.com" },
    { no: 5, rollNo: "N/A", username: "FX071", name: "FX071", rank: "FX Explorer", email: "salihapeely@gmail.com" },
    { no: 6, rollNo: "N/A", username: "FX070", name: "SARIBABEEGAM K K", rank: "FX Starter", email: "salihapeely@gmail.com" },
    { no: 7, rollNo: "N/A", username: "FX053", name: "SATHYAJITH Vazhayil", rank: "FX Creator", email: "ramjivazhayil@gmail.com" },
    { no: 8, rollNo: "N/A", username: "FX049", name: "SUHASINI Vazhayil", rank: "FX Starter", email: "ramjivazhayil@gmail.com" },
    { no: 9, rollNo: "N/A", username: "FX043", name: "SULAIKHA P S", rank: "FX Explorer", email: "salihapeely@gmail.com" },
    { no: 10, rollNo: "N/A", username: "FX042", name: "ABOOTHWAHIR T", rank: "FX Creator", email: "shakeysrr@gmail.com" },
    { no: 11, rollNo: "N/A", username: "FX041", name: "SALIHA P S", rank: "FX Innovator", email: "salihapeely@gmail.com" },
    { no: 12, rollNo: "N/A", username: "FX040", name: "HITHUL KRISHNA K R", rank: "FX Explorer", email: "sajini6002@gmail.com" },
    { no: 13, rollNo: "N/A", username: "FX039", name: "ANOOP K", rank: "FX Creator", email: "arunlalkokkur@gmail.com" },
    { no: 14, rollNo: "N/A", username: "FX034", name: "RATHIKUMARI A V", rank: "FX Explorer", email: "sajini6002@gmail.com" },
    { no: 15, rollNo: "N/A", username: "FX033", name: "FX033", rank: "FX Innovator", email: "sajini6002@gmail.com" },
    { no: 16, rollNo: "N/A", username: "FX024", name: "SAJINI C P", rank: "FX Hero", email: "sajini6002@gmail.com" },
    { no: 17, rollNo: "N/A", username: "FX021", name: "AJAYAKUMAR O K", rank: "FX Creator", email: "ajayakumarok@gmail.com" },
    { no: 18, rollNo: "N/A", username: "FX013", name: "MOHAMMEDMUBEEN M V", rank: "FX Hero", email: "jafarmubeen763@gmail.com" },
    { no: 19, rollNo: "N/A", username: "FX011", name: "SAVITHAMOL E S", rank: "FX Creator", email: "praveenxperience@yahoo.in" },
    { no: 20, rollNo: "N/A", username: "FX010", name: "VIJAYAN P N", rank: "FX Starter", email: "vijayanpn466@gmail.com" },
    { no: 21, rollNo: "N/A", username: "FX009", name: "MANILA NEERAJ", rank: "FX Creator", email: "neerajmanil@gmail.com" },
    { no: 22, rollNo: "N/A", username: "FX002", name: "ARUNLAL K", rank: "FX Legend", email: "arunlalkokkur@gmail.com" },
    { no: 23, rollNo: "N/A", username: "FX001", name: "PRAVEEN DINESH", rank: "FX Hero", email: "praveenxperience@yahoo.in" },
  ]);

  return (
    <AdminLayout>
      <div className="admin-achievers-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Criteria Achievers</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Criteria Achievers</span>
          </div>
        </div>

        {/* Criteria Achievers Table Card */}
        <div className="achievers-list-card">
          <div className="table-overflow-box">
            <table className="admin-achievers-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>No</th>
                  <th>Roll Number</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {achievers.map((ach) => (
                  <tr key={ach.no}>
                    <td>{ach.no}</td>
                    <td>{ach.rollNo}</td>
                    <td className="user-id-cell">{ach.username}</td>
                    <td className="user-name-cell">{ach.name}</td>
                    <td className="rank-name-cell">{ach.rank}</td>
                    <td className="user-email-cell">{ach.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar matching Screenshot 3 */}
          <div className="pagination-bar">
            <button type="button" className="page-nav-btn" disabled>
              &lt;
            </button>
            <button type="button" className="page-number active">
              1
            </button>
            <button type="button" className="page-nav-btn" disabled>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCriteriaAchievers;
