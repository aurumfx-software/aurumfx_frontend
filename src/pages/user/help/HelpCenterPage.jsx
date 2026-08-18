import { useEffect, useRef, useState } from "react";
import {
  FiInfo,
  FiMessageSquare,
  FiPlus,
  FiPaperclip,
  FiX,
  FiImage,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import { getMyTicketsApi, createTicketApi } from "../../../api/tickets";
import "./HelpCenterPage.css";

const MAX_FILE_SIZE_MB = 5;

function HelpCenterPage() {
  const fileInputRef = useRef(null);

  const [tickets, setTickets] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketFile, setTicketFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

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
      setShowNewTicket(false);
    }, 1800);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="ewallet-page help-center-page">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-title-icon" aria-hidden="true">🎫</span>
            Support Tickets
          </h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Support Tickets</span>
          </div>
        </div>

        <div className="ewallet-table-card help-card-container">
          <div className="card-header-bar">
            <div className="header-left">
              <FiMessageSquare className="card-header-icon" />
              <h2 className="section-title">Your Tickets</h2>
            </div>
            <button
              type="button"
              className="create-ticket-btn"
              onClick={() => setShowNewTicket((v) => !v)}
            >
              <FiPlus /> <span>New Ticket</span>
            </button>
          </div>

          {showNewTicket && (
            <form onSubmit={handleTicketSubmit} className="new-ticket-form">
              <h4 className="form-title">Create Support Ticket</h4>

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
          )}

          <div className="tickets-table-card">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Attachment</th>
                  <th>Date</th>
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
                      No tickets yet. Raise one above if you run into an issue.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id}>
                      <td className="ticket-id">{t.ticket_id || t.id}</td>
                      <td>{t.subject}</td>
                      <td>
                        <span className={`status-badge status--${(t.status || "").toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {t.attachment_url ? (
                          <a
                            href={t.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="attachment-link"
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
    </UserLayout>
  );
}

export default HelpCenterPage;