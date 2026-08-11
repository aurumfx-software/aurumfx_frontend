import { useState } from "react";
import { FiPlus, FiFolder, FiTrash2, FiDownload } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminDocuments.css";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!fileTitle) return;

    const newDoc = {
      id: Date.now(),
      title: fileTitle,
      sortOrder: sortOrder || "1",
      url: "#",
      fileName: fileName || "document.pdf",
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    setDocuments([...documents, newDoc]);
    setFileTitle("");
    setSortOrder("1");
    setFileName("");
    setShowUploadModal(false);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <AdminLayout>
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
            <button
              type="button"
              className="upload-file-btn"
              onClick={() => setShowUploadModal(true)}
            >
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
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={doc.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-bold">{doc.title}</td>
                    <td>{doc.sortOrder}</td>
                    <td>
                      <a href={doc.url} download className="download-link-btn" title="Download Document">
                        <FiDownload /> Download
                      </a>
                    </td>
                    <td>{doc.createdDate}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action-delete-btn"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete Document"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: 0 }}>
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
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload File Modal */}
        {showUploadModal && (
          <div className="docs-modal-overlay">
            <div className="docs-modal-card">
              <h3>Upload Document</h3>
              <form onSubmit={handleFileUpload}>
                <div className="modal-input-group">
                  <label>File Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter File Title"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Choose File</label>
                  <input
                    type="file"
                    onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                    className="modal-input-file"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDocuments;
