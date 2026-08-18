import api from "./axios";

const normalizePayoutItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && Array.isArray(payload.data.items)) return payload.data.items;
  if (payload.items && typeof payload.items === "object") {
    const nested = normalizePayoutItems(payload.items);
    if (nested.length) return nested;
  }

  return [];
};

export const getMyPayoutHistoryApi = async () => {
  try {
    const response = await api.get("/payout/history");
    const payload = response.data || {};
    const items = normalizePayoutItems(payload);

    return {
      success: true,
      data: {
        total: Number(payload.total ?? items.length ?? 0),
        items,
      },
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load payout history.";

    return { success: false, error: message };
  }
};
