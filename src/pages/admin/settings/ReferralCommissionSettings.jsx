import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getInvestmentPlansApi } from "../../../api/adminplans";
import {
  createReferralCommissionSettingApi,
  deleteReferralCommissionSettingApi,
  getReferralCommissionSettingsApi,
  updateReferralCommissionSettingApi,
} from "../../../api/admin-referral-commission";
import "./ReferralCommissionSettings.css";
import "./SettingsHeader.css";

const emptyForm = { investment_plan_id: "", minimum_amount: "", maximum_amount: "", commission_percentage: "", status: true };

function ReferralCommissionSettings() {
  const [settings, setSettings] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setListError("");
    const [settingsResult, plansResult] = await Promise.all([
      getReferralCommissionSettingsApi(),
      getInvestmentPlansApi(),
    ]);
    if (settingsResult.success) setSettings(settingsResult.data);
    else setListError(settingsResult.error || "Unable to load referral commission settings");
    if (plansResult.success) setPlans(plansResult.data);
    else if (!listError) setListError(plansResult.error || "Unable to load investment plans");
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (setting = null) => {
    setEditing(setting);
    setForm(setting ? {
      investment_plan_id: setting.investment_plan_id ?? "",
      minimum_amount: setting.minimum_amount ?? "",
      maximum_amount: setting.maximum_amount ?? "",
      commission_percentage: setting.commission_percentage ?? "",
      status: setting.status ?? true,
    } : { ...emptyForm, investment_plan_id: plans[0]?.id || "" });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => { if (!saving) setModalOpen(false); };
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!form.investment_plan_id || form.minimum_amount === "" || form.commission_percentage === "") {
      setFormError("Plan, minimum amount, and commission percentage are required.");
      return;
    }
    if (form.maximum_amount !== "" && Number(form.maximum_amount) < Number(form.minimum_amount)) {
      setFormError("Maximum amount must be greater than or equal to minimum amount.");
      return;
    }

    setSaving(true);
    const result = editing
      ? await updateReferralCommissionSettingApi(editing.id, form)
      : await createReferralCommissionSettingApi(form);
    setSaving(false);
    if (!result.success) {
      setFormError(result.error || "Unable to save referral commission setting");
      return;
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this referral commission setting?")) return;
    const result = await deleteReferralCommissionSettingApi(id);
    if (result.success) setSettings((current) => current.filter((setting) => setting.id !== id));
    else setListError(result.error || "Unable to delete referral commission setting");
  };

  return (
    <AdminLayout>
      <div className="referral-commission-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Settings Management</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Referral Commission</h1>
              <p className="agen-page-subtitle">Configure referral commission bands for each investment plan</p>
            </div>
            <button type="button" className="referral-primary-btn" onClick={() => openModal()}><FiPlus size={16} /> Add Setting</button>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Referral Commission</span></div>
        </div>

        <div className="referral-card">
          <div className="referral-card-heading"><h2>Commission Settings</h2><p>Configure referral commission bands for each investment plan.</p></div>
          <div className="referral-table-wrap">
            <table className="referral-table">
              <thead><tr><th>No</th><th>Plan</th><th>Amount Range</th><th>Commission</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="referral-empty">Loading...</td></tr> : listError ? <tr><td colSpan="7" className="referral-empty">{listError}</td></tr> : settings.length === 0 ? <tr><td colSpan="7" className="referral-empty">No referral commission settings configured.</td></tr> : settings.map((setting, index) => (
                  <tr key={setting.id ?? index}>
                    <td>{index + 1}</td><td>{setting.plan_name || `Plan #${setting.investment_plan_id}`}</td>
                    <td>₹{Number(setting.minimum_amount).toLocaleString()} - ₹{Number(setting.maximum_amount).toLocaleString()}</td>
                    <td className="referral-value">{Number(setting.commission_percentage).toFixed(2)}%</td>
                    <td><span className={`referral-status ${setting.status ? "is-active" : "is-inactive"}`}>{setting.status ? "Active" : "Inactive"}</span></td>
                    <td>{setting.created_at ? new Date(setting.created_at).toLocaleString() : "-"}</td>
                    <td className="referral-actions"><button type="button" title="Edit" onClick={() => openModal(setting)}><FiEdit2 size={14} /></button><button type="button" title="Delete" onClick={() => handleDelete(setting.id)}><FiTrash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && createPortal(<div className="referral-modal-backdrop" onClick={closeModal}><div className="referral-modal" onClick={(event) => event.stopPropagation()}>
          <div className="referral-modal-header"><h2>{editing ? "Edit Referral Commission" : "Add Referral Commission"}</h2><button type="button" onClick={closeModal} aria-label="Close"><FiX /></button></div>
          <form className="referral-form" onSubmit={handleSubmit}>
            <label>Investment Plan</label><select value={form.investment_plan_id} onChange={(event) => setField("investment_plan_id", event.target.value)} disabled={Boolean(editing)} required><option value="">Select plan</option>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.plan_name}</option>)}</select>
            <div className="referral-form-row"><div><label>Minimum Amount</label><input type="number" min="0" step="0.01" value={form.minimum_amount} onChange={(event) => setField("minimum_amount", event.target.value)} required /></div><div><label>Maximum Amount <span>(optional)</span></label><input type="number" min="0" step="0.01" value={form.maximum_amount} onChange={(event) => setField("maximum_amount", event.target.value)} /></div></div>
            <label>Commission Percentage (%)</label><input type="number" min="0" step="0.01" value={form.commission_percentage} onChange={(event) => setField("commission_percentage", event.target.value)} required />
            <label className="referral-toggle"><input type="checkbox" checked={form.status} onChange={(event) => setField("status", event.target.checked)} /> Active</label>
            {formError && <p className="referral-form-error">{formError}</p>}
            <div className="referral-modal-actions"><button type="button" className="referral-secondary-btn" onClick={closeModal}>Cancel</button><button type="submit" className="referral-primary-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button></div>
          </form>
        </div></div>, document.body)}
      </div>
    </AdminLayout>
  );
}

export default ReferralCommissionSettings;
