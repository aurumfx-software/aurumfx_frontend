import api from "./axios";

/**
 * Get all lots via GET /admin/lot-settings/
 */
export const getLotsApi = async () => {
  try {
    const response = await api.get("/admin/lot-settings/");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load lots";
    return { success: false, error: errorMessage };
  }
};

/**
 * Create lot via POST /admin/lot-settings/
 * Body: { lot_number, amount, status }
 */
export const createLotApi = async (lotData) => {
  const payload = {
    lot_number: Number(lotData.lot_number) || 0,
    amount: Number(lotData.amount) || 0,
    status: Number(lotData.status ?? 1),
  };
  try {
    const response = await api.post("/admin/lot-settings/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to create lot";
    return { success: false, error: errorMessage };
  }
};

/**
 * Get single lot via GET /admin/lot-settings/:lot_id
 */
export const getLotApi = async (lotId) => {
  try {
    const response = await api.get(`/admin/lot-settings/${lotId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load lot";
    return { success: false, error: errorMessage };
  }
};

/**
 * Update lot via PUT /admin/lot-settings/:lot_id
 * Body: { lot_number, amount, status }
 */
export const updateLotApi = async (lotId, lotData) => {
  const payload = {
    lot_number: Number(lotData.lot_number) || 0,
    amount: Number(lotData.amount) || 0,
    status: Number(lotData.status ?? 1),
  };
  try {
    const response = await api.put(`/admin/lot-settings/${lotId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to update lot";
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete lot via DELETE /admin/lot-settings/:lot_id
 */
export const deleteLotApi = async (lotId) => {
  try {
    const response = await api.delete(`/admin/lot-settings/${lotId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to delete lot";
    return { success: false, error: errorMessage };
  }
};