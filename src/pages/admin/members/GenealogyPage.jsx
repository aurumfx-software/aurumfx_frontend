import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiSearch, FiBriefcase } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllGenealogyApi,
  getAdminGenealogyListApi,
  getAdminUserGenealogyApi,
} from "../../../api/admin-genealogy";
import "./GenealogyPage.css";

/* ---------------------------------------------------------------------- */
/* Same avatar-tree pattern as the user-side "Family" view, adapted for   */
/* the admin's richer per-node metrics (wallet, investment, L/R business). */
/* ---------------------------------------------------------------------- */

const AVATAR_COLORS = [
  "#f97316", "#64748b", "#14b8a6", "#a855f7",
  "#22c55e", "#ef4444", "#3b82f6", "#eab308",
];

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/* ---------------------------------------------------------------------- */
/* Tooltip is rendered through a portal straight onto <body> and          */
/* positioned with `position: fixed`, using the hovered avatar's real     */
/* on-screen coordinates. This guarantees it always paints above every    */
/* other node in the tree, no matter how deep the nesting or how the      */
/* scroll container clips things — a plain CSS z-index inside the tree    */
/* can't guarantee that once multiple sibling nodes each become their     */
/* own stacking context on hover.                                        */
/* ---------------------------------------------------------------------- */
function AdminNodeTooltip({ anchorRect, node }) {
  const tipRef = useRef(null);
  const [pos, setPos] = useState(null); // { left, top, showBelow } in exact px, no transform involved

  // Measure the tooltip's REAL rendered size (it varies with content —
  // name length, whether a rank is set, etc.) and only then compute its
  // final position. Guessing a fixed height up front was the bug: it
  // either undershot (tooltip too close, overlapping the node) or
  // overshot (too far away). useLayoutEffect runs synchronously after
  // the DOM is painted but before the browser shows it to the user, so
  // there's no visible flicker between the "hidden, measuring" pass and
  // the final positioned pass.
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
    // Keep it on-screen horizontally too.
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - tipRect.width - VIEWPORT_MARGIN));

    const top = showBelow
      ? anchorRect.bottom + GAP
      : anchorRect.top - GAP - tipRect.height;

    setPos({ left, top, showBelow });
  }, [anchorRect]);

  if (!anchorRect) return null;

  const investmentStatus = String(node.investment_status || "INACTIVE").toUpperCase();

  // First paint: render off-screen/invisible purely so we can measure
  // it. Once `pos` is computed, snap to the real, exact position.
  const style = pos
    ? { position: "fixed", left: pos.left, top: pos.top, visibility: "visible" }
    : { position: "fixed", left: anchorRect.left, top: anchorRect.top, visibility: "hidden" };

  const placementClass = pos ? (pos.showBelow ? "is-below" : "is-above") : "is-above";

  return createPortal(
    <div ref={tipRef} className={`agen-tooltip-portal ${placementClass}`} style={style}>
      <div className="agen-tooltip-row">
        <span>Full Name</span>
        <span>{node.name || node.full_name || node.fullname || "User"}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Date of Joining</span>
        <span>{node.date_of_joining ? new Date(node.date_of_joining).toLocaleDateString() : "-"}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Rank</span>
        <span>{node.rank || "-"}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Total Investment</span>
        <span>{formatCurrency(node.total_investment)}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Personal Lots</span>
        <span>{Number(node.total_lots || 0)}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Total Lots</span>
        <span>{Number(node.total_group_lots || 0)}</span>
      </div>
      <div className="agen-tooltip-row">
        <span>Investment Status</span>
        <span>{investmentStatus}</span>
      </div>
    </div>,
    document.body
  );
}

/**
 * `onViewUser` — called when the admin clicks a node's avatar circle.
 * This drills the tree into that user's own subtree. It intentionally
 * does NOT touch the dropdown's selected value; it only updates the
 * separate `viewUserId` state in the parent, so the dropdown filter/
 * selection stays exactly as the admin left it.
 */
function AdminFamNode({ node, onViewUser }) {
  const nodeRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  if (!node) return null;

  const id = node.user_id || node.userId || "-";
  const name = node.name || node.full_name || node.fullname || "User";
  const photo = node.profile_image || node.photo || node.avatar;
  const children = Array.isArray(node.children) ? node.children : [];
  const investmentStatus = String(node.investment_status || "INACTIVE").toUpperCase();
  const statusClass = investmentStatus === "ACTIVE" ? "is-active" : "is-inactive";

  const handleMouseEnter = () => {
    if (nodeRef.current) {
      setAnchorRect(nodeRef.current.getBoundingClientRect());
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setAnchorRect(null);
  };

  const handleAvatarClick = () => {
    if (id && id !== "-" && onViewUser) onViewUser(id);
  };

  return (
    <li>
      <div
        className="agen-node"
        ref={nodeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="agen-avatar agen-avatar--clickable"
          style={{ background: colorForId(id) }}
          onClick={handleAvatarClick}
          role="button"
          tabIndex={0}
          title={`View ${id}'s tree`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAvatarClick();
            }
          }}
        >
          {photo ? <img src={photo} alt={name} /> : name.charAt(0).toUpperCase()}
        </div>
        <span className={`agen-badge ${statusClass}`}>{id}</span>
        <span className={`agen-investment-status ${statusClass}`}>{investmentStatus}</span>
      </div>

      {hovered && <AdminNodeTooltip anchorRect={anchorRect} node={node} />}

      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <AdminFamNode
              key={child.user_id || child.userId || `${id}-${Math.random()}`}
              node={child}
              onViewUser={onViewUser}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function AdminFamilyTree({ data, onViewUser }) {
  if (!data) return null;
  return (
    <div className="agen-tree-scroll">
      <ul className="agen-tree">
        <AdminFamNode node={data} onViewUser={onViewUser} />
      </ul>
    </div>
  );
}

function GenealogyPage() {
  const [allGenealogy, setAllGenealogy] = useState([]);

  // `selectedUserId` belongs ONLY to the dropdown filter — it never
  // changes as a side effect of clicking a node in the tree.
  const [selectedUserId, setSelectedUserId] = useState("");

  // `viewUserId` is the user whose tree is actually fetched and shown.
  // It's updated by the dropdown (selecting a user) AND independently
  // by clicking an avatar node in the rendered tree ("drill in").
  const [viewUserId, setViewUserId] = useState("");

  const [genealogy, setGenealogy] = useState(null);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [error, setError] = useState("");
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      setLoadingAll(true);
      setError("");

      const [treeRes, listRes] = await Promise.all([
        getAllGenealogyApi(),
        getAdminGenealogyListApi(),
      ]);
      if (!treeRes.success) setError(treeRes.error || "Unable to load genealogy data.");
      if (!listRes.success) setError(listRes.error || "Unable to load genealogy list.");

      if (listRes.success) {
        const list = Array.isArray(listRes.data) ? listRes.data : [];
        if (treeRes.success && treeRes.data?.user_id && !list.some((item) => item.user_id === treeRes.data.user_id)) {
          list.unshift(treeRes.data);
        }
        setAllGenealogy(list);
        if (list.length > 0) {
          setSelectedUserId(list[0].user_id);
          setViewUserId(list[0].user_id);
        }
      }

      // NOTE: intentionally NOT calling setGenealogy(treeRes.data) here.
      // The tree shown is always driven by `viewUserId`, via the effect
      // below, so it never gets silently overwritten by the full network
      // tree on initial load.

      setLoadingAll(false);
    };

    loadAll();
  }, []);

  // Fetches whichever user's tree should currently be displayed.
  // Fires on dropdown change AND on tree-node click, since both funnel
  // into `viewUserId`.
  useEffect(() => {
    if (!viewUserId) {
      setGenealogy(null);
      return;
    }

    const loadSelected = async () => {
      setLoadingSelected(true);
      setError("");

      const res = await getAdminUserGenealogyApi(viewUserId);
      if (res.success) {
        setGenealogy(res.data);
      } else {
        setError(res.error || "Unable to load selected user's genealogy.");
      }

      setLoadingSelected(false);
    };

    loadSelected();
  }, [viewUserId]);

  // Auto-select and fetch tree when user types in search input
  useEffect(() => {
    const q = filterInput.trim().toLowerCase();
    if (!q) {
      // Clear search if input is empty, keep current selection
      return;
    }

    // Find first matching user in the filtered list
    const matchedUser = allGenealogy.find(
      (item) =>
        String(item.user_id || "").toLowerCase().includes(q) ||
        String(item.name || item.full_name || item.fullname || "").toLowerCase().includes(q)
    );

    // Auto-select and fetch the tree for the matched user
    if (matchedUser && matchedUser.user_id !== viewUserId) {
      setSelectedUserId(matchedUser.user_id);
      setViewUserId(matchedUser.user_id);
    }
  }, [filterInput, allGenealogy, viewUserId]);

  // Dropdown handler: updates BOTH the dropdown's own value and the
  // displayed tree. This is the normal, expected "filter by user" flow.
  const handleDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedUserId(id);
    setViewUserId(id);
    setFilterInput(""); // Clear search when selecting from dropdown
  };

  // Tree-node click handler: updates ONLY the displayed tree. The
  // dropdown's selected value is left completely untouched, per the
  // requirement that drilling into a node must not affect the filter.
  const handleViewUser = (id) => {
    setViewUserId(id);
  };

  const filteredList = useMemo(() => {
    const q = filterInput.trim().toLowerCase();
    if (!q) return allGenealogy;
    return allGenealogy.filter(
      (item) =>
        String(item.user_id || "").toLowerCase().includes(q) ||
        String(item.name || item.full_name || item.fullname || "").toLowerCase().includes(q)
    );
  }, [allGenealogy, filterInput]);

  return (
    <AdminLayout>
      <div className="genealogy-page admin-genealogy-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow">
            <span className="agen-eyebrow-dot" />
            Network Overview
          </span>

          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Genealogy</h1>
              <p className="agen-page-subtitle">
                Browse every member's downline as a full network tree
              </p>
            </div>
          </div>

          <div className="agen-breadcrumb">
            <span>Dashboard</span>
            <span className="agen-crumb-sep">•</span>
            <span className="agen-crumb-active">Genealogy</span>
          </div>
        </div>

        <div className="agen-panel">
          <div className="agen-header-row">
            <h2>All Genealogy</h2>

            <div className="agen-actions">
              <div className="agen-search-input-wrap">
                <FiSearch size={14} className="agen-search-icon" />
                <input
                  type="text"
                  className="agen-input"
                  placeholder="Filter by user ID or name"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                />
              </div>

              <select
                className="agen-select"
                value={selectedUserId}
                onChange={handleDropdownChange}
                disabled={loadingAll || filteredList.length === 0}
              >
                {filteredList.length === 0 ? (
                  <option value="">No users</option>
                ) : (
                  filteredList.map((item) => (
                    <option key={item.user_id} value={item.user_id}>
                      {item.user_id} - {item.name || item.full_name || item.fullname || "User"}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="agen-quick-grid">
            <div className="agen-stat-card">
              <span>Total Users</span>
              <strong>{allGenealogy.length}</strong>
            </div>
            <div className="agen-stat-card">
              <span>Selected</span>
              <strong>{selectedUserId || "-"}</strong>
            </div>
            <div className="agen-stat-card">
              <span>
                <FiBriefcase size={11} /> Children
              </span>
              <strong>{genealogy?.children?.length || 0}</strong>
            </div>
          </div>

          {viewUserId && viewUserId !== selectedUserId && (
            <div className="agen-view-banner">
              Viewing <strong>{viewUserId}</strong>'s tree (drilled in from the diagram).
              <button
                type="button"
                className="agen-view-banner-reset"
                onClick={() => setViewUserId(selectedUserId)}
              >
                Back to {selectedUserId}
              </button>
            </div>
          )}

          {loadingAll ? (
            <div className="agen-empty">Loading genealogy list…</div>
          ) : error ? (
            <div className="agen-error">{error}</div>
          ) : loadingSelected ? (
            <div className="agen-empty">Loading selected genealogy…</div>
          ) : genealogy ? (
            <AdminFamilyTree data={genealogy} onViewUser={handleViewUser} />
          ) : (
            <div className="agen-empty">
              No genealogy details available for the selected user.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default GenealogyPage;