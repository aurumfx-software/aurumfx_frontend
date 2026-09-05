import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.detail?.[0]?.msg ||
  fallback;

/** GET /api/admin/members/kyc/pending */
export const getPendingAdminMembersKycApi = async () => {
  try {
    const response = await api.get("/api/admin/members/kyc/pending");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load pending KYC details.") };
  }
};

/** GET /api/admin/members/kyc */
export const getAllAdminMembersKycApi = async () => {
  try {
    const response = await api.get("/api/admin/members/kyc");
    const data = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load members KYC details.") };
  }
};

/** GET /api/admin/members/{user_id}/kyc */
export const getAdminMemberKycApi = async (userId) => {
  try {
    const response = await api.get(`/api/admin/members/${encodeURIComponent(userId)}/kyc`);
    const payload = response.data?.data || response.data || {};
    return { success: true, data: payload };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load KYC details.") };
  }
};

/** PATCH /api/admin/members/{user_id}/kyc-status */
export const updateAdminMemberKycStatusApi = async (userId, status, rejectionReason = "") => {
  try {
    const response = await api.patch(`/api/admin/members/${encodeURIComponent(userId)}/kyc-status`, {
      status,
      rejection_reason: rejectionReason || null,
    });
    return { success: true, data: response.data?.data || response.data || {} };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to update KYC status.") };
  }
};
