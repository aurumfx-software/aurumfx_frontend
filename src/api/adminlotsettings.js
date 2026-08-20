import api from "./axios";

const getListData = (payload) => {
  const data = payload?.data || payload?.lots || payload || [];
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
 * Get all lots via GET /admin/lots/
 */
export const getLotsApi = async () => {
  try {
    const response = await api.get("/admin/lots/");
    return { success: true, data: getListData(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load lots") };
  }
};

/**
 * Create lot via POST /admin/lots/
 * Body: { lot_number, amount, status }
 */
export const createLotApi = async (lotData) => {
  const payload = {
    lot_number: Number(lotData.lot_number) || 0,
    amount: Number(lotData.amount) || 0,
    status: Number(lotData.status ?? 1),
  };
  try {
    const response = await api.post("/admin/lots/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create lot") };
  }
};

/**
 * Get single lot via GET /admin/lots/:lot_id
 */
export const getLotApi = async (lotId) => {
  try {
    const response = await api.get(`/admin/lots/${lotId}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load lot") };
  }
};

/**
 * Update lot via PUT /admin/lots/:lot_id
 * Body: { lot_number, amount, status }
 */
export const updateLotApi = async (lotId, lotData) => {
  const payload = {
    lot_number: Number(lotData.lot_number) || 0,
    amount: Number(lotData.amount) || 0,
    status: Number(lotData.status ?? 1),
  };
  try {
    const response = await api.put(`/admin/lots/${lotId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update lot") };
  }
};

/**
 * Delete lot via DELETE /admin/lots/:lot_id
 */
export const deleteLotApi = async (lotId) => {
  try {
    const response = await api.delete(`/admin/lots/${lotId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete lot") };
  }
};