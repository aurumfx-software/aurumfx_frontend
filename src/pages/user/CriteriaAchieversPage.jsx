import { useMemo } from "react";
import UserLayout from "../../components/User/UserLayout";

function CriteriaAchieversPage() {
  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);
  const userName = useMemo(() => localStorage.getItem("userName") || "User", []);

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page" style={{ gap: "18px" }}>
        <div className="page-header">
          <h1 className="page-title">Criteria Achievers</h1>
        </div>

        <div className="ewallet-table-card" style={{ minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "14px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "10px" }}>
              Status
            </div>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Coming Soon
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              Criteria achievers page is being prepared.
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default CriteriaAchieversPage;
