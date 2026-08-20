import api from "./axios";

const getErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ") || fallback;
  }
  return detail || error.response?.data?.message || error.response?.data?.error || fallback;
};

const normalizeTicket = (ticket = {}) => ({
  ...ticket,
  ticket_id: ticket.ticket_id ?? ticket.id ?? null,
  ticket_number: ticket.ticket_number ?? "",
  user_id: ticket.user_id ?? "",
  subject: ticket.subject ?? "",
  message: ticket.message ?? "",
  attachment: ticket.attachment ?? ticket.attachment_url ?? null,
  replies: Array.isArray(ticket.replies) ? ticket.replies : [],
});

export const getAdminTicketsApi = async () => {
  try {
    const response = await api.get("/admin/help-center/tickets");
    const payload = response.data || {};
    const tickets = Array.isArray(payload) ? payload : payload.tickets || payload.data?.tickets || payload.data || [];
    return { success: true, data: Array.isArray(tickets) ? tickets.map(normalizeTicket) : [] };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load support tickets") };
  }
};

export const getAdminTicketDetailsApi = async (ticketId) => {
  try {
    const response = await api.get(`/admin/help-center/tickets/${ticketId}`);
    return { success: true, data: normalizeTicket(response.data?.data || response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load ticket details") };
  }
};

export const replyToAdminTicketApi = async (ticketId, message, attachment = null) => {
  const formData = new FormData();
  formData.append("message", message);
  if (attachment) formData.append("attachment", attachment);

  try {
    const response = await api.post(`/admin/help-center/tickets/${ticketId}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to reply to ticket") };
  }
};
