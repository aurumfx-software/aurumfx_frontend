import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./Achievers.css";

function CriteriaAchievers() {
  // Mock data matching screenshot 3
  const [criteriaAchievers] = useState([
    { no: 1, criteria: "N/A", userId: "FX055", name: "VIPIN V", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 2, criteria: "N/A", userId: "FX054", name: "SHIJIN K P", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 3, criteria: "N/A", userId: "FX053", name: "RANJITH M", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 4, criteria: "N/A", userId: "FX052", name: "SANTHOSH KUMAR", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 5, criteria: "N/A", userId: "FX051", name: "DEEPAK R", rank: "FX Explorer", email: "xxxxxxxxxxxxxxx" },
    { no: 6, criteria: "N/A", userId: "FX050", name: "NITHIN C H", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 7, criteria: "N/A", userId: "FX049", name: "SUHASINI Vazhayil", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 8, criteria: "N/A", userId: "FX043", name: "SULAIKHA P S", rank: "FX Explorer", email: "xxxxxxxxxxxxxxx" },
    { no: 9, criteria: "N/A", userId: "FX042", name: "ABOOTHWAHIR T", rank: "FX Creator", email: "xxxxxxxxxxxxxxx" },
    { no: 10, criteria: "N/A", userId: "FX041", name: "SALIHA P S", rank: "FX Innovator", email: "xxxxxxxxxxxxxxx" },
    { no: 11, criteria: "N/A", userId: "FX040", name: "HITHUL KRISHNA K R", rank: "FX Explorer", email: "xxxxxxxxxxxxxxx" },
    { no: 12, criteria: "N/A", userId: "FX039", name: "ANOOP K", rank: "FX Creator", email: "xxxxxxxxxxxxxxx" },
    { no: 13, criteria: "N/A", userId: "FX034", name: "RATHIKUMARI A V", rank: "FX Explorer", email: "xxxxxxxxxxxxxxx" },
    { no: 14, criteria: "N/A", userId: "FX033", name: "FX033", rank: "FX Innovator", email: "xxxxxxxxxxxxxxx" },
    { no: 15, criteria: "N/A", userId: "FX024", name: "SAJINI C P", rank: "FX Hero", email: "xxxxxxxxxxxxxxx" },
    { no: 16, criteria: "N/A", userId: "FX021", name: "AJAYAKUMAR O K", rank: "FX Creator", email: "xxxxxxxxxxxxxxx" },
    { no: 17, criteria: "N/A", userId: "FX013", name: "MOHAMMEDMUBEEN M V", rank: "FX Hero", email: "xxxxxxxxxxxxxxx" },
    { no: 18, criteria: "N/A", userId: "FX011", name: "SAVITHAMOL E S", rank: "FX Creator", email: "xxxxxxxxxxxxxxx" },
    { no: 19, criteria: "N/A", userId: "FX010", name: "VIJAYAN P N", rank: "FX Starter", email: "xxxxxxxxxxxxxxx" },
    { no: 20, criteria: "N/A", userId: "FX009", name: "MANILA NEERAJ", rank: "FX Creator", email: "xxxxxxxxxxxxxxx" },
    { no: 21, criteria: "N/A", userId: "FX002", name: "ARUNLAL K", rank: "FX Legend", email: "xxxxxxxxxxxxxxx" },
    { no: 22, criteria: "N/A", userId: "FX001", name: "PRAVEEN DINESH", rank: "FX Hero", email: "xxxxxxxxxxxxxxx" },
  ]);

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

        {/* Page Title & Breadcrumbs */}
        <div className="page-header">
          <h1 className="page-title">Criteria Achievers</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Criteria Achievers</span>
          </div>
        </div>

        {/* Criteria Achievers Main Table Card */}
        <div className="achievers-table-card">
          <div className="table-responsive">
            <table className="achievers-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>No</th>
                  <th>Criteria</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {criteriaAchievers.map((ach) => (
                  <tr key={ach.no}>
                    <td>{ach.no}</td>
                    <td>{ach.criteria}</td>
                    <td className="user-id-cell">{ach.userId}</td>
                    <td className="user-name-cell">{ach.name}</td>
                    <td className="rank-name-cell">{ach.rank}</td>
                    <td className="user-email-cell">{ach.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="pagination-bar">
            <button type="button" className="page-nav-btn" disabled>
              &lt;
            </button>
            <span className="page-number active">1</span>
            <button type="button" className="page-nav-btn" disabled>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default CriteriaAchievers;
