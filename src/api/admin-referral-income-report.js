import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

const buildParams = (filters = {}) => Object.fromEntries(
  Object.entries(filters).filter(([, value]) => String(value ?? "").trim() !== "")
);

export const getAdminReferralIncomeReportApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/referral-income-report/", { params: buildParams(filters) });
    const payload = response.data?.data || response.data || {};
    return {
      success: true,
      data: {
        total_records: Number(payload.total_records ?? 0),
        total_investment_amount: Number(payload.total_investment_amount ?? 0),
        total_commission_amount: Number(payload.total_commission_amount ?? 0),
        total_paid_amount: Number(payload.total_paid_amount ?? 0),
        total_washout_amount: Number(payload.total_washout_amount ?? 0),
        items: Array.isArray(payload.data) ? payload.data : Array.isArray(payload.items) ? payload.items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load referral income report.") };
  }
};

export const getAdminReferralIncomeReportPrintApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/referral-income-report/print", {
      params: buildParams(filters),
      responseType: "text",
      headers: { Accept: "text/html" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to print referral income report.") };
  }
};
