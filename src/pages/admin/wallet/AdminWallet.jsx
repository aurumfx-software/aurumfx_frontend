import { useEffect, useState } from "react";
import { FiCalendar, FiRefreshCw, FiSearch } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminWalletTransactionsApi } from "../../../api/admin-wallet";
import "./AdminWallet.css";

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
    const searchValue = String(activeFilters.user_id || "").trim();
    const isNumericUserId = /^\d+$/.test(searchValue);
    const apiFilters = isNumericUserId || !searchValue
      ? activeFilters
      : { ...activeFilters, user_id: "" };
    const result = await getAdminWalletTransactionsApi(apiFilters);
    if (result.success) {
      const normalizedSearch = searchValue.toLowerCase();
      const filteredTransactions = normalizedSearch && !isNumericUserId
        ? result.data.filter((transaction) => {
          const user = transaction.user || {};
          return String(user.user_id || "").toLowerCase() === normalizedSearch
            || String(user.name || "").toLowerCase().includes(normalizedSearch);
        })
        : result.data;
      setTransactions(filteredTransactions);
    }
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
            <button type="submit" className="yellow-get-btn" aria-label="Search wallet transactions"><FiSearch size={15} /> Search Transactions</button>
            <button type="button" className="wallet-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          </form>

          <div className="table-overflow-box" style={{ marginTop: "16px" }}>
            <table className="agen-list-table">
              <thead><tr><th>No</th><th>User ID</th><th>User Name</th><th>Transaction Type</th><th>Payment Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="8"><FiRefreshCw className="wallet-spinner" /> Loading wallet transactions...</td></tr> : error ? <tr><td colSpan="8">{error}</td></tr> : transactions.length === 0 ? <tr><td colSpan="8">No wallet transactions found.</td></tr> : transactions.map((transaction, index) => (
                  <tr key={transaction.id || transaction.transaction_id || index}>
                    <td>{index + 1}</td>
                    <td>{transaction.user?.user_id || transaction.user_id || "-"}</td>
                    <td>{transaction.user?.name || transaction.user_name || "-"}</td>
                    <td>{transaction.transaction_type || "-"}</td>
                    <td>{transaction.payment_type || "-"}</td>
                    <td className="amount-cell">{money(transaction.amount)}</td>
                    <td>{transaction.status || "-"}</td>
                    <td>{formatDate(transaction.date)}</td>
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
