import api from "./axios";

export const MOCK_INVESTMENT_TYPES = [
  { id: 1, return_type: "Monthly Return", status: true },
  { id: 2, return_type: "Weekly Payout", status: true },
  { id: 3, return_type: "Daily Yield", status: true },
  { id: 4, return_type: "Annual Fixed Growth", status: false },
];

export const getInvestmentTypesApi = async () => {
  try {
    const response = await api.get("/admin/return-types/");
    const payload = response.data;
    const types = payload?.data || payload?.return_types || payload || [];
    return { success: true, data: Array.isArray(types) ? types : [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || "Unable to load return types",
    };
  }
};

export const getInvestmentTypeApi = async (typeId) => {
  try {
    const response = await api.get(`/admin/return-types/${typeId}`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || "Unable to load return type",
    };
  }
};

export const createInvestmentTypeApi = async (typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    status: Boolean(typeData.status ?? true),
  };
  try {
    const response = await api.post("/admin/return-types/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || "Unable to create return type",
    };
  }
};


export const updateInvestmentTypeApi = async (typeId, typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    status: Boolean(typeData.status),   
  };
  try {
    const response = await api.put(`/admin/return-types/${typeId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || "Unable to update return type",
    };
  }
};

export const deleteInvestmentTypeApi = async (typeId) => {
  try {
    const response = await api.delete(`/admin/return-types/${typeId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || "Unable to delete return type",
    };
  }
};