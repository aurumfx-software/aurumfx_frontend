import api from "./axios";

/**
 * Get all level commissions via GET /admin/level-settings/
 */
export const getAllLevelsApi = async () => {
  try {
    const response = await api.get("/admin/level-settings/");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : (data?.data || []) };
  } catch (error) {
    let errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to load level settings";
    return { success: false, error: errorMessage };
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
    let errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to create level";
    return { success: false, error: errorMessage };
  }
};

/**
 * Get single level via GET /admin/level-settings/:level
 */
export const getLevelApi = async (level) => {
  try {
    const response = await api.get(`/admin/level-settings/${level}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to load level";
    return { success: false, error: errorMessage };
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
    let errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to update level";
    return { success: false, error: errorMessage };
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
    let errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to delete level";
    return { success: false, error: errorMessage };
  }
};