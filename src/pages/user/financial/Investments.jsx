import { useState, useEffect } from "react";
import {
  FiInfo,
  FiCalendar,
  FiDownload,
  FiSearch,
  FiPlusCircle,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import DoInvestmentModal from "../../../components/User/DoInvestmentModal";
import {
  createInvestmentApi,
  getMyInvestmentsApi,
  getInvestmentDetailsApi,
} from "../../../api/investments";
import "./Investments.css";

function Investments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankTxId, setBankTxId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [investments, setInvestments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  // NEW — row detail popup state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadInvestments = async (filters = {}) => {
    setListLoading(true);
    setListError("");
    const res = await getMyInvestmentsApi(filters);
    if (res.success) {
      setInvestments(res.data);
    } else {
      setListError(res.error || "Unable to load investments");
    }
    setListLoading(false);
  };

  useEffect(() => {
    loadInvestments();
  }, []);

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

    if (!apiRes.success) {
      setErrorMsg(apiRes.error || "Failed to submit investment");
      setLoading(false);
      return;
    }

    setSuccessMsg("Investment request submitted successfully!");
    setAmount("");
    setBankTxId("");
    setLoading(false);

    await loadInvestments();
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    await loadInvestments({
      start_date: startDate,
      end_date: endDate,
      status: statusFilter,
    });
  };

  // NEW — row click handler, calls GET /investments/{id}
  const handleRowClick = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const res = await getInvestmentDetailsApi(id);
    if (res.success) {
      setDetailData(res.data);
    }
    setDetailLoading(false);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="investments-page">
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">Click Here</a>, to go back admin account.
          </span>
        </div>

        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              background: "#ffc52d", color: "#fff", fontWeight: 700, fontSize: "14px",
              border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 12px rgba(255, 197, 45, 0.35)", transition: "all 0.15s ease",
            }}
          >
            <FiPlusCircle size={16} />
            <span>View Lots</span>
          </button>
        </div>

        <DoInvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          investmentsList={investments}
        />

        <div className="invest-form-card">
          <h2 className="card-title">Invest Amount</h2>
          <p className="card-subtitle">
            Invest 5000.00 or more (in multiples of 5000.00) and earn 14.00% of the invested amount every month for 10 months.
          </p>

          <form onSubmit={handleSubmit} className="invest-form">
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

            {errorMsg && <p className="form-error-msg">{errorMsg}</p>}
            {successMsg && <p className="form-success-msg">{successMsg}</p>}

            <button type="submit" className="invest-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="history-filter-card">
          <h2 className="section-title">History</h2>

          <form onSubmit={handleFilterSubmit} className="history-filter-form">
            <div className="filter-input-group">
              <div className="input-with-icon">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="filter-input" />
                <FiCalendar className="field-icon" />
              </div>
            </div>

            <div className="filter-input-group">
              <div className="input-with-icon">
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="filter-input" />
                <FiCalendar className="field-icon" />
              </div>
            </div>

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

            <div className="filter-input-group select-group">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
                <option value="All">Type of Investment</option>
                <option value="Standard Package">Standard Package</option>
                <option value="Network Investment">Network Investment</option>
                <option value="Holding Tank">Holding Tank</option>
              </select>
            </div>

            <div className="filter-input-group select-group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                <option value="All">Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button type="submit" className="get-filter-btn">Get</button>
          </form>
        </div>

        <div className="investments-table-card">
          <div className="table-responsive">
            <table className="investments-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Investment ID</th>
                  <th>Plan</th>
                  <th>Invest Amount</th>
                  <th>Lots</th>
                  <th>Return %</th>
                  <th>Monthly Return</th>
                  <th>Return Which</th>
                  <th>Return Balance</th>
                  <th>Return Date</th>
                  <th>Investment Status</th>
                  <th>Approval Status</th>
                  <th>Investment Date</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr><td colSpan="13">Loading...</td></tr>
                ) : listError ? (
                  <tr><td colSpan="13">{listError}</td></tr>
                ) : investments.length === 0 ? (
                  <tr><td colSpan="13">No investments yet.</td></tr>
                ) : (
                  investments.map((inv, idx) => (
                    <tr
                      key={inv.id}
                      onClick={() => handleRowClick(inv.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{idx + 1}</td>
                      <td>{inv.investment_id}</td>
                      <td>
                        <span className="modal-type-badge">{inv.plan_name}</span>
                      </td>
                      <td className="amount-cell">₹{Number(inv.amount).toLocaleString()}</td>
                      <td>{inv.lots}</td>
                      <td>{inv.monthly_return_percentage}%</td>
                      <td>₹{Number(inv.monthly_return_amount).toLocaleString()}</td>
                      <td>{inv.return_which}</td>
                      <td>₹{Number(inv.return_balance).toLocaleString()}</td>
                      <td className="date-cell">{inv.return_date}</td>
                      <td>
                        <span className="status-badge status--active">{inv.investment_status}</span>
                      </td>
                      <td>
                        <span className="status-badge status--approved">{inv.approval_status}</span>
                      </td>
                      <td className="date-cell">{inv.investment_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-bar">
            <button type="button" className="page-nav-btn" disabled>&lt;</button>
            <span className="page-number active">1</span>
            <button type="button" className="page-nav-btn" disabled>&gt;</button>
          </div>
        </div>

        {/* NEW — detail popup, opens on row click */}
        {detailOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setDetailOpen(false)}
          >
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Investment Detail</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setDetailOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <p>Loading...</p>
                ) : detailData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p>Investment ID: {detailData.investment_id}</p>
                    <p>Plan: {detailData.plan_name}</p>
                    <p>Amount: ₹{Number(detailData.amount).toLocaleString()}</p>
                    <p>Lots: {detailData.lots}</p>
                    <p>Monthly Return %: {detailData.monthly_return_percentage}%</p>
                    <p>Monthly Return Amount: ₹{Number(detailData.monthly_return_amount).toLocaleString()}</p>
                    <p>Return Which: {detailData.return_which}</p>
                    <p>Return Balance: ₹{Number(detailData.return_balance).toLocaleString()}</p>
                    <p>Return Date: {detailData.return_date}</p>
                    <p>Investment Status: {detailData.investment_status}</p>
                    <p>Approval Status: {detailData.approval_status}</p>
                    <p>Investment Date: {detailData.investment_date}</p>
                  </div>
                ) : (
                  <p>Unable to load detail.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Investments;