import { useState } from "react";
import { FiBookOpen, FiFileText, FiList, FiPlus, FiFolder, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminArticles.css";

function AdminArticles() {
  const [activeTab, setActiveTab] = useState("articles"); // "articles" or "categories"

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: "Trading Guide", count: 0 },
    { id: 2, name: "Account Management", count: 0 },
    { id: 3, name: "Deposit & Withdrawal", count: 0 },
  ]);

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedCat, setSelectedCat] = useState("Trading Guide");
  const [newCatName, setNewCatName] = useState("");

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newArticle = {
      no: articles.length + 1,
      title: newTitle,
      category: selectedCat,
      publishTime: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: newContent,
    };

    setArticles([...articles, newArticle]);
    setNewTitle("");
    setNewContent("");
    setShowArticleModal(false);

    // Update count in category
    setCategories(categories.map(c => c.name === selectedCat ? { ...c, count: c.count + 1 } : c));
  };

  const handleAddCat = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat = {
      id: categories.length + 1,
      name: newCatName,
      count: 0,
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    setShowCatModal(false);
  };

  const handleDeleteArticle = (no) => {
    const articleToDelete = articles.find(a => a.no === no);
    if (!articleToDelete) return;
    setArticles(articles.filter(a => a.no !== no).map((a, idx) => ({ ...a, no: idx + 1 })));
    setCategories(categories.map(c => c.name === articleToDelete.category ? { ...c, count: Math.max(0, c.count - 1) } : c));
  };

  return (
    <AdminLayout>
      <div className="admin-articles-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">Articles</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">Articles</span>
          </div>
        </div>

        {/* Outer Split layout Wrapper Card */}
        <div className="articles-outer-card">
          <div className="articles-split-layout">
            
            {/* Left Sidebar Pane */}
            <div className="articles-left-pane">
              <div className="kb-header">
                <FiBookOpen className="kb-icon" /> Knowledge Base
              </div>
              <div className="kb-menu-items">
                <button
                  type="button"
                  className={`kb-menu-btn ${activeTab === "articles" ? "kb-menu-btn--active" : ""}`}
                  onClick={() => setActiveTab("articles")}
                >
                  <FiFileText className="kb-btn-icon" /> Articles
                </button>
                <button
                  type="button"
                  className={`kb-menu-btn ${activeTab === "categories" ? "kb-menu-btn--active" : ""}`}
                  onClick={() => setActiveTab("categories")}
                >
                  <FiList className="kb-btn-icon" /> Article Categories
                </button>
              </div>
            </div>

            {/* Right List Pane */}
            <div className="articles-right-pane">
              {activeTab === "articles" ? (
                /* Articles List view */
                <div className="articles-right-content">
                  <div className="right-pane-header">
                    <span className="right-pane-title">All Articles</span>
                    <button type="button" className="yellow-add-btn" onClick={() => setShowArticleModal(true)}>
                      <FiPlus /> Article
                    </button>
                  </div>

                  <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                    <table className="admin-articles-table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Articles Title</th>
                          <th>Publish Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((art) => (
                          <tr key={art.no}>
                            <td>{art.no}</td>
                            <td className="article-title-cell">{art.title}</td>
                            <td>{art.publishTime}</td>
                            <td>
                              <div className="action-buttons-wrap">
                                <button type="button" className="btn-action-edit" title="Edit Article">
                                  <FiEdit2 />
                                </button>
                                <button type="button" className="btn-action-delete" title="Delete Article" onClick={() => handleDeleteArticle(art.no)}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {articles.length === 0 && (
                          <tr>
                            <td colSpan="4" style={{ padding: 0 }}>
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
              ) : (
                /* Article Categories List view */
                <div className="articles-right-content">
                  <div className="right-pane-header">
                    <span className="right-pane-title">All Categories</span>
                    <button type="button" className="yellow-add-btn" onClick={() => setShowCatModal(true)}>
                      <FiPlus /> Category
                    </button>
                  </div>

                  <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                    <table className="admin-articles-table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Category Name</th>
                          <th>Articles Count</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat, idx) => (
                          <tr key={cat.id}>
                            <td>{idx + 1}</td>
                            <td className="article-title-cell">{cat.name}</td>
                            <td>{cat.count} Articles</td>
                            <td>
                              <div className="action-buttons-wrap">
                                <button type="button" className="btn-action-edit" title="Edit Category">
                                  <FiEdit2 />
                                </button>
                                <button type="button" className="btn-action-delete" title="Delete Category" disabled={cat.count > 0}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modal for adding Article */}
        {showArticleModal && (
          <div className="article-modal-overlay">
            <div className="article-modal-card">
              <h3>Add New Article</h3>
              <form onSubmit={handleAddArticle}>
                <div className="modal-input-group">
                  <label>Category</label>
                  <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="modal-select">
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-input-group">
                  <label>Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Article Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-input-group">
                  <label>Content</label>
                  <textarea
                    required
                    placeholder="Type article content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="modal-textarea"
                    rows="6"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setShowArticleModal(false)}>Cancel</button>
                  <button type="submit" className="btn-modal-submit">Publish</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for adding Category */}
        {showCatModal && (
          <div className="article-modal-overlay">
            <div className="article-modal-card">
              <h3>Add Category</h3>
              <form onSubmit={handleAddCat}>
                <div className="modal-input-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Category Name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setShowCatModal(false)}>Cancel</button>
                  <button type="submit" className="btn-modal-submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminArticles;
