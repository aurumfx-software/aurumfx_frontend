import axios from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

const getRankData = (payload) => payload?.data || payload;

const normalizeRankPayload = (rank = {}) => ({
  rank_name: String(rank.rank_name || "").trim(),
  rank_no: Number(rank.rank_no) || 0,
  minimum_total_lots: Number(rank.minimum_total_lots) || 0,
  minimum_direct_sponsors: Number(rank.minimum_direct_sponsors) || 0,
  reward_income: Number(rank.reward_income) || 0,
  criteria: String(rank.criteria || "").trim(),
  status: Boolean(rank.status ?? true),
  conditions: Array.isArray(rank.conditions)
    ? rank.conditions.map((condition) => ({
        minimum_group_lots: Number(condition.minimum_group_lots) || 0,
        required_group_count: Number(condition.required_group_count) || 0,
        order_no: Number(condition.order_no) || 0,
      }))
    : [],
});

export async function getAllRanksApi() {
  try {
    const res = await axios.get(`/admin/ranks/`);
    const data = res.data?.data || res.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load ranks") };
  }
}

export async function getRankApi(rankId) {
  try {
    const res = await axios.get(`/admin/ranks/${rankId}`);
    return { success: true, data: getRankData(res.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load rank") };
  }
}

export async function getRankHoldersApi(rankId) {
  try {
    const res = await axios.get(`/admin/ranks/${rankId}/holders`);
    const data = res.data?.data || res.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load rank holders") };
  }
}

export async function getAllRankHoldersApi() {
  try {
    const res = await axios.get(`/admin/ranks/all/holders`);
    const data = res.data?.data || res.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load rank holders") };
  }
}

export async function getTodayRankHoldersApi() {
  try {
    const res = await axios.get(`/admin/ranks/today/holders`);
    const data = res.data?.data || res.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load today's rank holders") };
  }
}

export async function createRankApi(payload) {
  try {
    const res = await axios.post(`/admin/ranks/`, normalizeRankPayload(payload));
    return { success: true, data: getRankData(res.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create rank") };
  }
}

export async function updateRankApi(rankId, payload) {
  try {
    const res = await axios.put(`/admin/ranks/${rankId}`, normalizeRankPayload(payload));
    return { success: true, data: getRankData(res.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update rank") };
  }
}

export async function deleteRankApi(rankId) {
  try {
    const res = await axios.delete(`/admin/ranks/${rankId}`);
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete rank") };
  }
}

export default {
  getAllRanksApi,
  getRankApi,
  getRankHoldersApi,
  getAllRankHoldersApi,
  getTodayRankHoldersApi,
  createRankApi,
  updateRankApi,
  deleteRankApi,
};
