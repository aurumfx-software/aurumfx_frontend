import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

/** GET /admin/wallet/transactions with the active filters. */
export const getAdminWalletTransactionsApi = async (filters = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => String(value ?? "").trim() !== "")
    );
    const response = await api.get("/admin/wallet/transactions", { params });
    const payload = response.data?.data || response.data || [];
    return {
      success: true,
      data: Array.isArray(payload) ? payload : [],
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load wallet transactions.") };
  }
};
