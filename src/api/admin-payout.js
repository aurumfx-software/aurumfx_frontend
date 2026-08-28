import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

export const getPendingPayoutsApi = async () => {
  try {
    const response = await api.get("/admin/payout/pending");
    const payload = response.data || {};
    const items = Array.isArray(payload) ? payload : payload.items || payload.data?.items || payload.data || [];
    return {
      success: true,
      data: {
        total: Number(payload.total ?? items.length ?? 0),
        items: Array.isArray(items) ? items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load pending payouts") };
  }
};

export const payUserPayoutApi = async (userId) => {
  try {
    const response = await api.post(`/admin/payout/${userId}/pay`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to pay user") };
  }
};

export const rejectUserPayoutApi = async (userId, rejectionReason) => {
  try {
    const response = await api.post(`/admin/payout/${userId}/reject`, {
      rejection_reason: rejectionReason.trim(),
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to reject payout") };
  }
};

export const getPaidPayoutsApi = async () => {
  try {
    const response = await api.get("/admin/payout/paid");
    const payload = response.data || {};
    const items = Array.isArray(payload) ? payload : payload.items || payload.data?.items || payload.data || [];
    return {
      success: true,
      data: {
        total: Number(payload.total ?? items.length ?? 0),
        items: Array.isArray(items) ? items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load paid payouts") };
  }
};

export const getPayoutHistoryApi = async (filters = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => String(value || "").trim() !== "")
    );
    const response = await api.get("/admin/payout/history", { params });
    const responseData = response.data || {};
    const payload = responseData.data && !Array.isArray(responseData.data)
      ? responseData.data
      : responseData;
    const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
    return {
      success: true,
      data: {
        total: Number(payload.total ?? responseData.total ?? items.length ?? 0),
        items: Array.isArray(items) ? items.map((item) => ({
          ...item,
          user_code: item.user_code ?? item.userCode ?? "",
          user_name: item.user_name ?? item.userName ?? item.username ?? "",
          bank_details: item.bank_details ?? item.bankDetails ?? null,
          payout_method: item.payout_method ?? item.payoutMethod ?? "",
          payout_information: item.payout_information ?? item.payoutInformation ?? null,
          paid_at: item.paid_at ?? item.paidAt ?? null,
          created_at: item.created_at ?? item.createdAt ?? null,
        })) : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load payout history") };
  }
};
