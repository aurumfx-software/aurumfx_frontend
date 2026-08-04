import { useState } from "react";
import { FiSearch, FiRotateCcw, FiInfo } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
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

function EnrollerBusiness() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <UserLayout>
      <div className="genealogy-page">
        {/* Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-banner-icon" />
          <span>
            Heads up! You are now logged in as <strong>FX001</strong>{" "}
            <a href="/admin/login" className="alert-link">
              Click Here
            </a>{" "}
            , to go back admin account.
          </span>
        </div>

        {/* Page Title & Breadcrumb */}
        <div className="page-header">
          <h1 className="page-title">Enroller: Business</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Enroller: Business</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="list-page-card">
          {/* Top Search Controls */}
          <div className="tree-search-form">
            <input
              type="text"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="button" className="search-submit-btn">
              <FiSearch />
              <span>Search User</span>
            </button>
            <button
              type="button"
              className="search-reset-btn"
              onClick={() => setSearchQuery("")}
            >
              <span>Reset</span>
              <FiRotateCcw />
            </button>
          </div>

          {/* Enroller Tree Canvas */}
          <div className="sponsor-tree-container">
            {/* Top Root */}
            <div className="sponsor-top-root">
              <div className="tree-node">
                <div className="node-avatar avatar-root">P</div>
                <span className="node-badge">FX001</span>
              </div>
            </div>

            {/* Level 1 Direct Enrollers */}
            <div className="sponsor-level-1">
              <div className="tree-node">
                <div className="node-avatar bg-dark-blue">S</div>
                <span className="node-badge">FX011</span>
              </div>

              <div className="tree-node">
                <div className="node-avatar bg-dark-blue">S</div>
                <span className="node-badge">FX018</span>
              </div>
            </div>

            {/* Level 2 Sub Directs */}
            <div className="sponsor-level-2">
              <div className="sponsor-group">
                {enrollerNodesLeft.map((node) => (
                  <div key={node.id} className="tree-node">
                    <div className="node-avatar dark-avatar">U</div>
                    <span className="node-badge">{node.id}</span>
                  </div>
                ))}
              </div>

              <div className="sponsor-group">
                {enrollerNodesRight.map((node) => (
                  <div key={node.id} className="tree-node">
                    <div
                      className="node-avatar"
                      style={{ background: node.bg, color: "#1e293b" }}
                    >
                      {node.text}
                    </div>
                    <span className="node-badge">{node.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default EnrollerBusiness;
