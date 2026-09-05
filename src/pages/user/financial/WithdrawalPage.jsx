import { useEffect, useMemo, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import { getMyPayoutHistoryApi } from "../../../api/payout";
import "./EWallet.css";

function WithdrawalPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userId = useMemo(() => localStorage.getItem("userId") || "FX256", []);
  const userName = useMemo(() => localStorage.getItem("userName") || "User", []);

  const loadHistory = async (filters = {}) => {
    setLoading(true);
    setError("");

    const res = await getMyPayoutHistoryApi(filters);
    if (res.success) {
      setHistory(Array.isArray(res.data?.items) ? res.data.items : []);
    } else {
      setError(res.error || "Unable to load payout history.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReport = async (event) => {
    event.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      setError("End date must be after start date.");
      return;
    }

    await loadHistory({ start_date: startDate, end_date: endDate });
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page" style={{ gap: "18px" }}>
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Earnings &amp; Payouts
          </span>

          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">💸</span>
            <div className="page-header-text">
              <h1 className="page-title">Withdrawal</h1>
              <p className="page-subtitle">
                Request withdrawals and keep track of your payout history.
              </p>
            </div>
          </div>

        </div>

        <div className="ewallet-table-card">
          <div className="withdrawal-history-header">
            <h2 className="section-title">Payout History</h2>
          </div>

          <form className="ewallet-date-filter" onSubmit={handleReport}>
            <label className="ewallet-date-field">
              <span>Start Date</span>
              <div className="ewallet-date-input-wrap">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <FiCalendar aria-hidden="true" />
              </div>
            </label>
            <label className="ewallet-date-field">
              <span>End Date</span>
              <div className="ewallet-date-input-wrap">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FiCalendar aria-hidden="true" />
              </div>
            </label>
            <button type="submit" className="ewallet-report-btn">Get Report</button>
          </form>

          {loading ? (
            <div className="empty-cell">Loading payout history...</div>
          ) : error ? (
            <div className="empty-cell" style={{ color: "#fca5a5" }}>{error}</div>
          ) : history.length === 0 ? (
            <div className="empty-cell">No payout history found.</div>
          ) : (
            <div className="table-responsive">
              <table className="ewallet-table ewallet-table--clean payout-history-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Total Income</th>
                    <th>Admin Fee %</th>
                    <th>Admin Fee</th>
                    <th>Net Payable</th>
                    <th>Payout Method</th>
                    <th>Status</th>
                    <th>Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => {
                    const status = String(item.status || "").toUpperCase();
                    const statusClass = status === "PAID"
                      ? "status--paid"
                      : status === "REJECTED"
                        ? "status--rejected"
                        : status === "PENDING"
                          ? "status--pending"
                          : "";
                    return (
                    <tr key={item.id ?? `${item.user_id ?? "payout"}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{formatMoney(item.total_income)}</td>
                      <td>{item.admin_fee_percentage != null ? `${item.admin_fee_percentage}%` : "-"}</td>
                      <td>{formatMoney(item.admin_fee)}</td>
                      <td>{formatMoney(item.net_payable)}</td>
                      <td>{item.payout_method || "-"}</td>
                      <td>
                        <span className={`status-pill ${statusClass}`}>
                          {item.status || "-"}
                        </span>
                        {status === "REJECTED" && item.rejection_reason && (
                          <small className="payout-rejection-reason">{item.rejection_reason}</small>
                        )}
                      </td>
                      <td>{formatDate(item.paid_at)}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default WithdrawalPage;
