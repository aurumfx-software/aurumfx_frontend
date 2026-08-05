import { useState } from "react";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminEWallet.css";

const adminEWalletData = [
  { no: 1, username: "FX245", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "04 Aug 2026" },
  { no: 2, username: "FX179", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "04 Aug 2026" },
  { no: 3, username: "FX021", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "04 Aug 2026" },
  { no: 4, username: "FX011", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "04 Aug 2026" },
  { no: 5, username: "FX001", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4400, status: "Complete", date: "04 Aug 2026" },
  { no: 6, username: "FX011", fromUser: "FX128", amountType: "Enrolment Bonus", paymentType: "Credit", amount: 5000, status: "Complete", date: "04 Aug 2026" },
  { no: 7, username: "FX245", fromUser: "FX247", amountType: "Enrolment Bonus", paymentType: "Credit", amount: 500, status: "Complete", date: "04 Aug 2026" },
  { no: 8, username: "FX167", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "01 Aug 2026" },
  { no: 9, username: "FX152", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 600, status: "Complete", date: "01 Aug 2026" },
  { no: 10, username: "FX034", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "01 Aug 2026" },
  { no: 11, username: "FX033", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "01 Aug 2026" },
  { no: 12, username: "FX002", fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "01 Aug 2026" },
];

function AdminEWallet() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [amountType, setAmountType] = useState("All");

  const [transactions, setTransactions] = useState(adminEWalletData);

  const handleGetReport = (e) => {
    e.preventDefault();
    let filtered = adminEWalletData;
    if (usernameFilter) {
      filtered = filtered.filter((t) => t.username.toLowerCase() === usernameFilter.toLowerCase());
    }
    if (amountType !== "All") {
      filtered = filtered.filter((t) => t.amountType === amountType);
    }
    setTransactions(filtered);
  };

  return (
    <AdminLayout>
      <div className="admin-ewallet-page">
        {/* Page Header & Breadcrumb */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">E-wallet</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">E-wallet</span>
          </div>
        </div>

        {/* Filters and Table in List page card container */}
        <div className="list-page-card">
          <form onSubmit={handleGetReport} className="history-filter-row">
            {/* Pick Start Date */}
            <div className="filter-field-wrap">
              <span className="floating-top-label">Pick Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>

            {/* Pick End Date */}
            <div className="filter-field-wrap">
              <span className="floating-top-label">Pick End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="filter-input-field"
              />
              <FiCalendar className="field-right-icon" />
            </div>

            {/* Username selector */}
            <div className="filter-field-wrap select-field-wrap">
              <select
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                className="filter-select-field"
              >
                <option value="">Username</option>
                <option value="FX245">FX245</option>
                <option value="FX179">FX179</option>
                <option value="FX021">FX021</option>
                <option value="FX011">FX011</option>
                <option value="FX001">FX001</option>
                <option value="FX167">FX167</option>
                <option value="FX152">FX152</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Amount Type Select */}
            <div className="filter-field-wrap select-field-wrap">
              <span className="floating-top-label">Amount Type</span>
              <select
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
                className="filter-select-field"
              >
                <option value="All">All</option>
                <option value="Club Bonus">Club Bonus</option>
                <option value="Enrolment Bonus">Enrolment Bonus</option>
              </select>
              <FiChevronDown className="field-right-icon text-muted" />
            </div>

            {/* Yellow Get Report Button */}
            <button type="submit" className="yellow-get-btn">
              Get Report
            </button>
          </form>

          {/* Transactions Table */}
          <div className="table-overflow-box" style={{ marginTop: "10px" }}>
            <table className="admin-ewallet-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>From User</th>
                  <th>Amount Type</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.no}>
                    <td>{tx.no}</td>
                    <td className="username-cell">{tx.username}</td>
                    <td>{tx.fromUser}</td>
                    <td>{tx.amountType}</td>
                    <td>{tx.paymentType}</td>
                    <td className="amount-cell-val">₹{tx.amount}</td>
                    <td className="status-cell-val">{tx.status}</td>
                    <td>{tx.date}</td>
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

export default AdminEWallet;
