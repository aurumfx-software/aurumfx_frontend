import { useState } from "react";
import {
  FiInfo,
  FiCalendar,
  FiDownload,
  FiSearch,
  FiPlusCircle,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import DoInvestmentModal from "../../../components/User/DoInvestmentModal";
import { createInvestmentApi } from "../../../api/investments";
import "./Investments.css";


function Investments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankTxId, setBankTxId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [returnType, setReturnType] = useState("Monthly");

  // History filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sample initial investment data matching screenshot
  const [investments, setInvestments] = useState([
    {
      id: 1,
      enrollerName: "FX034",
      investmentType: "Standard Package",
      investAmount: 250000,
      bankTxId: "29072026250000",
      lots: 50,
      monthlyReturn: 35000,
      returnDuration: 10,
      investmentStatus: "Active",
      periodsInvested: 0,
      totalMonthlyReturn: 0,
      status: "Approved",

      date: "29 Jul 2026",
    },
  ]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("File size exceeds 2MB limit.");
        return;
      }
      setSelectedFile(file);
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 5000 || numAmount % 5000 !== 0) {
      setErrorMsg("Please invest 5000.00 or more in multiples of 5000.00");
      return;
    }

    if (!bankTxId.trim()) {
      setErrorMsg("Please enter a Bank Transaction ID");
      return;
    }

    setLoading(true);

    const apiRes = await createInvestmentApi({
      investment_plan_id: 0,
      return_type_id: 0,
      amount: numAmount,
      bank_transaction_id: bankTxId.trim(),
      enroller_id: localStorage.getItem("userId") || "FX034",
      investment_date: new Date().toISOString().split("T")[0],
    });

    const lots = Math.floor(numAmount / 5000);
    const monthlyReturn = Math.round(numAmount * 0.14);

    const newInv = {
      id: investments.length + 1,
      enrollerName: localStorage.getItem("enrollerId") || "FX034",
      investAmount: numAmount,
      bankTxId: bankTxId.trim(),
      lots: lots,
      monthlyReturn: monthlyReturn,
      returnDuration: 10,
      investmentStatus: "Active",
      periodsInvested: 0,
      totalMonthlyReturn: 0,
      status: "Approved",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setInvestments([newInv, ...investments]);
    setSuccessMsg("Investment request submitted successfully!");
    setAmount("");
    setBankTxId("");
    setProofText("");
    setSelectedFile(null);
    setLoading(false);
  };


  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Filtering history records
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="investments-page">
        {/* Top Heads-up Alert Banner */}
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
        <div
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="page-title">Investments</h1>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <span className="separator">•</span>
              <span className="current">Investments</span>
            </div>
          </div>
          <button
            type="button"
            className="do-invest-popup-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: "#ffc52d",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(255, 197, 45, 0.35)",
              transition: "all 0.15s ease",
            }}
          >
            <FiPlusCircle size={16} />
            <span>Split</span>
          </button>

        </div>

        {/* Investment Popup Modal */}
        <DoInvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newInv) => {
            setInvestments([newInv, ...investments]);
          }}
        />

        {/* Invest Amount Form Card */}
        <div className="invest-form-card">
          <h2 className="card-title">Invest Amount</h2>
          <p className="card-subtitle">
            Invest 5000.00 or more (in multiples of 5000.00) and earn 14.00% of
            the invested amount every month for 10 months.
          </p>

          <form onSubmit={handleSubmit} className="invest-form">
            {/* Amount Field */}
            <div className="form-group">
              <label className="separated-label">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                step="5000"
                min="5000"
              />
            </div>




            {/* Bank Transaction ID Field */}
            <div className="form-group">
              <label className="separated-label">Bank Transaction ID</label>
              <input
                type="text"
                placeholder="Bank Transaction ID"
                value={bankTxId}
                onChange={(e) => setBankTxId(e.target.value)}
                className="form-input"
              />
            </div>





            {/* Error / Success Notifications */}
            {errorMsg && <p className="form-error-msg">{errorMsg}</p>}
            {successMsg && <p className="form-success-msg">{successMsg}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="invest-submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* History Filters Section */}
        <div className="history-filter-card">
          <h2 className="section-title">History</h2>

          <form onSubmit={handleFilterSubmit} className="history-filter-form">
            {/* Start Date */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="date"
                  placeholder="Pick Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="filter-input"
                />
                <FiCalendar className="field-icon" />
              </div>
            </div>

            {/* End Date */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="date"
                  placeholder="Pick End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="filter-input"
                />
                <FiCalendar className="field-icon" />
              </div>
            </div>

            {/* Search User */}
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="filter-input"
                />
                <FiSearch className="field-icon" />
              </div>
            </div>

            {/* Investment Type Select */}
            <div className="filter-input-group select-group">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Type of Investment</option>
                <option value="Standard Package">Standard Package</option>
                <option value="Network Investment">Network Investment</option>
                <option value="Holding Tank">Holding Tank</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="filter-input-group select-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Get Button */}
            <button type="submit" className="get-filter-btn">
              Get
            </button>
          </form>
        </div>

        {/* Investments History Table */}
        <div className="investments-table-card">
          <div className="table-responsive">
            <table className="investments-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Enroller Name</th>
                  <th>Type of Investment</th>
                  <th>Invest Amount</th>
                  <th>Bank Transaction ID</th>
                  <th>Lots</th>
                  <th>Monthly Return</th>
                  <th>Return Duration</th>
                  <th>Payment Proof</th>
                  <th>Investment Status</th>
                  <th>Periods Invested</th>
                  <th>Total Monthly Return</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv, idx) => (
                  <tr key={inv.id}>
                    <td>{idx + 1}</td>
                    <td>{inv.enrollerName}</td>
                    <td>
                      <span className="modal-type-badge">
                        {inv.investmentType || "Standard Package"}
                      </span>
                    </td>
                    <td className="amount-cell">
                      ₹{inv.investAmount.toLocaleString()}
                    </td>

                    <td>{inv.bankTxId}</td>
                    <td>{inv.lots}</td>
                    <td>₹{inv.monthlyReturn.toLocaleString()}</td>
                    <td>{inv.returnDuration}</td>
                    <td className="proof-cell">
                      <button
                        type="button"
                        className="download-btn"
                        title="Download Proof"
                      >
                        <FiDownload />
                      </button>
                    </td>
                    <td>
                      <span className="status-badge status--active">
                        {inv.investmentStatus}
                      </span>
                    </td>
                    <td>{inv.periodsInvested}</td>
                    <td>₹{inv.totalMonthlyReturn.toLocaleString()}</td>
                    <td>
                      <span className="status-badge status--approved">
                        {inv.status}
                      </span>
                    </td>
                    <td className="date-cell">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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

export default Investments;
