import { useState } from "react";
import { FiCalendar, FiInfo } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./ListBusiness.css";

const listData = [
  { no: 1, username: "FX246", dateOfJoin: "10 Jul 2026", level: 8 },
  { no: 2, username: "FX240", dateOfJoin: "01 Jul 2026", level: 9 },
  { no: 3, username: "FX248", dateOfJoin: "13 Jul 2026", level: 10 },
  { no: 4, username: "FX249", dateOfJoin: "18 Jul 2026", level: 10 },
  { no: 5, username: "FX250", dateOfJoin: "20 Jul 2026", level: 11 },
  { no: 6, username: "FX256", dateOfJoin: "29 Jul 2026", level: 13 },
  { no: 7, username: "FX244", dateOfJoin: "08 Jul 2026", level: 13 },
  { no: 8, username: "FX253", dateOfJoin: "24 Jul 2026", level: 14 },
  { no: 9, username: "FX241", dateOfJoin: "03 Jul 2026", level: 15 },
  { no: 10, username: "FX254", dateOfJoin: "24 Jul 2026", level: 15 },
];

function ListBusiness() {
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [selectedUsername, setSelectedUsername] = useState("");

  return (
    <UserLayout>
      <div className="genealogy-page">
        {/* Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-icon" />
          <span>
            Heads up! You are now logged in as <strong>FX001</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumb */}
        <div className="page-header">
          <h1 className="page-title">List: Business</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">List: Business</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="list-page-card">
          {/* Date Filter & Search Form */}
          <form
            className="list-filter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="filter-input-group">
              <label>Pick Start Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <FiCalendar className="calendar-icon" />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Pick End Date</label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FiCalendar className="calendar-icon" />
              </div>
            </div>

            <div className="filter-input-group select-group">
              <label>Username</label>
              <select
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                className="filter-select"
              >
                <option value="">Username</option>
                <option value="FX246">FX246</option>
                <option value="FX240">FX240</option>
                <option value="FX248">FX248</option>
              </select>
            </div>

            <button type="submit" className="get-report-btn">
              Get Report
            </button>
          </form>

          {/* List Table */}
          <div className="list-table-container">
            <table className="business-list-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Date of Join</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((row) => (
                  <tr key={row.no}>
                    <td>{row.no}</td>
                    <td className="username-cell">{row.username}</td>
                    <td className="date-cell">{row.dateOfJoin}</td>
                    <td className="level-cell">{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default ListBusiness;
