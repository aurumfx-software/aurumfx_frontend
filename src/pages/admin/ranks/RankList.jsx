import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllRanksApi, getRankApi, deleteRankApi, createRankApi, updateRankApi } from "../../../api/admin-ranks";
import "./RankList.css";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

function RankList() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchRankId, setSearchRankId] = useState("");

  useEffect(() => {
    loadAllRanks();
  }, []);

  function showMessage(txt) {
    setMessage(txt);
    setTimeout(() => setMessage(""), 3500);
  }
  async function handleSearch(event) {
    event.preventDefault();
    const rankId = searchRankId.trim();
    if (!rankId) {
      loadAllRanks();
      return;
    }
    setLoading(true);
    setError("");
    const result = await getRankApi(rankId);
    if (result.success) setRanks(result.data ? [result.data] : []);
    else {
      setRanks([]);
      setError(result.error || "Unable to find rank");
    }
    setLoading(false);
  }

  async function loadAllRanks() {
    setLoading(true);
    setError("");
    const result = await getAllRanksApi();
    if (result.success) setRanks(result.data);
    else {
      setRanks([]);
      setError(result.error || "Unable to load ranks");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    // open confirm modal
    setToDelete(id);
    setConfirmOpen(true);
  }


  async function confirmDelete() {
    try {
      const result = await deleteRankApi(toDelete);
      if (!result.success) throw new Error(result.error);
      setRanks((s) => s.filter((r) => r.id !== toDelete));
      showMessage("Rank deleted");
    } catch (err) {
      console.error(err);
      showMessage("Delete failed");
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  }
  function openCreate() {
    setEditing(null);
    setEditing(null);
    setRankForm(emptyRank());
    setModalOpen(true);
  }

  function openEdit(rank) {
    setEditing(rank);
    setRankForm({ ...rank });
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    try {
      if (editing) {
        const result = await updateRankApi(editing.id, form);
        if (!result.success) throw new Error(result.error);
        const updated = result.data;
        setRanks((s) => s.map((r) => (r.id === editing.id ? { ...r, ...form, ...updated } : r)));
        showMessage("Rank updated");
      } else {
        const result = await createRankApi(form);
        if (!result.success) throw new Error(result.error);
        setRanks((s) => [{ ...form, ...result.data }, ...s]);
        showMessage("Rank created");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Save failed");
      showMessage("Save failed");
    }
  }

  // local form state for inline modal
  function emptyRank() {
    return {
      rank_name: "",
      rank_no: "",
      minimum_total_lots: "",
      minimum_direct_sponsors: "",
      reward_income: "",
      criteria: "",
      status: true,
      conditions: [],
    };
  }

  const [rankForm, setRankForm] = useState(emptyRank());

  function updateField(key, val) {
    setRankForm((s) => ({ ...s, [key]: val }));
  }

  function updateNumberField(key, event) {
    updateField(key, event.target.value === "" ? "" : Number(event.target.value));
  }

  function updateCondition(idx, key, val) {
    const next = [...(rankForm.conditions || [])];
    next[idx] = { ...next[idx], [key]: val };
    setRankForm((s) => ({ ...s, conditions: next }));
  }

  function addCondition() {
    setRankForm((s) => ({ ...s, conditions: [...(s.conditions || []), { minimum_group_lots: "", required_group_count: "", order_no: (s.conditions || []).length + 1 }] }));
  }

  function removeCondition(idx) {
    setRankForm((s) => ({ ...s, conditions: s.conditions.filter((_, i) => i !== idx) }));
  }

  // when saving from inline modal, reuse existing handleSubmit
  async function submitFromModal() {
    await handleSubmit(rankForm);
  }

  return (
    <AdminLayout>
      <div className="ranks-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow">
            <span className="agen-eyebrow-dot" />
            Rank Management
          </span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Admin Ranks</h1>
              <p className="agen-page-subtitle">Manage rank requirements, rewards, and eligibility criteria</p>
            </div>
            <button className="btn-primary" onClick={openCreate}>Create Rank</button>
          </div>
          <div className="agen-breadcrumb">
            <span>Dashboard</span>
            <span className="agen-crumb-sep">•</span>
            <span className="agen-crumb-active">Ranks</span>
          </div>
        </div>
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="ranks-card">
            <div className="ranks-card-heading">
              <h3>Rank Configuration</h3>
              <p>Manage rank requirements, rewards, and eligibility criteria.</p>
            </div>
            <form className="ranks-search-bar" onSubmit={handleSearch}>
              <input type="number" min="1" placeholder="Search by Rank ID" value={searchRankId} onChange={(event) => setSearchRankId(event.target.value)} />
              <button type="submit" className="btn-primary">Search</button>
              <button type="button" className="btn-secondary" onClick={() => { setSearchRankId(""); loadAllRanks(); }}>Show All</button>
            </form>
            <div className="table-responsive">
              <table className="level-table">
                <thead>
                  <tr>
                    <th>Rank No</th>
                    <th>Name</th>
                    <th>Min Lots</th>
                    <th>Direct Sponsors</th>
                    <th>Reward</th>
                    <th>Criteria</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th className="conditions-head">Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-cell">No ranks configured.</td>
                    </tr>
                  ) : ranks.map((r) => (
                    <tr key={r.id}>
                      <td>{r.rank_no}</td>
                      <td>{r.rank_name || "-"}</td>
                      <td>{formatNumber(r.minimum_total_lots)}</td>
                      <td>{r.minimum_direct_sponsors ?? "-"}</td>
                      <td>{r.reward_income !== undefined && r.reward_income !== null ? `₹${formatNumber(r.reward_income)}` : "-"}</td>
                      <td>{r.criteria || "-"}</td>
                      <td>
                        <span className={`status-pill ${r.status ? "status-pill--active" : "status-pill--inactive"}`}>
                          {r.status === undefined ? "-" : r.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <div>
                          <button className="icon-btn" title="Edit rank" aria-label="Edit rank" onClick={() => openEdit(r)}><FiEdit2 size={15} /></button>
                          <button className="icon-btn icon-btn--danger" title="Delete rank" aria-label="Delete rank" onClick={() => handleDelete(r.id)}><FiTrash2 size={15} /></button>
                        </div>
                      </td>
                      <td className="conditions-cell">
                        {Array.isArray(r.conditions) && r.conditions.length > 0 ? (
                          <div className="condition-chip-list">
                            {[...r.conditions]
                              .sort((a, b) => (a.order_no ?? 0) - (b.order_no ?? 0))
                              .map((condition, idx) => (
                                <span className="condition-chip" key={condition.id ?? `${r.id}-${idx}`}>
                                  <span className="condition-chip-order">{condition.order_no ?? idx + 1}</span>
                                  <span className="condition-chip-text">
                                    {formatNumber(condition.minimum_group_lots)} lots × {condition.required_group_count ?? 0} grp
                                  </span>
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="condition-chip-empty">No conditions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {modalOpen && createPortal(
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>{editing ? `Edit Rank #${editing.id}` : "Create Rank"}</h3>
                <button onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <div className="field">
                    <label>Name</label>
                    <input value={rankForm.rank_name} onChange={(e) => updateField("rank_name", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Rank No</label>
                    <input type="number" value={rankForm.rank_no} onChange={(e) => updateNumberField("rank_no", e)} />
                  </div>
                </div>

                <div className="field">
                  <label>Criteria</label>
                  <input value={rankForm.criteria} onChange={(e) => updateField("criteria", e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Minimum Total Lots</label>
                    <input type="number" value={rankForm.minimum_total_lots} onChange={(e) => updateNumberField("minimum_total_lots", e)} />
                  </div>
                  <div className="field">
                    <label>Direct Sponsors</label>
                    <input type="number" value={rankForm.minimum_direct_sponsors} onChange={(e) => updateNumberField("minimum_direct_sponsors", e)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Reward Income</label>
                    <input type="number" value={rankForm.reward_income} onChange={(e) => updateNumberField("reward_income", e)} />
                  </div>
                  <div className="field">
                    <label>Status</label>
                    <select value={rankForm.status ? "active" : "inactive"} onChange={(e) => updateField("status", e.target.value === "active")}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="conditions-list">
                  <div className="conditions-heading">
                    <div>
                      <strong>Conditions</strong>
                      <p>Define the group requirements for this rank.</p>
                    </div>
                    <button type="button" className="small-btn" onClick={addCondition}>Add Condition</button>
                  </div>
                  {(rankForm.conditions || []).map((c, idx) => (
                    <div className="condition-item" key={idx}>
                      <label>Minimum Group Lots<input type="number" value={c.minimum_group_lots ?? ""} onChange={(e) => updateCondition(idx, "minimum_group_lots", e.target.value === "" ? "" : Number(e.target.value))} /></label>
                      <label>Required Group Count<input type="number" value={c.required_group_count ?? ""} onChange={(e) => updateCondition(idx, "required_group_count", e.target.value === "" ? "" : Number(e.target.value))} /></label>
                      <label>Order No<input type="number" value={c.order_no ?? ""} onChange={(e) => updateCondition(idx, "order_no", e.target.value === "" ? "" : Number(e.target.value))} /></label>
                      <button type="button" className="small-btn condition-remove-btn" onClick={() => removeCondition(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={submitFromModal}>{editing ? "Save" : "Create"}</button>
              </div>
            </div>
          </div>
        , document.body)}
        {confirmOpen && createPortal(
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Delete Rank</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this rank?</p>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={confirmDelete}>Confirm</button>
              </div>
            </div>
          </div>
        , document.body)}
      </div>
    </AdminLayout>
  );
}

export default RankList;