import { useEffect, useMemo, useState } from "react";
import UserLayout from "../../components/User/UserLayout";
import { getUserGenealogyApi } from "../../api/genealogy";
import "./GenealogyPage.css";

function GenealogyNode({ node, depth = 0 }) {
  if (!node) return null;

  const children = Array.isArray(node.children) ? node.children : [];

  return (
    <div className="genealogy-node" style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      <div className="genealogy-card">
        <div className="genealogy-card-header">
          <span className="genealogy-user-badge">{node.user_id}</span>
          <span className="genealogy-role">{node.role}</span>
        </div>

        <h3>{node.name}</h3>

        <div className="genealogy-metrics">
          <div>
            Wallet
            <strong>₹{Number(node.wallet_balance || 0).toLocaleString()}</strong>
          </div>
          <div>
            Investment
            <strong>₹{Number(node.total_investment || 0).toLocaleString()}</strong>
          </div>
          <div>
            Left
            <strong>₹{Number(node.left_business || 0).toLocaleString()}</strong>
          </div>
          <div>
            Right
            <strong>₹{Number(node.right_business || 0).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div className="genealogy-children">
          {children.map((child) => (
            <GenealogyNode key={child.user_id || `${node.user_id}-${Math.random()}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function GenealogyPage() {
  const [genealogy, setGenealogy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = useMemo(() => {
    return localStorage.getItem("userId") || "FX001";
  }, []);

  useEffect(() => {
    const loadGenealogy = async () => {
      setLoading(true);
      setError("");

      const res = await getUserGenealogyApi(userId);

      if (res.success) {
        setGenealogy(res.data);
      } else {
        setError(res.error || "Unable to load genealogy data.");
      }

      setLoading(false);
    };

    loadGenealogy();
  }, [userId]);

  return (
    <UserLayout user={{ name: localStorage.getItem("userName") || "User", userId }}>
      <div className="genealogy-page user-genealogy-page">
        <div className="page-header">
          <h1 className="page-title">My Genealogy</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Genealogy</span>
          </div>
        </div>

        <div className="genealogy-panel">
          <div className="genealogy-header-row">
            <h2>User: {userId}</h2>
          </div>

          {loading ? (
            <div className="genealogy-empty">Loading genealogy...</div>
          ) : error ? (
            <div className="genealogy-error">{error}</div>
          ) : genealogy ? (
            <div className="genealogy-tree">
              <GenealogyNode node={genealogy} />
            </div>
          ) : (
            <div className="genealogy-empty">No genealogy data available.</div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default GenealogyPage;
