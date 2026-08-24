import { useEffect, useState } from "react";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminWalletTransactionsApi } from "../../../api/admin-wallet";
import "./AdminWallet.css";

const getValue = (row, ...keys) => keys.reduce((value, key) => value ?? row?.[key], undefined);
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const formatDate = (value) => value ? new Date(value).toLocaleString() : "-";

function AdminWallet() {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    user_id: "",
    transaction_type: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const loadTransactions = async (activeFilters = filters) => {
    setLoading(true);
    setError("");
    const result = await getAdminWalletTransactionsApi(activeFilters);
    if (result.success) setTransactions(result.data);
    else setError(result.error || "Unable to load wallet transactions.");
    setLoading(false);
  };

  useEffect(() => { loadTransactions(); }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadTransactions();
  };

  const handleReset = () => {
    const emptyFilters = { start_date: "", end_date: "", user_id: "", transaction_type: "" };
    setFilters(emptyFilters);
    loadTransactions(emptyFilters);
  };

  return (
    <AdminLayout>
      <div className="admin-wallet-page">
        <div className="admin-page-header">
          <span className="admin-eyebrow">
            <span className="admin-eyebrow-dot" />
            Finance
          </span>
          <h1 className="admin-page-title">Admin Wallet</h1>
          <p className="admin-page-subtitle">Track wallet transactions across the platform</p>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Admin Wallet</span>
          </div>
        </div>

        <div className="admin-wallet-history-card">
          <h2 className="section-title">Wallet Transactions</h2>
          <form className="history-filter-row" onSubmit={handleSearch}>
            <div className="filter-field-wrap"><span className="floating-top-label">Start Date</span><input type="date" value={filters.start_date} onChange={(event) => setFilter("start_date", event.target.value)} className="filter-input-field" /><FiCalendar className="field-right-icon" /></div>
            <div className="filter-field-wrap"><span className="floating-top-label">End Date</span><input type="date" value={filters.end_date} onChange={(event) => setFilter("end_date", event.target.value)} className="filter-input-field" /><FiCalendar className="field-right-icon" /></div>
            <input type="search" placeholder="User ID" value={filters.user_id} onChange={(event) => setFilter("user_id", event.target.value)} className="filter-input-field" />
            <input type="search" placeholder="Transaction Type" value={filters.transaction_type} onChange={(event) => setFilter("transaction_type", event.target.value)} className="filter-input-field" />
            <button type="submit" className="yellow-get-btn">Search</button>
            <button type="button" className="wallet-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          </form>

          <div className="table-overflow-box" style={{ marginTop: "16px" }}>
            <table className="agen-list-table">
              <thead><tr><th>No</th><th>Transaction ID</th><th>User ID</th><th>Transaction Type</th><th>Amount</th><th>Balance</th><th>Description</th><th>Date</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="8"><FiRefreshCw className="wallet-spinner" /> Loading wallet transactions...</td></tr> : error ? <tr><td colSpan="8">{error}</td></tr> : transactions.length === 0 ? <tr><td colSpan="8">No wallet transactions found.</td></tr> : transactions.map((transaction, index) => (
                  <tr key={transaction.id || transaction.transaction_id || index}>
                    <td>{index + 1}</td>
                    <td>{getValue(transaction, "transaction_id", "id") || "-"}</td>
                    <td>{getValue(transaction, "user_id", "userId") || "-"}</td>
                    <td>{getValue(transaction, "transaction_type", "type") || "-"}</td>
                    <td className="amount-cell">{money(getValue(transaction, "amount", "transaction_amount"))}</td>
                    <td>{money(getValue(transaction, "balance", "wallet_balance", "running_balance"))}</td>
                    <td>{getValue(transaction, "description", "remarks", "note") || "-"}</td>
                    <td>{formatDate(getValue(transaction, "created_at", "date", "transaction_date"))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminWallet;
