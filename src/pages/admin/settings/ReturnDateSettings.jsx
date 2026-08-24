import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  createReturnDateSettingApi,
  deleteReturnDateSettingApi,
  getReturnDateSettingApi,
  getReturnDateSettingsApi,
  updateReturnDateSettingApi,
} from "../../../api/admin-return-date-settings";
import "./ReturnDateSettings.css";

const emptyForm = { from_day: "", to_day: "", payout_day: "", status: true };

function ReturnDateSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setListError("");
    const result = await getReturnDateSettingsApi();
    if (result.success) setSettings(result.data);
    else setListError(result.error || "Unable to load return date settings.");
    setLoading(false);
  };

  useEffect(() => { loadSettings(); }, []);

  const openModal = async (setting = null) => {
    setEditing(setting);
    setFormError("");
    if (!setting) {
      setForm(emptyForm);
      setModalOpen(true);
      return;
    }

    setSaving(true);
    const result = await getReturnDateSettingApi(setting.id);
    setSaving(false);
    if (!result.success) {
      setListError(result.error || "Unable to load return date setting.");
      return;
    }
    const latest = result.data || setting;
    setForm({
      from_day: latest.from_day ?? "",
      to_day: latest.to_day ?? "",
      payout_day: latest.payout_day ?? "",
      status: latest.status ?? true,
    });
    setModalOpen(true);
  };

  const closeModal = () => { if (!saving) setModalOpen(false); };
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    const fromDay = Number(form.from_day);
    const toDay = Number(form.to_day);
    const payoutDay = Number(form.payout_day);
    if (!Number.isInteger(fromDay) || !Number.isInteger(toDay) || !Number.isInteger(payoutDay) || fromDay < 1 || toDay < fromDay || payoutDay < 1 || payoutDay > 31 || toDay > 31) {
      setFormError("Enter valid days between 1 and 31. To day must be after From day.");
      return;
    }

    setSaving(true);
    const payload = { from_day: fromDay, to_day: toDay, payout_day: payoutDay, status: form.status };
    const result = editing
      ? await updateReturnDateSettingApi(editing.id, payload)
      : await createReturnDateSettingApi(payload);
    setSaving(false);
    if (!result.success) {
      setFormError(result.error || "Unable to save return date setting.");
      return;
    }
    setModalOpen(false);
    await loadSettings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this return date setting?")) return;
    const result = await deleteReturnDateSettingApi(id);
    if (result.success) setSettings((current) => current.filter((setting) => setting.id !== id));
    else setListError(result.error || "Unable to delete return date setting.");
  };

  return (
    <AdminLayout>
      <div className="return-date-page">
        <div className="return-date-header">
          <div>
            <h1>Return Date Settings</h1>
            <div className="return-date-breadcrumb"><span>Dashboard</span><span>•</span><strong>Return Date Settings</strong></div>
          </div>
          <button type="button" className="return-date-primary-btn" onClick={() => openModal()}><FiPlus size={16} /> Add Setting</button>
        </div>

        <div className="return-date-card">
          <div className="return-date-card-heading"><h2>Payout Schedule</h2><p>Configure which day each investment range is paid.</p></div>
          <div className="return-date-table-wrap">
            <table className="return-date-table">
              <thead><tr><th>No</th><th>From Day</th><th>To Day</th><th>Payout Day</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="return-date-empty">Loading...</td></tr> : listError ? <tr><td colSpan="7" className="return-date-empty">{listError}</td></tr> : settings.length === 0 ? <tr><td colSpan="7" className="return-date-empty">No return date settings configured.</td></tr> : settings.map((setting, index) => (
                  <tr key={setting.id ?? index}>
                    <td>{index + 1}</td><td>{setting.from_day}</td><td>{setting.to_day}</td><td className="return-date-value">{setting.payout_day}</td>
                    <td><span className={`return-date-status ${setting.status ? "is-active" : "is-inactive"}`}>{setting.status ? "Active" : "Inactive"}</span></td>
                    <td>{setting.created_at ? new Date(setting.created_at).toLocaleString() : "-"}</td>
                    <td className="return-date-actions"><button type="button" title="Edit setting" onClick={() => openModal(setting)}><FiEdit2 size={14} /></button><button type="button" title="Delete setting" onClick={() => handleDelete(setting.id)}><FiTrash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && <div className="return-date-modal-backdrop" onClick={closeModal}><div className="return-date-modal" onClick={(event) => event.stopPropagation()}>
          <div className="return-date-modal-header"><h2>{editing ? "Edit Return Date" : "Add Return Date"}</h2><button type="button" onClick={closeModal} aria-label="Close"><FiX /></button></div>
          <form className="return-date-form" onSubmit={handleSubmit}>
            <div className="return-date-form-row"><div><label>From Day</label><input type="number" min="1" max="31" value={form.from_day} onChange={(event) => setField("from_day", event.target.value)} required /></div><div><label>To Day</label><input type="number" min="1" max="31" value={form.to_day} onChange={(event) => setField("to_day", event.target.value)} required /></div></div>
            <label>Payout Day</label><input type="number" min="1" max="31" value={form.payout_day} onChange={(event) => setField("payout_day", event.target.value)} required />
            <label className="return-date-toggle"><input type="checkbox" checked={form.status} onChange={(event) => setField("status", event.target.checked)} /> Active</label>
            {formError && <p className="return-date-form-error">{formError}</p>}
            <div className="return-date-modal-actions"><button type="button" className="return-date-secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="return-date-primary-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button></div>
          </form>
        </div></div>}
      </div>
    </AdminLayout>
  );
}

export default ReturnDateSettings;
