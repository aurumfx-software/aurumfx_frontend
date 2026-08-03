import { useState } from "react";
import { FiSearch, FiRotateCcw } from "react-icons/fi";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import "./EnrollerBusiness.css";

const enrollerNodesLeft = [
  { id: "FX115", bg: "#1e293b" },
  { id: "FX128", bg: "#1e293b" },
  { id: "FX157", bg: "#1e293b" },
  { id: "FX162", bg: "#1e293b" },
  { id: "FX165", bg: "#1e293b" },
  { id: "FX246", bg: "#1e293b" },
  { id: "FX252", bg: "#1e293b" },
  { id: "FX257", bg: "#1e293b" },
];

const enrollerNodesRight = [
  { id: "FX133", bg: "#e2e8f0", text: "M" },
  { id: "FX134", bg: "#e2e8f0", text: "A" },
  { id: "FX138", bg: "#e2e8f0", text: "S" },
  { id: "FX139", bg: "#d97706", text: "M" },
  { id: "FX141", bg: "#8b5cf6", text: "G" },
  { id: "FX143", bg: "#d97706", text: "M" },
  { id: "FX151", bg: "#94a3b8", text: "A" },
  { id: "FX152", bg: "#e2e8f0", text: "R" },
  { id: "FX154", bg: "#d97706", text: "A" },
];

function AdminEnrollerBusiness() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="admin-genealogy-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Enroller: Business</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Enroller: Business</span>
          </div>
        </div>

        <div className="admin-tree-card full-width-card">
          <div className="admin-tree-toolbar">
            <input
              type="text"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            <button type="button" className="admin-search-btn">
              <FiSearch />
              <span>Search User</span>
            </button>
            <button
              type="button"
              className="admin-reset-btn"
              onClick={() => setSearchQuery("")}
            >
              <span>Reset</span>
              <FiRotateCcw />
            </button>
          </div>

          <div className="sponsor-tree-container">
            <div className="sponsor-top-root">
              <div className="tree-node">
                <div className="node-circle bg-purple">A</div>
                <span className="node-pill">aurumfx</span>
              </div>
            </div>

            <div className="sponsor-level-1">
              <div className="tree-node">
                <div className="node-circle bg-photo-1">P</div>
                <span className="node-pill pill-green">FX001</span>
              </div>

              <div className="tree-node">
                <div className="node-circle bg-orange">A</div>
                <span className="node-pill pill-green">FX002</span>
              </div>
            </div>

            <div className="sponsor-level-2">
              <div className="sponsor-group">
                {enrollerNodesLeft.map((node) => (
                  <div key={node.id} className="tree-node">
                    <div className="node-circle bg-teal">U</div>
                    <span className="node-pill pill-green">{node.id}</span>
                  </div>
                ))}
              </div>

              <div className="sponsor-group">
                {enrollerNodesRight.map((node) => (
                  <div key={node.id} className="tree-node">
                    <div
                      className="node-circle"
                      style={{ background: node.bg, color: "#1e293b" }}
                    >
                      {node.text}
                    </div>
                    <span className="node-pill pill-green">{node.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminEnrollerBusiness;
