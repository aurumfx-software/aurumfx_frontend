import { useState } from "react";
import { FiX, FiDollarSign, FiUpload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import "./DoInvestmentModal.css";

function DoInvestmentModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [bankTxId, setBankTxId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [returnType, setReturnType] = useState("Monthly");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const lots = Math.floor(numAmount / 5000);
  const monthlyReturn = Math.round(numAmount * 0.14);
  const totalReturn = monthlyReturn * 10;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!numAmount || numAmount < 5000 || numAmount % 5000 !== 0) {
      setErrorMsg("Please enter an amount of ₹5,000 or more in multiples of ₹5,000.");
      return;
    }

    if (!bankTxId.trim()) {
      setErrorMsg("Please enter your Bank Transaction ID.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newInvestment = {
        id: Date.now(),
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

      setLoading(false);
      setSuccessMsg("Investment request submitted successfully!");

      if (onSuccess) {
        onSuccess(newInvestment);
      }

      setTimeout(() => {
        setAmount("");
        setBankTxId("");
        setSelectedFile(null);
        setSuccessMsg("");
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-icon-badge">
              <FiDollarSign size={20} />
            </div>
            <div>
              <h3>Do Investment</h3>
              <p>Earn 14.00% monthly return for 10 months</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Amount Field */}
          <div className="form-field">
            <label htmlFor="modal_amount">
              Investment Amount (₹) <span className="req">*</span>
            </label>
            <div className="input-with-affix">
              <span className="affix">₹</span>
              <input
                id="modal_amount"
                type="number"
                placeholder="Enter amount (e.g. 5000, 10000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="5000"
                min="5000"
                required
              />
            </div>
            <span className="field-hint">Min ₹5,000 in multiples of ₹5,000</span>
          </div>

          {/* Calculations Preview Box */}
          {numAmount >= 5000 && numAmount % 5000 === 0 && (
            <div className="calc-preview-card">
              <div className="calc-preview-item">
                <span className="calc-lbl">Lots:</span>
                <span className="calc-val">{lots}</span>
              </div>
              <div className="calc-preview-item">
                <span className="calc-lbl">Monthly Return (14%):</span>
                <span className="calc-val text-green">₹{monthlyReturn.toLocaleString()} / mo</span>
              </div>
              <div className="calc-preview-item">
                <span className="calc-lbl">Total (10 Months):</span>
                <span className="calc-val text-gold">₹{totalReturn.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Bank Transaction ID Field */}
          <div className="form-field">
            <label htmlFor="modal_bank_tx_id">
              Bank Transaction ID <span className="req">*</span>
            </label>
            <input
              id="modal_bank_tx_id"
              type="text"
              placeholder="e.g. TXN9876543210"
              value={bankTxId}
              onChange={(e) => setBankTxId(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div className="form-field">
            <label>Payment Proof (Optional)</label>
            <div className="modal-file-box">
              <label htmlFor="modal-proof-file" className="file-choose-btn">
                <FiUpload size={14} /> Choose File
              </label>
              <span className="file-chosen-text">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
              <input
                id="modal-proof-file"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xlsx"
                className="hidden-file-input"
              />
            </div>
            <span className="field-hint">Formats: .jpg, .png, .pdf, .docx (Max 2MB)</span>
          </div>

          {/* Return Type Select */}
          <div className="form-field">
            <label htmlFor="modal_return_type">Return Type</label>
            <select
              id="modal_return_type"
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
            >
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="modal-alert alert-error">
              <FiAlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="modal-alert alert-success">
              <FiCheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoInvestmentModal;
