import { useEffect, useState } from "react";
import { FiCalendar, FiPrinter, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAdminInvestmentReportApi,
  getAdminInvestmentReportPrintApi,
} from "../../../api/admin-investment-report";
import "./AdminReports.css";
import "./FundTransfer.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const valueOf = (row, ...keys) => keys.reduce((value, key) => value ?? row?.[key], undefined);
const userIdOf = (row) => valueOf(row, "user_id", "userId", "username") || "-";
const userNameOf = (row) => valueOf(row, "user_name", "userName", "fullname", "name") || "-";
const planOf = (row) => valueOf(row, "plan_name", "investment_plan_name", "plan") || "-";
const amountOf = (row) => valueOf(row, "amount", "investment_amount", "total_amount") || 0;
const lotsOf = (row) => valueOf(row, "lots", "lot_count") ?? "-";
const statusOf = (row) => valueOf(row, "status", "approval_status", "investment_status") || "-";
const dateOf = (row) => valueOf(row, "investment_date", "date", "created_at") || "-";
const formatDate = (value) => {
  if (!value || value === "-") return "-";
  const [datePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  return year && month && day ? `${day}-${month}-${year}` : datePart;
};

function InvestmentReport() {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    user_id: "",
  });
  const [report, setReport] = useState({ total_records: 0, total_amount: 0, total_lots: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const loadReport = async () => {
    setLoading(true);
    setError("");
    const result = await getAdminInvestmentReportApi(filters);
    if (result.success) setReport(result.data);
    else setError(result.error || "Unable to load investment report.");
    setLoading(false);
  };

  useEffect(() => { loadReport(); }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadReport();
  };

  const handleReset = () => {
    const emptyFilters = { start_date: "", end_date: "", user_id: "" };
    setFilters(emptyFilters);
    setLoading(true);
    setError("");
    getAdminInvestmentReportApi(emptyFilters).then((result) => {
      if (result.success) setReport(result.data);
      else setError(result.error || "Unable to load investment report.");
      setLoading(false);
    });
  };

  const handlePrint = async () => {
    setPrinting(true);
    setError("");
    const result = await getAdminInvestmentReportPrintApi(filters);
    if (result.success) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(result.data);
        printWindow.document.close();
      } else setError("Allow pop-ups to print the investment report.");
    } else setError(result.error || "Unable to print investment report.");
    setPrinting(false);
  };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="ft-page-header">
          <div className="admin-page-header">
            <span className="admin-eyebrow"><span className="admin-eyebrow-dot" />Reports</span>
            <h1 className="admin-page-title">Investment Report</h1>
            <p className="admin-page-subtitle">Review investment activity, amounts, and status across the platform</p>
            <div className="admin-breadcrumb"><span>Dashboard</span><span className="crumb-sep">•</span><span className="crumb-active">Investment Report</span></div>
          </div>
          <button type="button" className="ft-export-btn" onClick={handlePrint} disabled={printing}><FiPrinter size={14} /> {printing ? "Preparing..." : "Print"}</button>
        </div>

        <form className="reports-filter-bar" onSubmit={handleSearch}>
          <div className="reports-date-field"><span className="reports-date-label">Pick Start Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.start_date} onChange={(event) => setFilter("start_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <div className="reports-date-field"><span className="reports-date-label">Pick End Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.end_date} onChange={(event) => setFilter("end_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <input className="reports-user-select" placeholder="User ID" value={filters.user_id} onChange={(event) => setFilter("user_id", event.target.value)} />
          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
        </form>

        <div className="investment-report-summary">
          <div><span>Total Investments</span><strong>{report.total_records}</strong></div>
          <div><span>Total Amount</span><strong>{money(report.total_amount)}</strong></div>
          <div><span>Total Lots</span><strong>{report.total_lots}</strong></div>
        </div>

        <div className="reports-table-card"><div className="ft-table-wrapper"><table className="reports-table"><thead><tr><th>No</th><th>User ID</th><th>User Name</th><th>Plan</th><th>Amount</th><th>Lots</th><th>Status</th><th>Date</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="8">Loading investment report...</td></tr> : error ? <tr><td colSpan="8">{error}</td></tr> : report.items.length === 0 ? <tr><td colSpan="8" className="reports-empty-cell">No investment records found.</td></tr> : report.items.map((row, index) => <tr key={row.id || row.investment_id || `${userIdOf(row)}-${index}`}><td>{index + 1}</td><td>{userIdOf(row)}</td><td>{userNameOf(row)}</td><td>{planOf(row)}</td><td>{money(amountOf(row))}</td><td>{lotsOf(row)}</td><td>{statusOf(row)}</td><td>{formatDate(dateOf(row))}</td></tr>)}
        </tbody></table></div></div>
      </div>
    </AdminLayout>
  );
}

export default InvestmentReport;
