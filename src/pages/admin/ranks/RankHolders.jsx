import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiChevronRight, FiInfo, FiUsers } from "react-icons/fi";
import { GiLaurelsTrophy, GiMedal, GiAchievement, GiStarMedal, GiDiamondTrophy, GiCrown } from "react-icons/gi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllRanksApi, getRankHoldersApi } from "../../../api/admin-ranks";
import "./RankHolders.css";
import "../../../styles/AdminGenealogyHeader.css";

const formatAchievedDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const RANK_THEMES = [
  { icon: GiLaurelsTrophy, from: "#c98a4b", to: "#8a5a2b", ring: ["#e0a868", "#8a5a2b", "#c98a4b"], border: "#22c55e" },
  { icon: GiMedal, from: "#e2a53d", to: "#a9691a", ring: ["#f0b95a", "#a9691a", "#e2a53d"], border: "#6366f1" },
  { icon: GiAchievement, from: "#f0c34d", to: "#c99a1e", ring: ["#f5d061", "#c99a1e", "#f0c34d"], border: "#f97316" },
  { icon: GiStarMedal, from: "#e3ab97", to: "#b5651d", ring: ["#eec2ab", "#b5651d", "#e3ab97"], border: "#ec4899" },
  { icon: GiDiamondTrophy, from: "#e6b325", to: "#8a3b1b", ring: ["#f2c94c", "#8a3b1b", "#e6b325"], border: "#06b6d4" },
  { icon: GiCrown, from: "#fff3d0", to: "#d4af37", ring: ["#fff6d8", "#d4af37", "#f7da7d"], border: "#a855f7" },
];
const getRankTheme = (index) => RANK_THEMES[index % RANK_THEMES.length];
const getRankCriteriaTags = (rank) => {
  const tags = [];
  if (rank?.criteria && typeof rank.criteria === "string") rank.criteria.split(/,(?![^(]*\))/).forEach((part) => { const clean = part.trim(); if (clean) tags.push(clean); });
  if (rank?.criteria && typeof rank.criteria === "object") Object.entries(rank.criteria).forEach(([key, value]) => { if (value !== null && value !== undefined && value !== "") tags.push(`${key.replace(/_/g, " ")}: ${String(value)}`); });
  return tags.length ? tags : ["No criteria provided"];
};
const getInitials = (first, last) => `${(first || "").trim().charAt(0)}${(last || "").trim().charAt(0)}`.toUpperCase() || "?";

function RankHolders() {
  const [ranks, setRanks] = useState([]);
  const [selectedRankId, setSelectedRankId] = useState("");
  const [holders, setHolders] = useState([]);
  const [loadingRanks, setLoadingRanks] = useState(true);
  const [loadingHolders, setLoadingHolders] = useState(false);
  const [error, setError] = useState("");
  const selectedRankIndex = ranks.findIndex((rank) => String(rank.id) === String(selectedRankId));
  const selectedRank = selectedRankIndex >= 0 ? ranks[selectedRankIndex] : null;
  const selectedTheme = selectedRankIndex >= 0 ? getRankTheme(selectedRankIndex) : null;

  useEffect(() => {
    async function loadRanks() {
      const result = await getAllRanksApi();
      if (result.success) setRanks(result.data); else setError(result.error || "Unable to load ranks");
      setLoadingRanks(false);
    }
    loadRanks();
  }, []);

  useEffect(() => {
    if (!selectedRankId) { setHolders([]); return; }
    async function loadHolders() {
      setLoadingHolders(true); setError("");
      const result = await getRankHoldersApi(selectedRankId);
      if (result.success) setHolders(result.data); else { setHolders([]); setError(result.error || "Unable to load rank holders"); }
      setLoadingHolders(false);
    }
    loadHolders();
  }, [selectedRankId]);

  return (
    <AdminLayout>
      <div className="rank-holders-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Rank Management</span>
          <div className="agen-page-header-top"><div className="agen-page-header-text"><h1 className="agen-page-title">Rank List</h1><p className="agen-page-subtitle">Review members assigned to each configured rank</p></div></div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Rank List</span></div>
        </div>
        <div className="rank-holders-card">
          <div className="rank-holders-card-heading"><div><h2>All Ranks</h2><p>Explore each configured rank and the members who reached it.</p></div></div>
          <div className="rank-holders-hint"><FiInfo aria-hidden="true" /><span>Click the arrow on any rank card to see its current holders.</span></div>
          {error && !selectedRankId && <div className="rank-holders-error">{error}</div>}
          {loadingRanks ? <div className="rank-holders-empty">Loading ranks...</div> : ranks.length === 0 ? <div className="rank-holders-empty">No ranks configured.</div> : <div className="ranks-grid">{ranks.map((rank, index) => { const theme = getRankTheme(index); const RankIcon = theme.icon; return <div key={rank.id} className="rank-card" style={{ "--rank-from": theme.from, "--rank-to": theme.to, "--rank-border": theme.border, animationDelay: `${index * 90}ms` }} onClick={() => setSelectedRankId(String(rank.id))}><div className="rank-card-header"><span className="rank-card-icon"><RankIcon aria-hidden="true" /></span><div className="rank-card-title"><span className="rank-card-no">Rank {index + 1}</span><span className="rank-card-name">{rank.rank_name || "-"}</span></div></div><div className="rank-criteria-tags rank-criteria-tags--card">{getRankCriteriaTags(rank).map((tag, tagIndex) => <span className="rank-criteria-tag" key={`${rank.id}-${tagIndex}`}>{tag}</span>)}</div><div className="rank-card-footer"><span className="rank-card-holders"><FiUsers aria-hidden="true" />View holders</span><button type="button" className="rank-card-arrow-btn" aria-label={`View ${rank.rank_name} holders`} onClick={(event) => { event.stopPropagation(); setSelectedRankId(String(rank.id)); }}><FiChevronRight aria-hidden="true" /></button></div></div>; })}</div>}
        </div>
        {selectedRank && selectedTheme && createPortal(<div className="rank-holders-modal-backdrop" onClick={() => setSelectedRankId("")}><div className="rank-holders-modal" onClick={(event) => event.stopPropagation()}><div className="rank-holders-modal-header"><div className="rank-holders-modal-heading-main"><span className="rank-holders-modal-icon" style={{ "--rank-from": selectedTheme.from, "--rank-to": selectedTheme.to }}><selectedTheme.icon aria-hidden="true" /></span><div><h2>{selectedRank.rank_name} Holders</h2><div className="rank-criteria-tags rank-criteria-tags--modal">{getRankCriteriaTags(selectedRank).map((tag, tagIndex) => <span className="rank-criteria-tag" key={`modal-${tagIndex}`}>{tag}</span>)}</div></div></div><div className="rank-holders-modal-heading-actions"><strong className="rank-holder-count">{holders.length} holder{holders.length === 1 ? "" : "s"}</strong><button type="button" className="rank-holders-close" onClick={() => setSelectedRankId("")} aria-label="Close holders"><FiX /></button></div></div>{error && <div className="rank-holders-error">{error}</div>}<div className="rank-holders-grid-wrap">{loadingHolders ? <div className="rank-holders-empty rank-holders-empty-grid">Loading rank holders...</div> : holders.length === 0 ? <div className="rank-holders-empty rank-holders-empty-grid">No users currently hold this rank.</div> : <div className="holders-grid">{holders.map((holder, index) => { const name = `${holder.first_name || ""} ${holder.last_name || ""}`.trim() || "-"; const [ringA, ringB, ringC] = selectedTheme.ring; return <div key={holder.id ?? holder.user_id} className="holder-card" style={{ animationDelay: `${Math.min(index, 12) * 45}ms`, "--rank-from": selectedTheme.from, "--rank-to": selectedTheme.to }}><span className="holder-rank-badge" aria-hidden="true"><selectedTheme.icon /></span><div className="holder-avatar-wrap" style={{ "--ring-a": ringA, "--ring-b": ringB, "--ring-c": ringC }}>{holder.image ? <img className="holder-avatar-img" src={holder.image} alt={`${holder.user_id || "User"} profile`} /> : <div className="holder-avatar-initials" style={{ background: `linear-gradient(135deg, ${selectedTheme.from}, ${selectedTheme.to})` }}>{getInitials(holder.first_name, holder.last_name)}</div>}</div><div className="holder-card-body"><span className="holder-name">{name}</span><span className="holder-userid">{holder.user_id || "-"}</span><span className="holder-date">{formatAchievedDate(holder.achieved_at)}</span></div></div>; })}</div>}</div></div></div>, document.body)}
      </div>
    </AdminLayout>
  );
}

export default RankHolders;
