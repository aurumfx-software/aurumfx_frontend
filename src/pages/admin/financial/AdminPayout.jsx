import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiEye, FiCopy, FiCalendar, FiChevronDown, FiPrinter } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminPayout.css";

const initialPayoutRequests = [
  {
    no: 1,
    name: "Arumugam Krishnan",
    username: "FX245",
    idVal: "274",
    avatarText: "A",
    avatarBg: "#ef4444",
    userBalance: 900,
    adminFee: 45,
    netPayable: 855,
    bankDetails: {
      bankName: "Indian Bank",
      branch: "Villupuram",
      ifsc: "IDIB000V024",
      accountNo: "447607700",
    },
    hasDocument: true,
  },
  {
    no: 2,
    name: "Abhijith S",
    username: "FX179",
    idVal: "208",
    avatarText: "A",
    avatarBg: "#3b82f6",
    userBalance: 400,
    adminFee: 20,
    netPayable: 380,
    bankDetails: {
      bankName: "Federal Bank",
      branch: "Trikaripur",
      ifsc: "FDRL0001953",
      accountNo: "19530100055230",
    },
    hasDocument: true,
  },
  {
    no: 3,
    name: "AJAYAKUMAR O K",
    username: "FX021",
    idVal: "22",
    avatarText: "A",
    avatarBg: "#8b5cf6",
    userBalance: 400,
    adminFee: 20,
    netPayable: 380,
    bankDetails: {
      bankName: "STATE BANK OF INDIA",
      branch: "PAYYANUR",
      ifsc: "SBIN0004686",
      accountNo: "31439546042",
    },
    hasDocument: true,
  },
  {
    no: 4,
    name: "SAVITHAMOL E S",
    username: "FX011",
    idVal: "12",
    avatarText: "S",
    avatarBg: "#22c55e",
    userBalance: 9000,
    adminFee: 450,
    netPayable: 8550,
    bankDetails: null,
    hasDocument: false,
  },
  {
    no: 5,
    name: "PRAVEEN DINESH",
    username: "FX001",
    idVal: "2",
    avatarText: "P",
    avatarBg: "#8b5cf6",
    userBalance: 4400,
    adminFee: 220,
    netPayable: 4180,
    bankDetails: {
      bankName: "Federal Bank",
      branch: "Erumely",
      ifsc: "FDRL0001140",
      accountNo: "11400100171031",
    },
    hasDocument: true,
  },
];

const initialPayoutHistory = [
  {
    no: 1,
    name: "Muraleedharan K",
    username: "FX152",
    idVal: "361",
    email: "muralika1983@gmail.com",
    avatarText: "M",
    avatarBg: "#8b5cf6",
    bankDetails: {
      bankName: "State Bank of India",
      branch: "Karivellur",
      ifsc: "SBIN0071168",
      accountNo: "20014134123",
    },
    requestedAmount: "3,400.00",
    amountReleased: "3,400.00",
    date: "01 Aug 2026",
    status: "Approved",
  },
  {
    no: 2,
    name: "Hima V V",
    username: "FX155",
    idVal: "360",
    email: "muralika1983@gmail.com",
    avatarText: "H",
    avatarBg: "#22c55e",
    bankDetails: {
      bankName: "Canara Bank",
      branch: "Taliparamba",
      ifsc: "CNRB0014205",
      accountNo: "42052200129180",
    },
    requestedAmount: "4,500.00",
    amountReleased: "4,500.00",
    date: "01 Aug 2026",
    status: "Approved",
  },
  {
    no: 3,
    name: "Namitha E",
    username: "FX167",
    idVal: "359",
    email: "muralika1983@gmail.com",
    avatarText: "N",
    avatarBg: "#3b82f6",
    bankDetails: {
      bankName: "Kerala Gramin Bank",
      branch: "Kalikkadavu",
      ifsc: "KLGB0040661",
      accountNo: "40661101025200",
    },
    requestedAmount: "10,800.00",
    amountReleased: "10,800.00",
    date: "01 Aug 2026",
    status: "Approved",
  },
  {
    no: 4,
    name: "Abhijith S",
    username: "FX179",
    idVal: "358",
    email: "jayjth1962@gmail.com",
    avatarText: "A",
    avatarBg: "#3b82f6",
    bankDetails: {
      bankName: "Federal Bank",
      branch: "Trikaripur",
      ifsc: "FDRL0001953",
      accountNo: "19530100055230",
    },
    requestedAmount: "4,500.00",
    amountReleased: "4,500.00",
    date: "01 Aug 2026",
    status: "Approved",
  },
];

function AdminPayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state matches the path format
  const activeTab = location.pathname.includes("/history") ? "history" : "requests";

  const [requests, setRequests] = useState(initialPayoutRequests);
  const [history, setHistory] = useState(initialPayoutHistory);

  // Filters for Payout History
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payoutTypeFilter, setPayoutTypeFilter] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleConfirm = (no) => {
    const requestToConfirm = requests.find((r) => r.no === no);
    if (!requestToConfirm) return;

    // Remove from active requests
    setRequests(requests.filter((r) => r.no !== no));

    // Add to history list at the top
    const newHistoryItem = {
      no: history.length + 1,
      name: requestToConfirm.name,
      username: requestToConfirm.username,
      idVal: requestToConfirm.idVal,
      email: `${requestToConfirm.username.toLowerCase()}@aurumfx.net`,
      avatarText: requestToConfirm.avatarText,
      avatarBg: requestToConfirm.avatarBg,
      bankDetails: requestToConfirm.bankDetails,
      requestedAmount: requestToConfirm.userBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      amountReleased: requestToConfirm.netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Approved",
    };
    setHistory([newHistoryItem, ...history]);
  };

  return (
    <AdminLayout>
      <div className="admin-payout-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Payout</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Payout</span>
          </div>
        </div>

        {/* Custom Payout Content Wrapper */}
        <div className="payout-content-card">
          {/* Tab Headers */}
          <div className="payout-tabs-header">
            <button
              type="button"
              className={`payout-tab-btn ${activeTab === "requests" ? "payout-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/payout/request")}
            >
              Payout Status
            </button>
            <button
              type="button"
              className={`payout-tab-btn ${activeTab === "history" ? "payout-tab-btn--active" : ""}`}
              onClick={() => navigate("/admin/financial/payout/history")}
            >
              Payout History
            </button>
          </div>

          {/* Tab Panel Content */}
          <div className="payout-tab-content">
            {activeTab === "requests" ? (
              <div className="table-overflow-box">
                <table className="admin-payout-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>User Balance</th>
                      <th>Admin Fee</th>
                      <th>Net Payable</th>
                      <th>User Bank Details</th>
                      <th>Bank Document</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.no}>
                        <td>{req.no}</td>
                        {/* User Column with Avatar Circle */}
                        <td>
                          <div className="payout-user-cell">
                            <div className="payout-user-avatar" style={{ background: req.avatarBg }}>
                              {req.avatarText}
                            </div>
                            <div className="payout-user-meta">
                              <span className="payout-user-fullname">{req.name}</span>
                              <span className="payout-user-idsub">{req.username}</span>
                              <span className="payout-user-idsub text-gray">ID: {req.idVal}</span>
                            </div>
                          </div>
                        </td>
                        <td>₹{req.userBalance}</td>
                        <td>₹{req.adminFee}</td>
                        <td>₹{req.netPayable}</td>
                        {/* User Bank Details */}
                        <td>
                          {req.bankDetails ? (
                            <div className="payout-bank-block">
                              <div><strong>Bank Name:</strong> {req.bankDetails.bankName}</div>
                              <div><strong>Branch:</strong> {req.bankDetails.branch}</div>
                              <div className="copyable-row">
                                <strong>IFSC:</strong> {req.bankDetails.ifsc}
                                <button type="button" className="inline-copy-btn" onClick={() => handleCopy(req.bankDetails.ifsc)} title="Copy IFSC">
                                  <FiCopy />
                                </button>
                              </div>
                              <div className="copyable-row">
                                <strong>Account No:</strong> {req.bankDetails.accountNo}
                                <button type="button" className="inline-copy-btn" onClick={() => handleCopy(req.bankDetails.accountNo)} title="Copy Account No">
                                  <FiCopy />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray">No details</span>
                          )}
                        </td>
                        {/* Bank Document View Icon */}
                        <td className="text-center-cell">
                          {req.hasDocument ? (
                            <button type="button" className="view-document-btn" title="View Document">
                              <FiEye />
                            </button>
                          ) : (
                            <span className="text-gray">No details</span>
                          )}
                        </td>
                        {/* Action Confirm Button */}
                        <td>
                          <button
                            type="button"
                            className="payout-confirm-btn"
                            onClick={() => handleConfirm(req.no)}
                          >
                            <FiCheck className="confirm-check" /> Confirm
                          </button>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="8" className="payout-empty-row">
                          All active payout requests processed!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Payout History Panel Layout with Filters and Print option */
              <div className="payout-history-section">
                <form className="history-filter-row" onSubmit={(e) => e.preventDefault()}>
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

                  {/* User selector */}
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={usernameFilter}
                      onChange={(e) => setUsernameFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">User</option>
                      <option value="FX152">FX152</option>
                      <option value="FX155">FX155</option>
                      <option value="FX167">FX167</option>
                      <option value="FX179">FX179</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>

                  {/* Status selector */}
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>

                  {/* Payout Type selector */}
                  <div className="filter-field-wrap select-field-wrap">
                    <select
                      value={payoutTypeFilter}
                      onChange={(e) => setPayoutTypeFilter(e.target.value)}
                      className="filter-select-field"
                    >
                      <option value="">Payout Type</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Manual">Manual</option>
                    </select>
                    <FiChevronDown className="field-right-icon text-muted" />
                  </div>

                  {/* Get Report Button */}
                  <button type="button" className="yellow-get-btn">
                    Get Report
                  </button>
                </form>

                {/* Print button below filters */}
                <div className="history-actions-row">
                  <button type="button" className="print-report-btn">
                    <FiPrinter /> Print
                  </button>
                </div>

                <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                  <table className="admin-payout-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>User</th>
                        <th>Payout Information</th>
                        <th>Requested Amount</th>
                        <th>Amount Released</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((hist) => (
                        <tr key={hist.no}>
                          <td>{hist.no}</td>
                          {/* User info details */}
                          <td>
                            <div className="payout-user-cell">
                              <div className="payout-user-avatar" style={{ background: hist.avatarBg }}>
                                {hist.avatarText}
                              </div>
                              <div className="payout-user-meta">
                                <span className="payout-user-fullname">{hist.name}</span>
                                <span className="payout-user-idsub">{hist.username}</span>
                                <span className="payout-user-idsub text-gray">ID: {hist.idVal}</span>
                                <span className="payout-user-idsub text-gray font-italic">{hist.email}</span>
                              </div>
                            </div>
                          </td>
                          {/* Bank details block */}
                          <td>
                            {hist.bankDetails ? (
                              <div className="payout-bank-block">
                                <div><strong>Bank Name:</strong> {hist.bankDetails.bankName}</div>
                                <div><strong>Branch:</strong> {hist.bankDetails.branch}</div>
                                <div className="copyable-row">
                                  <strong>IFSC:</strong> {hist.bankDetails.ifsc}
                                  <button type="button" className="inline-copy-btn" onClick={() => handleCopy(hist.bankDetails.ifsc)} title="Copy IFSC">
                                    <FiCopy />
                                  </button>
                                </div>
                                <div className="copyable-row">
                                  <strong>Account No:</strong> {hist.bankDetails.accountNo}
                                  <button type="button" className="inline-copy-btn" onClick={() => handleCopy(hist.bankDetails.accountNo)} title="Copy Account No">
                                    <FiCopy />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray">No details</span>
                            )}
                          </td>
                          <td>₹{hist.requestedAmount}</td>
                          <td>₹{hist.amountReleased}</td>
                          <td>{hist.date}</td>
                          {/* Status Green Approved text */}
                          <td>
                            <span className="payout-status-green">
                              {hist.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPayout;
