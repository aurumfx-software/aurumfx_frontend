import { useEffect, useState } from "react";
import { FiCalendar, FiPrinter, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAdminLevelIncomeReportApi,
  getAdminLevelIncomeReportPrintApi,
} from "../../../api/admin-level-income-report";
import "./AdminReports.css";
import "./FundTransfer.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const valueOf = (row, ...keys) => keys.reduce((value, key) => value ?? row?.[key], undefined);
const userIdOf = (row) => valueOf(row, "user_id", "userId", "username") || "-";
const userNameOf = (row) => valueOf(row, "user_name", "userName", "fullname", "name") || "-";
const incomeOf = (row) => valueOf(row, "commission_amount", "commissionAmount", "income", "level_income", "commission", "amount") || 0;
const investmentOf = (row) => valueOf(row, "investment_amount", "investmentAmount", "amount") || 0;
const levelOf = (row) => valueOf(row, "level", "user_level") ?? "-";
const statusOf = (row) => valueOf(row, "status", "approval_status") || "-";
const dateOf = (row) => valueOf(row, "date", "created_at", "income_date") || "-";
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function LevelIncomeReport() {
  const [filters, setFilters] = useState({ start_date: "", end_date: "", status: "", user_id: "", level: "" });
  const [report, setReport] = useState({ total_records: 0, total_income: 0, total_investment_amount: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const loadReport = async (activeFilters = filters) => {
    setLoading(true);
    setError("");
    const result = await getAdminLevelIncomeReportApi(activeFilters);
    if (result.success) setReport(result.data);
    else setError(result.error || "Unable to load level income report.");
    setLoading(false);
  };

  useEffect(() => { loadReport(); }, []);

  const handleReset = () => {
    const emptyFilters = { start_date: "", end_date: "", status: "", user_id: "", level: "" };
    setFilters(emptyFilters);
    loadReport(emptyFilters);
  };

  const handlePrint = async () => {
    setPrinting(true);
    setError("");
    const result = await getAdminLevelIncomeReportPrintApi(filters);
    if (result.success) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(result.data);
        printWindow.document.close();
      } else setError("Allow pop-ups to print the level income report.");
    } else setError(result.error || "Unable to print level income report.");
    setPrinting(false);
  };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="ft-page-header"><div className="admin-page-header"><span className="admin-eyebrow"><span className="admin-eyebrow-dot" />Reports</span><h1 className="admin-page-title">Level Income Report</h1><p className="admin-page-subtitle">Review commission income generated across network levels</p><div className="admin-breadcrumb"><span>Dashboard</span><span className="crumb-sep">•</span><span className="crumb-active">Level Income Report</span></div></div><button type="button" className="ft-export-btn" onClick={handlePrint} disabled={printing}><FiPrinter size={14} /> {printing ? "Preparing..." : "Print"}</button></div>

        <form className="reports-filter-bar" onSubmit={(event) => { event.preventDefault(); loadReport(); }}>
          <div className="reports-date-field"><span className="reports-date-label">Pick Start Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.start_date} onChange={(event) => setFilter("start_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <div className="reports-date-field"><span className="reports-date-label">Pick End Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.end_date} onChange={(event) => setFilter("end_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <input className="reports-user-select" placeholder="User ID" value={filters.user_id} onChange={(event) => setFilter("user_id", event.target.value)} />
          <select className="reports-user-select" value={filters.status} onChange={(event) => setFilter("status", event.target.value)}><option value="">All Status</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select>
          <input className="reports-user-select" type="number" min="1" placeholder="Level" value={filters.level} onChange={(event) => setFilter("level", event.target.value)} />
          <button type="submit" className="reports-search-btn">Search</button><button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
        </form>

        <div className="investment-report-summary"><div><span>Total Records</span><strong>{report.total_records}</strong></div><div><span>Total Investment</span><strong>{money(report.total_investment_amount)}</strong></div><div><span>Total Commission</span><strong>{money(report.total_income)}</strong></div></div>

        <div className="reports-table-card"><div className="ft-table-wrapper"><table className="reports-table"><thead><tr><th>No</th><th>User ID</th><th>User Name</th><th>Level</th><th>Investment Amount</th><th>Commission</th><th>Status</th><th>Date</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="8">Loading level income report...</td></tr> : error ? <tr><td colSpan="8">{error}</td></tr> : report.items.length === 0 ? <tr><td colSpan="8" className="reports-empty-cell">No level income records found.</td></tr> : report.items.map((row, index) => <tr key={row.id || `${userIdOf(row)}-${index}`}><td>{index + 1}</td><td>{userIdOf(row)}</td><td>{userNameOf(row)}</td><td>{levelOf(row)}</td><td>{money(investmentOf(row))}</td><td>{money(incomeOf(row))}</td><td>{statusOf(row)}</td><td>{formatDate(dateOf(row))}</td></tr>)}
        </tbody></table></div></div>
      </div>
    </AdminLayout>
  );
}

export default LevelIncomeReport;
