import { useState, useEffect } from "react";
import { FiCalendar, FiDownload } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  createInvestmentApi,
  getMyInvestmentsApi,
} from "../../../api/investments";
import { getInvestmentPlansApi } from "../../../api/plans";
import { getInvestmentTypesApi } from "../../../api/investmentTypes";
import "./Investments.css";

function Investments() {
  const [amount, setAmount] = useState("");
  const [bankTxId, setBankTxId] = useState("");

  // NEW — plan & return type selection
  const [plans, setPlans] = useState([]);
  const [returnTypes, setReturnTypes] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedReturnTypeId, setSelectedReturnTypeId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [investments, setInvestments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

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

  // NEW — load real plans + return types for the dropdowns
  const loadOptions = async () => {
    const plansRes = await getInvestmentPlansApi();
    if (plansRes.success) {
      const realPlans = plansRes.data.filter((p) => p.status !== false);
      setPlans(realPlans);
      if (realPlans.length > 0) setSelectedPlanId(String(realPlans[0].id));
    }

    const typesRes = await getInvestmentTypesApi();
    if (typesRes.success) {
      const realTypes = typesRes.data.filter((t) => t.status !== false);
      setReturnTypes(realTypes);
      if (realTypes.length > 0) setSelectedReturnTypeId(String(realTypes[0].id));
    }
  };

  useEffect(() => {
    loadInvestments();
    loadOptions();
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
    if (!selectedPlanId) {
      setErrorMsg("Please select an Investment Plan");
      return;
    }

    setLoading(true);

    const apiRes = await createInvestmentApi({
      investment_plan_id: Number(selectedPlanId),
      return_type_id: Number(selectedReturnTypeId) || 0,
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

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="investments-page">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-title-icon" aria-hidden="true">📈</span>
            Investments
          </h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Investments</span>
          </div>
        </div>

        <div className="invest-form-card">
          <h2 className="card-title">Invest Amount</h2>
          <p className="card-subtitle">
            Invest 5000.00 or more (in multiples of 5000.00) and earn returns based on the selected plan.
          </p>

          <form onSubmit={handleSubmit} className="invest-form">
            <div className="form-row">
              {/* NEW — Plan selector */}
              <div className="form-group">
                <label className="separated-label">Investment Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="form-input form-select"
                >
                  {plans.length === 0 ? (
                    <option value="">No plans available</option>
                  ) : (
                    plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.plan_name} — {plan.return_percentage}% / {plan.duration_months}mo
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* NEW — Return Type selector */}
              <div className="form-group">
                <label className="separated-label">Return Type</label>
                <select
                  value={selectedReturnTypeId}
                  onChange={(e) => setSelectedReturnTypeId(e.target.value)}
                  className="form-input form-select"
                >
                  {returnTypes.length === 0 ? (
                    <option value="">No return types available</option>
                  ) : (
                    returnTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.return_type}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="form-row">
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
                  <tr><td colSpan="13" className="empty-cell">Loading...</td></tr>
                ) : listError ? (
                  <tr><td colSpan="13" className="empty-cell">{listError}</td></tr>
                ) : investments.length === 0 ? (
                  <tr><td colSpan="13" className="empty-cell">No investments yet.</td></tr>
                ) : (
                  investments.map((inv, idx) => (
                    <tr key={inv.id}>
                      <td>{idx + 1}</td>
                      <td>{inv.investment_id}</td>
                      <td><span className="modal-type-badge">{inv.plan_name}</span></td>
                      <td className="amount-cell">₹{Number(inv.amount).toLocaleString()}</td>
                      <td>{inv.lots}</td>
                      <td>{inv.monthly_return_percentage}%</td>
                      <td>₹{Number(inv.monthly_return_amount).toLocaleString()}</td>
                      <td>{inv.return_which}</td>
                      <td>₹{Number(inv.return_balance).toLocaleString()}</td>
                      <td className="date-cell">{inv.return_date}</td>
                      <td><span className="status-badge status--active">{inv.investment_status}</span></td>
                      <td><span className="status-badge status--approved">{inv.approval_status}</span></td>
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
      </div>
    </UserLayout>
  );
}

export default Investments;