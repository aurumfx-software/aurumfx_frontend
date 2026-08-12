import { FiX, FiLayers } from "react-icons/fi";
import "./DoInvestmentModal.css";

function DoInvestmentModal({ isOpen, onClose, investmentsList = [] }) {
  if (!isOpen) return null;

  const items = Array.isArray(investmentsList) ? investmentsList : [];
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalMonthlyReturn = items.reduce(
    (sum, item) => sum + (Number(item.monthly_return_amount) || 0),
    0
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-container--wide" onClick={(e) => e.stopPropagation()}>
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

        <div className="modal-body">
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

          <div className="modal-table-wrapper">
            <table className="modal-invest-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Investment ID</th>
                  <th>Plan</th>
                  <th>Invest Amount</th>
                  <th>Lots</th>
                  <th>Monthly Return</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="8">No investments found.</td></tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.investment_id}</td>
                      <td>
                        <span className="modal-type-badge">{item.plan_name}</span>
                      </td>
                      <td className="amount-cell">₹{Number(item.amount || 0).toLocaleString()}</td>
                      <td>{item.lots}</td>
                      <td className="return-cell">₹{Number(item.monthly_return_amount || 0).toLocaleString()}</td>
                      <td>
                        <span className="modal-status-badge status--approved">
                          {item.approval_status || item.investment_status}
                        </span>
                      </td>
                      <td className="date-cell">{item.investment_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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