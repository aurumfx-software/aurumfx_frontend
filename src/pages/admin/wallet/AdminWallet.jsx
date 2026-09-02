import { useEffect, useState } from "react";
import { FiCalendar, FiRefreshCw, FiSearch } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminWalletTransactionsApi } from "../../../api/admin-wallet";
import "./AdminWallet.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const formatDate = (value) => {
  if (!value && value !== 0) return "-";

  const raw = String(value).trim();
  const match = raw.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);

  if (match) {
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = String(parsed.getFullYear());
    return `${day}-${month}-${year}`;
  }

  return raw;
};

const formatUserWithId = (user) => {
  if (!user) return "-";
  const userId = user.user_id || user.userId || user.id || "";
  const userName = user.name || user.fullname || user.full_name || "";

  if (userId && userName) return `${userId} (${userName})`;
  if (userId) return userId;
  if (userName) return userName;
  return "-";
};

function AdminWallet() {
  const transactionOptions = [
    { value: "", label: "All Transactions" },
    { value: "LEVEL_INCOME", label: "Level Income" },
    { value: "REFERRAL", label: "Referral Income" },
    { value: "RANK_REWARD", label: "Rank Reward" },
  ];

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    user_id: "",
    transaction_type: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, total_pages: 1, has_next: false, has_previous: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const normalizeTransactionType = (value) => {
    if (!value) return "";
    const normalized = String(value).trim();
    const aliasMap = {
      level_income: "LEVEL_INCOME",
      levelincome: "LEVEL_INCOME",
      referral_income: "REFERRAL",
      referralincome: "REFERRAL",
      referral: "REFERRAL",
      rank_reward: "RANK_REWARD",
      rankreward: "RANK_REWARD",
      rank_reward: "RANK_REWARD",
    };
    return aliasMap[normalized.toLowerCase()] || normalized.toUpperCase();
  };

  const loadTransactions = async (activeFilters = filters, requestedPage = 1) => {
    setLoading(true);
    setError("");
    const searchValue = String(activeFilters.user_id || "").trim();
    const isNumericUserId = /^\d+$/.test(searchValue);
    const normalizedFilters = {
      ...activeFilters,
      transaction_type: normalizeTransactionType(activeFilters.transaction_type),
    };
    const apiFilters = isNumericUserId || !searchValue
      ? { ...normalizedFilters, page: requestedPage, limit: 20 }
      : { ...normalizedFilters, user_id: "", page: requestedPage, limit: 20 };
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
      setPagination(result.pagination || {
        page: requestedPage,
        limit: 20,
        total: filteredTransactions.length,
        total_pages: 1,
        has_next: false,
        has_previous: requestedPage > 1,
      });
    }
    else setError(result.error || "Unable to load wallet transactions.");
    setLoading(false);
  };

  useEffect(() => { loadTransactions(); }, []);

  const handleSearchByUserId = () => {
    loadTransactions(filters, 1);
  };

  const handleReset = () => {
    const emptyFilters = { start_date: "", end_date: "", user_id: "", transaction_type: "" };
    setFilters(emptyFilters);
    loadTransactions(emptyFilters, 1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.total_pages || nextPage === pagination.page || loading) return;
    loadTransactions(filters, nextPage);
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
          <div className="history-filter-row">
            <div className="filter-field-wrap"><span className="floating-top-label">Start Date</span><input type="date" value={filters.start_date} onChange={(event) => setFilter("start_date", event.target.value)} className="filter-input-field" /><FiCalendar className="field-right-icon" /></div>
            <div className="filter-field-wrap"><span className="floating-top-label">End Date</span><input type="date" value={filters.end_date} onChange={(event) => setFilter("end_date", event.target.value)} className="filter-input-field" /><FiCalendar className="field-right-icon" /></div>

            <div className="user-id-search-wrap">
              <input
                type="search"
                placeholder="User ID"
                value={filters.user_id}
                onChange={(event) => setFilter("user_id", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearchByUserId();
                  }
                }}
                className="filter-input-field"
              />
              <button type="button" className="search-icon-btn" aria-label="Search by user ID" onClick={handleSearchByUserId}>
                <FiSearch size={15} />
              </button>
            </div>

            <div className="filter-field-wrap filter-select-wrap">
              <select
                value={filters.transaction_type}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  const normalizedValue = normalizeTransactionType(nextValue);
                  setFilter("transaction_type", normalizedValue);
                  loadTransactions({ ...filters, transaction_type: normalizedValue }, 1);
                }}
                className="filter-input-field filter-select-field"
                aria-label="Select transaction type"
              >
                {transactionOptions.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="wallet-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
          </div>

          <div className="table-overflow-box" style={{ marginTop: "16px" }}>
            <table className="agen-list-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>From User</th>
                  <th>Transaction Type</th>
                  <th>Level</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="10"><FiRefreshCw className="wallet-spinner" /> Loading wallet transactions...</td></tr> : error ? <tr><td colSpan="10">{error}</td></tr> : transactions.length === 0 ? <tr><td colSpan="10">No wallet transactions found.</td></tr> : transactions.map((transaction, index) => (
                  <tr key={transaction.id || transaction.transaction_id || index}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td>{transaction.user?.user_id || transaction.user_id || "-"}</td>
                    <td>{transaction.user?.name || transaction.user_name || "-"}</td>
                    <td>{formatUserWithId(transaction.from_user || transaction.fromUser)}</td>
                    <td>{transaction.transaction_type || "-"}</td>
                    <td>{transaction.level ?? "-"}</td>
                    <td>{transaction.payment_type || "-"}</td>
                    <td className="amount-cell">{money(transaction.amount)}</td>
                    <td>{transaction.status || "-"}</td>
                    <td>{formatDate(transaction.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && !error && pagination.total_pages > 1 && (
            <div className="wallet-pagination" aria-label="Wallet transaction pages">
              <span className="wallet-pagination-summary">
                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} records)
              </span>
              <div className="wallet-pagination-controls">
                <button type="button" className="wallet-page-btn" disabled={!pagination.has_previous} onClick={() => handlePageChange(pagination.page - 1)}>Previous</button>
                {Array.from({ length: pagination.total_pages }, (_, index) => index + 1).map((pageNumber) => (
                  <button type="button" key={pageNumber} className={`wallet-page-btn ${pagination.page === pageNumber ? "wallet-page-btn--active" : ""}`} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                ))}
                <button type="button" className="wallet-page-btn" disabled={!pagination.has_next} onClick={() => handlePageChange(pagination.page + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminWallet;
