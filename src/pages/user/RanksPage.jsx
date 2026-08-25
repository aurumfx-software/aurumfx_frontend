import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import { getAllUserRankSettingsApi, getRankHoldersApi } from "../../api/user-rank";
import "./financial/EWallet.css";
import "./RanksPage.css";

const formatNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : "0";
};

const getRankId = (rank) => rank?.id ?? rank?.rank_id ?? null;

const getRankName = (rank) =>
  rank?.rank_name || rank?.name || rank?.title || `Rank ${rank?.rank_no ?? rank?.id ?? ""}`;

const formatAchievedDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

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

  const selectedRank = ranks.find((rank) => getRankId(rank) === selectedRankId) ?? null;

  useEffect(() => {
    const loadRanks = async () => {
      setLoading(true);
      setError("");

      const res = await getAllUserRankSettingsApi();
      if (res.success) {
        const rankList = Array.isArray(res.data) ? res.data : [];
        setRanks(rankList);

        setSelectedRankId(null);
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
                  const name = getRankName(rank);

                  return (
                    <tr key={rankId ?? `${name}-${rank?.rank_no ?? "rank"}`}>
                      <td>{rank?.rank_no ?? "-"}</td>
                      <td><button type="button" className="user-rank-name-button" onClick={() => setSelectedRankId(rankId)}>{name}</button></td>
                      <td>{getRankCriteria(rank)}</td>
                    </tr>
                  );
                })}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

        {selectedRank && createPortal(
          <div className="user-rank-modal-backdrop" onClick={() => setSelectedRankId(null)}>
            <div className="user-rank-modal" onClick={(event) => event.stopPropagation()}>
              <div className="user-rank-modal-header">
                <div>
                  <h2>{getRankName(selectedRank)} Holders</h2>
                  <p>{getRankCriteria(selectedRank)}</p>
                </div>
                <div className="user-rank-modal-heading-actions">
                  <strong>{holders.length} holder{holders.length === 1 ? "" : "s"}</strong>
                  <button type="button" onClick={() => setSelectedRankId(null)} aria-label="Close holders"><FiX /></button>
                </div>
              </div>
              <div className="user-rank-table-wrap">
                <table className="user-rank-table">
                  <thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Date</th><th>Image</th></tr></thead>
                  <tbody>
                    {holdersLoading ? <tr><td colSpan="5" className="user-rank-empty">Loading rank holders...</td></tr> : holders.length === 0 ? <tr><td colSpan="5" className="user-rank-empty">No users currently hold this rank.</td></tr> : holders.map((holder, index) => <tr key={holder?.id ?? holder?.user_id ?? index}><td>{index + 1}</td><td className="user-rank-holder-id">{holder?.user_id || "-"}</td><td>{`${holder?.first_name || ""} ${holder?.last_name || ""}`.trim() || "-"}</td><td>{formatAchievedDate(holder?.achieved_at)}</td><td>{holder?.image ? <img src={holder.image} alt={`${holder.user_id || "User"} profile`} /> : "-"}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </div>
    </UserLayout>
  );
}

export default RanksPage;
