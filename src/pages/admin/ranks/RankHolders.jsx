import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiAward, FiChevronRight, FiInfo } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllRanksApi, getRankHoldersApi } from "../../../api/admin-ranks";
import "./RankHolders.css";
import "../../../styles/AdminGenealogyHeader.css";

const formatAchievedDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// Rotates a small set of on-brand gradient pairs so initials avatars
// feel varied without breaking the gold/charcoal palette.
const AVATAR_THEMES = [
  ["#f5d061", "#c9992f"],
  ["#e8b04b", "#a67c1f"],
  ["#f7da7d", "#d4af37"],
  ["#eec766", "#b8860b"],
];

const getInitials = (first, last) => {
  const a = (first || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  const initials = `${a}${b}`.toUpperCase();
  return initials || "?";
};

function RankHolders() {
  const [ranks, setRanks] = useState([]);
  const [selectedRankId, setSelectedRankId] = useState("");
  const [holders, setHolders] = useState([]);
  const [loadingRanks, setLoadingRanks] = useState(true);
  const [loadingHolders, setLoadingHolders] = useState(false);
  const [error, setError] = useState("");
  const selectedRank = ranks.find((rank) => String(rank.id) === String(selectedRankId));

  useEffect(() => {
    async function loadRanks() {
      const result = await getAllRanksApi();
      if (result.success) {
        setRanks(result.data);
      } else setError(result.error || "Unable to load ranks");
      setLoadingRanks(false);
    }
    loadRanks();
  }, []);

  useEffect(() => {
    if (!selectedRankId) {
      setHolders([]);
      return;
    }
    async function loadHolders() {
      setLoadingHolders(true);
      setError("");
      const result = await getRankHoldersApi(selectedRankId);
      if (result.success) setHolders(result.data);
      else {
        setHolders([]);
        setError(result.error || "Unable to load rank holders");
      }
      setLoadingHolders(false);
    }
    loadHolders();
  }, [selectedRankId]);

  return (
    <AdminLayout>
      <div className="rank-holders-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Rank Management</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Rank List</h1>
              <p className="agen-page-subtitle">Review members assigned to each configured rank</p>
            </div>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Rank List</span></div>
        </div>

        <div className="rank-holders-card">
          <div className="rank-holders-card-heading">
            <div>
              <h2>All Ranks</h2>
              <p>Select a rank name to view its current holders.</p>
            </div>
          </div>

          <div className="rank-holders-hint">
            <FiInfo aria-hidden="true" />
            <span>Tap any rank button below to open its list of current holders.</span>
          </div>

          {error && !selectedRankId && <div className="rank-holders-error">{error}</div>}
          <div className="rank-holders-table-wrap">
            <table className="rank-holders-table rank-list-table">
              <thead><tr><th>No</th><th>Rank Name</th><th>Criteria</th></tr></thead>
              <tbody>
                {loadingRanks ? (
                  <tr><td colSpan="3" className="rank-holders-empty">Loading ranks...</td></tr>
                ) : ranks.length === 0 ? (
                  <tr><td colSpan="3" className="rank-holders-empty">No ranks configured.</td></tr>
                ) : (
                  ranks.map((rank, index) => (
                    <tr key={rank.id}>
                      <td>{index + 1}</td>
                      <td>
                        <button
                          type="button"
                          className="rank-pill-btn"
                          onClick={() => setSelectedRankId(String(rank.id))}
                        >
                          <span className="rank-pill-icon"><FiAward aria-hidden="true" /></span>
                          <span className="rank-pill-label">{rank.rank_name || "-"}</span>
                          <FiChevronRight className="rank-pill-arrow" aria-hidden="true" />
                        </button>
                      </td>
                      <td>{rank.criteria || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRank && createPortal(
          <div className="rank-holders-modal-backdrop" onClick={() => setSelectedRankId("")}>
            <div className="rank-holders-modal" onClick={(event) => event.stopPropagation()}>
              <div className="rank-holders-card-heading">
                <div><h2>{selectedRank.rank_name} Holders</h2><p>{selectedRank.criteria || "No criteria provided"}</p></div>
                <div className="rank-holders-modal-heading-actions"><b className="rank-holder-count">{holders.length} holder{holders.length === 1 ? "" : "s"}</b><button type="button" className="rank-holders-close" onClick={() => setSelectedRankId("")} aria-label="Close holders"><FiX /></button></div>
              </div>
              {error && <div className="rank-holders-error">{error}</div>}

              <div className="rank-holders-grid-wrap">
                {loadingHolders ? (
                  <div className="rank-holders-empty rank-holders-empty-grid">Loading rank holders...</div>
                ) : holders.length === 0 ? (
                  <div className="rank-holders-empty rank-holders-empty-grid">No users currently hold this rank.</div>
                ) : (
                  <div className="holders-grid">
                    {holders.map((holder, index) => {
                      const name = `${holder.first_name || ""} ${holder.last_name || ""}`.trim() || "-";
                      const [from, to] = AVATAR_THEMES[index % AVATAR_THEMES.length];
                      return (
                        <div
                          key={holder.id ?? holder.user_id}
                          className="holder-card"
                          style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                        >
                          <div className="holder-avatar-wrap">
                            {holder.image ? (
                              <img
                                className="holder-avatar-img"
                                src={holder.image}
                                alt={`${holder.user_id || "User"} profile`}
                              />
                            ) : (
                              <div
                                className="holder-avatar-initials"
                                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                              >
                                {getInitials(holder.first_name, holder.last_name)}
                              </div>
                            )}
                          </div>
                          <div className="holder-card-body">
                            <span className="holder-name">{name}</span>
                            <span className="holder-userid">{holder.user_id || "-"}</span>
                            <span className="holder-date">{formatAchievedDate(holder.achieved_at)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
      </div>
    </AdminLayout>
  );
}

export default RankHolders;