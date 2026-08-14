import { useEffect, useState } from "react";
import AdminLayout from "../../../components/Admin/AdminLayout";
import { getAllGenealogyApi, getUserGenealogyApi } from "../../../api/genealogy";
import "./GenealogyPage.css";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

function GenealogyNode({ node }) {
  if (!node) return null;

  const children = Array.isArray(node.children) ? node.children : [];

  return (
    <div className="genealogy-node">
      <div className="genealogy-card">
        <div className="genealogy-card-header">
          <span className="genealogy-user-badge">{node.user_id}</span>
          <span className="genealogy-role">{node.role}</span>
        </div>

        <h3>{node.name}</h3>

        <div className="genealogy-metrics">
          <div>
            Wallet
            <strong>₹{formatCurrency(node.wallet_balance)}</strong>
          </div>
          <div>
            Total Investment
            <strong>₹{formatCurrency(node.total_investment)}</strong>
          </div>
          <div>
            Left Business
            <strong>₹{formatCurrency(node.left_business)}</strong>
          </div>
          <div>
            Right Business
            <strong>₹{formatCurrency(node.right_business)}</strong>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div className="genealogy-children">
          {children.map((child) => (
            <GenealogyNode key={child.user_id || `${node.user_id}-${Math.random()}`} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function GenealogyPage() {
  const [allGenealogy, setAllGenealogy] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [genealogy, setGenealogy] = useState(null);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      setLoadingAll(true);
      setError("");

      const res = await getAllGenealogyApi();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : [];
        setAllGenealogy(list);
        if (list.length > 0) {
          setSelectedUserId(list[0].user_id);
        }
      } else {
        setError(res.error || "Unable to load genealogy list.");
      }

      setLoadingAll(false);
    };

    loadAll();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setGenealogy(null);
      return;
    }

    const loadSelected = async () => {
      setLoadingSelected(true);
      setError("");

      const res = await getUserGenealogyApi(selectedUserId);
      if (res.success) {
        setGenealogy(res.data);
      } else {
        setError(res.error || "Unable to load selected user's genealogy.");
      }

      setLoadingSelected(false);
    };

    loadSelected();
  }, [selectedUserId]);

  return (
    <AdminLayout>
      <div className="genealogy-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Genealogy</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Genealogy</span>
          </div>
        </div>

        <div className="genealogy-panel">
          <div className="genealogy-header-row">
            <h2>All Genealogy</h2>
            <div className="genealogy-actions">
              <select
                className="genealogy-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loadingAll || allGenealogy.length === 0}
              >
                {allGenealogy.length === 0 ? (
                  <option value="">No users</option>
                ) : (
                  allGenealogy.map((item) => (
                    <option key={item.user_id} value={item.user_id}>
                      {item.user_id} - {item.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="genealogy-quick-grid">
            <div className="genealogy-stat-card">
              <span>Total Users</span>
              <strong>{allGenealogy.length}</strong>
            </div>
            <div className="genealogy-stat-card">
              <span>Selected</span>
              <strong>{selectedUserId || "-"}</strong>
            </div>
            <div className="genealogy-stat-card">
              <span>Children</span>
              <strong>{genealogy?.children?.length || 0}</strong>
            </div>
          </div>

          {loadingAll ? (
            <div className="genealogy-empty">Loading genealogy list…</div>
          ) : error ? (
            <div className="genealogy-error">{error}</div>
          ) : loadingSelected ? (
            <div className="genealogy-empty">Loading selected genealogy…</div>
          ) : genealogy ? (
            <div className="genealogy-tree">
              <GenealogyNode node={genealogy} />
            </div>
          ) : (
            <div className="genealogy-empty">No genealogy details available for the selected user.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default GenealogyPage;
