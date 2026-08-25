import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
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
          {error && !selectedRankId && <div className="rank-holders-error">{error}</div>}
          <div className="rank-holders-table-wrap">
            <table className="rank-holders-table rank-list-table">
              <thead><tr><th>No</th><th>Rank Name</th><th>Criteria</th></tr></thead>
              <tbody>
                {loadingRanks ? <tr><td colSpan="3" className="rank-holders-empty">Loading ranks...</td></tr> : ranks.length === 0 ? <tr><td colSpan="3" className="rank-holders-empty">No ranks configured.</td></tr> : ranks.map((rank, index) => <tr key={rank.id}><td>{index + 1}</td><td><button type="button" className="rank-name-button" onClick={() => setSelectedRankId(String(rank.id))}>{rank.rank_name || "-"}</button></td><td>{rank.criteria || "-"}</td></tr>)}
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
              <div className="rank-holders-table-wrap">
                <table className="rank-holders-table">
                  <thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Date</th><th>Image</th></tr></thead>
                  <tbody>{loadingHolders ? <tr><td colSpan="5" className="rank-holders-empty">Loading rank holders...</td></tr> : holders.length === 0 ? <tr><td colSpan="5" className="rank-holders-empty">No users currently hold this rank.</td></tr> : holders.map((holder, index) => <tr key={holder.id ?? holder.user_id}><td>{index + 1}</td><td className="rank-holder-id">{holder.user_id || "-"}</td><td>{`${holder.first_name || ""} ${holder.last_name || ""}`.trim() || "-"}</td><td>{formatAchievedDate(holder.achieved_at)}</td><td>{holder.image ? <img src={holder.image} alt={`${holder.user_id || "User"} profile`} /> : "-"}</td></tr>)}</tbody>
                </table>
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
