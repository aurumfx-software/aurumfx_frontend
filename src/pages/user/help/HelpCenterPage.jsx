import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiInfo,
  FiHelpCircle,
  FiBookOpen,
  FiMessageSquare,
  FiFileText,
  FiVideo,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSearch,
  FiInbox,
  FiSend,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./HelpCenterPage.css";

function HelpCenterPage() {
  const location = useLocation();

  // Determine active section based on current path
  const getSectionFromPath = () => {
    const path = location.pathname;
    if (path.includes("/knowledge-base")) return "knowledge";
    if (path.includes("/emails") || path.includes("/mails")) return "emails";
    if (path.includes("/tickets")) return "tickets";
    if (path.includes("/documents")) return "documents";
    if (path.includes("/videos")) return "videos";
    return "faqs";
  };

  const activeSection = getSectionFromPath();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Email Inbox States
  const [emailFolder, setEmailFolder] = useState("inbox"); // 'inbox' or 'sent'
  const [selectAll, setSelectAll] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSuccess, setComposeSuccess] = useState("");

  const [inboxEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);

  // New Ticket Form State
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Sample FAQs
  const faqs = [
    {
      q: "How do I deposit funds into my AurumFX trading account?",
      a: "Navigate to Financial -> Investments or Fund Transfer in your user dashboard, choose your payment method (Bank Transfer / E-Wallet), enter the amount and submit the transaction ID with proof.",
    },
    {
      q: "What is the minimum investment amount?",
      a: "The minimum investment amount is ₹5000.00 (in multiples of ₹5000.00). Investments earn 14.00% monthly return for a 10-month contract duration.",
    },
    {
      q: "How long do withdrawal requests take to process?",
      a: "Standard withdrawal requests are processed within 24 to 48 business hours once bank details are verified.",
    },
    {
      q: "How can I update my bank details for payouts?",
      a: "Go to My Profile -> Bank Details, enter your Bank Name, Account Number, and IFSC code, then click Update Bank Details.",
    },
    {
      q: "What are the rules for referral commission and downline tree?",
      a: "You can view your binary network structure and sponsor tree under Business -> Club / Enroller pages in the sidebar menu.",
    },
  ];

  // Sample Knowledge Base Articles
  const articles = [
    { id: 1, title: "Getting Started with AurumFX", category: "Basics", time: "3 min read" },
    { id: 2, title: "Understanding Binary Network Matching", category: "Genealogy", time: "5 min read" },
    { id: 3, title: "E-Wallet Transfer & Fund Security", category: "Finance", time: "4 min read" },
    { id: 4, title: "Monthly Investment Return Calculations", category: "Returns", time: "3 min read" },
  ];

  // Sample Tickets
  const [tickets, setTickets] = useState([
    { id: "T-1082", subject: "Verification status query", status: "Open", date: "02 Aug 2026" },
    { id: "T-1045", subject: "Bank details update confirmation", status: "Closed", date: "28 Jul 2026" },
  ]);

  const handleComposeSend = (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) return;

    const newMail = {
      id: Date.now(),
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      date: "Today",
    };

    setSentEmails([newMail, ...sentEmails]);
    setComposeSuccess("Email sent successfully!");
    setTimeout(() => {
      setComposeSuccess("");
      setShowComposeModal(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
    }, 1500);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;

    const newT = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject.trim(),
      status: "Open",
      date: "Today",
    };
    setTickets([newT, ...tickets]);
    setTicketSubmitted(true);
    setTicketSubject("");
    setTicketMsg("");
    setTimeout(() => {
      setTicketSubmitted(false);
      setShowNewTicket(false);
    }, 2000);
  };

  const userId = localStorage.getItem("userId") || "FX256";
  const userName = localStorage.getItem("userName") || "SUCHITHRA";

  const getTitle = () => {
    switch (activeSection) {
      case "knowledge":
        return "Knowledge Base";
      case "emails":
        return "Emails";
      case "tickets":
        return "Support Tickets";
      case "documents":
        return "Documents";
      case "videos":
        return "Videos";
      default:
        return "FAQ's";
    }
  };

  const getBreadcrumb = () => {
    if (activeSection === "emails") return "Emails";
    return getTitle();
  };

  const currentEmails = emailFolder === "inbox" ? inboxEmails : sentEmails;

  return (
    <UserLayout user={{ name: userName, userId }}>
      <div className="help-center-page">
        {/* Top Heads-up Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>{userId}</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumbs */}
        <div className="page-header">
          <h1 className="page-title">{getTitle()}</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* SECTION 1: FAQ's */}
        {activeSection === "faqs" && (
          <div className="help-card-container">
            <div className="card-header-bar">
              <div className="header-left">
                <FiHelpCircle className="card-header-icon" />
                <h2 className="section-title">Frequently Asked Questions</h2>
              </div>
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="faq-accordion">
              {faqs
                .filter((f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                      >
                        <span className="faq-q-text">{faq.q}</span>
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      {isOpen && (
                        <div className="faq-answer-body">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SECTION 2: Knowledge Base */}
        {activeSection === "knowledge" && (
          <div className="help-card-container">
            <div className="card-header-bar">
              <div className="header-left">
                <FiBookOpen className="card-header-icon" />
                <h2 className="section-title">Knowledge Base</h2>
              </div>
            </div>

            <div className="articles-grid">
              {articles.map((art) => (
                <div key={art.id} className="article-card">
                  <span className="article-category">{art.category}</span>
                  <h3 className="article-title">{art.title}</h3>
                  <span className="article-time">{art.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Emails (Matching 2-Column Email Inbox Screenshot) */}
        {activeSection === "emails" && (
          <div className="email-inbox-card">
            {/* Left Sidebar Panel */}
            <div className="email-sidebar-panel">
              <button
                type="button"
                className="compose-btn"
                onClick={() => setShowComposeModal(true)}
              >
                <FiPlus className="compose-icon" /> <span>Compose</span>
              </button>

              <div className="email-folders-list">
                <button
                  type="button"
                  className={`folder-item ${emailFolder === "inbox" ? "folder-item--active" : ""}`}
                  onClick={() => setEmailFolder("inbox")}
                >
                  <FiInbox className="folder-icon" />
                  <span>Inbox</span>
                </button>

                <button
                  type="button"
                  className={`folder-item ${emailFolder === "sent" ? "folder-item--active" : ""}`}
                  onClick={() => setEmailFolder("sent")}
                >
                  <FiSend className="folder-icon" />
                  <span>Sent</span>
                </button>
              </div>
            </div>

            {/* Right Main Email List Panel */}
            <div className="email-main-panel">
              <div className="email-toolbar">
                <div className="toolbar-left">
                  <input
                    type="checkbox"
                    className="email-checkbox"
                    checked={selectAll}
                    onChange={(e) => setSelectAll(e.target.checked)}
                  />
                  <button
                    type="button"
                    className="toolbar-refresh-btn"
                    onClick={() => {}}
                    title="Refresh"
                  >
                    <FiRefreshCw />
                  </button>
                </div>
              </div>

              {/* Emails Content List or Empty State */}
              <div className="email-body-content">
                {currentEmails.length > 0 ? (
                  <div className="email-items-list">
                    {currentEmails.map((email) => (
                      <div key={email.id} className="email-row-item">
                        <input type="checkbox" checked={selectAll} readOnly />
                        <span className="email-sender">{email.to || email.sender || "Admin"}</span>
                        <span className="email-subject-text">{email.subject}</span>
                        <span className="email-time-text">{email.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="email-empty-state">
                    <div className="empty-illustration">
                      <svg
                        width="140"
                        height="115"
                        viewBox="0 0 150 125"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="25" y="15" width="90" height="75" rx="12" fill="#F1F5F9" />
                        <path
                          d="M40 38H95"
                          stroke="#CBD5E1"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M40 52H80"
                          stroke="#CBD5E1"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M40 66H65"
                          stroke="#CBD5E1"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="4 4"
                        />
                        {/* Magnifying Glass */}
                        <circle
                          cx="90"
                          cy="72"
                          r="24"
                          fill="white"
                          stroke="#94A3B8"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M83 72H97"
                          stroke="#94A3B8"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M90 65V79"
                          stroke="#94A3B8"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M107 89L122 104"
                          stroke="#64748B"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p className="empty-text">No Data Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compose Modal */}
            {showComposeModal && (
              <div className="compose-modal-overlay">
                <div className="compose-modal-card">
                  <div className="modal-header">
                    <h3 className="modal-title">New Message</h3>
                    <button
                      type="button"
                      className="close-modal-btn"
                      onClick={() => setShowComposeModal(false)}
                    >
                      <FiX />
                    </button>
                  </div>

                  <form onSubmit={handleComposeSend} className="compose-modal-form">
                    <input
                      type="email"
                      placeholder="To (e.g. support@aurumfx.net)"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="modal-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="modal-input"
                      required
                    />
                    <textarea
                      placeholder="Write your email message..."
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      className="modal-textarea"
                      rows={6}
                      required
                    />

                    {composeSuccess && (
                      <p className="modal-success-msg">{composeSuccess}</p>
                    )}

                    <div className="modal-footer">
                      <button type="submit" className="send-mail-btn">
                        Send Email
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Support Tickets */}
        {activeSection === "tickets" && (
          <div className="help-card-container">
            <div className="card-header-bar">
              <div className="header-left">
                <FiMessageSquare className="card-header-icon" />
                <h2 className="section-title">Support Tickets</h2>
              </div>
              <button
                type="button"
                className="create-ticket-btn"
                onClick={() => setShowNewTicket(!showNewTicket)}
              >
                <FiPlus /> <span>New Ticket</span>
              </button>
            </div>

            {showNewTicket && (
              <form onSubmit={handleTicketSubmit} className="new-ticket-form">
                <h4 className="form-title">Create Support Ticket</h4>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Describe your query..."
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    className="form-textarea"
                    rows={4}
                  />
                </div>
                {ticketSubmitted && (
                  <p className="form-success-msg">Ticket submitted successfully!</p>
                )}
                <button type="submit" className="submit-ticket-btn">
                  Submit Ticket
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
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td className="ticket-id">{t.id}</td>
                      <td>{t.subject}</td>
                      <td>
                        <span className={`status-badge status--${t.status.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5: Documents */}
        {activeSection === "documents" && (
          <div className="help-card-container">
            <div className="card-header-bar">
              <div className="header-left">
                <FiFileText className="card-header-icon" />
                <h2 className="section-title">Official Documents</h2>
              </div>
            </div>

            <div className="docs-list">
              <div className="doc-item">
                <FiFileText className="doc-icon" />
                <div className="doc-info">
                  <h4 className="doc-name">AurumFX Terms & Conditions.pdf</h4>
                  <span className="doc-size">1.2 MB</span>
                </div>
              </div>
              <div className="doc-item">
                <FiFileText className="doc-icon" />
                <div className="doc-info">
                  <h4 className="doc-name">Trading Platform Policy & Disclaimers.pdf</h4>
                  <span className="doc-size">850 KB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: Videos */}
        {activeSection === "videos" && (
          <div className="help-card-container">
            <div className="card-header-bar">
              <div className="header-left">
                <FiVideo className="card-header-icon" />
                <h2 className="section-title">Video Tutorials</h2>
              </div>
            </div>

            <div className="videos-grid">
              <div className="video-card">
                <div className="video-thumb">
                  <FiVideo className="play-icon" />
                </div>
                <h4 className="video-title">Platform Overview & Navigation Guide</h4>
              </div>
              <div className="video-card">
                <div className="video-thumb">
                  <FiVideo className="play-icon" />
                </div>
                <h4 className="video-title">How to Deposit and Track Monthly Returns</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default HelpCenterPage;
