import axios from "./axios";

export async function getAllRanksApi() {
  const res = await axios.get(`/admin/ranks/`);
  return res.data;
}

export async function getRankApi(rankId) {
  const res = await axios.get(`/admin/ranks/${rankId}`);
  return res.data;
}

export async function createRankApi(payload) {
  const res = await axios.post(`/admin/ranks/`, payload);
  return res.data;
}

export async function updateRankApi(rankId, payload) {
  const res = await axios.put(`/admin/ranks/${rankId}`, payload);
  return res.data;
}

export async function deleteRankApi(rankId) {
  const res = await axios.delete(`/admin/ranks/${rankId}`);
  return res.data;
}

export default {
  getAllRanksApi,
  getRankApi,
  createRankApi,
  updateRankApi,
  deleteRankApi,
};
