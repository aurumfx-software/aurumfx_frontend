import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiUsers, FiUser, FiBriefcase, FiCalendar, FiAward, FiDollarSign } from "react-icons/fi";
import UserLayout from "../../components/User/UserLayout";
import {
  getUserGenealogyApi,
  getUserGenealogyListApi,
  getUserEnrollersApi,
} from "../../api/genealogy";
import "./GenealogyPage.css";

/* ---------------------------------------------------------------------- */
/* Family view — org-chart avatar tree with hover tooltip                  */
/* ---------------------------------------------------------------------- */

const AVATAR_COLORS = [
  "#f97316", "#64748b", "#14b8a6", "#a855f7",
  "#22c55e", "#ef4444", "#3b82f6", "#eab308",
];

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function FamNode({ node }) {
  if (!node) return null;

  const id = node.user_id || node.userId || "-";
  const name = node.name || node.full_name || "User";
  const photo = node.photo || node.avatar || node.profile_image;
  const children = Array.isArray(node.children) ? node.children : [];
  const isActive = node.status ? node.status === "active" : true;

  return (
    <li>
      <div className="fam-node">
        <div className="fam-avatar" style={{ background: colorForId(id) }}>
          {photo ? <img src={photo} alt={name} /> : name.charAt(0).toUpperCase()}
        </div>
        <span className={`fam-badge ${isActive ? "" : "is-inactive"}`}>{id}</span>

        <div className="fam-tooltip">
          <div className="fam-tooltip-row">
            <span>Full Name</span>
            <span>{name}</span>
          </div>
          <div className="fam-tooltip-row">
            <span>Date of Join</span>
            <span>{node.date_of_join ? new Date(node.date_of_join).toLocaleDateString() : "-"}</span>
          </div>
          <div className="fam-tooltip-row">
            <span>Rank</span>
            <span>{node.rank || "-"}</span>
          </div>
          <div className="fam-tooltip-row">
            <span>Trade Amount</span>
            <span>₹{Number(node.total_investment || 0).toLocaleString()}</span>
          </div>
          <div className="fam-tooltip-row">
            <span>Total Lots</span>
            <span>{Number(node.total_lots || 0)}</span>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <FamNode
              key={child.user_id || child.userId || `${id}-${Math.random()}`}
              node={child}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function FamilyOrgTree({ data }) {
  if (!data) return null;
  return (
    <div className="fam-tree-scroll">
      <ul className="tree">
        <FamNode node={data} />
      </ul>
    </div>
  );
}

function GenealogyPage() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = useMemo(() => localStorage.getItem("userId") || "FX001", []);

  const view = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.includes("/business/list")) return "list";
    if (pathname.includes("/business/enroller")) return "enroller";
    return "family";
  }, [location.pathname]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      let res;
      if (view === "family") {
        res = await getUserGenealogyApi();
      } else if (view === "list") {
        res = await getUserGenealogyListApi();
      } else {
        res = await getUserEnrollersApi();
      }

      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || "Unable to load data.");
      }

      setLoading(false);
    };

    loadData();
  }, [view]);

  const title =
    view === "family" ? "Family" : view === "list" ? "List" : "Enroller";

  const subtitle =
    view === "family"
      ? "Explore your downline across every generation, at a glance"
      : view === "list"
      ? "Every member in your network, with their investment at a glance"
      : "Members you've personally enrolled into the network";

  const columnIcons = {
    user: <FiUser size={12} />,
    name: <FiUsers size={12} />,
    investment: <FiDollarSign size={12} />,
    joined: <FiCalendar size={12} />,
    rank: <FiAward size={12} />,
    lots: <FiBriefcase size={12} />,
  };

  return (
    <UserLayout user={{ name: localStorage.getItem("userName") || "User", userId }}>
      <div className="genealogy-page user-genealogy-page">
        <div className="page-header">
          <span className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Genealogy Network
          </span>

          <div className="page-header-top">
            <span className="page-title-icon" aria-hidden="true">
              👨‍👩‍👧‍👦
            </span>
            <div className="page-header-text">
              <h1 className="page-title">{title}</h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>
          </div>

        </div>

        <div className="genealogy-panel">
          <div className="genealogy-header-row">
            <h2>User: {userId}</h2>
          </div>

          {loading ? (
            <div className="genealogy-empty">Loading {title.toLowerCase()}...</div>
          ) : error ? (
            <div className="genealogy-error">{error}</div>
          ) : view === "family" ? (
            data ? (
              <FamilyOrgTree data={data} />
            ) : (
              <div className="genealogy-empty">No family data available.</div>
            )
          ) : view === "list" ? (
            Array.isArray(data) && data.length > 0 ? (
              <div className="list-table-wrapper">
                <table className="genealogy-table">
                  <thead>
                    <tr>
                      <th><span className="genealogy-head-label"><span className="genealogy-head-icon">{columnIcons.user}</span>User ID</span></th>
                      <th><span className="genealogy-head-label"><span className="genealogy-head-icon">{columnIcons.name}</span>Name</span></th>
                      <th><span className="genealogy-head-label"><span className="genealogy-head-icon">{columnIcons.investment}</span>Investment</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={`${item.user_id || item.userId || "genealogy-list-"}${index}`}>
                        <td>{item.user_id || item.userId || "-"}</td>
                        <td>{item.full_name || item.name || "-"}</td>
                        <td>₹{Number(item.total_investment || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="genealogy-empty">No list data available.</div>
            )
          ) : Array.isArray(data?.enrollers) && data.enrollers.length > 0 ? (
            <div className="list-table-wrapper">
              <table className="genealogy-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Joined</th>
                    <th>Rank</th>
                    <th>Investment</th>
                    <th>Lots</th>
                  </tr>
                </thead>
                <tbody>
                  {data.enrollers.map((item, index) => (
                    <tr key={`${item.user_id || item.userId || "enroller-"}${index}`}>
                      <td>{item.user_id || "-"}</td>
                      <td>{item.fullname || item.full_name || "-"}</td>
                      <td>{item.date_of_joining || item.date_of_join || "-"}</td>
                      <td>{item.rank || "-"}</td>
                      <td>₹{Number(item.total_investment_amount || 0).toLocaleString()}</td>
                      <td>{Number(item.total_lots || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="genealogy-empty">No enrollers available.</div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default GenealogyPage;