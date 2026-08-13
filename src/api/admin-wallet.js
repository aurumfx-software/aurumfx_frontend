import api from "./axios";

/**
 * Admin Wallet Summary via GET /admin/wallet/summary
 */
export const getAdminWalletSummaryApi = async () => {
  try {
    const response = await api.get("/admin/wallet/summary");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load wallet summary";
    return { success: false, error: errorMessage };
  }
};

/**
 * Admin Fee History via GET /admin/wallet/history
 * Optional query: start_date, end_date
 */
export const getAdminFeeHistoryApi = async (filters = {}) => {
  try {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;

    const response = await api.get("/admin/wallet/history", { params });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load fee history";
    return { success: false, error: errorMessage };
  }
};

/**
 * Today's Admin Fee via GET /admin/wallet/today
 */
export const getTodayAdminFeeApi = async () => {
  try {
    const response = await api.get("/admin/wallet/today");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load today's fee";
    return { success: false, error: errorMessage };
  }
};

/**
 * Admin Fee Details via GET /admin/wallet/{id}
 */
export const getAdminFeeDetailsApi = async (id) => {
  try {
    const response = await api.get(`/admin/wallet/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load fee details";
    return { success: false, error: errorMessage };
  }
};