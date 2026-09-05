import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  createAdminFeeApi,
  deleteAdminFeeApi,
  getAdminFeesApi,
  updateAdminFeeApi,
} from "../../../api/admin-fees";
import "./AdminFeeSettings.css";
import "./SettingsHeader.css";

function AdminFeeSettings() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [feePercentage, setFeePercentage] = useState("");
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadFees = async () => {
    setLoading(true);
    setListError("");
    const result = await getAdminFeesApi();
    if (result.success) {
      setFees(result.data);
    } else {
      setFees([]);
      setListError(result.error || "Unable to load admin fees");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFees();
  }, []);

  const openModal = (fee = null) => {
    setEditingFee(fee);
    setFeePercentage(fee?.fee_percentage ?? "");
    setStatus(fee?.status ?? true);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (feePercentage === "" || Number(feePercentage) < 0) {
      setFormError("Enter a valid fee percentage.");
      return;
    }

    setSaving(true);
    const payload = { fee_percentage: feePercentage, status };
    const result = editingFee
      ? await updateAdminFeeApi(editingFee.id, payload)
      : await createAdminFeeApi(payload);
    setSaving(false);

    if (!result.success) {
      setFormError(result.error || "Unable to save admin fee");
      return;
    }

    setModalOpen(false);
    await loadFees();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin fee?")) return;
    const result = await deleteAdminFeeApi(id);
    if (result.success) {
      setFees((current) => current.filter((fee) => fee.id !== id));
    } else {
      setListError(result.error || "Unable to delete admin fee");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-fee-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Settings Management</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Admin Fee</h1>
              <p className="agen-page-subtitle">Manage the percentage applied to applicable admin transactions</p>
            </div>
          <button type="button" className="admin-fee-primary-btn" onClick={() => openModal()}>
            <FiPlus size={16} /> Add Admin Fee
          </button>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Admin Fee</span></div>
        </div>

        <div className="admin-fee-card">
          <div className="admin-fee-card-title">
            <div>
              <h2>Fee Configuration</h2>
              <p>Manage the percentage applied to applicable admin transactions.</p>
            </div>
          </div>
          <div className="admin-fee-table-wrap">
            <table className="admin-fee-table">
              <thead>
                <tr><th>No</th><th>Fee Percentage</th><th>Status</th><th>Created At</th><th>Updated At</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="admin-fee-empty">Loading...</td></tr>
                ) : listError ? (
                  <tr><td colSpan="6" className="admin-fee-empty">{listError}</td></tr>
                ) : fees.length === 0 ? (
                  <tr><td colSpan="6" className="admin-fee-empty">No admin fees configured.</td></tr>
                ) : fees.map((fee, index) => (
                  <tr key={fee.id ?? index}>
                    <td>{index + 1}</td>
                    <td className="admin-fee-value">{Number(fee.fee_percentage).toFixed(2)}%</td>
                    <td><span className={`admin-fee-status ${fee.status ? "is-active" : "is-inactive"}`}>{fee.status ? "Active" : "Inactive"}</span></td>
                    <td>{fee.created_at ? new Date(fee.created_at).toLocaleString() : "-"}</td>
                    <td>{fee.updated_at ? new Date(fee.updated_at).toLocaleString() : "-"}</td>
                    <td className="admin-fee-actions">
                      <button type="button" title="Edit admin fee" onClick={() => openModal(fee)}><FiEdit2 size={14} /></button>
                      <button type="button" title="Delete admin fee" onClick={() => handleDelete(fee.id)}><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && createPortal(
          <div className="admin-fee-modal-backdrop" onClick={closeModal}>
            <div className="admin-fee-modal" onClick={(event) => event.stopPropagation()}>
              <div className="admin-fee-modal-header">
                <h2>{editingFee ? "Edit Admin Fee" : "Add Admin Fee"}</h2>
                <button type="button" onClick={closeModal} aria-label="Close"><FiX /></button>
              </div>
              <form onSubmit={handleSubmit} className="admin-fee-form">
                <label>Fee Percentage (%)</label>
                <input type="number" min="0" step="0.01" value={feePercentage} onChange={(event) => setFeePercentage(event.target.value)} required />
                <label className="admin-fee-toggle-label">
                  <input type="checkbox" checked={status} onChange={(event) => setStatus(event.target.checked)} />
                  <span>Active</span>
                </label>
                {formError && <p className="admin-fee-form-error">{formError}</p>}
                <div className="admin-fee-modal-actions">
                  <button type="button" className="admin-fee-secondary-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="admin-fee-primary-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        , document.body)}
      </div>
    </AdminLayout>
  );
}

export default AdminFeeSettings;
