import api from "./axios";

const normalizeTicket = (ticket = {}) => ({
  id: ticket.id ?? ticket.ticket_id ?? ticket._id ?? null,
  subject: ticket.subject ?? ticket.title ?? "",
  message: ticket.message ?? ticket.description ?? "",
  status: String(ticket.status ?? "open").toLowerCase(),
  created_at: ticket.created_at ?? ticket.createdAt ?? ticket.date ?? null,
  updated_at: ticket.updated_at ?? ticket.updatedAt ?? null,
  ...ticket,
});

export const getMyTicketsApi = async () => {
  try {
    const response = await api.get("/support/tickets");
    const payload = response.data;

    if (
      payload &&
      (payload.success === false || payload.status === "error" || payload.status === false)
    ) {
      throw new Error(payload.message || payload.error || "Unable to load tickets");
    }

    const rows = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    return {
      success: true,
      data: rows.map(normalizeTicket),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to load tickets",
      data: [],
    };
  }
};

export const createTicketApi = async (formData) => {
  try {
    const response = await api.post("/support/tickets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data;

    if (
      payload &&
      (payload.success === false || payload.status === "error" || payload.status === false)
    ) {
      throw new Error(payload.message || payload.error || "Unable to create ticket");
    }

    const data = payload?.data || payload || {};

    return {
      success: true,
      data: normalizeTicket(data),
      message: payload?.message || "Ticket created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to create ticket",
    };
  }
};
