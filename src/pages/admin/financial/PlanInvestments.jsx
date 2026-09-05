import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  getInvestmentPlansApi,
  createInvestmentPlanApi,
  updateInvestmentPlanApi,
  deleteInvestmentPlanApi,
} from "../../../api/adminplans";
import "./PlanInvestments.css";
import "../settings/SettingsHeader.css";

function PlanInvestments() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Form State matching requested schema
  const [formData, setFormData] = useState({
    plan_name: "",
    duration_months: "",
    return_percentage: "",
    minimum_amount: "",
    status: true,
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setListError("");
    const res = await getInvestmentPlansApi();
    if (res.success && res.data) {
      setPlans(res.data);
    } else {
      setPlans([]);
      setListError(res.error || "Unable to load investment plans.");
    }
    setLoading(false);
  };

  const handleOpenModal = (plan = null) => {
    setLoading(false);
    setFormError("");
    setFormSuccess("");

    if (plan) {
      setEditingPlan(plan);
      setFormData({
        plan_name: plan.plan_name || "",
        duration_months: plan.duration_months ?? "",
        return_percentage: plan.return_percentage ?? "",
        minimum_amount: plan.minimum_amount ?? "",
        status: plan.status ?? true,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        plan_name: "",
        duration_months: 10,
        return_percentage: 14.0,
        minimum_amount: 5000,
        status: true,
      });
    }
    setIsModalOpen(true);
  };



  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setFormError("");
    setFormSuccess("");
  };

  const normalizeNumberValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.plan_name.trim()) {
      setFormError("Please enter a Plan Name.");
      return;
    }

    setLoading(true);

    const sanitizedFormData = {
      ...formData,
      duration_months: normalizeNumberValue(formData.duration_months),
      return_percentage: normalizeNumberValue(formData.return_percentage),
      minimum_amount: normalizeNumberValue(formData.minimum_amount),
    };

    if (editingPlan) {
      const res = await updateInvestmentPlanApi(editingPlan.id, sanitizedFormData);
      if (res.success) {
        setPlans((prev) =>
          prev.map((p) => (p.id === editingPlan.id ? { ...p, ...sanitizedFormData } : p))
        );
        setFormSuccess("Investment plan updated successfully!");
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setFormError(res.error || "Failed to update plan.");
      }
    } else {
      const res = await createInvestmentPlanApi(sanitizedFormData);
      if (res.success) {
        const newPlan = {
          id: res.data?.id || Date.now(),
          ...sanitizedFormData,
        };
        setPlans([newPlan, ...plans]);
        setFormSuccess("Investment plan created successfully!");
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setFormError(res.error || "Failed to create plan.");
      }
    }

    setLoading(false);
  };

  const handleDeletePlan = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this investment plan?")
    ) {
      await deleteInvestmentPlanApi(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = async (plan) => {
    const updatedStatus = !plan.status;
    const updatedPlan = { ...plan, status: updatedStatus };
    await updateInvestmentPlanApi(plan.id, updatedPlan);
    setPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? { ...p, status: updatedStatus } : p))
    );
  };



  // Filter plans by search and status
  const filteredPlans = plans.filter((p) => {
    const matchesSearch = String(p.plan_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? p.status === true
        : p.status === false;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="plan-investments-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Settings Management</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Investment Plan</h1>
              <p className="agen-page-subtitle">Manage investment plans, returns, and eligibility criteria</p>
            </div>
            <button
            type="button"
            className="create-plan-btn"
            onClick={() => handleOpenModal()}
          >
            <FiPlus size={16} />
            <span>Add New Plan</span>
            </button>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Investment Plan</span></div>
        </div>

        {/* List Card Container */}
        <div className="plan-list-card">
          {/* Top Actions Row */}
          <div className="plans-filter-row">
            {/* Search Input */}
            <div className="search-input-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search plan by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="filter-select-box">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Investment Plans Table */}
          <div className="plans-table-wrapper">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Plan Name</th>
                  <th>Duration (Months)</th>
                  <th>Return (%)</th>
                  <th>Minimum Amount</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="no-data-cell">Loading investment plans...</td>
                  </tr>
                ) : listError ? (
                  <tr>
                    <td colSpan="7" className="no-data-cell">{listError}</td>
                  </tr>
                ) : filteredPlans.length > 0 ? (
                  filteredPlans.map((plan, index) => (
                    <tr key={plan.id || index}>
                      <td>{index + 1}</td>
                      <td className="plan-name-cell">
                        <FiLayers className="cell-icon" />
                        <span>{plan.plan_name}</span>
                      </td>
                      <td>{plan.duration_months} Months</td>
                      <td className="text-green font-bold">
                        {Number(plan.return_percentage).toFixed(2)}%
                      </td>
                      <td className="amount-cell">
                        ₹{Number(plan.minimum_amount).toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`status-badge-btn ${
                            plan.status ? "status--active" : "status--inactive"
                          }`}
                          onClick={() => handleToggleStatus(plan)}
                          title="Click to toggle status"
                        >
                          {plan.status ? (
                            <>
                              <FiCheckCircle size={12} /> Active
                            </>
                          ) : (
                            <>
                              <FiXCircle size={12} /> Inactive
                            </>
                          )}
                        </button>
                      </td>


                      <td className="text-right actions-cell">
                        <button
                          type="button"
                          className="action-icon-btn action-edit"
                          onClick={() => handleOpenModal(plan)}
                          title="Edit Plan"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn action-delete"
                          onClick={() => handleDeletePlan(plan.id)}
                          title="Delete Plan"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data-cell">
                      No Investment Plans Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Plan Modal */}
        {isModalOpen && createPortal(
          <div className="plan-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="plan-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="plan-modal-header">
                <h3>
                  {editingPlan ? "Edit Investment Plan" : "Add Investment Plan"}
                </h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Form matching exact schema */}
              <form onSubmit={handleFormSubmit} className="plan-modal-body">
                {/* 1. Plan Name */}
                <div className="modal-field">
                  <label className="field-label">Plan Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Starter FX Plan"
                    value={formData.plan_name}
                    onChange={(e) =>
                      setFormData({ ...formData, plan_name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* 2 & 3. Duration & Return % */}
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label className="field-label">Duration (Months) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.duration_months}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration_months: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-field">
                    <label className="field-label">Return (%) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 14.0"
                      value={formData.return_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          return_percentage: e.target.value,
                        })
                      }
                      step="any"
                      required
                    />
                  </div>
                </div>

                {/* 4. Minimum Amount */}
                <div className="modal-field">
                  <label className="field-label">Minimum Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.minimum_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimum_amount: e.target.value,
                      })
                    }
                    step="any"
                  />
                </div>

                {/* Status Toggle */}
                <div className="modal-field status-toggle-field">
                  <label className="field-label">Status</label>
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="plan_status_toggle"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="plan_status_toggle"
                      className="toggle-slider"
                    />
                    <span className="toggle-text">
                      {formData.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Error & Success Messages */}
                {formError && (
                  <div className="modal-alert error">{formError}</div>
                )}
                {formSuccess && (
                  <div className="modal-alert success">{formSuccess}</div>
                )}

                {/* Modal Footer Actions */}
                <div className="plan-modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingPlan
                        ? "Update Plan"
                        : "Create Plan"}
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

export default PlanInvestments;
