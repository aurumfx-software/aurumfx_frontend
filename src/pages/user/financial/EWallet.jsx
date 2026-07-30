import { useState } from "react";
import {
  FiInfo,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCreditCard,
  FiRadio,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./EWallet.css";

const allTransactions = [
  { no: 1, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4600, status: "Complete", date: "30 Jul 2026" },
  { no: 2, fromUser: "FX150", amountType: "Enrolment Bonus", paymentType: "Credit", amount: 250, status: "Complete", date: "29 Jul 2026" },
  { no: 3, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 2000, status: "Complete", date: "27 Jul 2026" },
  { no: 4, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 800, status: "Complete", date: "26 Jul 2026" },
  { no: 5, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 10000, status: "Complete", date: "24 Jul 2026" },
  { no: 6, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 800, status: "Complete", date: "21 Jul 2026" },
  { no: 7, fromUser: "FX023", amountType: "Enrolment Bonus", paymentType: "Credit", amount: 1000, status: "Complete", date: "21 Jul 2026" },
  { no: 8, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 5000, status: "Complete", date: "19 Jul 2026" },
  { no: 9, fromUser: "aurumfx", amountType: "Rank Bonus", paymentType: "Credit", amount: 42500, status: "Complete", date: "18 Jul 2026" },
  { no: 10, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "12 Jul 2026" },
  { no: 11, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4400, status: "Complete", date: "11 Jul 2026" },
  { no: 12, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "08 Jul 2026" },
  { no: 13, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "06 Jul 2026" },
  { no: 14, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "01 Jul 2026" },
  { no: 15, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "24 Jun 2026" },
  { no: 16, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 1200, status: "Complete", date: "23 Jun 2026" },
  { no: 17, fromUser: "FX018", amountType: "Enrolment Bonus", paymentType: "Credit", amount: 1500, status: "Complete", date: "22 Jun 2026" },
  { no: 18, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 400, status: "Complete", date: "22 Jun 2026" },
  { no: 19, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 1200, status: "Complete", date: "21 Jun 2026" },
  { no: 20, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 5000, status: "Complete", date: "19 Jun 2026" },
  { no: 21, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 5000, status: "Complete", date: "13 Jun 2026" },
  { no: 22, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 4000, status: "Complete", date: "11 Jun 2026" },
  { no: 23, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 3600, status: "Complete", date: "05 Jun 2026" },
  { no: 24, fromUser: "aurumfx", amountType: "Club Bonus", paymentType: "Credit", amount: 2000, status: "Complete", date: "30 May 2026" },
  { no: 25, fromUser: "aurumfx", amountType: "Rank Bonus", paymentType: "Credit", amount: 22500, status: "Complete", date: "29 May 2026" },
];

function EWallet() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [amountType, setAmountType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter transactions
  const filteredData = allTransactions.filter((item) => {
    if (amountType !== "All" && item.amountType !== amountType) return false;
    if (
      searchUser.trim() &&
      !item.fromUser.toLowerCase().includes(searchUser.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <UserLayout>
      <div className="ewallet-page">
        {/* Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
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
          <h1 className="page-title">E-wallet</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">E-wallet</span>
          </div>
        </div>

        {/* Top 5 Financial Metric Cards Row */}
        <div className="ewallet-metrics-grid">
          {/* Balance Card */}
          <div className="ewallet-metric-card">
            <div className="ewallet-card-content">
              <span className="ewallet-card-label">Balance</span>
              <h3 className="ewallet-card-value">₹7650</h3>
            </div>
            <div className="ewallet-card-icon icon--pink">
              <span>$</span>
            </div>
          </div>

          {/* Transfer Out Card */}
          <div className="ewallet-metric-card">
            <div className="ewallet-card-content">
              <span className="ewallet-card-label">Transfer Out</span>
              <h3 className="ewallet-card-value">₹0</h3>
            </div>
            <div className="ewallet-card-icon icon--blue">
              <FiArrowUpRight />
            </div>
          </div>

          {/* Transfer In Card */}
          <div className="ewallet-metric-card">
            <div className="ewallet-card-content">
              <span className="ewallet-card-label">Transfer in</span>
              <h3 className="ewallet-card-value">₹0</h3>
            </div>
            <div className="ewallet-card-icon icon--green">
              <FiArrowDownLeft />
            </div>
          </div>

          {/* Total Payout Card */}
          <div className="ewallet-metric-card">
            <div className="ewallet-card-content">
              <span className="ewallet-card-label">Total Payout</span>
              <h3 className="ewallet-card-value">₹233900</h3>
            </div>
            <div className="ewallet-card-icon icon--purple">
              <FiCreditCard />
            </div>
          </div>

          {/* Bonus Card */}
          <div className="ewallet-metric-card">
            <div className="ewallet-card-content">
              <span className="ewallet-card-label">Bonus</span>
              <h3 className="ewallet-card-value">₹241550</h3>
            </div>
            <div className="ewallet-card-icon icon--gold">
              <FiRadio />
            </div>
          </div>
        </div>

        {/* History Card Section */}
        <div className="ewallet-history-card">
          <h3 className="history-title">History</h3>

          {/* Filters Row */}
          <form
            className="history-filter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            <div className="history-filter-group">
              <div className="date-input-box">
                <input
                  type="date"
                  placeholder="Pick Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <FiCalendar className="calendar-icon" />
              </div>
            </div>

            <div className="history-filter-group">
              <div className="date-input-box">
                <input
                  type="date"
                  placeholder="Pick End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FiCalendar className="calendar-icon" />
              </div>
            </div>

            <div className="history-filter-group select-box-group">
              <select
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="history-select"
              >
                <option value="">Search User</option>
                <option value="aurumfx">aurumfx</option>
                <option value="FX150">FX150</option>
                <option value="FX023">FX023</option>
                <option value="FX018">FX018</option>
              </select>
            </div>

            <div className="history-filter-group select-box-group">
              <label className="input-top-label">Amount Type</label>
              <select
                value={amountType}
                onChange={(e) => {
                  setAmountType(e.target.value);
                  setCurrentPage(1);
                }}
                className="history-select"
              >
                <option value="All">All</option>
                <option value="Club Bonus">Club Bonus</option>
                <option value="Enrolment Bonus">Enrolment Bonus</option>
                <option value="Rank Bonus">Rank Bonus</option>
              </select>
            </div>

            <button type="submit" className="history-get-btn">
              Get
            </button>
          </form>

          {/* History Data Table */}
          <div className="table-responsive-wrapper">
            <table className="ewallet-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>From User</th>
                  <th>Amount Type</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row) => (
                  <tr key={row.no}>
                    <td className="no-cell">{row.no}</td>
                    <td className="from-user-cell">{row.fromUser}</td>
                    <td className="amount-type-cell">{row.amountType}</td>
                    <td className="payment-type-cell">{row.paymentType}</td>
                    <td className="amount-cell">₹{row.amount.toLocaleString()}</td>
                    <td className="status-cell">{row.status}</td>
                    <td className="date-cell">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
          <div className="pagination-bar">
            <button
              type="button"
              className="page-nav-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`page-num-btn ${
                  currentPage === page ? "page-num-btn--active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="page-nav-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default EWallet;
