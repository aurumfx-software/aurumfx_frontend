import { useState } from "react";
import {
  FiRotateCcw,
  FiUser,
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import "./ClubBusiness.css";

const initialTreeNodes = {
  topAdmin: { id: "aurumfx", name: "aurumfx", avatarText: "A", bg: "#7c3aed" },
  root: { id: "FX001", name: "PRAVEEN", avatarText: "P", photo: true },
  level1: [
    { id: "FX002", name: "AKASH", avatarText: "A", bg: "#ea580c" },
    { id: "FX011", name: "SAVITHAMOL", avatarText: "S", photo: true },
  ],
  level2: [
    { id: "FX003", name: "S", bg: "#0d9488" },
    { id: "FX024", name: "ANJU", photo: true },
    { id: "FX115", name: "N", photo: true },
    { id: "FX018", name: "SOBHANA", photo: true },
  ],
  level3: [
    { id: "FX004", name: "S", bg: "#059669" },
    { id: "FX022", name: "P", bg: "#ea580c" },
    { id: "FX033", name: "R", photo: true },
    { id: "FX025", name: "M", bg: "#0d9488" },
    { id: "FX128", name: "B", photo: true },
    { id: "FX021", name: "A", photo: true },
  ],
};

function AdminClubBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    name: "aurumfx",
    username: "aurumfx",
    rank: "Investor",
    dateJoined: "15 Oct 2025",
    weeklyLotLeft: 0,
    weeklyLotRight: 0,
    totalLotLeft: 0,
    totalLotRight: 0,
    totalLeftUsers: 262,
    totalRightUsers: 210,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const queryUpper = searchQuery.toUpperCase();
    setSelectedUser({
      name: queryUpper,
      username: queryUpper,
      rank: "Investor",
      dateJoined: "15 Oct 2025",
      weeklyLotLeft: 12,
      weeklyLotRight: 8,
      totalLotLeft: 145,
      totalLotRight: 98,
      totalLeftUsers: 145,
      totalRightUsers: 98,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedUser({
      name: "aurumfx",
      username: "aurumfx",
      rank: "Investor",
      dateJoined: "15 Oct 2025",
      weeklyLotLeft: 0,
      weeklyLotRight: 0,
      totalLotLeft: 0,
      totalLotRight: 0,
      totalLeftUsers: 262,
      totalRightUsers: 210,
    });
  };

  const handleNodeClick = (nodeData) => {
    setSelectedUser({
      name: nodeData.name || nodeData.id,
      username: nodeData.id,
      rank: "Investor",
      dateJoined: "15 Oct 2025",
      weeklyLotLeft: 0,
      weeklyLotRight: 0,
      totalLotLeft: 0,
      totalLotRight: 0,
      totalLeftUsers: Math.floor(Math.random() * 200) + 50,
      totalRightUsers: Math.floor(Math.random() * 150) + 40,
    });
  };

  return (
    <DashboardLayout>
      <div className="admin-club-page">
        {/* Page Title & Breadcrumbs */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Club: Business</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Club: Business</span>
          </div>
        </div>

        {/* Search Controls Toolbar */}
        <form onSubmit={handleSearch} className="admin-tree-toolbar">
          <input
            type="text"
            placeholder="Search User"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          <button type="submit" className="admin-search-btn">
            Search User
          </button>
          <button type="button" onClick={handleReset} className="admin-reset-btn">
            Reset <FiRotateCcw className="reset-icon" />
          </button>
        </form>

        {/* Main Content Layout (Left Tree Canvas + Right Info Sidebar) */}
        <div className="admin-club-grid">
          {/* Left Container: Dashed Tree View Canvas */}
          <div className="admin-tree-card">
            <div className="binary-canvas">
              {/* Level 0: Admin Top Node */}
              <div className="tree-row">
                <div
                  className="binary-node"
                  onClick={() => handleNodeClick(initialTreeNodes.topAdmin)}
                >
                  <div className="node-circle bg-purple">A</div>
                  <span className="node-pill">aurumfx</span>
                </div>
              </div>

              <div className="tree-line-v" />

              {/* Level 1: Root User Node */}
              <div className="tree-row">
                <div
                  className="binary-node"
                  onClick={() => handleNodeClick(initialTreeNodes.root)}
                >
                  <div className="node-circle bg-photo-1">P</div>
                  <span className="node-pill pill-green">FX001</span>
                </div>
              </div>

              <div className="tree-line-v" />
              <div className="tree-line-h-w2" />

              {/* Level 2: Left & Right */}
              <div className="tree-row row-space-w2">
                {initialTreeNodes.level1.map((node) => (
                  <div
                    key={node.id}
                    className="binary-node"
                    onClick={() => handleNodeClick(node)}
                  >
                    <div
                      className={`node-circle ${
                        node.photo ? "bg-photo-2" : "bg-orange"
                      }`}
                    >
                      {node.avatarText}
                    </div>
                    <span className="node-pill pill-green">{node.id}</span>
                  </div>
                ))}
              </div>

              <div className="tree-line-connectors-w4" />

              {/* Level 3: 4 Children */}
              <div className="tree-row row-space-w4">
                {initialTreeNodes.level2.map((node) => (
                  <div
                    key={node.id}
                    className="binary-node"
                    onClick={() => handleNodeClick(node)}
                  >
                    <div
                      className={`node-circle ${
                        node.photo ? "bg-photo-3" : "bg-teal"
                      }`}
                    >
                      {node.name.charAt(0)}
                    </div>
                    <span className="node-pill pill-green">{node.id}</span>
                  </div>
                ))}
              </div>

              <div className="tree-line-connectors-w8" />

              {/* Level 4: 6 Bottom Children */}
              <div className="tree-row row-space-w8">
                {initialTreeNodes.level3.map((node) => (
                  <div
                    key={node.id}
                    className="binary-node"
                    onClick={() => handleNodeClick(node)}
                  >
                    <div
                      className={`node-circle ${
                        node.photo ? "bg-photo-4" : ""
                      }`}
                      style={{ background: node.bg || "#059669" }}
                    >
                      {node.name}
                    </div>
                    <span className="node-pill pill-green">{node.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: 10 Info Cards matching Screenshot */}
          <div className="admin-member-sidebar">
            {/* 1. Name */}
            <div className="info-stat-card">
              <div className="icon-badge bg-cyan">
                <FiBarChart2 />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Name</span>
                <h4 className="info-val">{selectedUser.name}</h4>
              </div>
            </div>

            {/* 2. Username */}
            <div className="info-stat-card">
              <div className="icon-badge bg-pink">
                <FiUser />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Username</span>
                <h4 className="info-val">{selectedUser.username}</h4>
              </div>
            </div>

            {/* 3. Current Rank */}
            <div className="info-stat-card">
              <div className="icon-badge bg-purple">
                <FiAward />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Current Rank</span>
                <h4 className="info-val">{selectedUser.rank}</h4>
              </div>
            </div>

            {/* 4. Date of Join */}
            <div className="info-stat-card">
              <div className="icon-badge bg-yellow">
                <FiCalendar />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Date of Join</span>
                <h4 className="info-val">{selectedUser.dateJoined}</h4>
              </div>
            </div>

            {/* 5. Weekly LOT(left) */}
            <div className="info-stat-card">
              <div className="icon-badge bg-blue">
                <FiBarChart2 />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Weekly LOT(left)</span>
                <h4 className="info-val">{selectedUser.weeklyLotLeft}</h4>
              </div>
            </div>

            {/* 6. Weekly LOT(right) */}
            <div className="info-stat-card">
              <div className="icon-badge bg-blue">
                <FiBarChart2 />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Weekly LOT(right)</span>
                <h4 className="info-val">{selectedUser.weeklyLotRight}</h4>
              </div>
            </div>

            {/* 7. Total LOT(left) */}
            <div className="info-stat-card">
              <div className="icon-badge bg-fuchsia">
                <FiLayers />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Total LOT(left)</span>
                <h4 className="info-val">{selectedUser.totalLotLeft}</h4>
              </div>
            </div>

            {/* 8. Total LOT(right) */}
            <div className="info-stat-card">
              <div className="icon-badge bg-fuchsia">
                <FiLayers />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Total LOT(right)</span>
                <h4 className="info-val">{selectedUser.totalLotRight}</h4>
              </div>
            </div>

            {/* 9. Total Left Users */}
            <div className="info-stat-card">
              <div className="icon-badge bg-emerald">
                <FiUsers />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Total Left Users</span>
                <h4 className="info-val">{selectedUser.totalLeftUsers}</h4>
              </div>
            </div>

            {/* 10. Total Right Users */}
            <div className="info-stat-card">
              <div className="icon-badge bg-emerald">
                <FiUsers />
              </div>
              <div className="info-meta">
                <span className="info-lbl">Total Right Users</span>
                <h4 className="info-val">{selectedUser.totalRightUsers}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminClubBusiness;
