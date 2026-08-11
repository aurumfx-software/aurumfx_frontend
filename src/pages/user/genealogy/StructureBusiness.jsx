import { useState } from "react";
import { FiSearch, FiRotateCcw, FiInfo, FiChevronRight, FiChevronDown } from "react-icons/fi";
import UserLayout from "../../../components/User/UserLayout";
import "./StructureBusiness.css";

function StructureBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <UserLayout>
      <div className="genealogy-page">
        {/* Alert Banner */}
        <div className="user-alert-banner">
          <FiInfo className="alert-icon" />
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
          <h1 className="page-title">Structure: Business</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="separator">•</span>
            <span className="current">Structure: Business</span>
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

          {/* Structure Node Hierarchy */}
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
                <div className="user-avatar-purple">P</div>
                <div className="structure-user-info">
                  <span className="structure-user-id">FX001</span>
                  <span className="structure-user-name">PRAVEEN</span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="structure-children-list">
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
    </UserLayout>
  );
}

export default StructureBusiness;
