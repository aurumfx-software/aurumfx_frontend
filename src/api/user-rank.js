import api from "./axios";

export const getAllUserRankSettingsApi = async () => {
  try {
    const response = await api.get("/user/rank");
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return { success: true, data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load rank settings.";
    return { success: false, error: message };
  }
};

export const getRankHoldersApi = async (rankId) => {
  const cleanedRankId = Number(rankId);

  if (!Number.isFinite(cleanedRankId)) {
    return { success: false, error: "Rank ID is required." };
  }

  try {
    const response = await api.get(`/user/rank/${encodeURIComponent(cleanedRankId)}/holders`);
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return { success: true, data };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load rank holders.";
    return { success: false, error: message };
  }
};
