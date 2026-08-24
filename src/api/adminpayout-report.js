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

export const getAdminPayoutReportApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/payout-report/", { params: buildParams(filters) });
    const payload = response.data?.data || response.data || {};
    return {
      success: true,
      data: {
        total_records: Number(payload.total_records ?? 0),
        total_referral_income: Number(payload.total_referral_income ?? 0),
        total_level_income: Number(payload.total_level_income ?? 0),
        total_rank_income: Number(payload.total_rank_income ?? 0),
        total_income: Number(payload.total_income ?? 0),
        total_admin_fee: Number(payload.total_admin_fee ?? 0),
        total_net_payable: Number(payload.total_net_payable ?? 0),
        items: Array.isArray(payload.data) ? payload.data : Array.isArray(payload.items) ? payload.items : [],
      },
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load payout report.") };
  }
};

export const getAdminPayoutReportPrintApi = async (filters = {}) => {
  try {
    const response = await api.get("/admin/payout-report/print", {
      params: buildParams(filters),
      responseType: "text",
      headers: { Accept: "text/html" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to print payout report.") };
  }
};
