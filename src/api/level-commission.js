import api from "./axios";

export const getLevelCommissionHistoryApi = async (skip = 0, limit = 50) => {
  try {
    const response = await api.get("/admin/level-commission/history", {
      params: { skip, limit },
    });
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load history" };
  }
};

export const getUserLevelCommissionApi = async (userId) => {
  try {
    const response = await api.get(`/admin/level-commission/history/${userId}`);
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load user history" };
  }
};

export const getInvestmentLevelCommissionApi = async (investmentId) => {
  try {
    const response = await api.get(`/admin/level-commission/investment/${investmentId}`);
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load investment history" };
  }
};

export const getLevelCommissionSummaryApi = async () => {
  try {
    const response = await api.get("/admin/level-commission/summary");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load summary" };
  }
};

export const getTodayLevelIncomeApi = async () => {
  try {
    const response = await api.get("/admin/level-commission/today");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load today's income" };
  }
};

export const getMonthlyLevelIncomeApi = async (year, month) => {
  try {
    const response = await api.get("/admin/level-commission/month", {
      params: { year, month },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load monthly income" };
  }
};

export const getLevelReportApi = async (level) => {
  try {
    const response = await api.get(`/admin/level-commission/level/${level}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load level report" };
  }
};

export const getTopEarnersApi = async () => {
  try {
    const response = await api.get("/admin/level-commission/top-earners");
    const data = response.data;
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Unable to load top earners" };
  }
};