import api from "./axios";

export const getUserGenealogyApi = async () => {
  try {
    const response = await api.get("/user/genealogy/");
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load family data.";
    return { success: false, error: message };
  }
};

export const getUserGenealogyListApi = async () => {
  try {
    const response = await api.get("/user/genealogy/list");
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

export const getUserEnrollersApi = async () => {
  try {
    const response = await api.get("/user/enrollers");
    const data = response.data?.data || response.data || { total: 0, enrollers: [] };
    return {
      success: true,
      data: {
        total: Number(data.total ?? 0),
        enrollers: Array.isArray(data.enrollers) ? data.enrollers : [],
      },
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load enrollers.";
    return { success: false, error: message };
  }
};
