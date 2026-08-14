import api from "./axios";

export const getAllGenealogyApi = async () => {
  try {
    const response = await api.get("/genealogy/");
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return { success: true, data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load genealogy data.";
    return { success: false, error: message };
  }
};

export const getUserGenealogyApi = async (userId) => {
  const cleanedUserId = String(userId || "").trim();
  if (!cleanedUserId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const response = await api.get(`/genealogy/${encodeURIComponent(cleanedUserId)}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load user genealogy.";
    return { success: false, error: message };
  }
};
