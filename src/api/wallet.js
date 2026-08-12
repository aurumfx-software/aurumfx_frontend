import api from "./axios";

/**
 * Wallet Summary via GET /wallet/summary
 */
export const getWalletSummaryApi = async () => {
  try {
    const response = await api.get("/wallet/summary");
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
 * Commission History via GET /wallet/commissions
 */
export const getCommissionHistoryApi = async () => {
  try {
    const response = await api.get("/wallet/commissions");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : (data?.data || []) };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load commission history";
    return { success: false, error: errorMessage };
  }
};

/**
 * Today's Commission via GET /wallet/today
 */
export const getTodayCommissionApi = async () => {
  try {
    const response = await api.get("/wallet/today");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load today's commission";
    return { success: false, error: errorMessage };
  }
};

/**
 * Commission Details via GET /wallet/commissions/:id
 */
export const getCommissionDetailsApi = async (id) => {
  try {
    const response = await api.get(`/wallet/commissions/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load commission details";
    return { success: false, error: errorMessage };
  }
};