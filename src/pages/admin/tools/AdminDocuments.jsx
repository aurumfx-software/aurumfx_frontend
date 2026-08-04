import { useState } from "react";
import { FiPlus, FiFolder } from "react-icons/fi";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import "./AdminDocuments.css";

function AdminDocuments() {
  const [documents] = useState([]);

  return (
    <DashboardLayout>
      <div className="admin-documents-page">
        {/* Page Title & Breadcrumbs */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Documents</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Documents</span>
          </div>
        </div>

        {/* Main Card Wrapper */}
        <div className="admin-documents-card">
          <div className="card-top-header">
            <h3 className="card-header-title">Documents</h3>
            <button type="button" className="upload-file-btn">
              <FiPlus /> File Upload
            </button>
          </div>

          {/* Table Container */}
          <div className="table-overflow-box">
            <table className="admin-documents-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>File Title</th>
                  <th>Sort Order</th>
                  <th>Download</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              {documents.length > 0 && (
                <tbody>
                  {documents.map((doc, idx) => (
                    <tr key={doc.id || idx}>
                      <td>{idx + 1}</td>
                      <td className="fw-bold">{doc.title}</td>
                      <td>{doc.sortOrder}</td>
                      <td>
                        <a href={doc.url} download className="download-link">
                          Download
                        </a>
                      </td>
                      <td>{doc.createdDate}</td>
                      <td>
                        <button type="button" className="table-action-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Empty State matching Screenshot 2 */}
          {documents.length === 0 && (
            <div className="docs-empty-state">
              <div className="empty-magnifier-box">
                <div className="magnifier-art">
                  <FiFolder className="folder-back-art" />
                  <div className="glass-lens-art">
                    <span className="glass-quest">?</span>
                  </div>
                </div>
              </div>
              <h4 className="empty-state-label">No Data Available</h4>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDocuments;
