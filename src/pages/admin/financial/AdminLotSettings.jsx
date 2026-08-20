import { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiLayers,
} from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getLotsApi,
  createLotApi,
  updateLotApi,
  deleteLotApi,
} from "../../../api/adminlotsettings";
import "./PlanInvestments.css";

function AdminLotSettings() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState(null);

  const [formData, setFormData] = useState({
    lot_number: "",
    amount: "",
    status: 1,
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    setLoading(true);
    setListError("");
    const res = await getLotsApi();
    if (res.success) {
      setLots(res.data);
    } else {
      setLots([]);
      setListError(res.error || "Unable to load lots.");
    }
    setLoading(false);
  };

  const handleOpenModal = (lot = null) => {
    setFormError("");
    setFormSuccess("");

    if (lot) {
      setEditingLot(lot);
      setFormData({
        lot_number: lot.lot_number ?? "",
        amount: lot.amount ?? "",
        status: lot.status ?? 1,
      });
    } else {
      setEditingLot(null);
      setFormData({ lot_number: "", amount: "", status: 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLot(null);
    setFormError("");
    setFormSuccess("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.lot_number || !formData.amount) {
      setFormError("Please fill Lot Number and Amount.");
      return;
    }

    setLoading(true);

    if (editingLot) {
      const res = await updateLotApi(editingLot.id, formData);
      if (res.success) {
        setFormSuccess("Lot updated successfully!");
        await fetchLots();
        setTimeout(() => handleCloseModal(), 800);
      } else {
        setFormError(res.error || "Failed to update lot.");
      }
    } else {
      const res = await createLotApi(formData);
      if (res.success) {
        setFormSuccess("Lot created successfully!");
        await fetchLots();
        setTimeout(() => handleCloseModal(), 800);
      } else {
        setFormError(res.error || "Failed to create lot.");
      }
    }

    setLoading(false);
  };

  const handleDeleteLot = async (id) => {
    if (window.confirm("Are you sure you want to delete this lot?")) {
      await deleteLotApi(id);
      setLots((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleToggleStatus = async (lot) => {
    const updatedStatus = lot.status === 1 ? 0 : 1;
    await updateLotApi(lot.id, { ...lot, status: updatedStatus });
    setLots((prev) =>
      prev.map((l) => (l.id === lot.id ? { ...l, status: updatedStatus } : l))
    );
  };

  const filteredLots = lots.filter((l) => {
    const matchesSearch = String(l.lot_number || "").includes(searchQuery);
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? l.status === 1
        : l.status === 0;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="plan-investments-page">
        <div className="admin-page-header">
          <div className="header-title-block">
            <h1 className="admin-page-title">Lot Settings</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span>Financial</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Lot Settings</span>
            </div>
          </div>
          <button type="button" className="create-plan-btn" onClick={() => handleOpenModal()}>
            <FiPlus size={16} />
            <span>Add Lot</span>
          </button>
        </div>

        <div className="plan-list-card">
          <div className="plans-filter-row">
            <div className="search-input-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by lot number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-select-box">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="plans-table-wrapper">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Lot Number</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="no-data-cell">Loading...</td></tr>
                ) : listError ? (
                  <tr><td colSpan="6" className="no-data-cell">{listError}</td></tr>
                ) : filteredLots.length > 0 ? (
                  filteredLots.map((lot, index) => (
                    <tr key={lot.id}>
                      <td>{index + 1}</td>
                      <td className="plan-name-cell">
                        <FiLayers className="cell-icon" />
                        <span>Lot #{lot.lot_number}</span>
                      </td>
                      <td className="amount-cell">₹{Number(lot.amount).toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-badge-btn ${lot.status === 1 ? "status--active" : "status--inactive"}`}
                          onClick={() => handleToggleStatus(lot)}
                        >
                          {lot.status === 1 ? (
                            <><FiCheckCircle size={12} /> Active</>
                          ) : (
                            <><FiXCircle size={12} /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td>{lot.created_at ? new Date(lot.created_at).toLocaleDateString() : "-"}</td>
                      <td className="text-right actions-cell">
                        <button type="button" className="action-icon-btn action-edit" onClick={() => handleOpenModal(lot)}>
                          <FiEdit2 size={14} />
                        </button>
                        <button type="button" className="action-icon-btn action-delete" onClick={() => handleDeleteLot(lot.id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="no-data-cell">No Lots Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="plan-modal-backdrop" onClick={handleCloseModal}>
            <div className="plan-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="plan-modal-header">
                <h3>{editingLot ? "Edit Lot" : "Add Lot"}</h3>
                <button type="button" className="modal-close-btn" onClick={handleCloseModal}>
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="plan-modal-body">
                <div className="modal-field">
                  <label className="field-label">Lot Number *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={formData.lot_number}
                    onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label className="field-label">Amount (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-field status-toggle-field">
                  <label className="field-label">Status</label>
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="lot_status_toggle"
                      checked={formData.status === 1}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                    />
                    <label htmlFor="lot_status_toggle" className="toggle-slider" />
                    <span className="toggle-text">{formData.status === 1 ? "Active" : "Inactive"}</span>
                  </div>
                </div>

                {formError && <div className="modal-alert error">{formError}</div>}
                {formSuccess && <div className="modal-alert success">{formSuccess}</div>}

                <div className="plan-modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Saving..." : editingLot ? "Update Lot" : "Create Lot"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminLotSettings;