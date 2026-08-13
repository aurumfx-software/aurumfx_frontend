import { useEffect, useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllRanksApi, deleteRankApi, createRankApi, updateRankApi } from "../../../api/admin-ranks";
// RankModal inlined below per project pattern
import "./RankList.css";

function RankList() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllRanksApi();
        setRanks(data || []);
      } catch (err) {
        console.error("Failed to load ranks", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function showMessage(txt) {
    setMessage(txt);
    setTimeout(() => setMessage(""), 3500);
  }

  async function handleDelete(id) {
    // open confirm modal
    setToDelete(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    try {
      await deleteRankApi(toDelete);
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
        const updated = await updateRankApi(editing.id, form);
        setRanks((s) => s.map((r) => (r.id === updated.id ? updated : r)));
        showMessage("Rank updated");
      } else {
        const created = await createRankApi(form);
        setRanks((s) => [created, ...s]);
        showMessage("Rank created");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      showMessage("Save failed");
    }
  }

  // local form state for inline modal
  function emptyRank() {
    return {
      rank_name: "",
      rank_no: 0,
      minimum_total_lots: 0,
      minimum_direct_sponsors: 0,
      reward_income: 0,
      status: true,
      conditions: [],
    };
  }

  const [rankForm, setRankForm] = useState(emptyRank());

  function updateField(key, val) {
    setRankForm((s) => ({ ...s, [key]: val }));
  }

  function updateCondition(idx, key, val) {
    const next = [...(rankForm.conditions || [])];
    next[idx] = { ...next[idx], [key]: val };
    setRankForm((s) => ({ ...s, conditions: next }));
  }

  function addCondition() {
    setRankForm((s) => ({ ...s, conditions: [...(s.conditions || []), { minimum_group_lots: 0, required_group_count: 0, order_no: (s.conditions || []).length + 1 }] }));
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
        <div className="page-header">
          <div>
            <h2 className="page-title">Admin Ranks</h2>
          </div>
          <div>
            <button className="btn-primary" onClick={openCreate}>Create Rank</button>
          </div>
        </div>
        {message && <div className="success-banner">{message}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="ranks-card level-table-card">
            <div className="table-responsive">
            {ranks.length === 0 ? (
              <p className="empty-cell">No ranks configured.</p>
            ) : (
              <table className="level-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Rank No</th>
                    <th>Min Lots</th>
                    <th>Direct Sponsors</th>
                    <th>Reward</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.rank_name}</td>
                      <td>{r.rank_no}</td>
                      <td>{r.minimum_total_lots}</td>
                      <td>{r.minimum_direct_sponsors}</td>
                      <td>{r.reward_income}</td>
                      <td>{r.status ? "Active" : "Inactive"}</td>
                      <td className="cell-actions">
                        <div>
                          <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(r))}>Copy</button>
                          <button className="btn-secondary" onClick={() => openEdit(r)}>Edit</button>
                          <button className="icon-btn icon-btn--danger" onClick={() => handleDelete(r.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>
        )}

        {modalOpen && (
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
                    <input type="number" value={rankForm.rank_no} onChange={(e) => updateField("rank_no", Number(e.target.value))} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Minimum Total Lots</label>
                    <input type="number" value={rankForm.minimum_total_lots} onChange={(e) => updateField("minimum_total_lots", Number(e.target.value))} />
                  </div>
                  <div className="field">
                    <label>Direct Sponsors</label>
                    <input type="number" value={rankForm.minimum_direct_sponsors} onChange={(e) => updateField("minimum_direct_sponsors", Number(e.target.value))} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Reward Income</label>
                    <input type="number" value={rankForm.reward_income} onChange={(e) => updateField("reward_income", Number(e.target.value))} />
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Conditions</strong>
                    <button className="small-btn" onClick={addCondition}>Add Condition</button>
                  </div>

                  {(rankForm.conditions || []).map((c, idx) => (
                    <div className="condition-item" key={idx}>
                      <input type="number" value={c.minimum_group_lots} onChange={(e) => updateCondition(idx, "minimum_group_lots", Number(e.target.value))} />
                      <input type="number" value={c.required_group_count} onChange={(e) => updateCondition(idx, "required_group_count", Number(e.target.value))} />
                      <input type="number" value={c.order_no} onChange={(e) => updateCondition(idx, "order_no", Number(e.target.value))} />
                      <button className="small-btn" onClick={() => removeCondition(idx)}>Remove</button>
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
        )}
        {confirmOpen && (
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
        )}
      </div>
    </AdminLayout>
  );
}

export default RankList;
