import { useEffect, useMemo, useState } from "react";
import { FiAward, FiRefreshCw, FiSearch } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllRanksApi, getAllRankHoldersApi, getTodayRankHoldersApi } from "../../../api/admin-ranks";
import "./RankTodayHolders.css";
import "../../../styles/AdminGenealogyHeader.css";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

function RankTodayHolders({ defaultView = "all" }) {
  const [view, setView] = useState(defaultView);
  const [holders, setHolders] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHolders = async (activeView = view) => {
    setLoading(true);
    setError("");
    const result = activeView === "today" ? await getTodayRankHoldersApi() : await getAllRankHoldersApi();
    if (result.success) setHolders(result.data);
    else { setHolders([]); setError(result.error || "Unable to load rank holders"); }
    setLoading(false);
  };

  useEffect(() => {
    loadHolders(defaultView);
    getAllRanksApi().then((result) => { if (result.success) setRanks(result.data); });
  }, [defaultView]);

  const rankNames = useMemo(() => new Map(ranks.map((rank) => [String(rank.id), rank.rank_name])), [ranks]);
  const filteredHolders = useMemo(() => {
    const query = searchUserId.trim().toLowerCase();
    return query ? holders.filter((holder) => String(holder.user_id || "").toLowerCase().includes(query)) : holders;
  }, [holders, searchUserId]);

  const handleViewChange = (nextView) => {
    setView(nextView);
    setSearchUserId("");
    loadHolders(nextView);
  };

  return (
    <AdminLayout>
      <div className="rank-today-holders-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Rank Management</span>
          <div className="agen-page-header-top"><div className="agen-page-header-text"><h1 className="agen-page-title">Rank Holders</h1><p className="agen-page-subtitle">View members who currently hold a rank</p></div></div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Rank Holders</span></div>
        </div>
        <div className="rank-today-holders-card">
          <div className="rank-today-holders-toolbar"><div><h2>{view === "today" ? "Today Rank Holders" : "All Rank Holders"}</h2><p>{filteredHolders.length} member{filteredHolders.length === 1 ? "" : "s"} found</p></div><div className="rank-today-holders-actions">
            <div className="rank-today-holders-search"><FiSearch aria-hidden="true" /><input type="search" value={searchUserId} onChange={(event) => setSearchUserId(event.target.value)} placeholder="Filter by User ID" aria-label="Filter rank holders by user ID" /></div>
            <div className="rank-today-holders-tabs" role="tablist" aria-label="Rank holder view"><button type="button" className={view === "all" ? "is-active" : ""} onClick={() => handleViewChange("all")}>All Rank Holders</button><button type="button" className={view === "today" ? "is-active" : ""} onClick={() => handleViewChange("today")}>Today Rank Holders</button></div>
            <button type="button" className="rank-today-holders-refresh" onClick={() => loadHolders()} aria-label="Refresh rank holders" title="Refresh"><FiRefreshCw /></button>
          </div></div>
          {loading ? <div className="rank-today-holders-empty"><FiRefreshCw className="wallet-spinner" /> Loading rank holders...</div> : error ? <div className="rank-today-holders-error">{error}</div> : filteredHolders.length === 0 ? <div className="rank-today-holders-empty">No rank holders found.</div> : <div className="rank-today-holders-table-wrap"><table className="rank-today-holders-table"><thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Rank</th><th>Achieved At</th></tr></thead><tbody>{filteredHolders.map((holder, index) => <tr key={holder.id ?? holder.user_id}><td>{index + 1}</td><td className="rank-today-holder-user-id">{holder.user_id || "-"}</td><td className="rank-today-holder-name"><span className="rank-today-holder-avatar">{holder.image ? <img src={holder.image} alt="" /> : <FiAward aria-hidden="true" />}</span>{`${holder.first_name || ""} ${holder.last_name || ""}`.trim() || "-"}</td><td><span className="rank-today-holder-rank">{rankNames.get(String(holder.rank_id)) || `Rank #${holder.rank_id ?? "-"}`}</span></td><td>{formatDate(holder.achieved_at)}</td></tr>)}</tbody></table></div>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default RankTodayHolders;
