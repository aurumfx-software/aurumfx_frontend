import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

export const getAdminFeesApi = async () => {
  try {
    const response = await api.get("/admin/admin-fees");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load admin fees") };
  }
};

export const createAdminFeeApi = async (feeData) => {
  const payload = {
    fee_percentage: Number(feeData.fee_percentage) || 0,
    status: Boolean(feeData.status ?? true),
  };

  try {
    const response = await api.post("/admin/admin-fees", payload);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create admin fee") };
  }
};

export const updateAdminFeeApi = async (feeId, feeData) => {
  const payload = {
    fee_percentage: Number(feeData.fee_percentage) || 0,
    status: Boolean(feeData.status ?? true),
  };

  try {
    const response = await api.put(`/admin/admin-fees/${feeId}`, payload);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update admin fee") };
  }
};

export const deleteAdminFeeApi = async (feeId) => {
  try {
    const response = await api.delete(`/admin/admin-fees/${feeId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete admin fee") };
  }
};
