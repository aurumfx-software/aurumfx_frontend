import { useState, useEffect } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getLevelCommissionSummaryApi,
  getTopEarnersApi,
  getLevelCommissionHistoryApi,
} from "../../../api/level-commission";
import "./LevelCommissionReport.css";

function LevelCommissionReport() {
  const [summary, setSummary] = useState(null);
  const [topEarners, setTopEarners] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [sRes, tRes, hRes] = await Promise.all([
        getLevelCommissionSummaryApi(),
        getTopEarnersApi(),
        getLevelCommissionHistoryApi(0, 50),
      ]);

      if (sRes.success) setSummary(sRes.data);
      if (tRes.success) setTopEarners(tRes.data || []);
      if (hRes.success) setHistory(hRes.data || []);

      if (!sRes.success && !tRes.success && !hRes.success) {
        setError("Unable to load level commission data.");
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mapRow = (row) => {
    return {
      date: row.date || row.created_at || row.timestamp || row.created || "-",
      user: row.user?.name || row.user_name || row.account || row.username || row.user_id || "-",
      level: row.level || row.level_number || row.level_no || "-",
      amount: row.amount || row.commission_amount || row.level_income || row.total || "-",
      note: row.reason || row.type || row.source || "-",
    };
  };

  return (
    <AdminLayout>
      <div className="level-commission-report-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Level Commission Report</h1>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <span className="separator">•</span>
              <span className="current">Level Commission</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="card-label">Total Levels</div>
                <div className="card-value">{summary?.levels_count ?? "-"}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">Total Commission</div>
                <div className="card-value">{summary?.total_commission ?? "-"}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">Today's Income</div>
                <div className="card-value">{summary?.today_income ?? "-"}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">Monthly Income</div>
                <div className="card-value">{summary?.monthly_income ?? "-"}</div>
              </div>
            </div>

            <div className="top-earners">
              <h3>Top Earners</h3>
              <ul>
                {topEarners.length === 0 && <li>No top earners</li>}
                {topEarners.map((e, idx) => (
                  <li key={idx}>
                    <strong>{e.name || e.user || e.user_name || e.account || "-"}</strong>
                    <span className="earned">{e.amount ?? e.total ?? e.income ?? "-"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="history-table-card">
              <h3>Recent Level Commission History</h3>
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Level</th>
                      <th>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-cell">No records found</td>
                      </tr>
                    ) : (
                      history.map((r, i) => {
                        const m = mapRow(r);
                        return (
                          <tr key={i}>
                            <td>{m.date}</td>
                            <td>{m.user}</td>
                            <td>{m.level}</td>
                            <td>{m.amount}</td>
                            <td>{m.note}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default LevelCommissionReport;
