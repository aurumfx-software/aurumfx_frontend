import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../components/User/UserLayout";
import { getAllUserRankSettingsApi, getRankHoldersApi } from "../../api/user-rank";
import "./financial/EWallet.css";

const formatNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : "0";
};

const getRankId = (rank) => rank?.id ?? rank?.rank_id ?? null;

const getRankName = (rank) =>
  rank?.rank_name || rank?.name || rank?.title || `Rank ${rank?.rank_no ?? rank?.id ?? ""}`;

const getRankCriteria = (rank) => {
  const criteriaList = [];

  if (rank?.criteria && typeof rank.criteria === "string") {
    criteriaList.push(rank.criteria);
  }

  if (rank?.description && typeof rank.description === "string") {
    criteriaList.push(rank.description);
  }

  if (rank?.minimum_total_lots != null || rank?.minimum_lots != null || rank?.min_lots != null) {
    const minLots = rank?.minimum_total_lots ?? rank?.minimum_lots ?? rank?.min_lots;
    criteriaList.push(`Minimum total lots: ${formatNumber(minLots)}`);
  }

  if (rank?.required_lots != null || rank?.requiredLots != null) {
    const requiredLots = rank?.required_lots ?? rank?.requiredLots;
    criteriaList.push(`Required lots: ${formatNumber(requiredLots)}`);
  }

  if (rank?.criteria && typeof rank.criteria === "object") {
    Object.entries(rank.criteria).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        criteriaList.push(`${key.replace(/_/g, " ")}: ${String(value)}`);
      }
    });
  }

  return criteriaList.length ? criteriaList.join(" • ") : "No criteria provided.";
};

function RanksPage() {
  const [ranks, setRanks] = useState([]);
  const [selectedRankId, setSelectedRankId] = useState(null);
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holdersLoading, setHoldersLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);
  const userName = useMemo(() => localStorage.getItem("userName") || "User", []);

  const selectedRank = ranks.find((rank) => getRankId(rank) === selectedRankId) ?? ranks[0] ?? null;

  useEffect(() => {
    const loadRanks = async () => {
      setLoading(true);
      setError("");

      const res = await getAllUserRankSettingsApi();
      if (res.success) {
        const rankList = Array.isArray(res.data) ? res.data : [];
        setRanks(rankList);

        if (rankList.length > 0) {
          setSelectedRankId(getRankId(rankList[0]));
        } else {
          setSelectedRankId(null);
        }
      } else {
        setError(res.error || "Unable to load ranks.");
        setSelectedRankId(null);
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

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page rank-page" style={{ gap: "18px" }}>
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Recognition &amp; Rewards
          </span>
          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">🏅</span>
            <div className="page-header-text">
              <h1 className="page-title">Rank List</h1>
              <p className="page-subtitle">Explore achievement levels and the members who reached them.</p>
            </div>
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
        ) : ranks.length === 0 ? (
          <div className="ewallet-table-card">
            <h2 className="section-title" style={{ marginBottom: "14px" }}>Ranks</h2>
            <div className="table-responsive">
              <table className="ewallet-table ewallet-table--clean">
                <thead>
                  <tr>
                    <th>Rank No</th>
                    <th>Name</th>
                    <th>Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" className="empty-cell">No rank settings</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="ewallet-table-card">
              <h2 className="section-title" style={{ marginBottom: "14px" }}>Ranks</h2>
              <div className="table-responsive">
                <table className="ewallet-table ewallet-table--clean">
                  <thead>
                    <tr>
                      <th>Rank No</th>
                      <th>Name</th>
                      <th>Criteria</th>
                    </tr>
                  </thead>
                  <tbody>
                {ranks.map((rank) => {
                  const rankId = getRankId(rank);
                  const isSelected = selectedRankId === rankId;
                  const name = getRankName(rank);

                  return (
                    <tr
                      key={rankId ?? `${name}-${rank?.rank_no ?? "rank"}`}
                      onClick={() => setSelectedRankId(rankId)}
                      className={isSelected ? "row--clickable row--selected" : "row--clickable"}
                    >
                      <td>{rank?.rank_no ?? "-"}</td>
                      <td>{name}</td>
                      <td>{getRankCriteria(rank)}</td>
                    </tr>
                  );
                })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ewallet-table-card">
              {selectedRank ? (
                <>
                  <h2 className="section-title" style={{ marginBottom: "10px" }}>{getRankName(selectedRank)}</h2>
                  <div style={{ marginBottom: "18px", color: "#cbd5e1", fontSize: "14px", lineHeight: 1.7 }}>
                    <strong style={{ color: "#f5d061" }}>Criteria:</strong> {getRankCriteria(selectedRank)}
                  </div>

                  {holdersLoading ? (
                    <div className="empty-cell">Loading rank holders...</div>
                  ) : holders.length === 0 ? (
                    <div className="empty-cell">No users hold this rank yet.</div>
                  ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {holders.map((holder) => (
                        <div
                          key={holder?.id ?? `${holder?.user_id ?? "user"}-${holder?.first_name ?? ""}-${holder?.last_name ?? ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(212, 175, 55, 0.18)",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            color: "#f8fafc",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "15px" }}>
                              {holder?.first_name || "User"} {holder?.last_name || ""}
                            </div>
                            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                              {holder?.user_id || holder?.id || "User ID unavailable"}
                            </div>
                          </div>
                          <span style={{ color: "#f5d061", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                            Rank Holder
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-cell">Select a rank to view holders.</div>
              )}
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}

export default RanksPage;
