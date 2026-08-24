import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.detail?.[0]?.msg ||
  fallback;

export const getAdminMembersApi = async (filters = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => String(value || "").trim() !== "")
    );
    const response = await api.get("/api/admin/members/", { params });
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load network members.") };
  }
};

export const impersonateAdminMemberApi = async (userId) => {
  try {
    const response = await api.post(`/api/admin/members/members/${encodeURIComponent(userId)}/impersonate`);
    const data = response.data?.data || response.data || {};
    return { success: true, data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to open this user account.") };
  }
};

export const switchBackToAdminApi = async () => {
  try {
    const response = await api.post("/api/admin/members/switch-back");
    return { success: true, data: response.data?.data || response.data || {} };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to switch back to admin.") };
  }
};

export const updateAdminMemberStatusApi = async (userId, status) => {
  try {
    const response = await api.patch(`/api/admin/members/${encodeURIComponent(userId)}/status`, {
      status: String(status).toUpperCase(),
    });
    return { success: true, data: response.data?.data || response.data || {} };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update member status.") };
  }
};