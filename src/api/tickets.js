import api from "./axios";

const normalizeTicket = (ticket = {}) => ({
  id: ticket.ticket_id ?? ticket.id ?? ticket._id ?? null,
  ticket_id: ticket.ticket_id ?? ticket.id ?? ticket._id ?? null,
  ticket_number: ticket.ticket_number ?? "",
  subject: ticket.subject ?? ticket.title ?? "",
  message: ticket.message ?? ticket.description ?? "",
  attachment: ticket.attachment ?? null,
  attachment_url: ticket.attachment_url ?? ticket.attachment ?? null,
  status: String(ticket.status ?? "open").toLowerCase(),
  created_at: ticket.created_at ?? ticket.createdAt ?? ticket.date ?? null,
  updated_at: ticket.updated_at ?? ticket.updatedAt ?? null,
  replies: Array.isArray(ticket.replies) ? ticket.replies : [],
  ...ticket,
});

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail?.[0]?.msg ||
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const getMyTicketsApi = async () => {
  try {
    const response = await api.get("/user/help-center/tickets");
    const payload = response.data;
    const rows = Array.isArray(payload?.tickets) ? payload.tickets : [];

    return {
      success: true,
      data: rows.map(normalizeTicket),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Unable to load tickets"),
      data: [],
    };
  }
};

export const createTicketApi = async (formData) => {
  try {
    const response = await api.post("/user/help-center/tickets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data || {};

    return {
      success: true,
      data: normalizeTicket(payload),
      message: payload?.message || "Ticket created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Unable to create ticket"),
    };
  }
};

export const getTicketDetailsApi = async (ticketId) => {
  try {
    const response = await api.get(`/user/help-center/tickets/${ticketId}`);
    return { success: true, data: normalizeTicket(response.data) };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to load ticket details") };
  }
};

export const replyToTicketApi = async (ticketId, formData) => {
  try {
    const response = await api.post(`/user/help-center/tickets/${ticketId}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Unable to send reply") };
  }
};
