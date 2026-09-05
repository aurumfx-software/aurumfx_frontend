import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiInfo,
  FiMessageSquare,
  FiPaperclip,
  FiX,
  FiImage,
  FiSend,
  FiHash,
  FiCheckCircle,
  FiCalendar,
  FiHeadphones,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import {
  getMyTicketsApi,
  createTicketApi,
  getTicketDetailsApi,
  replyToTicketApi,
} from "../../../api/tickets";
import "./HelpCenterPage.css";
import "../financial/EWallet.css";

const MAX_FILE_SIZE_MB = 5;

function HelpCenterPage() {
  const fileInputRef = useRef(null);

  const [tickets, setTickets] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketFile, setTicketFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  const loadTickets = async () => {
    setListLoading(true);
    setListError("");
    const res = await getMyTicketsApi();
    if (res.success) {
      setTickets(res.data || []);
    } else {
      setListError(res.error || "Unable to load tickets");
    }
    setListLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!ticketFile) {
      setFilePreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(ticketFile);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [ticketFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSubmitError("");
    if (!file) {
      setTicketFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setSubmitError("Please attach an image file (PNG, JPG, etc.)");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSubmitError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }
    setTicketFile(file);
  };

  const removeFile = () => {
    setTicketFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTicketSubject("");
    setTicketMsg("");
    removeFile();
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!ticketSubject.trim() || !ticketMsg.trim()) {
      setSubmitError("Please fill in both subject and description.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("subject", ticketSubject.trim());
    formData.append("message", ticketMsg.trim());
    if (ticketFile) formData.append("attachment", ticketFile);

    const res = await createTicketApi(formData);

    if (!res.success) {
      setSubmitError(res.error || "Failed to submit ticket");
      setSubmitting(false);
      return;
    }

    setTicketSubmitted(true);
    resetForm();
    setSubmitting(false);
    await loadTickets();

    setTimeout(() => {
      setTicketSubmitted(false);
    }, 1800);
  };

  const openTicket = async (ticketId) => {
    setDetailLoading(true);
    setDetailError("");
    setReplyError("");
    setReplyMessage("");
    setSelectedTicket(null);
    const res = await getTicketDetailsApi(ticketId);
    if (res.success) setSelectedTicket(res.data);
    else setDetailError(res.error || "Unable to load ticket details");
    setDetailLoading(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket?.id) return;

    setReplying(true);
    setReplyError("");
    const formData = new FormData();
    formData.append("message", replyMessage.trim());
    const res = await replyToTicketApi(selectedTicket.id, formData);
    if (!res.success) {
      setReplyError(res.error || "Unable to send reply");
      setReplying(false);
      return;
    }

    setReplyMessage("");
    const refreshed = await getTicketDetailsApi(selectedTicket.id);
    if (refreshed.success) setSelectedTicket(refreshed.data);
    setReplying(false);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page help-center-page">
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Help &amp; Assistance
          </span>
          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">
              <FiHeadphones size={22} />
            </span>
            <div className="page-header-text">
              <h1 className="page-title">Help &amp; Support</h1>
              <p className="page-subtitle">We are here to help with questions, requests, and account support.</p>
            </div>
          </div>
        </div>

        <div className="ewallet-table-card help-card-container">
          <div className="card-header-bar">
            <div className="header-left">
              <FiMessageSquare className="card-header-icon" />
              <h2 className="section-title">Your Support Requests</h2>
            </div>
          </div>

          <form onSubmit={handleTicketSubmit} className="new-ticket-form">
              <h4 className="form-title">How Can We Help?</h4>

              <div className="form-group">
                <label className="separated-label">Subject</label>
                <input
                  type="text"
                  placeholder="Briefly describe the issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="separated-label">Description</label>
                <textarea
                  placeholder="Describe your query or the error you ran into..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="separated-label">
                  Attach a screenshot of the error (optional)
                </label>

                {!ticketFile ? (
                  <label className="upload-dropzone" htmlFor="ticket-attachment">
                    <FiImage className="upload-dropzone-icon" />
                    <span className="upload-dropzone-text">
                      Click to upload an image
                    </span>
                    <span className="upload-dropzone-hint">
                      PNG or JPG, up to {MAX_FILE_SIZE_MB}MB
                    </span>
                    <input
                      id="ticket-attachment"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden-file-input"
                    />
                  </label>
                ) : (
                  <div className="upload-preview">
                    <img
                      src={filePreviewUrl}
                      alt="Attachment preview"
                      className="upload-preview-img"
                    />
                    <div className="upload-preview-info">
                      <span className="upload-preview-name">
                        <FiPaperclip /> {ticketFile.name}
                      </span>
                      <span className="upload-preview-size">
                        {(ticketFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="upload-remove-btn"
                      onClick={removeFile}
                      aria-label="Remove attachment"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>

              {submitError && <p className="form-error-msg">{submitError}</p>}
              {ticketSubmitted && (
                <p className="form-success-msg">Ticket submitted successfully!</p>
              )}

              <button type="submit" className="submit-ticket-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
          </form>

          <div className="tickets-table-card">
            <h2 className="section-title">Support Tickets</h2>
            <div className="tickets-table-responsive">
              <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    <span className="hc-head-label">
                      <span className="hc-head-icon"><FiHash size={12} /></span>
                      Ticket No
                    </span>
                  </th>
                  <th>
                    <span className="hc-head-label">
                      <span className="hc-head-icon"><FiMessageSquare size={12} /></span>
                      Subject
                    </span>
                  </th>
                  <th>
                    <span className="hc-head-label">
                      <span className="hc-head-icon"><FiCheckCircle size={12} /></span>
                      Status
                    </span>
                  </th>
                  <th>
                    <span className="hc-head-label">
                      <span className="hc-head-icon"><FiPaperclip size={12} /></span>
                      Attachment
                    </span>
                  </th>
                  <th>
                    <span className="hc-head-label">
                      <span className="hc-head-icon"><FiCalendar size={12} /></span>
                      Date
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">Loading...</td>
                  </tr>
                ) : listError ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">{listError}</td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                            No support requests yet. Send us a message whenever you need help.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} onClick={() => openTicket(t.id)} className="ticket-row">
                      <td className="ticket-id">{t.ticket_id || t.id}</td>
                      <td>{t.subject}</td>
                      <td>
                        <span className={`status-badge status--${(t.status || "").toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {t.attachment_url || t.attachment ? (
                          <a
                            href={t.attachment_url || t.attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="attachment-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiPaperclip /> View
                          </a>
                        ) : (
                          <span className="no-attachment">—</span>
                        )}
                      </td>
                      <td>{t.date || t.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>

        {(detailLoading || detailError || selectedTicket) && createPortal(
          <div className="ticket-detail-backdrop" onClick={() => setSelectedTicket(null)}>
            <section
              className="ticket-detail-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ticket-detail-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ticket-detail-header">
                <div>
                  <span className="detail-kicker">Ticket details</span>
                  <h2 id="ticket-detail-title">
                    {selectedTicket?.ticket_number || selectedTicket?.id || "Loading..."}
                  </h2>
                </div>
                <button type="button" className="modal-close-btn" onClick={() => setSelectedTicket(null)} aria-label="Close ticket details">
                  <FiX />
                </button>
              </div>

              <div className="ticket-detail-modal-body">
                {detailLoading && <p className="detail-state">Loading ticket details...</p>}
                {detailError && <p className="form-error-msg">{detailError}</p>}
                {selectedTicket && (
                  <>
                    <div className="ticket-detail-content">
                      <div className="detail-meta">
                        <strong>{selectedTicket.subject}</strong>
                        <span className={`status-badge status--${selectedTicket.status}`}>{selectedTicket.status}</span>
                      </div>
                      <p className="ticket-message">{selectedTicket.message}</p>
                      {(selectedTicket.replies || []).map((reply) => (
                        <div className="ticket-reply" key={reply.id}>
                          <span>{reply.sender_type || "Reply"}</span>
                          <p>{reply.message}</p>
                        </div>
                      ))}
                    </div>
                    <form className="reply-form" onSubmit={handleReplySubmit}>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Write a reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                      {replyError && <p className="form-error-msg">{replyError}</p>}
                      <button type="submit" className="submit-ticket-btn" disabled={replying || !replyMessage.trim()}>
                        <FiSend /> {replying ? "Sending..." : "Send Reply"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </section>
          </div>,
          document.body,
        )}
      </div>
    </UserLayout>
  );
}

export default HelpCenterPage;