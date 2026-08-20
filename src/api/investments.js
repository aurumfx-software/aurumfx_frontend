import api from "./axios";

/**
 * Create Investment via POST /investments/
 */
export const createInvestmentApi = async (data) => {
  const payload = new FormData();
  payload.append("investment_plan_id", String(Number(data.investment_plan_id) || 0));
  payload.append("amount", String(Number(data.amount) || 0));
  payload.append("return_type_id", String(Number(data.return_type_id) || 0));
  payload.append("bank_transaction_id", String(data.bank_transaction_id || "").trim());
  payload.append(
    "investment_date",
    data.investment_date || new Date().toISOString().split("T")[0]
  );
  if (data.payment_proof) payload.append("payment_proof", data.payment_proof);

  try {
    const response = await api.post("/investments", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load investment details";
    return { success: false, error: errorMessage };
  }
};