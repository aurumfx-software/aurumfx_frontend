import { FiX, FiLayers } from "react-icons/fi";
import "./DoInvestmentModal.css";

const DEFAULT_INVESTMENT_LIST = [
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
    status: "Approved",
    date: "29 Jul 2026",
  },
  {
    id: 2,
    enrollerName: "FX034",
    investmentType: "Network Investment",
    investAmount: 100000,
    bankTxId: "15072026100000",
    lots: 20,
    monthlyReturn: 14000,
    returnDuration: 10,
    investmentStatus: "Active",
    status: "Approved",
    date: "15 Jul 2026",
  },
  {
    id: 3,
    enrollerName: "FX034",
    investmentType: "Holding Tank",
    investAmount: 50000,
    bankTxId: "0107202650000",
    lots: 10,
    monthlyReturn: 7000,
    returnDuration: 10,
    investmentStatus: "Active",
    status: "Approved",
    date: "01 Jul 2026",
  },
];

function DoInvestmentModal({ isOpen, onClose, investmentsList = DEFAULT_INVESTMENT_LIST }) {
  if (!isOpen) return null;

  const items = Array.isArray(investmentsList) && investmentsList.length > 0 ? investmentsList : DEFAULT_INVESTMENT_LIST;
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.investAmount) || 0), 0);
  const totalMonthlyReturn = items.reduce((sum, item) => sum + (Number(item.monthlyReturn || Math.round((Number(item.investAmount) || 0) * 0.14)) || 0), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-container--wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-icon-badge">
              <FiLayers size={20} />
            </div>
            <div>
              <h3>Investment List</h3>
              <p>List of all active investments and monthly return splits</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Content - Investment List */}
        <div className="modal-body">
          {/* Summary Row */}
          <div className="modal-summary-row">
            <div className="summary-chip">
              <span className="chip-label">Total Investment:</span>
              <span className="chip-value">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="summary-chip">
              <span className="chip-label">Monthly Return:</span>
              <span className="chip-value text-green">₹{totalMonthlyReturn.toLocaleString()} / mo</span>
            </div>
            <div className="summary-chip">
              <span className="chip-label">Active Investments:</span>
              <span className="chip-value">{items.length}</span>
            </div>
          </div>

          {/* Investment List Table */}
          <div className="modal-table-wrapper">
            <table className="modal-invest-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Enroller Name</th>
                  <th>Investment Type</th>
                  <th>Invest Amount</th>
                  <th>Bank Tx ID</th>
                  <th>Lots</th>
                  <th>Monthly Return</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const amt = Number(item.investAmount || 0);
                  const lots = item.lots || Math.floor(amt / 5000);
                  const monthlyRet = item.monthlyReturn || Math.round(amt * 0.14);

                  return (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.enrollerName || "FX034"}</td>
                      <td>
                        <span className="modal-type-badge">
                          {item.investmentType || "Standard Package"}
                        </span>
                      </td>
                      <td className="amount-cell">₹{amt.toLocaleString()}</td>
                      <td>{item.bankTxId || "-"}</td>
                      <td>{lots}</td>
                      <td className="return-cell">₹{monthlyRet.toLocaleString()}</td>
                      <td>
                        <span className="modal-status-badge status--approved">
                          {item.status || item.investmentStatus || "Approved"}
                        </span>
                      </td>
                      <td className="date-cell">{item.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>


          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoInvestmentModal;
