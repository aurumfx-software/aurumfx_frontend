import api from "./axios";

/**
 * All Investment Requests via GET /admin/investments/
 * No params
 */
export const getAllAdminInvestmentsApi = async () => {
  try {
    const response = await api.get("/admin/investments/");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load investments";
    return { success: false, error: errorMessage };
  }
};

/**
 * Pending Investments via GET /admin/investments/pending
 * Optional query: user_id, start_date, end_date
 */
export const getPendingInvestmentsApi = async (filters = {}) => {
  try {
    const params = {};
    if (filters.user_id) params.user_id = filters.user_id;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;

    const response = await api.get("/admin/investments/pending", { params });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load pending investments";
    return { success: false, error: errorMessage };
  }
};

/**
 * Active Investments via GET /admin/investments/active
 * Optional query: user_id, status, start_date, end_date
 */
export const getActiveInvestmentsApi = async (filters = {}) => {
  try {
    const params = {};
    if (filters.user_id) params.user_id = filters.user_id;
    if (filters.status) params.status = filters.status;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;

    const response = await api.get("/admin/investments/active", { params });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load active investments";
    return { success: false, error: errorMessage };
  }
};

/**
 * Today's Returns via GET /admin/investments/today-returns
 * No params
 */
export const getTodayReturnsApi = async () => {
  try {
    const response = await api.get("/admin/investments/today-returns");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load today's returns";
    return { success: false, error: errorMessage };
  }
};

/**
 * Approve Return via PUT /admin/investments/{id}/approve-return
 * Body: { remarks: string }
 */
export const approveReturnApi = async (id, remarks = "") => {
  const payload = { remarks };
  try {
    const response = await api.put(`/admin/investments/${id}/approve-return`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to approve return";
    return { success: false, error: errorMessage };
  }
};

/**
 * Investment Details via GET /admin/investments/{id}
 */
export const getAdminInvestmentDetailsApi = async (id) => {
  try {
    const response = await api.get(`/admin/investments/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load investment details";
    return { success: false, error: errorMessage };
  }
};

/**
 * Approve/Reject Investment via PUT /admin/investments/{id}
 * Body: { approval_status: string }  e.g. "Approved" | "Rejected"
 */
export const approveRejectInvestmentApi = async (id, approvalStatus) => {
  const payload = { approval_status: approvalStatus };
  try {
    const response = await api.put(`/admin/investments/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to update investment status";
    return { success: false, error: errorMessage };
  }
};