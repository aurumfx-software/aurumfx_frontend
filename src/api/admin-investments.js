import api from "./axios";

const getListData = (payload) => {
  const data = payload?.data || payload?.investments || payload || [];
  return Array.isArray(data) ? data : [];
};

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

/**
 * All Investment Requests via GET /admin/investments/
 * No params
 */
export const getAllAdminInvestmentsApi = async () => {
  try {
    const response = await api.get("/admin/investments/");
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load investments") };
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
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load pending investments") };
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
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load active investments") };
  }
};

/**
 * Today's Returns via GET /admin/investments/today-returns
 * No params
 */
export const getTodayReturnsApi = async () => {
  try {
    const response = await api.get("/admin/investments/today-returns");
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load today's returns") };
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
    return { success: false, error: getErrorMessage(error, "Unable to approve return") };
  }
};

/**
 * Investment Details via GET /admin/investments/{id}
 */
export const getAdminInvestmentDetailsApi = async (id) => {
  try {
    const response = await api.get(`/admin/investments/${id}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load investment details") };
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
    return { success: false, error: getErrorMessage(error, "Unable to update investment status") };
  }
};