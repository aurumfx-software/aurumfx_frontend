import { useState } from "react";
import { FiSearch, FiRotateCcw, FiChevronRight, FiChevronDown } from "react-icons/fi";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import "./StructureBusiness.css";

function AdminStructureBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <DashboardLayout>
      <div className="admin-genealogy-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Structure: Business</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Structure: Business</span>
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

          <div className="structure-tree-area">
            <div className="structure-node-item">
              <button
                type="button"
                className="structure-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </button>

              <div className="structure-user-card">
                <div className="user-avatar-purple">A</div>
                <div className="structure-user-info">
                  <span className="structure-user-id">aurumfx</span>
                  <span className="structure-user-name">aurumfx Admin</span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="structure-children-list">
                <div className="structure-node-item">
                  <div className="structure-user-card">
                    <div className="user-avatar-teal">P</div>
                    <div className="structure-user-info">
                      <span className="structure-user-id">FX001</span>
                      <span className="structure-user-name">PRAVEEN</span>
                    </div>
                  </div>
                </div>

                <div className="structure-node-item">
                  <div className="structure-user-card">
                    <div className="user-avatar-orange">A</div>
                    <div className="structure-user-info">
                      <span className="structure-user-id">FX002</span>
                      <span className="structure-user-name">AKASH</span>
                    </div>
                  </div>
                </div>

                <div className="structure-node-item">
                  <div className="structure-user-card">
                    <div className="user-avatar-dark">S</div>
                    <div className="structure-user-info">
                      <span className="structure-user-id">FX011</span>
                      <span className="structure-user-name">SAVITHAMOL</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminStructureBusiness;
