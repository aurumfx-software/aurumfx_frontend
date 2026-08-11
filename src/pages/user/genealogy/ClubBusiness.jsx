import { useState } from "react";
import { FiSearch, FiRotateCcw, FiInfo, FiUser, FiCalendar, FiAward, FiBarChart2 } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./ClubBusiness.css";

const initialNodes = {
  root: { id: "FX001", name: "PRAVEEN", avatarText: "P", isRoot: true },
  left: { id: "FX002", name: "A", avatarText: "A" },
  right: { id: "FX011", name: "SAVITHAMOL", avatarText: "S" },
  leftLeft: { id: "FX003", name: "S", avatarText: "S" },
  leftRight: { id: "FX024", name: "ANJU", avatarText: "A" },
  rightLeft: { id: "FX115", name: "N", avatarText: "N" },
  rightRight: { id: "FX018", name: "SOBHANA", avatarText: "S" },
  level3: [
    { id: "FX004", name: "S", bg: "#00a884" },
    { id: "FX022", name: "P", bg: "#d97706" },
    { id: "FX033", name: "R", bg: "#0d9488" },
    { id: "FX025", name: "M", bg: "#059669" },
    { id: "FX128", name: "B", bg: "#1e293b" },
    { id: "FX021", name: "A", bg: "#334155" },
  ],
};

function ClubBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    name: "PRAVEEN DINESH",
    username: "FX001",
    rank: "FX Hero",
    dateJoined: "15 Oct 2025",
    leftLot: 8520,
    rightLot: 1121,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedUser({
      name: `${searchQuery.toUpperCase()} USER`,
      username: searchQuery.toUpperCase(),
      rank: "FX Hero",
      dateJoined: "15 Oct 2025",
      leftLot: 1250,
      rightLot: 890,
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedUser({
      name: "PRAVEEN DINESH",
      username: "FX001",
      rank: "FX Hero",
      dateJoined: "15 Oct 2025",
      leftLot: 8520,
      rightLot: 1121,
    });
  };

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
          <h1 className="page-title">Club: Business</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Club: Business</span>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="genealogy-content-grid">
          {/* Main Tree Card */}
          <div className="tree-card">
            {/* Top Search Controls */}
            <form onSubmit={handleSearch} className="tree-search-form">
              <input
                type="text"
                placeholder="Search User"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-submit-btn">
                <FiSearch />
                <span>Search User</span>
              </button>
              <button
                type="button"
                className="search-reset-btn"
                onClick={handleReset}
              >
                <span>Reset</span>
                <FiRotateCcw />
              </button>
            </form>

            {/* Tree Area Canvas */}
            <div className="binary-tree-container">
              {/* Root */}
              <div className="tree-level level-root">
                <div
                  className="tree-node node-root"
                  onClick={() =>
                    setSelectedUser({
                      name: "PRAVEEN DINESH",
                      username: "FX001",
                      rank: "FX Hero",
                      dateJoined: "15 Oct 2025",
                      leftLot: 8520,
                      rightLot: 1121,
                    })
                  }
                >
                  <div className="node-avatar avatar-root">P</div>
                  <span className="node-badge">FX001</span>
                </div>
              </div>

              <div className="connector-line vertical-main" />

              {/* Level 1 */}
              <div className="tree-level level-1">
                <div
                  className="tree-node"
                  onClick={() =>
                    setSelectedUser({
                      name: "AKASH KUMAR",
                      username: "FX002",
                      rank: "FX Trader",
                      dateJoined: "20 Oct 2025",
                      leftLot: 4200,
                      rightLot: 3100,
                    })
                  }
                >
                  <div className="node-avatar avatar-a">A</div>
                  <span className="node-badge">FX002</span>
                </div>

                <div
                  className="tree-node"
                  onClick={() =>
                    setSelectedUser({
                      name: "SAVITHAMOL",
                      username: "FX011",
                      rank: "FX Legend",
                      dateJoined: "01 Nov 2025",
                      leftLot: 4320,
                      rightLot: 980,
                    })
                  }
                >
                  <div className="node-avatar avatar-b">S</div>
                  <span className="node-badge">FX011</span>
                </div>
              </div>

              {/* Level 2 */}
              <div className="tree-level level-2">
                <div className="tree-node">
                  <div className="node-avatar bg-teal">S</div>
                  <span className="node-badge">FX003</span>
                </div>

                <div className="tree-node">
                  <div className="node-avatar bg-amber">A</div>
                  <span className="node-badge">FX024</span>
                </div>

                <div className="tree-node">
                  <div className="node-avatar bg-slate">N</div>
                  <span className="node-badge">FX115</span>
                </div>

                <div className="tree-node">
                  <div className="node-avatar bg-emerald">S</div>
                  <span className="node-badge">FX018</span>
                </div>
              </div>

              {/* Level 3 */}
              <div className="tree-level level-3">
                {initialNodes.level3.map((node) => (
                  <div key={node.id} className="tree-node">
                    <div
                      className="node-avatar"
                      style={{ background: node.bg }}
                    >
                      {node.name}
                    </div>
                    <span className="node-badge">{node.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="member-details-column">
            <div className="detail-stat-card">
              <div className="detail-icon-box bg-mint">
                <FiBarChart2 />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Name</span>
                <h4 className="detail-val">{selectedUser.name}</h4>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-icon-box bg-rose">
                <FiUser />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Username</span>
                <h4 className="detail-val">{selectedUser.username}</h4>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-icon-box bg-purple">
                <FiAward />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Current Rank</span>
                <h4 className="detail-val">{selectedUser.rank}</h4>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-icon-box bg-amber">
                <FiCalendar />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Date of Join</span>
                <h4 className="detail-val">{selectedUser.dateJoined}</h4>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-icon-box bg-cyan">
                <FiBarChart2 />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Weekly LOT(left)</span>
                <h4 className="detail-val">{selectedUser.leftLot}</h4>
              </div>
            </div>

            <div className="detail-stat-card">
              <div className="detail-icon-box bg-blue">
                <FiBarChart2 />
              </div>
              <div className="detail-info">
                <span className="detail-lbl">Weekly LOT(right)</span>
                <h4 className="detail-val">{selectedUser.rightLot}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default ClubBusiness;
