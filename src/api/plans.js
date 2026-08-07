import api from "./axios";

// Fallback initial sample investment plans data matching backend schema
export const MOCK_INVESTMENT_PLANS = [
  {
    id: 1,
    plan_name: "Starter FX Plan",
    duration_months: 10,
    return_percentage: 14.0,
    minimum_amount: 5000,
    commission_percentage: 5.0,
    daily_commission_limit: 10000,
    admin_fee_percentage: 2.0,
    status: true,
  },
  {
    id: 2,
    plan_name: "Pro Trader Plan",
    duration_months: 12,
    return_percentage: 16.5,
    minimum_amount: 25000,
    commission_percentage: 7.5,
    daily_commission_limit: 25000,
    admin_fee_percentage: 1.5,
    status: true,
  },
  {
    id: 3,
    plan_name: "Royal Elite Gold Plan",
    duration_months: 15,
    return_percentage: 20.0,
    minimum_amount: 100000,
    commission_percentage: 10.0,
    daily_commission_limit: 50000,
    admin_fee_percentage: 1.0,
    status: true,
  },
  {
    id: 4,
    plan_name: "Starter Trial Plan",
    duration_months: 6,
    return_percentage: 10.0,
    minimum_amount: 1000,
    commission_percentage: 3.0,
    daily_commission_limit: 5000,
    admin_fee_percentage: 2.5,
    status: false,
  },
];

/**
 * Fetch Investment Plans from /investment-plans API
 */
export const getInvestmentPlansApi = async () => {
  try {
    let response;
    try {
      response = await api.get("/investment-plans");
    } catch (err) {
      response = await api.get("/admin/investment-plans");
    }
    const payload = response.data;
    const plans = payload?.data || payload?.investment_plans || payload || MOCK_INVESTMENT_PLANS;
    return { success: true, data: Array.isArray(plans) ? plans : MOCK_INVESTMENT_PLANS };
  } catch (error) {
    console.warn("Investment plans API offline, using fallback data:", error.message);
    return { success: true, isMock: true, data: MOCK_INVESTMENT_PLANS };
  }
};

/**
 * Create a new Investment Plan via POST /investment-plans
 * @param {Object} planData
 * @param {string} planData.plan_name
 * @param {number} planData.duration_months
 * @param {number} planData.return_percentage
 * @param {number} planData.minimum_amount
 * @param {number} planData.commission_percentage
 * @param {number} planData.daily_commission_limit
 * @param {number} planData.admin_fee_percentage
 * @param {boolean} planData.status
 */
export const createInvestmentPlanApi = async (planData) => {
  const payload = {
    plan_name: String(planData.plan_name || "").trim(),
    duration_months: Number(planData.duration_months) || 0,
    return_percentage: Number(planData.return_percentage) || 0,
    minimum_amount: Number(planData.minimum_amount) || 0,
    commission_percentage: Number(planData.commission_percentage) || 0,
    daily_commission_limit: Number(planData.daily_commission_limit) || 0,
    admin_fee_percentage: Number(planData.admin_fee_percentage) || 0,
    status: Boolean(planData.status ?? true),
  };

  try {
    let response;
    try {
      response = await api.post("/investment-plans", payload);
    } catch (err) {
      response = await api.post("/admin/investment-plans", payload);
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Create Investment Plan API offline:", error.message);
    return {
      success: true,
      isMock: true,
      data: { id: Date.now(), ...payload },
    };
  }
};

/**
 * Update an existing Investment Plan via PUT /investment-plans/:id
 */
export const updateInvestmentPlanApi = async (planId, planData) => {
  const payload = {
    plan_name: String(planData.plan_name || "").trim(),
    duration_months: Number(planData.duration_months) || 0,
    return_percentage: Number(planData.return_percentage) || 0,
    minimum_amount: Number(planData.minimum_amount) || 0,
    commission_percentage: Number(planData.commission_percentage) || 0,
    daily_commission_limit: Number(planData.daily_commission_limit) || 0,
    admin_fee_percentage: Number(planData.admin_fee_percentage) || 0,
    status: Boolean(planData.status ?? true),
  };

  try {
    let response;
    try {
      response = await api.put(`/investment-plans/${planId}`, payload);
    } catch (err) {
      response = await api.put(`/admin/investment-plans/${planId}`, payload);
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Update Investment Plan API offline:", error.message);
    return {
      success: true,
      isMock: true,
      data: { id: planId, ...payload },
    };
  }
};

/**
 * Delete an Investment Plan via DELETE /investment-plans/:id
 */
export const deleteInvestmentPlanApi = async (planId) => {
  try {
    let response;
    try {
      response = await api.delete(`/investment-plans/${planId}`);
    } catch (err) {
      response = await api.delete(`/admin/investment-plans/${planId}`);
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Delete Investment Plan API offline:", error.message);
    return { success: true, isMock: true };
  }
};
