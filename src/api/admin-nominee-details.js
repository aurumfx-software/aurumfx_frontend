import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.detail?.[0]?.msg ||
  fallback;

/** GET /api/admin/members/nominee-details/pending */
export const getPendingAdminMembersNomineeDetailsApi = async () => {
  try {
    const response = await api.get("/api/admin/members/nominee-details/pending");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load pending nominee details.") };
  }
};

/** GET /api/admin/members/nominee-details */
export const getAllAdminMembersNomineeDetailsApi = async () => {
  try {
    const response = await api.get("/api/admin/members/nominee-details");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load members nominee details.") };
  }
};

/** GET /api/admin/members/{user_id}/nominee-details */
export const getAdminMemberNomineeDetailsApi = async (userId) => {
  try {
    const response = await api.get(`/api/admin/members/${encodeURIComponent(userId)}/nominee-details`);
    return { success: true, data: response.data?.data || response.data || {} };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load nominee details.") };
  }
};

/** PATCH /api/admin/members/{user_id}/nominee-status */
export const updateAdminMemberNomineeStatusApi = async (userId, status, rejectionReason = "") => {
  try {
    const response = await api.patch(`/api/admin/members/${encodeURIComponent(userId)}/nominee-status`, {
      nominee_status: status,
      nominee_rejection_reason: rejectionReason || null,
    });

    const payload = response.data?.data || response.data || {};
    return {
      success: true,
      data: typeof payload === "string" ? { message: payload } : payload,
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update nominee status.") };
  }
};
