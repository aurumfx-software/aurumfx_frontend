import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLayers } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAllLevelsApi,
  createLevelApi,
  updateLevelApi,
  deleteLevelApi,
} from "../../../api/adminlevelsettings";
import "./LevelSettings.css";
import "../settings/SettingsHeader.css";

function LevelSettings() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create mode, object = edit mode
  const [formLevel, setFormLevel] = useState("");
  const [formPercentage, setFormPercentage] = useState("");
  const [formStatus, setFormStatus] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deletingLevel, setDeletingLevel] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const res = await getAllLevelsApi();
    if (res.success) {
      setLevels(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormLevel("");
    setFormPercentage("");
    setFormStatus(1);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormLevel(row.level);
    setFormPercentage(row.commission_percentage);
    setFormStatus(row.status);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    if (formLevel === "" || formPercentage === "") {
      setFormError("Level and commission percentage are required.");
      return;
    }

    setSaving(true);
    let res;
    if (editing) {
      res = await updateLevelApi(editing.level, {
        commission_percentage: Number(formPercentage),
        status: Number(formStatus),
      });
    } else {
      res = await createLevelApi({
        level: Number(formLevel),
        commission_percentage: Number(formPercentage),
      });
    }
    setSaving(false);

    if (res.success) {
      setFormOpen(false);
      load();
    } else {
      setFormError(res.error);
    }
  };

  const handleDelete = async (level) => {
    setDeletingLevel(level);
    const res = await deleteLevelApi(level);
    setDeletingLevel(null);
    if (res.success) {
      load();
    } else {
      setError(res.error);
    }
  };

  return (
    <AdminLayout>
      <div className="level-settings-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Settings Management</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Level Commission</h1>
              <p className="agen-page-subtitle">Configure the commission percentage assigned to each level</p>
            </div>
            <button className="btn-primary" onClick={openCreate}><FiPlus /> Add Level</button>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Level Commission</span></div>
        </div>

        <div className="level-table-card">
          <div className="level-card-heading">
            <h2>Commission Levels</h2>
            <p>Configure the commission percentage assigned to each level.</p>
          </div>
          <div className="table-responsive">
            <table className="level-table">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Commission %</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      {error}
                    </td>
                  </tr>
                ) : levels.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      <div className="empty-state">
                        <FiLayers size={28} />
                        <p>No levels configured yet.</p>
                        <button className="btn-primary" onClick={openCreate}>
                          <FiPlus /> Add your first level
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  levels.map((row) => (
                    <tr key={row.id ?? row.level}>
                      <td className="cell-level">Level {row.level}</td>
                      <td className="cell-percentage">
                        {row.commission_percentage}%
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            Number(row.status) === 1
                              ? "status--active"
                              : "status--inactive"
                          }`}
                        >
                          {Number(row.status) === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() => openEdit(row)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          title="Delete"
                          disabled={deletingLevel === row.level}
                          onClick={() => handleDelete(row.level)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && createPortal(
          <div className="modal-backdrop" onClick={closeForm}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editing ? `Edit Level ${editing.level}` : "Add Level"}</h3>
                <button className="modal-close-btn" onClick={closeForm}>
                  <FiX size={18} />
                </button>
              </div>
              <form className="modal-body" onSubmit={handleSave}>
                {formError && <div className="form-error">{formError}</div>}

                <div className="form-group">
                  <label>Level</label>
                  <input
                    type="number"
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    disabled={!!editing}
                    placeholder="e.g. 1"
                  />
                  {editing && (
                    <span className="field-hint">Level number can't be changed.</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Commission Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPercentage}
                    onChange={(e) => setFormPercentage(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>

                {editing && (
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        , document.body)}
      </div>
    </AdminLayout>
  );
}

export default LevelSettings;