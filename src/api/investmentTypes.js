import api from "./axios";

export const MOCK_INVESTMENT_TYPES = [
  {
    id: 1,
    return_type: "Monthly Return",
    type_name: "Monthly Return",
    return_percentage: 14.0,
    duration_months: 10,
    description: "Standard monthly return payout at 14.0% for 10 months",
    status: true,
  },
  {
    id: 2,
    return_type: "Weekly Payout",
    type_name: "Weekly Payout",
    return_percentage: 3.5,
    duration_months: 12,
    description: "Weekly return payout at 3.5% per week for 12 months",
    status: true,
  },
  {
    id: 3,
    return_type: "Daily Yield",
    type_name: "Daily Yield",
    return_percentage: 0.5,
    duration_months: 6,
    description: "Daily return yield payout at 0.5% per trading day",
    status: true,
  },
  {
    id: 4,
    return_type: "Annual Fixed Growth",
    type_name: "Annual Fixed Growth",
    return_percentage: 180.0,
    duration_months: 12,
    description: "Compounded annual fixed return payout at 180%",
    status: false,
  },
];

/**
 * Fetch Return Types from /return-type API
 */
export const getInvestmentTypesApi = async () => {
  try {
    let response;
    try {
      response = await api.get("/return-type");
    } catch (err1) {
      try {
        response = await api.get("/return-types");
      } catch (err2) {
        response = await api.get("/admin/return-type");
      }
    }
    const payload = response.data;
    const types = payload?.data || payload?.return_types || payload || MOCK_INVESTMENT_TYPES;
    return { success: true, data: Array.isArray(types) ? types : MOCK_INVESTMENT_TYPES };
  } catch (error) {
    console.warn("Return type API offline, using fallback data:", error.message);
    return { success: true, isMock: true, data: MOCK_INVESTMENT_TYPES };
  }
};

/**
 * Create a new Return Type via POST /return-type
 */
export const createInvestmentTypeApi = async (typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    type_name: String(typeData.return_type || typeData.type_name || "").trim(),
    return_percentage: Number(typeData.return_percentage) || 0,
    duration_months: Number(typeData.duration_months) || 0,
    description: String(typeData.description || "").trim(),
    status: Boolean(typeData.status ?? true),
  };

  try {
    let response;
    try {
      response = await api.post("/return-type", payload);
    } catch (err1) {
      try {
        response = await api.post("/return-types", payload);
      } catch (err2) {
        response = await api.post("/admin/return-type", payload);
      }
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Create Return Type API offline:", error.message);
    return {
      success: true,
      isMock: true,
      data: { id: Date.now(), ...payload },
    };
  }
};

/**
 * Update a Return Type via PUT /return-type/:id
 */
export const updateInvestmentTypeApi = async (typeId, typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    type_name: String(typeData.return_type || typeData.type_name || "").trim(),
    return_percentage: Number(typeData.return_percentage) || 0,
    duration_months: Number(typeData.duration_months) || 0,
    description: String(typeData.description || "").trim(),
    status: Boolean(typeData.status ?? true),
  };

  try {
    let response;
    try {
      response = await api.put(`/return-type/${typeId}`, payload);
    } catch (err1) {
      try {
        response = await api.put(`/return-types/${typeId}`, payload);
      } catch (err2) {
        response = await api.put(`/admin/return-type/${typeId}`, payload);
      }
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Update Return Type API offline:", error.message);
    return {
      success: true,
      isMock: true,
      data: { id: typeId, ...payload },
    };
  }
};

/**
 * Delete a Return Type via DELETE /return-type/:id
 */
export const deleteInvestmentTypeApi = async (typeId) => {
  try {
    let response;
    try {
      response = await api.delete(`/return-type/${typeId}`);
    } catch (err1) {
      try {
        response = await api.delete(`/return-types/${typeId}`);
      } catch (err2) {
        response = await api.delete(`/admin/return-type/${typeId}`);
      }
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Delete Return Type API offline:", error.message);
    return { success: true, isMock: true };
  }
};
