import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

const normalizeNotification = (notification = {}) => ({
  ...notification,
  id: notification.id ?? null,
  type: notification.type ?? "",
  title: notification.title ?? "Notification",
  message: notification.message ?? "",
  reference_id: notification.reference_id ?? null,
  reference_type: notification.reference_type ?? "",
  is_read: Boolean(notification.is_read),
  created_at: notification.created_at ?? null,
});

export const getAdminNotificationsApi = async () => {
  try {
    const response = await api.get("/admin/notifications/");
    const payload = response.data || {};
    const notifications = Array.isArray(payload)
      ? payload
      : payload.notifications || payload.data?.notifications || payload.data || [];
    return {
      success: true,
      data: Array.isArray(notifications) ? notifications.map(normalizeNotification) : [],
    };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load notifications") };
  }
};

export const getAdminUnreadNotificationCountApi = async () => {
  try {
    const response = await api.get("/admin/notifications/unread-count");
    return { success: true, data: Number(response.data?.unread_count || 0) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load notification count") };
  }
};

export const markAdminNotificationAsReadApi = async (notificationId) => {
  try {
    const response = await api.patch(`/admin/notifications/${notificationId}/read`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to mark notification as read") };
  }
};

export const markAllAdminNotificationsAsReadApi = async () => {
  try {
    const response = await api.patch("/admin/notifications/read-all");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to mark notifications as read") };
  }
};