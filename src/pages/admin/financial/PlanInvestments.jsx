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
  getInvestmentPlansApi,
  createInvestmentPlanApi,
  updateInvestmentPlanApi,
  deleteInvestmentPlanApi,
  MOCK_INVESTMENT_PLANS,
} from "../../../api/plans";
import "./PlanInvestments.css";

function PlanInvestments() {
  const [plans, setPlans] = useState(MOCK_INVESTMENT_PLANS);
  const [loading, setLoading] = useState(false);
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
    commission_percentage: "",
    daily_commission_limit: "",
    status: true,
    admin_fee_percentage: "",
    return_type: "Monthly",
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await getInvestmentPlansApi();
    if (res.success && res.data) {
      setPlans(res.data);
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
        commission_percentage: plan.commission_percentage ?? "",
        daily_commission_limit: plan.daily_commission_limit ?? "",
        admin_fee_percentage: plan.admin_fee_percentage ?? "",
        return_type: plan.return_type || "Monthly",
        status: plan.status ?? true,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        plan_name: "",
        duration_months: 10,
        return_percentage: 14.0,
        minimum_amount: 5000,
        commission_percentage: 5.0,
        daily_commission_limit: 10000,
        admin_fee_percentage: 2.0,
        return_type: "Monthly",
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.plan_name.trim()) {
      setFormError("Please enter a Plan Name.");
      return;
    }

    setLoading(true);

    if (editingPlan) {
      const res = await updateInvestmentPlanApi(editingPlan.id, formData);
      if (res.success) {
        setPlans((prev) =>
          prev.map((p) => (p.id === editingPlan.id ? { ...p, ...formData } : p))
        );
        setFormSuccess("Investment plan updated successfully!");
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setFormError(res.error || "Failed to update plan.");
      }
    } else {
      const res = await createInvestmentPlanApi(formData);
      if (res.success) {
        const newPlan = {
          id: res.data?.id || Date.now(),
          ...formData,
          duration_months: Number(formData.duration_months),
          return_percentage: Number(formData.return_percentage),
          minimum_amount: Number(formData.minimum_amount),
          commission_percentage: Number(formData.commission_percentage),
          daily_commission_limit: Number(formData.daily_commission_limit),
          admin_fee_percentage: Number(formData.admin_fee_percentage),
          return_type: formData.return_type || "Monthly",
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
        {/* Header & Breadcrumbs */}
        <div className="admin-page-header">
          <div className="header-title-block">
            <h1 className="admin-page-title">Investment Plan</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span>Financial</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Investment Plan</span>
            </div>
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

        {/* List Card Container */}
        <div className="list-page-card">
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
                  <th>Return Type</th>
                  <th>Minimum Amount</th>
                  <th>Commission (%)</th>
                  <th>Daily Commission Limit</th>
                  <th>Admin Fee (%)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.length > 0 ? (
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
                      <td>
                        <span className="modal-type-badge">
                          {plan.return_type || "Monthly"}
                        </span>
                      </td>
                      <td className="amount-cell">
                        ₹{Number(plan.minimum_amount).toLocaleString()}
                      </td>
                      <td>{Number(plan.commission_percentage).toFixed(2)}%</td>
                      <td>
                        ₹{Number(plan.daily_commission_limit).toLocaleString()}
                      </td>
                      <td>{Number(plan.admin_fee_percentage || 0).toFixed(2)}%</td>
                      <td>

                        <button
                          type="button"
                          className={`status-badge-btn ${plan.status ? "status--active" : "status--inactive"
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
                    <td colSpan="9" className="no-data-cell">
                      No Investment Plans Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Plan Modal */}
        {isModalOpen && (
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


                {/* 5 & 6. Commission % & Daily Commission Limit */}
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label className="field-label">Commission (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5.0"
                      value={formData.commission_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commission_percentage: e.target.value,
                        })
                      }
                      step="any"
                    />
                  </div>
                  <div className="modal-field">
                    <label className="field-label">
                      Daily Commission Limit (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={formData.daily_commission_limit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          daily_commission_limit: e.target.value,
                        })
                      }
                      step="any"
                    />
                  </div>
                </div>

                {/* Admin Fee (%) & Return Type */}
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label className="field-label">Admin Fee (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2.0"
                      value={formData.admin_fee_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin_fee_percentage: e.target.value,
                        })
                      }
                      step="any"
                    />
                  </div>
                  <div className="modal-field">
                    <label className="field-label">Return Type</label>
                    <select
                      className="modal-select"
                      style={{
                        border: "1.5px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "13.5px",
                        color: "#1e293b",
                        outline: "none",
                        background: "#fff",
                      }}
                      value={formData.return_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          return_type: e.target.value,
                        })
                      }
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Daily">Daily</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                </div>



                {/* 7. Status Toggle */}
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
        )}
      </div>
    </AdminLayout>
  );
}

export default PlanInvestments;
