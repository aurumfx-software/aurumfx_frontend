import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiChevronDown, FiEye, FiRefreshCw } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAdminMembersApi, impersonateAdminMemberApi, updateAdminMemberStatusApi } from "../../../api/admin-members-management";
import "./AdminNetworkMembers.css";

const RANK_OPTIONS = ["No Rank", "Investor", "Associate", "Manager"];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

function AdminNetworkMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState("");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(true);
  const [impersonatingId, setImpersonatingId] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState("");
  const [error, setError] = useState("");

  const loadMembers = async (filters = { start_date: startDate, end_date: endDate, user_id: userId, rank }) => {
    setLoading(true);
    setError("");
    const result = await getAdminMembersApi(filters);
    if (result.success) setMembers(result.data);
    else setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers({});
  }, []);

  const handleGetReport = (event) => {
    event.preventDefault();
    loadMembers();
  };

  const handleStatusToggle = async (member) => {
    const currentStatus = String(member.status || member.user_status || "ACTIVE").toUpperCase();
    const nextStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setUpdatingStatusId(member.user_id);
    setError("");
    const result = await updateAdminMemberStatusApi(member.user_id, nextStatus);
    if (result.success) {
      setMembers((current) => current.map((item) => item.user_id === member.user_id
        ? { ...item, ...result.data, status: result.data.status || nextStatus }
        : item));
    } else setError(result.error);
    setUpdatingStatusId("");
  };

  const handleImpersonate = async (member) => {
    setImpersonatingId(member.user_id);
    setError("");
    const adminSession = {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      userId: localStorage.getItem("userId"),
      userName: localStorage.getItem("userName"),
    };
    const result = await impersonateAdminMemberApi(member.user_id);
    if (!result.success) {
      setError(result.error);
      setImpersonatingId("");
      return;
    }

    const { token, access_token: accessToken, user_id: impersonatedUserId } = result.data;
  sessionStorage.setItem("adminImpersonationSession", JSON.stringify(adminSession));
    localStorage.setItem("token", token || accessToken || "");
    localStorage.setItem("role", "user");
    localStorage.setItem("userId", impersonatedUserId || member.user_id);
    localStorage.setItem("userName", member.fullname || member.user_id);
    navigate("/user/dashboard", { replace: true });
  };

  return (
    <AdminLayout>
      <div className="admin-network-page">
        <div className="agen-page-header">
          <span className="agen-eyebrow">
            <span className="agen-eyebrow-dot" />
            Network Overview
          </span>

          <div className="agen-page-header-top">
            <div className="agen-page-header-text">
              <h1 className="agen-page-title">Network Members</h1>
              <p className="agen-page-subtitle">Browse and manage every member in the network</p>
            </div>
          </div>

          <div className="agen-breadcrumb">
            <span>Dashboard</span>
            <span className="agen-crumb-sep">•</span>
            <span className="agen-crumb-active">Network Members</span>
          </div>
        </div>

        <form className="network-filters-card" onSubmit={handleGetReport}>
          <div className="filters-grid">
            <div className="filter-input-wrap">
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="filter-date-field" aria-label="Start date" />
              <FiCalendar className="field-date-icon" />
            </div>
            <div className="filter-input-wrap">
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="filter-date-field" aria-label="End date" />
              <FiCalendar className="field-date-icon" />
            </div>
            <div className="filter-input-wrap">
              <input type="search" placeholder="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} className="filter-input-field" />
            </div>
            <div className="filter-select-wrap">
              <select value={rank} onChange={(event) => setRank(event.target.value)} className="filter-select-field" aria-label="Filter by rank">
                <option value="">All ranks</option>
                {RANK_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FiChevronDown className="field-arrow" />
            </div>
            <button type="submit" className="yellow-report-btn">Get Report</button>
          </div>
        </form>

        <div className="network-list-card">
          {error && <div className="network-message network-message--error">{error}</div>}
          {loading ? (
            <div className="network-message"><FiRefreshCw className="network-spinner" /> Loading members...</div>
          ) : (
            <div className="table-overflow-box">
              <table className="admin-network-table">
                <thead><tr><th>No</th><th>User ID</th><th>Name</th><th>Rank</th><th>Join Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr><td colSpan="7" className="network-empty-cell">No members found.</td></tr>
                  ) : members.map((member, index) => (
                    <tr key={member.id || member.user_id}>
                      <td>{index + 1}</td>
                      <td className="member-id-cell">{member.user_id || "-"}</td>
                      <td className="member-name-cell">
                        {member.profile_image ? <img src={member.profile_image} alt="" className="member-avatar" /> : <span className="member-avatar member-avatar--fallback">{(member.fullname || member.user_id || "U").charAt(0).toUpperCase()}</span>}
                        <span>{member.fullname || "-"}</span>
                      </td>
                      <td>{member.rank || "No Rank"}</td>
                      <td>{formatDate(member.join_date)}</td>
                      <td><button type="button" className={`member-status-toggle ${String(member.status || member.user_status || "ACTIVE").toUpperCase() === "ACTIVE" ? "is-active" : "is-blocked"}`} onClick={() => handleStatusToggle(member)} disabled={updatingStatusId === member.user_id} title="Toggle member status"><span className="member-status-toggle-track"><span className="member-status-toggle-thumb" /></span><span>{updatingStatusId === member.user_id ? "Updating..." : String(member.status || member.user_status || "ACTIVE").toUpperCase()}</span></button></td>
                      <td><button type="button" className="impersonate-btn" onClick={() => handleImpersonate(member)} disabled={Boolean(impersonatingId)} title={`Open ${member.user_id} account`}><FiEye />{impersonatingId === member.user_id ? "Opening..." : "Impersonate"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminNetworkMembers;
