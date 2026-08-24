import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

const unwrap = (response) => response.data?.data || response.data || {};

export const getReturnDateSettingsApi = async () => {
  try {
    const response = await api.get("/admin/return-date-settings/");
    const data = unwrap(response);
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load return date settings.") };
  }
};

/** GET /admin/return-date-settings/{setting_id} */
export const getReturnDateSettingApi = async (settingId) => {
  try {
    const response = await api.get(`/admin/return-date-settings/${encodeURIComponent(settingId)}`);
    return { success: true, data: unwrap(response) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load return date setting.") };
  }
};

export const createReturnDateSettingApi = async (payload) => {
  try {
    const response = await api.post("/admin/return-date-settings/", payload);
    return { success: true, data: unwrap(response) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create return date setting.") };
  }
};

export const updateReturnDateSettingApi = async (settingId, payload) => {
  try {
    const response = await api.put(`/admin/return-date-settings/${encodeURIComponent(settingId)}`, payload);
    return { success: true, data: unwrap(response) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update return date setting.") };
  }
};

export const deleteReturnDateSettingApi = async (settingId) => {
  try {
    const response = await api.delete(`/admin/return-date-settings/${encodeURIComponent(settingId)}`);
    return { success: true, data: unwrap(response) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete return date setting.") };
  }
};
