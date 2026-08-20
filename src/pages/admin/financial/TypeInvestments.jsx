import { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiTag,
} from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getInvestmentTypesApi,
  createInvestmentTypeApi,
  updateInvestmentTypeApi,
  deleteInvestmentTypeApi,
  MOCK_INVESTMENT_TYPES,
} from "../../../api/adminreturntype";
import "./PlanInvestments.css";

function TypeInvestments() {
  const [types, setTypes] = useState(MOCK_INVESTMENT_TYPES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Form State using return_type & status only
  const [formData, setFormData] = useState({
    return_type: "",
    status: true,
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    const res = await getInvestmentTypesApi();
    if (res.success && res.data) {
      setTypes(res.data);
    }
    setLoading(false);
  };

  const handleOpenModal = (typeObj = null) => {
    setLoading(false);
    setFormError("");
    setFormSuccess("");

    if (typeObj) {
      setEditingType(typeObj);
      setFormData({
        return_type: typeObj.return_type || typeObj.type_name || "",
        status: typeObj.status ?? true,
      });
    } else {
      setEditingType(null);
      setFormData({
        return_type: "",
        status: true,
      });
    }
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormError("");
    setFormSuccess("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const returnTypeName = String(formData.return_type || "").trim();
    if (!returnTypeName) {
      setFormError("Please enter a Return Type.");
      return;
    }

    setLoading(true);

    const submitData = {
      ...formData,
      return_type: returnTypeName,
      type_name: returnTypeName,
    };

    if (editingType) {
      const res = await updateInvestmentTypeApi(editingType.id, submitData);
      if (res.success) {
        setTypes((prev) =>
          prev.map((t) => (t.id === editingType.id ? { ...t, ...submitData } : t))
        );
        setFormSuccess("Return type updated successfully!");
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setFormError(res.error || "Failed to update return type.");
      }
    } else {
      const res = await createInvestmentTypeApi(submitData);
      if (res.success) {
        const newType = {
          id: res.data?.id || Date.now(),
          ...submitData,
          return_percentage: Number(formData.return_percentage),
          duration_months: Number(formData.duration_months),
        };
        setTypes([newType, ...types]);
        setFormSuccess("Return type created successfully!");
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setFormError(res.error || "Failed to create return type.");
      }
    }

    setLoading(false);
  };

  const handleDeleteType = async (id) => {
    if (window.confirm("Are you sure you want to delete this return type?")) {
      await deleteInvestmentTypeApi(id);
      setTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggleStatus = async (typeObj) => {
    const updatedStatus = !typeObj.status;
    const updatedType = { ...typeObj, status: updatedStatus };
    await updateInvestmentTypeApi(typeObj.id, updatedType);
    setTypes((prev) =>
      prev.map((t) => (t.id === typeObj.id ? { ...t, status: updatedStatus } : t))
    );
  };



  // Filter types by search and status
  const filteredTypes = types.filter((t) => {
    const typeLabel = t.return_type || t.type_name || "";
    const matchesSearch = typeLabel
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
          ? t.status === true
          : t.status === false;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="plan-investments-page">
        {/* Header & Breadcrumbs */}
        <div className="admin-page-header">
          <div className="header-title-block">
            <h1 className="admin-page-title">Return Type</h1>
            <div className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="crumb-sep">•</span>
              <span>Financial</span>
              <span className="crumb-sep">•</span>
              <span className="crumb-active">Return Type</span>
            </div>
          </div>
          <button
            type="button"
            className="create-plan-btn"
            onClick={() => handleOpenModal()}
          >
            <FiPlus size={16} />
            <span>Add Return Type</span>
          </button>
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
                placeholder="Search by return type..."
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

          {/* Investment / Return Types Table */}
          <div className="plans-table-wrapper">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Return Type</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((t, index) => (
                    <tr key={t.id || index}>
                      <td>{index + 1}</td>
                      <td className="plan-name-cell">
                        <FiTag className="cell-icon" />
                        <span>{t.return_type || t.type_name}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`status-badge-btn ${t.status ? "status--active" : "status--inactive"
                            }`}
                          onClick={() => handleToggleStatus(t)}
                          title="Click to toggle status"
                        >
                          {t.status ? (
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
                          onClick={() => handleOpenModal(t)}
                          title="Edit Type"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn action-delete"
                          onClick={() => handleDeleteType(t.id)}
                          title="Delete Type"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-cell">
                      No Return Types Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Return Type Modal */}
        {isModalOpen && (
          <div className="plan-modal-backdrop" onClick={handleCloseModal}>
            <div
              className="plan-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="plan-modal-header">
                <h3>{editingType ? "Edit Return Type" : "Add Return Type"}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleFormSubmit} className="plan-modal-body">
                {/* Return Type */}
                <div className="modal-field">
                  <label className="field-label">Return Type *</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Return"
                    value={formData.return_type}
                    onChange={(e) =>
                      setFormData({ ...formData, return_type: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Status Toggle */}
                <div className="modal-field status-toggle-field">

                  <label className="field-label">Status</label>
                  <div className="toggle-wrapper">
                    <input
                      type="checkbox"
                      id="type_status_toggle"
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="type_status_toggle"
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
                      : editingType
                        ? "Update Return Type"
                        : "Create Return Type"}
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

export default TypeInvestments;
