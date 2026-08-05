import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiInbox, FiSend, FiPlus, FiRotateCw, FiFolder, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminEmails.css";

function AdminEmails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active folder from route
  const activeFolder = location.pathname.includes("/sent") ? "sent" : "inbox";

  const [inboxEmails, setInboxEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);

  const [showCompose, setShowCompose] = useState(false);
  const [targetUser, setTargetUser] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!targetUser || !subject || !message) return;

    const newMail = {
      id: Date.now(),
      to: targetUser,
      subject: subject,
      message: message,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSentEmails([newMail, ...sentEmails]);
    setTargetUser("");
    setSubject("");
    setMessage("");
    setShowCompose(false);
    navigate("/admin/communication/mails/sent");
  };

  const handleDelete = (id, folder) => {
    if (folder === "inbox") {
      setInboxEmails(inboxEmails.filter((m) => m.id !== id));
    } else {
      setSentEmails(sentEmails.filter((m) => m.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="admin-emails-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Emails</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Emails</span>
          </div>
        </div>

        {/* Outer Split Wrapper Card */}
        <div className="emails-outer-card">
          <div className="emails-split-layout">
            
            {/* Left Sidebar Pane */}
            <div className="emails-left-pane">
              <button
                type="button"
                className="emails-compose-btn"
                onClick={() => setShowCompose(true)}
              >
                <FiPlus className="compose-plus-icon" /> Compose
              </button>

              <div className="emails-folder-menu">
                <button
                  type="button"
                  className={`folder-menu-btn ${activeFolder === "inbox" ? "folder-menu-btn--active" : ""}`}
                  onClick={() => navigate("/admin/communication/mails/inbox")}
                >
                  <FiInbox className="folder-icon" /> Inbox
                </button>
                <button
                  type="button"
                  className={`folder-menu-btn ${activeFolder === "sent" ? "folder-menu-btn--active" : ""}`}
                  onClick={() => navigate("/admin/communication/mails/sent")}
                >
                  <FiSend className="folder-icon" /> Sent
                </button>
              </div>
            </div>

            {/* Right List Pane */}
            <div className="emails-right-pane">
              {/* Inner Toolbar */}
              <div className="emails-inner-toolbar">
                <div className="toolbar-left-controls">
                  <input type="checkbox" className="toolbar-checkbox" disabled />
                  <button type="button" className="toolbar-refresh-btn" title="Refresh">
                    <FiRotateCw />
                  </button>
                </div>
              </div>

              {/* Emails Content List / Empty state */}
              <div className="emails-list-container">
                {activeFolder === "inbox" ? (
                  inboxEmails.length > 0 ? (
                    <div className="emails-list-rows">
                      {inboxEmails.map((email) => (
                        <div key={email.id} className="email-item-row">
                          <div className="email-item-meta">
                            <span className="email-item-sender">{email.sender}</span>
                            <span className="email-item-subject">{email.subject}</span>
                          </div>
                          <span className="email-item-date">{email.date}</span>
                          <button type="button" className="email-delete-btn" onClick={() => handleDelete(email.id, "inbox")}>
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="docs-empty-state">
                      <div className="empty-magnifier-box">
                        <div className="magnifier-art">
                          <FiFolder className="folder-back-art" />
                          <div className="glass-lens-art">
                            <span className="glass-quest">?</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="empty-state-label">No Data Available</h4>
                    </div>
                  )
                ) : (
                  sentEmails.length > 0 ? (
                    <div className="emails-list-rows">
                      {sentEmails.map((email) => (
                        <div key={email.id} className="email-item-row">
                          <div className="email-item-meta">
                            <span className="email-item-sender">To: {email.to}</span>
                            <span className="email-item-subject">{email.subject}</span>
                            <p className="email-item-snippet">{email.message}</p>
                          </div>
                          <span className="email-item-date">{email.date}</span>
                          <button type="button" className="email-delete-btn" onClick={() => handleDelete(email.id, "sent")}>
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="docs-empty-state">
                      <div className="empty-magnifier-box">
                        <div className="magnifier-art">
                          <FiFolder className="folder-back-art" />
                          <div className="glass-lens-art">
                            <span className="glass-quest">?</span>
                          </div>
                        </div>
                      </div>
                      <h4 className="empty-state-label">No Data Available</h4>
                    </div>
                  )
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="email-modal-overlay">
            <div className="email-modal-card">
              <h3>Compose New Email</h3>
              <form onSubmit={handleComposeSubmit}>
                <div className="email-modal-input-group">
                  <label>Select User</label>
                  <select
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="email-modal-select"
                    required
                  >
                    <option value="">Choose User</option>
                    <option value="FX245">FX245</option>
                    <option value="FX179">FX179</option>
                    <option value="FX001">FX001</option>
                  </select>
                </div>

                <div className="email-modal-input-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Email Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="email-modal-input"
                  />
                </div>

                <div className="email-modal-input-group">
                  <label>Message</label>
                  <textarea
                    required
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="email-modal-textarea"
                    rows="6"
                  />
                </div>

                <div className="email-modal-actions">
                  <button type="button" className="btn-email-modal-cancel" onClick={() => setShowCompose(false)}>Cancel</button>
                  <button type="submit" className="btn-email-modal-submit">Send Email</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEmails;
