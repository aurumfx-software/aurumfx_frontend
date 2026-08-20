import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

export const getReferralCommissionSettingsApi = async () => {
  try {
    const response = await api.get("/admin/referral-commission-settings");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load referral commission settings") };
  }
};

export const getReferralCommissionSettingApi = async (id) => {
  try {
    const response = await api.get(`/admin/referral-commission-settings/${id}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load referral commission setting") };
  }
};

const buildPayload = (data) => ({
  investment_plan_id: Number(data.investment_plan_id) || 0,
  minimum_amount: Number(data.minimum_amount) || 0,
  maximum_amount: Number(data.maximum_amount) || 0,
  commission_percentage: Number(data.commission_percentage) || 0,
  status: Boolean(data.status ?? true),
});

export const createReferralCommissionSettingApi = async (data) => {
  try {
    const response = await api.post("/admin/referral-commission-settings", buildPayload(data));
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create referral commission setting") };
  }
};

export const updateReferralCommissionSettingApi = async (id, data) => {
  try {
    const response = await api.put(`/admin/referral-commission-settings/${id}`, buildPayload(data));
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update referral commission setting") };
  }
};

export const deleteReferralCommissionSettingApi = async (id) => {
  try {
    const response = await api.delete(`/admin/referral-commission-settings/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete referral commission setting") };
  }
};
