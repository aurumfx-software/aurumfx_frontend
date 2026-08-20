import api from "./axios";

const getListData = (payload) => {
  const data = payload?.data || payload?.levels || payload || [];
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
 * Get all level commissions via GET /admin/level-settings/
 */
export const getAllLevelsApi = async () => {
  try {
    const response = await api.get("/admin/level-settings/");
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load level settings") };
  }
};

/**
 * Create a level commission via POST /admin/level-settings/
 * body: { level, commission_percentage }
 */
export const createLevelApi = async (payload) => {
  try {
    const response = await api.post("/admin/level-settings/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create level") };
  }
};

/**
 * Get single level via GET /admin/level-settings/:level
 */
export const getLevelApi = async (level) => {
  try {
    const response = await api.get(`/admin/level-settings/${level}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load level") };
  }
};

/**
 * Update a level via PUT /admin/level-settings/:level
 * body: { commission_percentage, status }
 */
export const updateLevelApi = async (level, payload) => {
  try {
    const response = await api.put(`/admin/level-settings/${level}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update level") };
  }
};

/**
 * Delete a level via DELETE /admin/level-settings/:level
 */
export const deleteLevelApi = async (level) => {
  try {
    const response = await api.delete(`/admin/level-settings/${level}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete level") };
  }
};