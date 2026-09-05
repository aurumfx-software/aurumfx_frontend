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

export const getAdminRankIncomeReportApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/rank-income-report/", { params: buildParams(filters) });
    const responseData = response.data || {};
    const payload = responseData.data && !Array.isArray(responseData.data)
      ? responseData.data
      : responseData;
    return {
      success: true,
      data: {
        total_records: Number(payload.total_records ?? 0),
        total_income: Number(payload.total_income ?? 0),
        total_paid: Number(payload.total_paid ?? 0),
        total_pending: Number(payload.total_pending ?? 0),
        items: Array.isArray(payload.data) ? payload.data : Array.isArray(payload.items) ? payload.items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load rank income report.") };
  }
};

export const getAdminRankIncomeReportPrintApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/rank-income-report/print", {
      params: buildParams(filters),
      responseType: "text",
      headers: { Accept: "text/html" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to print rank income report.") };
  }
};
