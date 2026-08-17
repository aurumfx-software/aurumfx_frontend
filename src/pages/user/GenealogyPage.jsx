import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import UserLayout from "../../components/User/UserLayout";
import {
  getUserGenealogyApi,
  getUserGenealogyListApi,
  getUserEnrollersApi,
} from "../../api/genealogy";
import "./GenealogyPage.css";

function GenealogyNode({ node, depth = 0 }) {
  if (!node) return null;

  const children = Array.isArray(node.children) ? node.children : [];

  return (
    <div className="genealogy-node" style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      <div className="genealogy-card">
        <div className="genealogy-card-header">
          <span className="genealogy-user-badge">{node.user_id || node.userId || "-"}</span>
          <span className="genealogy-role">{node.role || "Member"}</span>
        </div>

        <h3>{node.name || node.full_name || "User"}</h3>

        <div className="genealogy-metrics">
          <div>
            Investment
            <strong>₹{Number(node.total_investment || 0).toLocaleString()}</strong>
          </div>
          <div>
            Total Lots
            <strong>{Number(node.total_lots || 0)}</strong>
          </div>
          <div>
            Joined
            <strong>{node.date_of_join ? new Date(node.date_of_join).toLocaleDateString() : "-"}</strong>
          </div>
          <div>
            Rank
            <strong>{node.rank || "-"}</strong>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div className="genealogy-children">
          {children.map((child) => (
            <GenealogyNode key={child.user_id || child.userId || `${node.user_id || "node"}-${Math.random()}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
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

  return (
    <UserLayout user={{ name: localStorage.getItem("userName") || "User", userId }}>
      <div className="genealogy-page user-genealogy-page">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">{title}</span>
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
              <div className="genealogy-tree">
                <GenealogyNode node={data} />
              </div>
            ) : (
              <div className="genealogy-empty">No family data available.</div>
            )
          ) : view === "list" ? (
            Array.isArray(data) && data.length > 0 ? (
              <div className="list-table-wrapper">
                <table className="genealogy-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Investment</th>
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
