import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiChevronRight,
  FiInfo,
  FiUsers,
} from "react-icons/fi";
import {
  GiLaurelsTrophy,
  GiMedal,
  GiAchievement,
  GiStarMedal,
  GiDiamondTrophy,
  GiCrown,
} from "react-icons/gi";
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

// Returns an array of short, chip-ready criteria strings instead of one
// run-on sentence, so the table (and modal subtitle) can render tags.
const getRankCriteriaTags = (rank) => {
  const tags = [];

  if (rank?.minimum_total_lots != null || rank?.minimum_lots != null || rank?.min_lots != null) {
    const minLots = rank?.minimum_total_lots ?? rank?.minimum_lots ?? rank?.min_lots;
    tags.push(`Team Lots ${formatNumber(minLots)}`);
  }

  if (rank?.required_lots != null || rank?.requiredLots != null) {
    tags.push(`Required Lots ${formatNumber(rank?.required_lots ?? rank?.requiredLots)}`);
  }

  if (rank?.criteria && typeof rank.criteria === "string") {
    rank.criteria.split(/,(?![^(]*\))/).forEach((part) => {
      const clean = part.trim();
      if (clean) tags.push(clean);
    });
  }

  if (rank?.criteria && typeof rank.criteria === "object") {
    Object.entries(rank.criteria).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        tags.push(`${key.replace(/_/g, " ")}: ${String(value)}`);
      }
    });
  }

  if (rank?.description && typeof rank.description === "string") {
    tags.push(rank.description);
  }

  return tags.length ? tags : ["No criteria provided"];
};

// One visual identity per rank tier — a distinct icon and a distinct warm
// color pair, so ranks read as genuinely different rather than the same
// gold pill six times over. Cycles automatically if there are more ranks
// than themes defined here.
const RANK_THEMES = [
  { icon: GiLaurelsTrophy, from: "#c98a4b", to: "#8a5a2b", ring: ["#e0a868", "#8a5a2b", "#c98a4b"], border: "#22c55e" }, // green
  { icon: GiMedal, from: "#e2a53d", to: "#a9691a", ring: ["#f0b95a", "#a9691a", "#e2a53d"], border: "#6366f1" }, // indigo
  { icon: GiAchievement, from: "#f0c34d", to: "#c99a1e", ring: ["#f5d061", "#c99a1e", "#f0c34d"], border: "#f97316" }, // orange
  { icon: GiStarMedal, from: "#e3ab97", to: "#b5651d", ring: ["#eec2ab", "#b5651d", "#e3ab97"], border: "#ec4899" }, // pink
  { icon: GiDiamondTrophy, from: "#e6b325", to: "#8a3b1b", ring: ["#f2c94c", "#8a3b1b", "#e6b325"], border: "#06b6d4" }, // cyan
  { icon: GiCrown, from: "#fff3d0", to: "#d4af37", ring: ["#fff6d8", "#d4af37", "#f7da7d"], border: "#a855f7" }, // purple
];

const getRankTheme = (index) => RANK_THEMES[index % RANK_THEMES.length];

const getInitials = (first, last) => {
  const a = (first || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  const initials = `${a}${b}`.toUpperCase();
  return initials || "?";
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

  const selectedRankIndex = ranks.findIndex((rank) => getRankId(rank) === selectedRankId);
  const selectedRank = selectedRankIndex >= 0 ? ranks[selectedRankIndex] : null;
  const selectedTheme = selectedRankIndex >= 0 ? getRankTheme(selectedRankIndex) : null;

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
            <div className="user-rank-empty">No rank settings available.</div>
          </div>
        ) : (
          <div className="ewallet-table-card">
            <h2 className="section-title" style={{ marginBottom: "14px" }}>Ranks</h2>

            <div className="user-rank-hint">
              <FiInfo aria-hidden="true" />
              <span>Click the arrow on any rank card to see its current holders.</span>
            </div>

            <div className="user-ranks-grid">
              {ranks.map((rank, index) => {
                const rankId = getRankId(rank);
                const name = getRankName(rank);
                const theme = getRankTheme(index);
                const RankIcon = theme.icon;
                const criteriaTags = getRankCriteriaTags(rank);
                const holderCount =
                  rank?.holders_count ?? rank?.holder_count ?? rank?.holders ?? null;

                return (
                  <div
                    key={rankId ?? `${name}-${rank?.rank_no ?? "rank"}`}
                    className="user-rank-card"
                    style={{
                      "--rank-from": theme.from,
                      "--rank-to": theme.to,
                      "--rank-border": theme.border,
                      animationDelay: `${index * 90}ms`,
                    }}
                    onClick={() => setSelectedRankId(rankId)}
                  >
                    <div className="user-rank-card-header">
                      <span className="user-rank-card-icon">
                        <RankIcon aria-hidden="true" />
                      </span>
                      <div className="user-rank-card-title">
                        <span className="user-rank-card-no">
                          Rank {rank?.rank_no ?? index + 1}
                        </span>
                        <span className="user-rank-card-name">{name}</span>
                      </div>
                    </div>

                    <div className="user-rank-criteria-tags user-rank-criteria-tags--modal user-rank-criteria-tags--card">
                      {criteriaTags.map((tag, tagIndex) => (
                        <span
                          className="user-rank-criteria-tag"
                          key={`${rankId}-${tagIndex}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="user-rank-card-footer">
                      <span className="user-rank-card-holders">
                        <FiUsers aria-hidden="true" />
                        {holderCount != null
                          ? `${formatNumber(holderCount)} holder${holderCount === 1 ? "" : "s"}`
                          : "View holders"}
                      </span>
                      <button
                        type="button"
                        className="user-rank-card-arrow-btn"
                        aria-label={`View ${name} holders`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRankId(rankId);
                        }}
                      >
                        <FiChevronRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedRank && selectedTheme && createPortal(
          <div className="user-rank-modal-backdrop" onClick={() => setSelectedRankId(null)}>
            <div className="user-rank-modal" onClick={(event) => event.stopPropagation()}>
              <div className="user-rank-modal-header">
                <div className="user-rank-modal-heading-main">
                  <span
                    className="user-rank-modal-icon"
                    style={{ "--rank-from": selectedTheme.from, "--rank-to": selectedTheme.to }}
                  >
                    <selectedTheme.icon aria-hidden="true" />
                  </span>
                  <div>
                    <h2>{getRankName(selectedRank)} Holders</h2>
                    <div className="user-rank-criteria-tags user-rank-criteria-tags--modal">
                      {getRankCriteriaTags(selectedRank).map((tag, tagIndex) => (
                        <span className="user-rank-criteria-tag" key={`modal-${tagIndex}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="user-rank-modal-heading-actions">
                  <strong>{holders.length} holder{holders.length === 1 ? "" : "s"}</strong>
                  <button type="button" onClick={() => setSelectedRankId(null)} aria-label="Close holders"><FiX /></button>
                </div>
              </div>

              <div className="user-rank-grid-wrap">
                {holdersLoading ? (
                  <div className="user-rank-empty user-rank-empty-grid">Loading rank holders...</div>
                ) : holders.length === 0 ? (
                  <div className="user-rank-empty user-rank-empty-grid">No users currently hold this rank.</div>
                ) : (
                  <div className="user-holders-grid">
                    {holders.map((holder, index) => {
                      const name = `${holder?.first_name || ""} ${holder?.last_name || ""}`.trim() || "-";
                      const [ringA, ringB, ringC] = selectedTheme.ring;
                      return (
                        <div
                          key={holder?.id ?? holder?.user_id ?? index}
                          className="user-holder-card"
                          style={{
                            animationDelay: `${Math.min(index, 12) * 45}ms`,
                            "--rank-from": selectedTheme.from,
                            "--rank-to": selectedTheme.to,
                          }}
                        >
                          <span className="user-holder-rank-badge" aria-hidden="true">
                            <selectedTheme.icon />
                          </span>
                          <div
                            className="user-holder-avatar-wrap"
                            style={{ "--ring-a": ringA, "--ring-b": ringB, "--ring-c": ringC }}
                          >
                            {holder?.image ? (
                              <img
                                className="user-holder-avatar-img"
                                src={holder.image}
                                alt={`${holder.user_id || "User"} profile`}
                              />
                            ) : (
                              <div
                                className="user-holder-avatar-initials"
                                style={{ background: `linear-gradient(135deg, ${selectedTheme.from}, ${selectedTheme.to})` }}
                              >
                                {getInitials(holder?.first_name, holder?.last_name)}
                              </div>
                            )}
                          </div>
                          <div className="user-holder-card-body">
                            <span className="user-holder-name">{name}</span>
                            <span className="user-holder-userid">{holder?.user_id || "-"}</span>
                            <span className="user-holder-date">{formatAchievedDate(holder?.achieved_at)}</span>
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
    </UserLayout>
  );
}

export default RanksPage;