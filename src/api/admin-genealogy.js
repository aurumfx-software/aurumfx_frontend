import api from "./axios";

export const getAllGenealogyApi = async () => {
  try {
    const response = await api.get("/admin/genealogy/");
    const data = response.data?.data || response.data || [];
    return { success: true, data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load genealogy data.";
    return { success: false, error: message };
  }
};

export const getAdminGenealogyListApi = async () => {
  try {
    const response = await api.get("/admin/genealogy/list/all");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load genealogy list.";
    return { success: false, error: message };
  }
};

export const getAdminUserGenealogyApi = async (userId) => {
  try {
    const response = await api.get(`/admin/genealogy/${userId}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load selected user's genealogy.";
    return { success: false, error: message };
  }
};

export const getAdminEnrollersApi = async () => {
  try {
    const response = await api.get("/admin/enrollers");
    const payload = response.data || {};
    return {
      success: true,
      data: {
        total: Number(payload.total ?? 0),
        enrollers: Array.isArray(payload.enrollers) ? payload.enrollers : [],
      },
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load admin enrollers.";
    return { success: false, error: message };
  }
};
