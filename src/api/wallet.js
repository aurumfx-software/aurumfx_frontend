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
 * Wallet Transaction History via GET /wallet/transactions
 */
export const getWalletTransactionsApi = async () => {
  try {
    const response = await api.get("/wallet/transactions");
    const payload = response.data;
    const data = Array.isArray(payload)
      ? payload
      : payload?.transactions || payload?.data?.transactions || payload?.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load wallet transaction history";
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