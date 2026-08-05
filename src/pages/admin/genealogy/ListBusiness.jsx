import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./ListBusiness.css";

const adminListData = [
  { no: 1, username: "FX246", name: "MANUJA", dateOfJoin: "10 Jul 2026", level: 8 },
  { no: 2, username: "FX240", name: "SURESHKUMAR", dateOfJoin: "01 Jul 2026", level: 9 },
  { no: 3, username: "FX248", name: "MOHANAN", dateOfJoin: "13 Jul 2026", level: 10 },
  { no: 4, username: "FX249", name: "ANILKUMAR", dateOfJoin: "18 Jul 2026", level: 10 },
  { no: 5, username: "FX250", name: "SUCHITHRA", dateOfJoin: "20 Jul 2026", level: 11 },
  { no: 6, username: "FX256", name: "AJAYAKUMAR", dateOfJoin: "29 Jul 2026", level: 13 },
  { no: 7, username: "FX244", name: "BINDU", dateOfJoin: "08 Jul 2026", level: 13 },
  { no: 8, username: "FX253", name: "SAVITHAMOL", dateOfJoin: "24 Jul 2026", level: 14 },
  { no: 9, username: "FX241", name: "AKASH", dateOfJoin: "03 Jul 2026", level: 15 },
  { no: 10, username: "FX254", name: "SOBHANA", dateOfJoin: "24 Jul 2026", level: 15 },
];

function AdminListBusiness() {
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-31");
  const [selectedUsername, setSelectedUsername] = useState("");

  return (
    <AdminLayout>
      <div className="admin-genealogy-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">List: Business</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">List: Business</span>
          </div>
        </div>

        <div className="list-page-card">
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
                <option value="">All Users</option>
                <option value="FX246">FX246 (MANUJA)</option>
                <option value="FX240">FX240 (SURESHKUMAR)</option>
                <option value="FX248">FX248 (MOHANAN)</option>
              </select>
            </div>

            <button type="submit" className="get-report-btn">
              Get Report
            </button>
          </form>

          <div className="list-table-container">
            <table className="business-list-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Date of Join</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {adminListData.map((row) => (
                  <tr key={row.no}>
                    <td>{row.no}</td>
                    <td className="username-cell">{row.username}</td>
                    <td>{row.name}</td>
                    <td className="date-cell">{row.dateOfJoin}</td>
                    <td className="level-cell">{row.level}</td>
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

export default AdminListBusiness;
