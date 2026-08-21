import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiSearch, FiBriefcase } from "react-icons/fi";
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

function AdminFamNode({ node }) {
  if (!node) return null;

  const id = node.user_id || node.userId || "-";
  const name = node.name || node.full_name || node.fullname || "User";
  const photo = node.profile_image || node.photo || node.avatar;
  const children = Array.isArray(node.children) ? node.children : [];
  const investmentStatus = String(node.investment_status || "INACTIVE").toUpperCase();
  const statusClass = investmentStatus === "ACTIVE" ? "is-active" : "is-inactive";

  return (
    <li>
      <div className="agen-node">
        <div className="agen-avatar" style={{ background: colorForId(id) }}>
          {photo ? <img src={photo} alt={name} /> : name.charAt(0).toUpperCase()}
        </div>
        <span className={`agen-badge ${statusClass}`}>{id}</span>
        <span className={`agen-investment-status ${statusClass}`}>{investmentStatus}</span>

        <div className="agen-tooltip">
          <div className="agen-tooltip-row">
            <span>Full Name</span>
            <span>{name}</span>
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
            <span>Total Lots</span>
            <span>{Number(node.total_lots || 0)}</span>
          </div>
          <div className="agen-tooltip-row">
            <span>Investment Status</span>
            <span>{investmentStatus}</span>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <AdminFamNode key={child.user_id || child.userId || `${id}-${Math.random()}`} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function AdminFamilyTree({ data }) {
  if (!data) return null;
  return (
    <div className="agen-tree-scroll">
      <ul className="agen-tree">
        <AdminFamNode node={data} />
      </ul>
    </div>
  );
}

function GenealogyPage() {
  const [allGenealogy, setAllGenealogy] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
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
        if (list.length > 0) setSelectedUserId(list[0].user_id);
      }
      if (treeRes.success && treeRes.data?.user_id) setGenealogy(treeRes.data);

      setLoadingAll(false);
    };

    loadAll();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setGenealogy(null);
      return;
    }

    const loadSelected = async () => {
      setLoadingSelected(true);
      setError("");

      const res = await getAdminUserGenealogyApi(selectedUserId);
      if (res.success) {
        setGenealogy(res.data);
      } else {
        setError(res.error || "Unable to load selected user's genealogy.");
      }

      setLoadingSelected(false);
    };

    loadSelected();
  }, [selectedUserId]);

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
            <span className="agen-title-icon" aria-hidden="true">
              <FiUsers />
            </span>
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
                onChange={(e) => setSelectedUserId(e.target.value)}
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

          {loadingAll ? (
            <div className="agen-empty">Loading genealogy list…</div>
          ) : error ? (
            <div className="agen-error">{error}</div>
          ) : loadingSelected ? (
            <div className="agen-empty">Loading selected genealogy…</div>
          ) : genealogy ? (
            <AdminFamilyTree data={genealogy} />
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