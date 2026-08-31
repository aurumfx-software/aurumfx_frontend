import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import {
  FiUsers,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import {
  getUserGenealogyApi,
  getUserGenealogyListApi,
  getUserEnrollersApi,
} from "../../api/genealogy";
import "./GenealogyPage.css";

/* ---------------------------------------------------------------------- */
/* Family view — org-chart avatar tree with hover tooltip                  */
/* ---------------------------------------------------------------------- */

const AVATAR_COLORS = [
  "#f97316", "#64748b", "#14b8a6", "#a855f7",
  "#22c55e", "#ef4444", "#3b82f6", "#eab308",
];

const formatJoinDate = (value) => {
  if (!value) return "-";
  const [datePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  return year && month && day ? `${day}-${month}-${year}` : datePart;
};

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Recursively looks for a node whose user_id/userId matches the query
 * (case-insensitive). Returns that node — with its own `children` intact —
 * so the tree can be re-rooted at the searched user, showing only them
 * and their downline instead of the whole network.
 */
function getNodeId(node) {
  if (!node) return "";
  return String(
    node.user_id ||
    node.userId ||
    node.id ||
    node.member_id ||
    node.referral_id ||
    node.username ||
    ""
  ).toLowerCase();
}

function findNodeById(node, query) {
  if (!node) return null;
  const queryId = String(query || "").toLowerCase();

  const candidates = Array.isArray(node) ? node : [node];
  for (const current of candidates) {
    if (!current) continue;

    if (getNodeId(current) === queryId) return current;

    const childGroups = [
      current.children,
      current.downline,
      current.descendants,
      current.members,
      current.child,
      current.data,
      current.user,
    ];

    for (const group of childGroups) {
      const children = Array.isArray(group) ? group : group ? [group] : [];
      for (const child of children) {
        const found = findNodeById(child, queryId);
        if (found) return found;
      }
    }
  }

  return null;
}

/** Filters a flat list (List / Enroller views) by user id or name. */
function filterByUser(list, query) {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    const id = String(item.user_id || item.userId || "").toLowerCase();
    const name = String(item.full_name || item.fullname || item.name || "").toLowerCase();
    return id.includes(query) || name.includes(query);
  });
}

function UserNodeTooltip({ anchorRect, node }) {
  const tipRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!anchorRect || !tipRef.current) {
      setPos(null);
      return;
    }

    const tipRect = tipRef.current.getBoundingClientRect();
    const GAP = 14;
    const VIEWPORT_MARGIN = 8;
    const showBelow = anchorRect.top < tipRect.height + GAP + VIEWPORT_MARGIN;

    let left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - tipRect.width - VIEWPORT_MARGIN));

    const top = showBelow
      ? anchorRect.bottom + GAP
      : anchorRect.top - GAP - tipRect.height;

    setPos({ left, top, showBelow });
  }, [anchorRect, node]);

  if (!anchorRect) return null;

  const investmentStatus = String(node.investment_status || "INACTIVE").toUpperCase();
  const style = pos
    ? { position: "fixed", left: pos.left, top: pos.top, visibility: "visible" }
    : { position: "fixed", left: anchorRect.left, top: anchorRect.top, visibility: "hidden" };

  const placementClass = pos ? (pos.showBelow ? "is-below" : "is-above") : "is-above";

  return createPortal(
    <div ref={tipRef} className={`fam-tooltip-portal ${placementClass}`} style={style}>
      <div className="fam-tooltip-row">
        <span>Full Name</span>
        <span>{node.name || node.full_name || node.fullname || "User"}</span>
      </div>
      <div className="fam-tooltip-row">
        <span>Date of Join</span>
        <span>{formatJoinDate(node.date_of_joining || node.date_of_join)}</span>
      </div>
      <div className="fam-tooltip-row">
        <span>Rank</span>
        <span>{node.rank || "-"}</span>
      </div>
      <div className="fam-tooltip-row">
        <span>Trade Amount</span>
        <span>₹{Number(node.total_investment || 0).toLocaleString()}</span>
      </div>
      <div className="fam-tooltip-row">
        <span>Total Lots</span>
        <span>{Number(node.total_lots || 0)}</span>
      </div>
      <div className="fam-tooltip-row">
        <span>Investment Status</span>
        <span>{investmentStatus}</span>
      </div>
    </div>,
    document.body
  );
}

function FamNode({ node, openNodeId, onToggleDetails, onHoverDetails, onViewUser }) {
  if (!node) return null;

  const nodeRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const id = node.user_id || node.userId || "-";
  const name = node.name || node.full_name || node.fullname || "User";
  const photo = node.photo || node.avatar || node.profile_image;
  const children = Array.isArray(node.children) ? node.children : [];
  const investmentStatus = String(node.investment_status || "INACTIVE").toUpperCase();
  const isActive = investmentStatus === "ACTIVE";
  const detailsOpen = openNodeId === id;

  const handleMouseEnter = () => {
    if (nodeRef.current) setAnchorRect(nodeRef.current.getBoundingClientRect());
    setHovered(true);
    onHoverDetails(id);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setAnchorRect(null);
    onHoverDetails(null, id);
  };

  const handleNodeToggle = () => {
    if (nodeRef.current) {
      setAnchorRect(nodeRef.current.getBoundingClientRect());
    }
    onToggleDetails(id);
  };

  const handleAvatarClick = (event) => {
    event.stopPropagation();
    if (id && id !== "-" && onViewUser) onViewUser(id);
  };

  return (
    <li>
      <div
        ref={nodeRef}
        className={`fam-node ${detailsOpen ? "is-details-open" : ""}`}
        role="button"
        tabIndex={0}
        onClick={handleNodeToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleNodeToggle();
          }
        }}
        aria-expanded={detailsOpen}
        aria-label={`Show details for ${name}`}
      >
        <div
          className="fam-avatar fam-avatar--clickable"
          style={{ background: colorForId(id) }}
          onClick={handleAvatarClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleAvatarClick(event);
            }
          }}
          role="button"
          tabIndex={0}
          title={`View ${id}'s tree`}
          aria-label={`View ${name}'s tree`}
        >
          {photo ? <img src={photo} alt={name} /> : name.charAt(0).toUpperCase()}
        </div>
        <span className={`fam-badge ${isActive ? "is-active" : "is-inactive"}`}>{id}</span>
        <span className={`fam-investment-status ${isActive ? "is-active" : "is-inactive"}`}>
          {investmentStatus}
        </span>
      </div>

      {(hovered || detailsOpen) && <UserNodeTooltip anchorRect={anchorRect} node={node} />}

      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <FamNode
              key={child.user_id || child.userId || `${id}-${Math.random()}`}
              node={child}
              openNodeId={openNodeId}
              onToggleDetails={onToggleDetails}
              onHoverDetails={onHoverDetails}
              onViewUser={onViewUser}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function FamilyOrgTree({ data, onViewUser }) {
  if (!data) return null;
  const [openNodeId, setOpenNodeId] = useState(null);

  const handleToggleDetails = (id) => {
    setOpenNodeId((currentId) => (currentId === id ? null : id));
  };

  const handleHoverDetails = (id, previousId) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setOpenNodeId((currentId) => {
      if (id === null && currentId === previousId) return null;
      return id || currentId;
    });
  };

  useEffect(() => {
    if (!openNodeId) return undefined;

    const handleOutsideClick = (event) => {
      const openNode = event.target.closest?.(".fam-node.is-details-open");
      if (!openNode) {
        setOpenNodeId(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [openNodeId]);

  return (
    <div className="fam-tree-scroll">
      <ul className="tree">
        <FamNode
          node={data}
          openNodeId={openNodeId}
          onToggleDetails={handleToggleDetails}
          onHoverDetails={handleHoverDetails}
          onViewUser={onViewUser}
        />
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Search bar — shared across Family / List / Enroller                     */
/* ---------------------------------------------------------------------- */
function GenSearchBar({ value, onChange, onSearch, onReset, placeholder, hasActiveSearch }) {
  return (
    <div className="gen-search-bar">
      <div className="gen-search-input-wrap">
        <FiSearch size={14} className="gen-search-icon" />
        <input
          type="text"
          className="gen-search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
      </div>
      <button type="button" className="gen-search-btn" onClick={onSearch}>
        Search User
      </button>
      <button
        type="button"
        className="gen-search-reset"
        onClick={onReset}
        disabled={!hasActiveSearch && !value}
      >
        <FiRefreshCw size={13} />
        Reset
      </button>
    </div>
  );
}

function GenealogyPage() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [searchMiss, setSearchMiss] = useState(false);
  const [drillHistory, setDrillHistory] = useState([]);
  const [viewRoot, setViewRoot] = useState(null);
  const [drilledUserId, setDrilledUserId] = useState("");

  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);

  const view = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.includes("/business/list")) return "list";
    if (pathname.includes("/business/enroller")) return "enroller";
    return "family";
  }, [location.pathname]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      let res;
      if (view === "family") {
        res = await getUserGenealogyApi();
      } else if (view === "list") {
        res = await getUserGenealogyListApi();
      } else {
        res = await getUserEnrollersApi();
      }

      if (res.success) {
        setData(res.data);
        setViewRoot(res.data || null);
      } else {
        setError(res.error || "Unable to load data.");
        setViewRoot(null);
      }

      setLoading(false);
    };

    // Reset any active search and drill state whenever the tab changes.
    setSearchInput("");
    setActiveSearch("");
    setSearchMiss(false);
    setDrillHistory([]);
    setViewRoot(null);
    setDrilledUserId("");

    loadData();
  }, [view]);

  const handleViewUser = (id) => {
    if (!id || activeSearch) return;
    const selectedNode = findNodeById(viewRoot || data, id);
    if (!selectedNode) return;

    setDrillHistory((current) => [...current, viewRoot || data]);
    setViewRoot(selectedNode);
    setDrilledUserId(id);
  };

  const handleBackToPrevious = () => {
    setDrillHistory((current) => {
      if (current.length === 0) {
        setViewRoot(data || null);
        setDrilledUserId("");
        return [];
      }

      const previous = current[current.length - 1];
      const previousId = getNodeId(previous) || userId;
      setViewRoot(previous);
      setDrilledUserId(previousId);
      return current.slice(0, -1);
    });
  };

  const handleSearch = () => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      setActiveSearch("");
      setSearchMiss(false);
      return;
    }
    setActiveSearch(q);

    if (view === "family") {
      setSearchMiss(!findNodeById(data, q));
    } else if (view === "list") {
      setSearchMiss(filterByUser(data, q).length === 0);
    } else {
      setSearchMiss(filterByUser(data?.enrollers, q).length === 0);
    }
  };

  const handleReset = () => {
    setSearchInput("");
    setActiveSearch("");
    setSearchMiss(false);
    setDrillHistory([]);
    setViewRoot(data || null);
    setDrilledUserId("");
  };

  const title =
    view === "family" ? "Family" : view === "list" ? "List" : "Enrolment";

  const subtitle =
    view === "family"
      ? "Explore your downline across every generation, at a glance"
      : view === "list"
      ? "Every member in your network, with their investment at a glance"
      : "Members you have personally enrolled into your network";

  const searchPlaceholder =
    view === "family" ? "Enter User ID (e.g. FX007)" : "Search by User ID or Name";

  const columnIcons = {
    user: <FiUser size={12} />,
    name: <FiUsers size={12} />,
    investment: <FiDollarSign size={12} />,
    joined: <FiCalendar size={12} />,
    rank: <FiAward size={12} />,
    lots: <FiBriefcase size={12} />,
  };

  // Search-aware datasets. With no active search these fall back to the
  // full data set, so List/Enroller behave exactly as before by default.
  const familyDisplayNode =
    view === "family"
      ? activeSearch
        ? findNodeById(data, activeSearch)
        : viewRoot || data
      : null;

  const previousViewUserId =
    drillHistory.length > 0
      ? getNodeId(drillHistory[drillHistory.length - 1]) || userId
      : userId;

  const listDisplayRows =
    view === "list"
      ? activeSearch
        ? filterByUser(data, activeSearch)
        : Array.isArray(data)
        ? data
        : []
      : [];

  const enrollerDisplayRows =
    view === "enroller"
      ? activeSearch
        ? filterByUser(data?.enrollers, activeSearch)
        : Array.isArray(data?.enrollers)
        ? data.enrollers
        : []
      : [];

  return (
    <UserLayout user={{ name: localStorage.getItem("userName") || "User", userId }}>
      <div className="genealogy-page user-genealogy-page">
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Network Overview
          </span>

          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">
              👨‍👩‍👧‍👦
            </span>
            <div className="page-header-text">
              <h1 className="page-title">{title}</h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="genealogy-panel">
          <div className="genealogy-header-row">
            <h2>User: {userId}</h2>
          </div>

          <GenSearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            onReset={handleReset}
            placeholder={searchPlaceholder}
            hasActiveSearch={!!activeSearch}
          />

          {view === "family" && !activeSearch && drilledUserId && drilledUserId !== userId && (
            <div className="fam-view-banner">
              Viewing <strong>{drilledUserId}</strong>'s tree (drilled in from the diagram).
              <button
                type="button"
                className="fam-view-banner-reset"
                onClick={handleBackToPrevious}
              >
                Back to {previousViewUserId}
              </button>
            </div>
          )}

          {loading ? (
            <div className="genealogy-empty">Loading {title.toLowerCase()}...</div>
          ) : error ? (
            <div className="genealogy-error">{error}</div>
          ) : view === "family" ? (
            activeSearch && searchMiss ? (
              <div className="genealogy-empty">
                No user found for “{searchInput.trim()}”.
              </div>
            ) : familyDisplayNode ? (
              <FamilyOrgTree data={familyDisplayNode} onViewUser={handleViewUser} />
            ) : (
              <div className="genealogy-empty">No family data available.</div>
            )
          ) : view === "list" ? (
            listDisplayRows.length > 0 ? (
              <div className="list-table-wrapper">
                <table className="genealogy-table">
                  <thead>
                    <tr>
                      <th>
                        <span className="genealogy-head-label">
                          <span className="genealogy-head-icon">{columnIcons.user}</span>
                          User ID
                        </span>
                      </th>
                      <th>
                        <span className="genealogy-head-label">
                          <span className="genealogy-head-icon">{columnIcons.name}</span>
                          Name
                        </span>
                      </th>
                      <th>
                        <span className="genealogy-head-label">
                          <span className="genealogy-head-icon">{columnIcons.joined}</span>
                          Date of Join
                        </span>
                      </th>
                      <th>
                        <span className="genealogy-head-label">
                          <span className="genealogy-head-icon">{columnIcons.investment}</span>
                          Investment
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listDisplayRows.map((item, index) => {
                      const joinDate = item.date_of_join || item.date_of_joining;
                      return (
                        <tr key={`${item.user_id || item.userId || "genealogy-list-"}${index}`}>
                          <td>{item.user_id || item.userId || "-"}</td>
                          <td>{item.fullname || item.full_name || item.name || "-"}</td>
                          <td>{formatJoinDate(joinDate)}</td>
                          <td>₹{Number(item.total_investment || 0).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="genealogy-empty">
                {activeSearch ? `No results for “${searchInput.trim()}”.` : "No list data available."}
              </div>
            )
          ) : enrollerDisplayRows.length > 0 ? (
            <div className="list-table-wrapper">
              <table className="genealogy-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Joined</th>
                    <th>Rank</th>
                    <th>Investment</th>
                    <th>Lots</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollerDisplayRows.map((item, index) => (
                    <tr key={`${item.user_id || item.userId || "enroller-"}${index}`}>
                      <td>{item.user_id || "-"}</td>
                      <td>{item.fullname || item.full_name || "-"}</td>
                      <td>{formatJoinDate(item.date_of_joining || item.date_of_join)}</td>
                      <td>{item.rank || "-"}</td>
                      <td>₹{Number(item.total_investment_amount || 0).toLocaleString()}</td>
                      <td>{Number(item.total_lots || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="genealogy-empty">
              {activeSearch ? `No results for “${searchInput.trim()}”.` : "No enrolment records available."}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default GenealogyPage;