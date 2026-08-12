import api from "./axios";

/**
 * Create Investment via POST /investments/
 */
export const createInvestmentApi = async (data) => {
  const payload = {
    investment_plan_id: Number(data.investment_plan_id) || 0,
    return_type_id: Number(data.return_type_id) || 0,
    amount: Number(data.amount) || 0,
    bank_transaction_id: String(data.bank_transaction_id || "").trim(),
    enroller_id: String(
      data.enroller_id ||
      localStorage.getItem("enrollerId") ||
      localStorage.getItem("userId") ||
      "FX034"
    ).trim(),
    investment_date:
      data.investment_date || new Date().toISOString().split("T")[0],
  };

  try {
    const response = await api.post("/investments", payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to submit investment";
    return { success: false, error: errorMessage };
  }
};

/**
 * My Investments via GET /investments/
 * Optional filter: start_date, end_date, status
 */
export const getMyInvestmentsApi = async (filters = {}) => {
  try {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.status && filters.status !== "All") params.status = filters.status;

    const response = await api.get("/investments", { params });
    const payload = response.data;
    const data = payload?.data || payload || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load investments";
    return { success: false, error: errorMessage };
  }
};

/**
 * Investment Details via GET /investments/:id
 */
export const getInvestmentDetailsApi = async (investmentId) => {
  try {
    const response = await api.get(`/investments/${investmentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load investment details";
    return { success: false, error: errorMessage };
  }
};