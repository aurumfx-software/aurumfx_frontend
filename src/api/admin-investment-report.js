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

export const getAdminInvestmentReportApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/investment-report/", { params: buildParams(filters) });
    const responseData = response.data || {};
    const payload = responseData.data && !Array.isArray(responseData.data)
      ? responseData.data
      : responseData;
    return {
      success: true,
      data: {
        total_records: Number(payload.total_records ?? 0),
        total_amount: Number(payload.total_amount ?? 0),
        total_lots: Number(payload.total_lots ?? 0),
        items: Array.isArray(payload.data) ? payload.data : Array.isArray(payload.items) ? payload.items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load investment report.") };
  }
};

export const getAdminInvestmentReportPrintApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/investment-report/print", {
      params: buildParams(filters),
      responseType: "text",
      headers: { Accept: "text/html" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to print investment report.") };
  }
};
