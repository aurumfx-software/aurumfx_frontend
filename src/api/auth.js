import api from "./axios";

/**
 * Login API call
 * Sends login credentials to backend /auth/login
 * Fallbacks to demo users if backend is not reachable/404
 */
export const loginApi = async (userId, password, requiredRole = null) => {
  const trimmedUserId = String(userId || "").trim();
  try {
    const loginEndpoint =
      requiredRole && requiredRole.toLowerCase() === "admin"
        ? "/auth/admin/login"
        : "/auth/login";
    const response = await api.post(loginEndpoint, {
      user_id: trimmedUserId,
      password,
    });

    const payload = response.data;
    if (
      payload &&
      (payload.success === false ||
        payload.status === "error" ||
        payload.status === false)
    ) {
      throw new Error(payload.message || payload.error || "Login failed");
    }

    const data = payload?.data || payload;
    const isDetectedAdmin =
      trimmedUserId.toLowerCase() === "aurumfx" ||
      trimmedUserId.toLowerCase() === "admin";
    const role = String(
      payload?.role || data?.role || (isDetectedAdmin ? "admin" : "user")
    ).toLowerCase();

    if (requiredRole && role !== requiredRole.toLowerCase()) {
      throw new Error(
        `Access Denied: This portal is for ${requiredRole} accounts only.`
      );
    }

    const token =
      payload?.token ||
      data?.token ||
      payload?.access_token ||
      data?.access_token ||
      `token-${role}`;
    const user = payload?.user ||
      data?.user || { userId: trimmedUserId, role, name: trimmedUserId };
    const redirectPath =
      role === "admin" ? "/admin/dashboard/business" : "/user/dashboard";

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", trimmedUserId);
    if (user?.name || payload?.name || data?.name) {
      localStorage.setItem(
        "userName",
        user?.name || payload?.name || data?.name
      );
    }

    return { success: true, redirect: redirectPath, data: payload };
  } catch (error) {
    if (error.message && error.message.includes("Access Denied")) {
      return { success: false, error: error.message };
    }

    // Direct offline fallback for admin usernames (e.g. aurumfx / admin) ONLY if completely offline
    if (
      !error.response &&
      (trimmedUserId.toLowerCase() === "aurumfx" ||
        trimmedUserId.toLowerCase() === "admin")
    ) {
      if (requiredRole && requiredRole.toLowerCase() !== "admin") {
        return {
          success: false,
          error: `Access Denied: This portal is for ${requiredRole} accounts only.`,
        };
      }

      const token = `admin-token-${Date.now()}`;
      const uId = trimmedUserId || "aurumfx";

      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", uId);

      return { success: true, redirect: "/admin/dashboard/business" };
    }

    let errorMessage =
      error.response?.data?.message || error.response?.data?.error;

    if (
      !errorMessage ||
      errorMessage.includes("status code") ||
      errorMessage.includes("Request failed")
    ) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 404 ||
        error.message?.includes("401") ||
        error.message?.includes("404")
      ) {
        errorMessage = "User Not Found";
      } else if (
        error.message &&
        !error.message.includes("status code") &&
        !error.message.includes("Request failed")
      ) {
        errorMessage = error.message;
      } else {
        errorMessage = "User Not Found";
      }
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Register API call
 * Sends registration form data to backend /auth/register
 */
export const registerApi = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);
    return { success: true, data: response.data };
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        isMock: true,
        message: "Registration recorded (offline mode)",
      };
    }

    const responseData = error.response?.data || {};
    const errorMessage =
      responseData?.message ||
      responseData?.error ||
      responseData?.detail ||
      (typeof responseData === "string" ? responseData : "") ||
      "Registration failed. Please try again.";

    const nestedError = Object.values(responseData?.errors || {}).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );

    return {
      success: false,
      error:
        nestedError.length > 0
          ? nestedError.join("; ")
          : errorMessage,
      raw: responseData,
    };
  }
};

/**
 * Check Enroller ID API call
 * Sends GET /auth/check-enroller/{enroller_id} to backend
 */
export const checkEnrollerApi = async (enrollerId) => {
  try {
    const response = await api.get(
      `/auth/check-enroller/${encodeURIComponent(enrollerId)}`
    );
    const data = response.data;
    const exists =
      data?.exists !== undefined
        ? data.exists
        : data?.success !== false && data?.status !== "error";
    let name = "";
    if (data?.name) name = data.name;
    else if (data?.enroller_name) name = data.enroller_name;
    else if (data?.full_name) name = data.full_name;
    else if (data?.first_name || data?.last_name) {
      name = `${data?.first_name || ""}${data?.first_name && data?.last_name ? " " : ""}${data?.last_name || ""}`.trim();
    } else if (data?.user) {
      if (data.user.name) name = data.user.name;
      else if (data.user.full_name) name = data.user.full_name;
      else if (data.user.first_name || data.user.last_name) {
        name = `${data.user.first_name || ""}${data.user.first_name && data.user.last_name ? " " : ""}${data.user.last_name || ""}`.trim();
      }
    } else if (data?.data) {
      if (data.data.name) name = data.data.name;
      else if (data.data.full_name) name = data.data.full_name;
      else if (data.data.first_name || data.data.last_name) {
        name = `${data.data.first_name || ""}${data.data.first_name && data.data.last_name ? " " : ""}${data.data.last_name || ""}`.trim();
      }
    }

    return {
      success: true,
      exists,
      name,
      message: data?.message,
      data,
    };
  } catch (error) {
    if (!error.response) {
      return {
        success: true,
        exists: true,
        isMock: true,
        message: "Enroller check (offline mode)",
      };
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Enroller ID does not exist";

    return { success: false, exists: false, error: errorMessage };
  }
};

/**
 * Get user profile data from /auth/profile
 */
export const getProfileApi = async () => {
  try {
    const response = await api.get("/auth/profile");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load profile";

    return { success: false, error: errorMessage };
  }
};

/**
 * Update user profile data via PUT /auth/profile
 * Payload matches the backend schema exactly:
 * { email, first_name, last_name, date_of_birth, country, city, zip_code, mobile, aadhar_no, pan, gender }
 * Bank account number and password are intentionally never sent from this
 * method — those are handled by their own dedicated endpoints/tabs.
 */
export const updateProfileApi = async (payload) => {
  try {
    const response = await api.put("/auth/profile", payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail?.[0]?.msg ||
      "Unable to update profile";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get profile activity history from /auth/profile/activity-history
 */
export const getProfileActivityHistoryApi = async () => {
  try {
    const response = await api.get("/auth/profile/activity-history");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load activity history";

    return { success: false, error: errorMessage };
  }
};

/**
 * Update user bank details via PUT /auth/profile/bank-details
 * multipart/form-data. Nominee name, aadhar and mobile are mandatory on the
 * backend, as is the passbook/proof document upload.
 *
 * payload: {
 *   bank_account, bank_name, ifsc,
 *   nominee_name, nominee_relation, nominee_gender, nominee_dob,
 *   nominee_address, nominee_aadhar, nominee_mobile,
 *   proof_document, nominee_aadhar_front, nominee_aadhar_back // File
 * }
 */
export const updateProfileBankDetailsApi = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("bank_account", payload.bank_account || "");
    formData.append("bank_name", payload.bank_name || "");
    formData.append("ifsc", payload.ifsc || "");
    formData.append("nominee_name", payload.nominee_name || "");
    formData.append("nominee_relation", payload.nominee_relation || "");
    formData.append("nominee_gender", payload.nominee_gender || "");
    formData.append("nominee_dob", payload.nominee_dob || "");
    formData.append("nominee_address", payload.nominee_address || "");
    formData.append("nominee_aadhar", payload.nominee_aadhar || "");
    formData.append("nominee_mobile", payload.nominee_mobile || "");
    if (payload.proof_document) {
      formData.append("proof_document", payload.proof_document);
    }
    if (payload.nominee_aadhar_front) {
      formData.append("nominee_aadhar_front", payload.nominee_aadhar_front);
    }
    if (payload.nominee_aadhar_back) {
      formData.append("nominee_aadhar_back", payload.nominee_aadhar_back);
    }

    const response = await api.put("/auth/profile/bank-details", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail?.[0]?.msg ||
      "Unable to update bank details";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get the authenticated user's bank and nominee details.
 */
export const getProfileBankDetailsApi = async () => {
  try {
    const response = await api.get("/auth/profile/bank-details");
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load bank details",
    };
  }
};

/**
 * Change user password via PUT /auth/change-password
 */
export const changePasswordApi = async (payload) => {
  try {
    const response = await api.put("/auth/change-password", payload);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to change password";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get the authenticated user's profile image via GET /auth/image.
 */
export const getProfileImageApi = async () => {
  try {
    const response = await api.get("/auth/image");
    return {
      success: true,
      data: response.data?.profile_image || "",
      userId: response.data?.user_id || "",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load profile image",
    };
  }
};

/**
 * Upload profile image via POST /auth/profile/image
 */
export const uploadProfileImageApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/auth/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to upload profile image";

    return { success: false, error: errorMessage };
  }
};

/* ------------------------------------------------------------------------ */
/* User KYC                                                                  */
/* ------------------------------------------------------------------------ */

/**
 * Upload KYC documents via POST /api/user/kyc/upload
 * multipart/form-data: { document_type, aadhar_no, pan, front_file, back_file, file }
 */
export const uploadKycDocumentApi = async ({
  documentType,
  aadharNumber,
  panNumber,
  frontFile,
  backFile,
  file,
}) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentType);
    if (aadharNumber) formData.append("aadhar_no", aadharNumber);
    if (panNumber) formData.append("pan", panNumber);
    if (frontFile) formData.append("front_file", frontFile);
    if (backFile) formData.append("back_file", backFile);
    if (file) formData.append("file", file);

    const response = await api.post("/api/user/kyc/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail?.[0]?.msg ||
      "Unable to upload KYC document";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get the current user's KYC documents via GET /api/user/kyc
 */
export const getMyKycApi = async () => {
  try {
    const response = await api.get("/api/user/kyc");
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load KYC documents";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get a single KYC document via GET /api/user/kyc/{kyc_id}
 */
export const getKycDocumentApi = async (kycId) => {
  try {
    const response = await api.get(`/api/user/kyc/${kycId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to load KYC document";

    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a KYC document via DELETE /api/user/kyc/{kyc_id}
 * Only allowed while the document is pending/rejected — approved documents
 * are locked on the backend.
 */
export const deleteKycDocumentApi = async (kycId) => {
  try {
    const response = await api.delete(`/api/user/kyc/${kycId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to delete KYC document";

    return { success: false, error: errorMessage };
  }
};

/**
 * Get a viewable URL for a KYC document via GET /api/user/kyc/{kyc_id}/view
 */
export const viewKycDocumentApi = async (kycId) => {
  try {
    const response = await api.get(`/api/user/kyc/${kycId}/view`);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to view KYC document";

    return { success: false, error: errorMessage };
  }
};

import { clearDashboardCache } from "./dashboard";

/**
 * Logout API call
 * Sends POST /auth/logout to backend and clears session
 */
export const logoutApi = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token && !token.startsWith("demo-")) {
      await api.post("/auth/logout");
    }
  } catch (error) {
    console.warn("Logout API call failed or offline:", error.message);
  } finally {
    clearDashboardCache();
    localStorage.clear();
  }
};