import { useEffect, useState } from "react";
import { FiMessageSquare, FiPaperclip, FiSend, FiX } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import {
  getAdminTicketDetailsApi,
  getAdminTicketsApi,
  replyToAdminTicketApi,
} from "../../../api/admin-help-center";
import "./AdminHelpCenter.css";
import "../../../styles/AdminGenealogyHeader.css";

const attachmentUrl = (value) => {
  if (!value || /^https?:\/\//i.test(value)) return value || "";
  return value;
};

function AdminHelpCenter() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setListError("");
    const result = await getAdminTicketsApi();
    if (result.success) setTickets(result.data);
    else setListError(result.error || "Unable to load support tickets");
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, []);

  const openTicket = async (ticketId) => {
    setSelectedTicket(null);
    setDetailLoading(true);
    setDetailError("");
    setReplyError("");
    const result = await getAdminTicketDetailsApi(ticketId);
    if (result.success) setSelectedTicket(result.data);
    else setDetailError(result.error || "Unable to load ticket details");
    setDetailLoading(false);
  };

  const handleReply = async (event) => {
    event.preventDefault();
    if (!replyMessage.trim() || !selectedTicket?.ticket_id) return;
    setReplying(true);
    setReplyError("");
    const result = await replyToAdminTicketApi(selectedTicket.ticket_id, replyMessage.trim(), replyAttachment);
    if (!result.success) {
      setReplyError(result.error || "Unable to reply to ticket");
      setReplying(false);
      return;
    }
    setReplyMessage("");
    setReplyAttachment(null);
    const refreshed = await getAdminTicketDetailsApi(selectedTicket.ticket_id);
    if (refreshed.success) setSelectedTicket(refreshed.data);
    await loadTickets();
    setReplying(false);
  };

  return (
    <AdminLayout>
      <div className="admin-help-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow"><span className="agen-eyebrow-dot" />Support Center</span>
          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Help Center</h1>
              <p className="agen-page-subtitle">Review user requests and reply from the admin panel</p>
            </div>
          </div>
          <div className="agen-breadcrumb"><span>Dashboard</span><span className="agen-crumb-sep">•</span><span className="agen-crumb-active">Help Center</span></div>
        </div>

        <div className="admin-help-card">
          <div className="admin-help-card-heading"><h2>Support Tickets</h2><p>Review user requests and reply from the admin panel.</p></div>
          <div className="admin-help-table-wrap">
            <table className="admin-help-table">
              <thead><tr><th>Ticket</th><th>User</th><th>Subject</th><th>Status</th><th>Attachment</th><th>Created</th><th>Action</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="admin-help-empty">Loading...</td></tr> : listError ? <tr><td colSpan="7" className="admin-help-empty">{listError}</td></tr> : tickets.length === 0 ? <tr><td colSpan="7" className="admin-help-empty">No support tickets found.</td></tr> : tickets.map((ticket) => (
                  <tr key={ticket.ticket_id}>
                    <td className="admin-help-ticket-number">{ticket.ticket_number || `#${ticket.ticket_id}`}</td>
                    <td>{ticket.user_id || "-"}</td><td>{ticket.subject || "-"}</td>
                    <td><span className={`admin-help-status status-${String(ticket.status || "open").toLowerCase()}`}>{ticket.status || "Open"}</span></td>
                    <td>{ticket.attachment ? <a href={attachmentUrl(ticket.attachment)} target="_blank" rel="noreferrer"><FiPaperclip size={13} /> View</a> : "-"}</td>
                    <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}</td>
                    <td><button type="button" className="admin-help-view-btn" onClick={() => openTicket(ticket.ticket_id)}>View & Reply</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(detailLoading || selectedTicket || detailError) && <div className="admin-help-modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="admin-help-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-help-modal-header"><div><h2>{selectedTicket?.ticket_number || "Ticket Details"}</h2><p>{selectedTicket?.subject || "Support ticket"}</p></div><button type="button" onClick={() => setSelectedTicket(null)} aria-label="Close"><FiX /></button></div>
            {detailLoading ? <p className="admin-help-message">Loading ticket...</p> : detailError ? <p className="admin-help-error">{detailError}</p> : selectedTicket && <>
              <div className="admin-help-conversation"><div className="admin-help-message-block"><strong>User {selectedTicket.user_id}</strong><p>{selectedTicket.message}</p>{selectedTicket.attachment && <a href={attachmentUrl(selectedTicket.attachment)} target="_blank" rel="noreferrer"><FiPaperclip size={13} /> Open attachment</a>}</div>
                {selectedTicket.replies.map((reply) => <div className={`admin-help-message-block reply-${reply.sender_type}`} key={reply.id}><strong>{reply.sender_type || "Reply"}</strong><p>{reply.message}</p>{reply.attachment && <a href={attachmentUrl(reply.attachment)} target="_blank" rel="noreferrer"><FiPaperclip size={13} /> Open attachment</a>}</div>)}
              </div>
              <form className="admin-help-reply-form" onSubmit={handleReply}><textarea value={replyMessage} onChange={(event) => setReplyMessage(event.target.value)} placeholder="Write a reply..." rows="4" required /><label className="admin-help-attachment"><FiPaperclip /> {replyAttachment ? replyAttachment.name : "Attach file"}<input type="file" onChange={(event) => setReplyAttachment(event.target.files?.[0] || null)} /></label>{replyError && <p className="admin-help-error">{replyError}</p>}<button type="submit" className="admin-help-send-btn" disabled={replying}><FiSend size={14} /> {replying ? "Sending..." : "Send Reply"}</button></form>
            </>}
          </div>
        </div>}
      </div>
    </AdminLayout>
  );
}

export default AdminHelpCenter;
