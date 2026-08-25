import { useState, useEffect } from "react";
import { FiCalendar, FiChevronDown, FiEye, FiUpload, FiX } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  createInvestmentApi,
  getMyInvestmentsApi,
  getInvestmentDetailsApi,
} from "../../../api/investments";
import { API_BASE_URL } from "../../../api/axios";
import { getInvestmentPlansApi } from "../../../api/adminplans";
import { getInvestmentTypesApi } from "../../../api/adminreturntype";
import "./Investments.css";

function Investments() {
  const [amount, setAmount] = useState("");
  const [bankTxId, setBankTxId] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");

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
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const selectedPlan = plans.find((plan) => String(plan.id) === String(selectedPlanId));

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
      const defaultPlan = realPlans.find((plan) => Number(plan.duration_months) === 30) || realPlans[0];
      if (defaultPlan) setSelectedPlanId(String(defaultPlan.id));
    }

    const typesRes = await getInvestmentTypesApi();
    if (typesRes.success) {
      const realTypes = typesRes.data.filter((t) => t.status !== false);
      setReturnTypes(realTypes);
      const defaultType = realTypes.find((type) => String(type.return_type || type.type_name || "").toLowerCase().includes("month")) || realTypes[0];
      if (defaultType) setSelectedReturnTypeId(String(defaultType.id));
    }
  };

  useEffect(() => {
    loadInvestments();
    loadOptions();
  }, []);

  useEffect(() => {
    if (!paymentProof) {
      setPaymentProofPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(paymentProof);
    setPaymentProofPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [paymentProof]);

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
    if (!paymentProof) {
      setErrorMsg("Please upload the payment proof");
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
      investment_date: new Date().toISOString().split("T")[0],
      payment_proof: paymentProof,
    });

    if (!apiRes.success) {
      setErrorMsg(apiRes.error || "Failed to submit investment");
      setLoading(false);
      return;
    }

    setSuccessMsg("Investment request submitted successfully!");
    setAmount("");
    setBankTxId("");
    setPaymentProof(null);
    document.getElementById("payment-proof-upload").value = "";
    setLoading(false);

    await loadInvestments();
  };

  const handleProofClick = async (investmentId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const res = await getInvestmentDetailsApi(investmentId);
    if (res.success) setDetailData(res.data);
    setDetailLoading(false);
  };

  const resolveProofUrl = (path) => {
    if (!path || path instanceof File || String(path).startsWith("blob:")) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL.replace(/\/api\/?$/, "")}/${String(path).replace(/^\//, "")}`;
  };

  const getProofName = (path) => {
    if (!path) return "View proof";
    return decodeURIComponent(String(path).split("?")[0].split("/").pop() || "View proof");
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
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Portfolio Growth
          </span>
          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">📈</span>
            <div className="page-header-text">
              <h1 className="page-title">Investments</h1>
              <p className="page-subtitle">Build your portfolio and track every investment in one place.</p>
            </div>
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
                <div className="select-control">
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="form-input form-select"
                  >
                    {plans.length === 0 ? <option value="">No plans available</option> : plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.plan_name || `Plan #${plan.id}`}</option>)}
                  </select>
                  <FiChevronDown className="select-arrow" aria-hidden="true" />
                </div>
                {selectedPlan && (
                  <div className="selected-plan-details" aria-live="polite">
                    <div><span>Plan</span><strong>{selectedPlan.plan_name || `Plan #${selectedPlan.id}`}</strong></div>
                    <div><span>Duration</span><strong>{selectedPlan.duration_months ?? 0} months</strong></div>
                    <div><span>Return</span><strong>{Number(selectedPlan.return_percentage ?? 0).toFixed(2)}%</strong></div>
                    <div><span>Minimum</span><strong>₹{Number(selectedPlan.minimum_amount ?? 0).toLocaleString("en-IN")}</strong></div>
                  </div>
                )}
              </div>

              {/* NEW — Return Type selector */}
              <div className="form-group">
                <label className="separated-label">Return Type</label>
                <div className="select-control">
                  <select
                    value={selectedReturnTypeId}
                    onChange={(e) => setSelectedReturnTypeId(e.target.value)}
                    className="form-input form-select"
                  >
                    {returnTypes.length === 0 ? <option value="">No return types available</option> : returnTypes.map((rt) => <option key={rt.id} value={rt.id}>{rt.return_type || rt.type_name || `Type #${rt.id}`}</option>)}
                  </select>
                  <FiChevronDown className="select-arrow" aria-hidden="true" />
                </div>
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

            <div className="form-group payment-proof-field">
              <label className="separated-label">Payment Proof</label>
              <label className={`payment-proof-upload ${paymentProof ? "is-filled" : ""}`} htmlFor="payment-proof-upload">
                {paymentProofPreview ? (
                  <img className="payment-proof-thumb" src={paymentProofPreview} alt="Selected payment proof" />
                ) : (
                  <FiUpload />
                )}
                <span>{paymentProof ? paymentProof.name : "Add your payment proof"}</span>
                <input
                  id="payment-proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                />
              </label>
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
              <div className="select-control">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                  <option value="All">Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <FiChevronDown className="select-arrow" aria-hidden="true" />
              </div>
            </div>
            <button type="submit" className="get-filter-btn">Get</button>
          </form>
        </div>

        <div className="investments-table-card">
          <h2 className="section-title">Investment History</h2>
          <div className="table-responsive">
            <table className="investments-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Investment Date</th>
                  <th>Plan Name</th>
                  <th>Return Type</th>
                  <th>Investment Amount</th>
                  <th>Lots</th>
                  <th>Monthly Return %</th>
                  <th>Monthly Return Amount</th>
                  <th>Total Returns</th>
                  <th>Returns Paid</th>
                  <th>Returns Remaining</th>
                  <th>Return Date</th>
                  <th>Investment Status</th>
                  <th>Approval Status</th>
                  <th>Payment Proof</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr><td colSpan="15" className="empty-cell">Loading...</td></tr>
                ) : listError ? (
                  <tr><td colSpan="15" className="empty-cell">{listError}</td></tr>
                ) : investments.length === 0 ? (
                  <tr><td colSpan="15" className="empty-cell">No investments yet.</td></tr>
                ) : (
                  investments.map((inv, idx) => (
                    <tr key={inv.id}>
                      <td>{idx + 1}</td>
                      <td className="date-cell">{inv.investment_date}</td>
                      <td><span className="modal-type-badge">{inv.plan_name}</span></td>
                      <td>{inv.return_type || inv.return_type_name || inv.return_which || "-"}</td>
                      <td className="amount-cell">₹{Number(inv.amount).toLocaleString()}</td>
                      <td>{inv.lots}</td>
                      <td>{inv.monthly_return_percentage}%</td>
                      <td>₹{Number(inv.monthly_return_amount).toLocaleString()}</td>
                      <td>{inv.duration_months ?? 0}</td>
                      <td>{inv.return_which ?? 0}</td>
                      <td>{inv.return_balance ?? 0}</td>
                      <td className="date-cell">{inv.return_date}</td>
                      <td><span className="status-badge status--active">{inv.investment_status}</span></td>
                      <td><span className="status-badge status--approved">{inv.approval_status}</span></td>
                      <td>
                        {inv.payment_proof ? (
                          <button type="button" className="proof-link" onClick={() => handleProofClick(inv.id)}>
                            <FiEye size={14} /> {getProofName(inv.payment_proof)}
                          </button>
                        ) : "-"}
                      </td>
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

        {detailOpen && (
          <div className="proof-modal-backdrop" onClick={() => setDetailOpen(false)}>
            <div className="proof-modal" onClick={(e) => e.stopPropagation()}>
              <div className="proof-modal-header">
                <h2>Payment Proof</h2>
                <button type="button" className="proof-close-btn" onClick={() => setDetailOpen(false)} aria-label="Close">
                  <FiX size={18} />
                </button>
              </div>
              {detailLoading ? (
                <p className="proof-modal-message">Loading...</p>
              ) : detailData?.payment_proof ? (
                <img className="payment-proof-preview" src={resolveProofUrl(detailData.payment_proof)} alt="Payment proof" />
              ) : (
                <p className="proof-modal-message">Payment proof is unavailable.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Investments;