import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/Admin/AdminLayout";
import "./AdminDashboard.css";

const moduleTitles = {
  "/admin/financial/e-wallet": { title: "E-Wallet", category: "Financial" },
  "/admin/financial/ewallet": { title: "E-Wallet", category: "Financial" },
  "/admin/financial/deposit-wallet": { title: "Deposit Wallet", category: "Financial" },
  "/admin/financial/deposit": { title: "Deposit Wallet", category: "Financial" },
  "/admin/financial/fund-credits": { title: "Fund Credit", category: "Financial" },
  "/admin/financial/fund-credit": { title: "Fund Credit", category: "Financial" },
  "/admin/financial/credit": { title: "Fund Credit", category: "Financial" },
  "/admin/financial/transfer": { title: "Fund Transfer", category: "Financial" },
  "/admin/financial/payout/request": { title: "Payout Management", category: "Financial" },
  "/admin/financial/payout/history": { title: "Payout History", category: "Financial" },
  "/admin/financial/payout": { title: "Payout Management", category: "Financial" },
  "/admin/financial/investments/request": { title: "Investments Overview", category: "Financial" },
  "/admin/financial/investments/history": { title: "Investment History", category: "Financial" },
  "/admin/financial/investments": { title: "Investments Overview", category: "Financial" },
  "/admin/communication/faqs": { title: "FAQ's", category: "Communication" },
  "/admin/communication/faq": { title: "FAQ's", category: "Communication" },
  "/admin/communication/mails/inbox": { title: "Emails", category: "Communication" },
  "/admin/communication/mails/sent": { title: "Emails", category: "Communication" },
  "/admin/communication/emails": { title: "Emails", category: "Communication" },
  "/admin/communication/help-center": { title: "Help Center", category: "Communication" },
  "/admin/communication/articles": { title: "Articles", category: "Communication" },
  "/admin/communication/article": { title: "Articles", category: "Communication" },
  "/admin/tools/documents": { title: "Documents Library", category: "Tools" },
  "/admin/tools/videos": { title: "Video Tutorials", category: "Tools" },
  "/admin/tools/faqs": { title: "FAQ Management", category: "Tools" },
  "/admin/members/list": { title: "Members List", category: "Members Management" },
  "/admin/members/add": { title: "Add New Member", category: "Members Management" },
  "/admin/members/kyc": { title: "KYC Verification", category: "Members Management" },
  "/admin/achievers/rank": { title: "Rank Achievers", category: "Achievers List" },
  "/admin/achievers/criteria": { title: "Criteria Achievers", category: "Achievers List" },
  "/admin/settings/general": { title: "General Settings", category: "Settings" },
  "/admin/settings/payment": { title: "Payment Gateways", category: "Settings" },
  "/admin/settings/commissions": { title: "Commission Structure", category: "Settings" },
  "/admin/reports/sales": { title: "Sales Reports", category: "Reports" },
  "/admin/reports/payout": { title: "Payout Reports", category: "Reports" },
  "/admin/reports/tax": { title: "Tax & Analytics", category: "Reports" },
};

function AdminModulePage() {
  const location = useLocation();
  const currentConfig = moduleTitles[location.pathname] || {
    title: "Admin Management",
    category: "Dashboard",
  };

  const rows = [
    { id: 1, userId: "FX001", name: "PRAVEEN", desc: currentConfig.title + " transaction record", date: "03 Aug 2026", status: "Completed" },
    { id: 2, userId: "FX002", name: "AKASH", desc: currentConfig.title + " update request", date: "02 Aug 2026", status: "Pending" },
    { id: 3, userId: "FX011", name: "SAVITHAMOL", desc: currentConfig.title + " active entry", date: "01 Aug 2026", status: "Completed" },
    { id: 4, userId: "FX024", name: "ANJU", desc: currentConfig.title + " verification log", date: "31 Jul 2026", status: "Approved" },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-page-header" style={{ marginBottom: "20px" }}>
          <h1 className="admin-page-title" style={{ fontSize: "24px", fontWeight: "800", color: "#1f2937" }}>
            {currentConfig.title}
          </h1>
          <div className="admin-breadcrumb" style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#9ca3af" }}>
            <span>Dashboard</span>
            <span>•</span>
            <span>{currentConfig.category}</span>
            <span>•</span>
            <span style={{ color: "#6b7280", fontWeight: "600" }}>{currentConfig.title}</span>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
              {currentConfig.title} Records
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: "8px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  outline: "none",
                  width: "200px",
                }}
              />
              <button
                type="button"
                style={{
                  background: "#ffc52d",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  color: "#1e293b",
                  cursor: "pointer",
                }}
              >
                Filter
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>#</th>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>User ID</th>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Name</th>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Description</th>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Date</th>
                  <th style={{ padding: "12px 14px", fontSize: "13px", color: "#64748b" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px" }}>{row.id}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>
                      {row.userId}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px" }}>{row.name}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px", color: "#64748b" }}>{row.desc}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px", color: "#64748b" }}>{row.date}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13.5px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "11.5px",
                          fontWeight: "700",
                          background: row.status === "Pending" ? "#fef3c7" : "#d1fae5",
                          color: row.status === "Pending" ? "#d97706" : "#059669",
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
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

export default AdminModulePage;
