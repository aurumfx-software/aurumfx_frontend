import api from "./axios";

export const MOCK_INVESTMENT_TYPES = [
  { id: 1, return_type: "Monthly Return", status: true },
  { id: 2, return_type: "Weekly Payout", status: true },
  { id: 3, return_type: "Daily Yield", status: true },
  { id: 4, return_type: "Annual Fixed Growth", status: false },
];

export const getInvestmentTypesApi = async () => {
  try {
    const response = await api.get("/return-types/");
    const payload = response.data;
    const types = payload?.data || payload?.return_types || payload || MOCK_INVESTMENT_TYPES;
    return { success: true, data: Array.isArray(types) ? types : MOCK_INVESTMENT_TYPES };
  } catch (error) {
    console.warn("Return type API offline, using fallback data:", error.message);
    return { success: true, isMock: true, data: MOCK_INVESTMENT_TYPES };
  }
};

export const createInvestmentTypeApi = async (typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    status: Boolean(typeData.status ?? true),
  };
  try {
    const response = await api.post("/return-types/", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Create Return Type API offline:", error.message);
    return { success: true, isMock: true, data: { id: Date.now(), ...payload } };
  }
};


export const updateInvestmentTypeApi = async (typeId, typeData) => {
  const payload = {
    return_type: String(typeData.return_type || typeData.type_name || "").trim(),
    status: Boolean(typeData.status),   
  };
  try {
    const response = await api.put(`/return-types/${typeId}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Update Return Type API offline:", error.message);
    return { success: true, isMock: true, data: { id: typeId, ...payload, status: Boolean(typeData.status ?? true) } };
  }
};

export const deleteInvestmentTypeApi = async (typeId) => {
  try {
    const response = await api.delete(`/return-types/${typeId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.warn("Delete Return Type API offline:", error.message);
    return { success: true, isMock: true };
  }
};