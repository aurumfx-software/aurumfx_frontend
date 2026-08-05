import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiTag,
  FiAlertTriangle,
  FiFolder,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiMessageSquare,
  FiBriefcase,
  FiList,
  FiFileText,
  FiFlag,
  FiPlus,
  FiChevronDown,
  FiEye,
  FiTrash2
} from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminHelpCenter.css";

const categoriesList = [
  { id: "dashboard", label: "Tickets Dashboard", icon: FiGrid },
  { id: "all", label: "All tickets", icon: FiTag },
  { id: "overdue", label: "Overdue", icon: FiAlertTriangle },
  { id: "open", label: "Open", icon: FiFolder },
  { id: "resolved", label: "Resolved", icon: FiCheckCircle },
  { id: "closed", label: "Closed", icon: FiXCircle },
  { id: "inprogress", label: "In Progress", icon: FiLoader },
  { id: "responded", label: "Responded", icon: FiMessageSquare },
  { id: "departments", label: "Departments", icon: FiBriefcase },
  { id: "categories", label: "Categories", icon: FiList },
  { id: "canned", label: "Canned Response", icon: FiFileText },
  { id: "priorities", label: "Priorities", icon: FiFlag }
];

function AdminHelpCenter() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active sub-category from route path
  let activeCat = "inprogress";
  categoriesList.forEach((cat) => {
    if (location.pathname.includes(`/help-center/tickets/${cat.id}`)) {
      activeCat = cat.id;
    }
  });

  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter Form State
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Create Ticket Form State
  const [newSubject, setNewSubject] = useState("");
  const [newDepartment, setNewDepartment] = useState("Technical");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("General Support");
  const [newMsg, setNewMsg] = useState("");

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newSubject || !newMsg) return;

    const newTicket = {
      no: tickets.length + 1,
      ticketNumber: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      ticketFrom: "FX245",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      subject: newSubject,
      status: "In Progress",
      priority: newPriority,
      department: newDepartment,
      category: newCategory,
      message: newMsg
    };

    setTickets([newTicket, ...tickets]);
    setNewSubject("");
    setNewMsg("");
    setShowCreateModal(false);
    navigate("/admin/communication/help-center/tickets/inprogress");
  };

  const handleDeleteTicket = (no) => {
    setTickets(tickets.filter((t) => t.no !== no).map((t, idx) => ({ ...t, no: idx + 1 })));
  };

  return (
    <AdminLayout>
      <div className="admin-help-center-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Help Center</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Help Center</span>
          </div>
        </div>

        {/* Outer Help Center Split card */}
        <div className="help-center-outer-card">
          <div className="help-center-split-layout">
            
            {/* Left Options Pane */}
            <div className="help-center-left-pane">
              <button
                type="button"
                className="help-center-create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus className="create-plus-icon" /> Create Ticket
              </button>

              <div className="help-center-categories-menu">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`help-cat-menu-btn ${activeCat === cat.id ? "help-cat-menu-btn--active" : ""}`}
                      onClick={() => navigate(`/admin/communication/help-center/tickets/${cat.id}`)}
                    >
                      <Icon className="help-cat-icon" /> {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Tickets List Pane */}
            <div className="help-center-right-pane">
              
              {/* Top Collapsible Filters Block */}
              <div className="help-filters-card">
                <form className="help-filters-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="help-filters-grid">
                    {/* Department Select */}
                    <div className="filter-field-wrap select-field-wrap">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="filter-select-field"
                      >
                        <option value="">Departments</option>
                        <option value="Technical">Technical Support</option>
                        <option value="Billing">Billing Support</option>
                        <option value="General">General Inquiries</option>
                      </select>
                      <FiChevronDown className="field-right-icon text-muted" />
                    </div>

                    {/* Priority Select */}
                    <div className="filter-field-wrap select-field-wrap">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="filter-select-field"
                      >
                        <option value="">Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <FiChevronDown className="field-right-icon text-muted" />
                    </div>

                    {/* Status Select */}
                    <div className="filter-field-wrap select-field-wrap">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="filter-select-field"
                      >
                        <option value="">Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <FiChevronDown className="field-right-icon text-muted" />
                    </div>

                    {/* Category Select */}
                    <div className="filter-field-wrap select-field-wrap">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="filter-select-field"
                      >
                        <option value="">Category</option>
                        <option value="General Support">General Support</option>
                        <option value="E-Wallet Query">E-Wallet Query</option>
                        <option value="Verification KYC">Verification KYC</option>
                      </select>
                      <FiChevronDown className="field-right-icon text-muted" />
                    </div>

                    {/* Ticket ID Input */}
                    <div className="filter-field-wrap">
                      <input
                        type="text"
                        placeholder="Ticket Id"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        className="filter-input-field"
                      />
                    </div>

                    {/* Search User Select */}
                    <div className="filter-field-wrap select-field-wrap">
                      <select
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="filter-select-field"
                      >
                        <option value="">Search User</option>
                        <option value="FX245">FX245</option>
                        <option value="FX179">FX179</option>
                        <option value="FX001">FX001</option>
                      </select>
                      <FiChevronDown className="field-right-icon text-muted" />
                    </div>

                    {/* Overdue Checkbox */}
                    <label className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={showOverdueOnly}
                        onChange={(e) => setShowOverdueOnly(e.target.checked)}
                        className="filter-checkbox"
                      />
                      <span>Show Only Overdue Items</span>
                    </label>

                    {/* Get Report Button */}
                    <button type="button" className="yellow-get-btn">
                      Get Report
                    </button>
                  </div>
                </form>
              </div>

              {/* Inner List Panel */}
              <div className="help-tickets-list-card">
                <h3 className="help-tickets-list-title">
                  {categoriesList.find((c) => c.id === activeCat)?.label || "In-progress"} Tickets
                </h3>

                <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                  <table className="admin-help-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Ticket Number</th>
                        <th>Ticket From</th>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Department</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Filter matches only inprogress tickets for demonstration if path matches inprogress */}
                      {tickets
                        .filter((t) => activeCat === "all" || t.status.toLowerCase().replace(" ", "") === activeCat)
                        .map((ticket) => (
                          <tr key={ticket.no}>
                            <td>{ticket.no}</td>
                            <td className="ticket-num-cell">{ticket.ticketNumber}</td>
                            <td className="username-cell">{ticket.ticketFrom}</td>
                            <td>{ticket.date}</td>
                            <td className="ticket-subject-cell">{ticket.subject}</td>
                            <td>
                              <span className="ticket-status-badge badge-inprogress">
                                {ticket.status}
                              </span>
                            </td>
                            <td>{ticket.priority}</td>
                            <td>{ticket.department}</td>
                            <td>{ticket.category}</td>
                            <td>
                              <div className="action-buttons-wrap">
                                <button type="button" className="btn-action-view" title="View Details">
                                  <FiEye />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-delete"
                                  title="Delete Ticket"
                                  onClick={() => handleDeleteTicket(ticket.no)}
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {tickets.filter((t) => activeCat === "all" || t.status.toLowerCase().replace(" ", "") === activeCat).length === 0 && (
                        <tr>
                          <td colSpan="10" style={{ padding: 0 }}>
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
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="ticket-modal-overlay">
            <div className="ticket-modal-card">
              <h3>Create New Ticket</h3>
              <form onSubmit={handleCreateTicket}>
                <div className="ticket-modal-input-row">
                  <div className="ticket-modal-input-group">
                    <label>Department</label>
                    <select
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="ticket-modal-select"
                      required
                    >
                      <option value="Technical">Technical Support</option>
                      <option value="Billing">Billing Support</option>
                      <option value="General">General Inquiries</option>
                    </select>
                  </div>
                  <div className="ticket-modal-input-group">
                    <label>Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="ticket-modal-select"
                      required
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="ticket-modal-input-group">
                  <label>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="ticket-modal-select"
                    required
                  >
                    <option value="General Support">General Support</option>
                    <option value="E-Wallet Query">E-Wallet Query</option>
                    <option value="Verification KYC">Verification KYC</option>
                  </select>
                </div>

                <div className="ticket-modal-input-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Ticket Subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="ticket-modal-input"
                  />
                </div>

                <div className="ticket-modal-input-group">
                  <label>Message Detail</label>
                  <textarea
                    required
                    placeholder="Type transaction or request details..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="ticket-modal-textarea"
                    rows="6"
                  />
                </div>

                <div className="ticket-modal-actions">
                  <button type="button" className="btn-ticket-modal-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn-ticket-modal-submit">Create Ticket</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminHelpCenter;
