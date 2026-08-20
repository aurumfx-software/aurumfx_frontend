import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || fallback;
};

export const getInvestmentPlansApi = async () => {
  try {
    const response = await api.get("/admin/investment-plans/");
    const payload = response.data;
    const plans = payload?.data || payload || [];
    return { success: true, data: Array.isArray(plans) ? plans : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load investment plans") };
  }
};

export const getInvestmentPlanApi = async (planId) => {
  try {
    const response = await api.get(`/admin/investment-plans/${planId}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load investment plan") };
  }
};

export const createInvestmentPlanApi = async (planData) => {
  const payload = {
    plan_name: String(planData.plan_name || "").trim(),
    duration_months: Number(planData.duration_months) || 0,
    return_percentage: Number(planData.return_percentage) || 0,
    minimum_amount: Number(planData.minimum_amount) || 0,
  };

  try {
    const response = await api.post("/admin/investment-plans/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to create investment plan") };
  }
};

export const updateInvestmentPlanApi = async (planId, planData) => {
  const payload = {
    plan_name: String(planData.plan_name || "").trim(),
    duration_months: Number(planData.duration_months) || 0,
    return_percentage: Number(planData.return_percentage) || 0,
    minimum_amount: Number(planData.minimum_amount) || 0,
    status: Boolean(planData.status ?? true),
  };

  try {
    const response = await api.put(`/admin/investment-plans/${planId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update investment plan") };
  }
};

export const deleteInvestmentPlanApi = async (planId) => {
  try {
    const response = await api.delete(`/admin/investment-plans/${planId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to delete investment plan") };
  }
};
