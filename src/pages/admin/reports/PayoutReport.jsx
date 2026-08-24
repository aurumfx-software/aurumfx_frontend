import { useEffect, useState } from "react";
import { FiCalendar, FiPrinter, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAdminPayoutReportApi,
  getAdminPayoutReportPrintApi,
} from "../../../api/adminpayout-report";
import "./AdminReports.css";
import "./FundTransfer.css";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const valueOf = (row, ...keys) => keys.reduce((value, key) => value ?? row?.[key], undefined);
const incomeOf = (row, key) => valueOf(row, key, key.replace("_income", "Income"), key.replace("_income", "_amount")) || 0;
const userIdOf = (row) => valueOf(row, "user_id", "userId", "username") || "-";
const userNameOf = (row) => valueOf(row, "user_name", "userName", "fullname", "name") || "-";
const rankOf = (row) => valueOf(row, "rank", "rank_name", "user_rank") || "-";
const statusOf = (row) => valueOf(row, "status", "payout_status") || "-";
const paidDateOf = (row) => valueOf(row, "paid_date", "paid_at", "payment_date") || "-";

function PayoutReport() {
  const [filters, setFilters] = useState({ start_date: "", end_date: "", status: "", user_id: "" });
  const [report, setReport] = useState({ total_records: 0, total_income: 0, total_admin_fee: 0, total_net_payable: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const loadReport = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    const result = await getAdminPayoutReportApi(nextFilters);
    if (result.success) setReport(result.data);
    else setError(result.error || "Unable to load payout report.");
    setLoading(false);
  };

  useEffect(() => { loadReport(); }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadReport();
  };

  const handleReset = () => {
    const emptyFilters = { start_date: "", end_date: "", status: "", user_id: "" };
    setFilters(emptyFilters);
    loadReport(emptyFilters);
  };

  const handlePrint = async () => {
    setPrinting(true);
    setError("");
    const result = await getAdminPayoutReportPrintApi(filters);
    if (result.success) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(result.data);
        printWindow.document.close();
      } else setError("Allow pop-ups to print the payout report.");
    } else setError(result.error || "Unable to print payout report.");
    setPrinting(false);
  };

  return (
    <AdminLayout>
      <div className="admin-reports-page">
        <div className="ft-page-header">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Payout Report</h1>
            <div className="admin-breadcrumb"><span>Dashboard</span><span className="crumb-sep">•</span><span className="crumb-active">Payout Report</span></div>
          </div>
          <button type="button" className="ft-export-btn" onClick={handlePrint} disabled={printing}><FiPrinter size={14} /> {printing ? "Preparing..." : "Print"}</button>
        </div>

        <form className="reports-filter-bar" onSubmit={handleSearch}>
          <div className="reports-date-field"><span className="reports-date-label">Pick Start Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.start_date} onChange={(event) => setFilter("start_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <div className="reports-date-field"><span className="reports-date-label">Pick End Date</span><div className="reports-date-row"><input type="date" className="reports-date-input" value={filters.end_date} onChange={(event) => setFilter("end_date", event.target.value)} /><FiCalendar className="reports-date-icon" /></div></div>
          <input className="reports-user-select" placeholder="User ID" value={filters.user_id} onChange={(event) => setFilter("user_id", event.target.value)} />
          <select className="reports-user-select" value={filters.status} onChange={(event) => setFilter("status", event.target.value)}><option value="">All Status</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Paid">Paid</option><option value="Rejected">Rejected</option></select>
          <button type="submit" className="reports-search-btn">Search</button>
          <button type="button" className="reports-reset-btn" onClick={handleReset}>Reset <FiRefreshCw size={13} /></button>
        </form>

        <div className="investment-report-summary payout-report-summary">
          <div><span>Total Payouts</span><strong>{report.total_records}</strong></div>
          <div><span>Total Income</span><strong>{money(report.total_income)}</strong></div>
          <div><span>Admin Fee</span><strong>{money(report.total_admin_fee)}</strong></div>
          <div><span>Net Payable</span><strong>{money(report.total_net_payable)}</strong></div>
        </div>

        <div className="reports-table-card"><div className="ft-table-wrapper"><table className="reports-table"><thead><tr><th>No</th><th>User ID</th><th>User Name</th><th>Referral</th><th>Level</th><th>Rank</th><th>Total</th><th>Admin Fee</th><th>Net Payable</th><th>Status</th><th>Paid Date</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="11">Loading payout report...</td></tr> : error ? <tr><td colSpan="11">{error}</td></tr> : report.items.length === 0 ? <tr><td colSpan="11" className="reports-empty-cell">No payout records found.</td></tr> : report.items.map((row, index) => {
            const referral = Number(incomeOf(row, "referral_income"));
            const level = Number(incomeOf(row, "level_income"));
            const rank = Number(incomeOf(row, "rank_income"));
            const total = Number(valueOf(row, "total", "gross_income", "total_income") ?? referral + level + rank);
            const adminFee = Number(valueOf(row, "admin_fee", "admin_fee_amount") || 0);
            const netPayable = Number(valueOf(row, "net_payable", "netPayable") ?? total - adminFee);
            return <tr key={row.id || `${userIdOf(row)}-${index}`}><td>{index + 1}</td><td>{userIdOf(row)}</td><td>{userNameOf(row)}</td><td>{money(referral)}</td><td>{money(level)}</td><td>{rankOf(row)}</td><td>{money(total)}</td><td>{money(adminFee)}</td><td>{money(netPayable)}</td><td>{statusOf(row)}</td><td>{paidDateOf(row)}</td></tr>;
          })}
        </tbody></table></div></div>
      </div>
    </AdminLayout>
  );
}

export default PayoutReport;
