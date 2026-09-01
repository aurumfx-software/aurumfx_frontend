import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiAward, FiChevronRight, FiInfo } from "react-icons/fi";
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

const getInitials = (first, last) => {
  const a = (first || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  const initials = `${a}${b}`.toUpperCase();
  return initials || "?";
};

// ---------------------------------------------------------------------------
// Premium per-rank color themes. Each theme is self-contained (accent RGB,
// gradient hex pair, avatar ring gradient) so a rank's whole card look —
// border glow, shimmer sweep, badge, avatar ring — flows from one palette.
//
// Theming is STABLE PER RANK ID (hashed), not by array position. This means:
//   - A rank always renders the same color, no matter what order the API
//     returns ranks in, and no matter how many ranks exist before/after it.
//   - Adding a brand-new rank anywhere (start, middle, end) never reshuffles
//     colors on existing ranks — each keeps its own theme permanently.
//   - Two ranks *can* land on the same theme if their ids collide modulo the
//     palette size (harmless — they just share a look). If you ever need
//     guaranteed-unique colors per rank, store an explicit theme key in the
//     rank record on the backend instead of hashing the id.
// ---------------------------------------------------------------------------
const RANK_THEMES = [
  {
    name: "gold",
    accent: "245,208,97",
    bgFrom: "26,20,8",
    bgTo: "9,7,3",
    hexA: "#f5d061",
    hexB: "#d4af37",
    ring: "conic-gradient(from 180deg, #f5d061, #fff6d8, #d4af37, #f7da7d, #f5d061)",
  },
  {
    name: "platinum",
    accent: "224,229,238",
    bgFrom: "22,25,31",
    bgTo: "8,9,12",
    hexA: "#e5e9f0",
    hexB: "#9aa7ba",
    ring: "conic-gradient(from 180deg, #e5e9f0, #ffffff, #9aa7ba, #c7d0dc, #e5e9f0)",
  },
  {
    name: "rose",
    accent: "240,168,160",
    bgFrom: "28,14,14",
    bgTo: "10,4,4",
    hexA: "#f0a8a0",
    hexB: "#c96a5f",
    ring: "conic-gradient(from 180deg, #f0a8a0, #ffe3df, #c96a5f, #e8968a, #f0a8a0)",
  },
  {
    name: "emerald",
    accent: "111,214,168",
    bgFrom: "8,22,16",
    bgTo: "3,9,6",
    hexA: "#6fd6a8",
    hexB: "#2e9e6f",
    ring: "conic-gradient(from 180deg, #6fd6a8, #d7fbe8, #2e9e6f, #4fc496, #6fd6a8)",
  },
  {
    name: "sapphire",
    accent: "127,178,240",
    bgFrom: "8,16,28",
    bgTo: "3,6,10",
    hexA: "#7fb2f0",
    hexB: "#3a72c4",
    ring: "conic-gradient(from 180deg, #7fb2f0, #dcecff, #3a72c4, #5f96e0, #7fb2f0)",
  },
  {
    name: "amethyst",
    accent: "199,157,240",
    bgFrom: "18,10,28",
    bgTo: "7,3,10",
    hexA: "#c79df0",
    hexB: "#8a4fc4",
    ring: "conic-gradient(from 180deg, #c79df0, #f2e3ff, #8a4fc4, #ad72d8, #c79df0)",
  },
  {
    name: "bronze",
    accent: "217,154,99",
    bgFrom: "24,15,7",
    bgTo: "9,5,2",
    hexA: "#d99a63",
    hexB: "#a85f2e",
    ring: "conic-gradient(from 180deg, #d99a63, #ffe3c2, #a85f2e, #c17a44, #d99a63)",
  },
];

const getRankTheme = (rank) => {
  const rawId = getRankId(rank) ?? getRankName(rank) ?? "0";
  // Simple deterministic string hash so it works whether id is numeric or a string.
  let hash = 0;
  const str = String(rawId);
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % RANK_THEMES.length;
  return RANK_THEMES[idx];
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
  const selectedTheme = selectedRank ? getRankTheme(selectedRank) : null;

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
          <div className="ewallet-table-card">
            <h2 className="section-title" style={{ marginBottom: "14px" }}>Ranks</h2>

            <div className="user-rank-hint">
              <FiInfo aria-hidden="true" />
              <span>Tap any rank button below to open its list of current holders.</span>
            </div>

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
                    const theme = getRankTheme(rank);

                    return (
                      <tr key={rankId ?? `${name}-${rank?.rank_no ?? "rank"}`}>
                        <td>{rank?.rank_no ?? "-"}</td>
                        <td>
                          <button
                            type="button"
                            className="user-rank-pill-btn"
                            style={{
                              "--rank-accent": theme.accent,
                              background: `linear-gradient(135deg, rgba(${theme.accent}, 0.14), rgba(${theme.accent}, 0.05))`,
                              borderColor: `rgba(${theme.accent}, 0.35)`,
                            }}
                            onClick={() => setSelectedRankId(rankId)}
                          >
                            <span
                              className="user-rank-pill-icon"
                              style={{ background: `linear-gradient(135deg, ${theme.hexA}, ${theme.hexB})` }}
                            >
                              <FiAward aria-hidden="true" />
                            </span>
                            <span className="user-rank-pill-label" style={{ color: theme.hexB }}>
                              {name}
                            </span>
                            <FiChevronRight
                              className="user-rank-pill-arrow"
                              style={{ color: theme.hexB }}
                              aria-hidden="true"
                            />
                          </button>
                        </td>
                        <td>{getRankCriteria(rank)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedRank && selectedTheme && createPortal(
          <div className="user-rank-modal-backdrop" onClick={() => setSelectedRankId(null)}>
            <div
              className="user-rank-modal"
              onClick={(event) => event.stopPropagation()}
              style={{
                "--rank-accent": selectedTheme.accent,
                "--rank-bg-from": selectedTheme.bgFrom,
                "--rank-bg-to": selectedTheme.bgTo,
                "--rank-ring": selectedTheme.ring,
              }}
            >
              <div
                className="user-rank-modal-header"
                style={{
                  background: `linear-gradient(135deg, rgba(${selectedTheme.accent}, 0.10), rgba(${selectedTheme.accent}, 0.02))`,
                }}
              >
                <div>
                  <h2>{getRankName(selectedRank)} Holders</h2>
                  <p>{getRankCriteria(selectedRank)}</p>
                </div>
                <div className="user-rank-modal-heading-actions">
                  <strong style={{ color: selectedTheme.hexA }}>
                    {holders.length} holder{holders.length === 1 ? "" : "s"}
                  </strong>
                  <button type="button" onClick={() => setSelectedRankId(null)} aria-label="Close holders">
                    <FiX />
                  </button>
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
                      return (
                        <div
                          key={holder?.id ?? holder?.user_id ?? index}
                          className="user-holder-card"
                          style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                        >
                          <div className="user-holder-avatar-wrap">
                            {holder?.image ? (
                              <img
                                className="user-holder-avatar-img"
                                src={holder.image}
                                alt={`${holder.user_id || "User"} profile`}
                              />
                            ) : (
                              <div
                                className="user-holder-avatar-initials"
                                style={{ background: `linear-gradient(135deg, ${selectedTheme.hexA}, ${selectedTheme.hexB})` }}
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