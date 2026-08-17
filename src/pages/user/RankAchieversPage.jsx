import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../components/User/UserLayout";
import { getAllUserRankSettingsApi, getRankHoldersApi } from "../../api/user-rank";

function RankAchieversPage() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRankId, setSelectedRankId] = useState(null);
  const [holders, setHolders] = useState([]);
  const [holdersLoading, setHoldersLoading] = useState(false);

  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);
  const userName = useMemo(() => localStorage.getItem("userName") || "User", []);

  useEffect(() => {
    const loadRanks = async () => {
      setLoading(true);
      setError("");

      const res = await getAllUserRankSettingsApi();

      if (res.success) {
        const rankList = Array.isArray(res.data) ? res.data : [];
        setRanks(rankList);
        if (rankList.length > 0) {
          setSelectedRankId(rankList[0].id ?? null);
        }
      } else {
        setError(res.error || "Unable to load rank settings.");
      }

      setLoading(false);
    };

    loadRanks();
  }, []);

  useEffect(() => {
    if (!selectedRankId) {
      setHolders([]);
      return;
    }

    const loadHolders = async () => {
      setHoldersLoading(true);
      const res = await getRankHoldersApi(selectedRankId);
      if (res.success) {
        setHolders(Array.isArray(res.data) ? res.data : []);
      } else {
        setHolders([]);
      }
      setHoldersLoading(false);
    };

    loadHolders();
  }, [selectedRankId]);

  const selectedRank = ranks.find((item) => item.id === selectedRankId) || ranks[0] || null;

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page" style={{ gap: "18px" }}>
        <div className="page-header">
          <h1 className="page-title">Rank Achievers</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Achiever's List</span>
          </div>
        </div>

        {loading ? (
          <div className="ewallet-table-card">
            <div className="empty-cell">Loading rank settings...</div>
          </div>
        ) : error ? (
          <div className="ewallet-table-card">
            <div className="empty-cell" style={{ color: "#fca5a5" }}>{error}</div>
          </div>
        ) : (
          <>
            <div className="ewallet-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {ranks.map((rank) => (
                <button
                  key={rank.id}
                  type="button"
                  onClick={() => setSelectedRankId(rank.id)}
                  style={{
                    textAlign: "left",
                    background: selectedRankId === rank.id ? "#1f2937" : "#111111",
                    border: selectedRankId === rank.id ? "1px solid rgba(245, 208, 97, 0.45)" : "1px solid rgba(212, 175, 55, 0.16)",
                    borderRadius: "14px",
                    padding: "18px 18px",
                    color: "#f8fafc",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Rank {rank.rank_no ?? rank.id}
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "8px" }}>{rank.rank_name || "Unnamed Rank"}</div>
                  <div style={{ marginTop: "10px", fontSize: "13px", color: "#cbd5e1" }}>
                    Min lots: {Number(rank.minimum_total_lots || 0)}
                  </div>
                </button>
              ))}
            </div>

            <div className="ewallet-table-card">
              <h2 className="section-title">
                {selectedRank ? `${selectedRank.rank_name || "Selected Rank"} Holders` : "Rank Holders"}
              </h2>

              {holdersLoading ? (
                <div className="empty-cell">Loading holders...</div>
              ) : holders.length === 0 ? (
                <div className="empty-cell">No holders found for this rank.</div>
              ) : (
                <div className="table-responsive">
                  <table className="ewallet-table ewallet-table--clean">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Rank ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holders.map((holder, index) => (
                        <tr key={`${holder.user_id || holder.id || "holder"}-${index}`}>
                          <td>{holder.user_id || "-"}</td>
                          <td>{holder.first_name || "-"}</td>
                          <td>{holder.last_name || "-"}</td>
                          <td>{holder.rank_id ?? selectedRankId ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}

export default RankAchieversPage;
