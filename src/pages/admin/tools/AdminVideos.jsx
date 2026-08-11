import { useState } from "react";
import { FiPlus, FiFolder, FiTrash2, FiPlay } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminVideos.css";

function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl) return;

    const newVideo = {
      id: Date.now(),
      title: videoTitle,
      url: videoUrl,
      sortOrder: sortOrder || "1",
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    setVideos([...videos, newVideo]);
    setVideoTitle("");
    setVideoUrl("");
    setSortOrder("1");
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setVideos(videos.filter((vid) => vid.id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-videos-page">
        {/* Page Title & Breadcrumbs */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Videos</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Videos</span>
          </div>
        </div>

        {/* Main Card Wrapper */}
        <div className="admin-videos-card">
          <div className="card-top-header">
            <h3 className="card-header-title">Videos</h3>
            <button
              type="button"
              className="add-video-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add Video
            </button>
          </div>

          {/* Table Container */}
          <div className="table-overflow-box">
            <table className="admin-videos-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Video Title</th>
                  <th>View</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((vid, idx) => (
                  <tr key={vid.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-bold">{vid.title}</td>
                    <td>
                      <a href={vid.url} target="_blank" rel="noreferrer" className="view-video-link" title="Play Video">
                        <FiPlay /> View
                      </a>
                    </td>
                    <td>{vid.createdDate}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action-delete-btn"
                        onClick={() => handleDelete(vid.id)}
                        title="Delete Video"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 0 }}>
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

        {/* Add Video Modal */}
        {showAddModal && (
          <div className="videos-modal-overlay">
            <div className="videos-modal-card">
              <h3>Add Video Tutorial</h3>
              <form onSubmit={handleAddVideo}>
                <div className="modal-input-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Video Title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="modal-input"
                  />
                </div>

                <div className="modal-input-group">
                  <label>Video URL / Embed Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/video.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
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

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    Add
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

export default AdminVideos;
