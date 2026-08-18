import api from "./axios";

const normalizeRankList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.data,
    payload.results,
    payload.ranks,
    payload.rank_settings,
    payload.rankSettings,
    payload.items,
    payload.list,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested = normalizeRankList(candidate);
      if (nested.length) return nested;
    }
  }

  return [];
};

export const getAllUserRankSettingsApi = async () => {
  try {
    const response = await api.get("/user/rank");
    const data = normalizeRankList(response.data);
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
