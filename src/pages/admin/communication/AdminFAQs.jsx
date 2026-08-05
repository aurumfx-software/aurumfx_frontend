import { useState } from "react";
import { FiFolder, FiPlus, FiBookOpen, FiList, FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../../components/Admin/AdminLayout";
import "./AdminFAQs.css";

function AdminFAQs() {
  const [activeTab, setActiveTab] = useState("faqs"); // "faqs" or "categories"

  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: "General", count: 0 },
    { id: 2, name: "Financial", count: 0 },
    { id: 3, name: "Account", count: 0 },
  ]);

  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedCat, setSelectedCat] = useState("General");
  const [newCatName, setNewCatName] = useState("");

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;

    const newFaq = {
      no: faqs.length + 1,
      question: newQuestion,
      answer: newAnswer,
      category: selectedCat,
    };

    setFaqs([...faqs, newFaq]);
    setNewQuestion("");
    setNewAnswer("");
    setShowFaqModal(false);

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

  const handleDeleteFaq = (no) => {
    const faqToDelete = faqs.find(f => f.no === no);
    if (!faqToDelete) return;
    setFaqs(faqs.filter(f => f.no !== no).map((f, idx) => ({ ...f, no: idx + 1 })));
    setCategories(categories.map(c => c.name === faqToDelete.category ? { ...c, count: Math.max(0, c.count - 1) } : c));
  };

  return (
    <AdminLayout>
      <div className="admin-faqs-page">
        {/* Page Header */}
        <div className="admin-page-header">
          <h1 className="admin-page-title">FAQ's</h1>
          <div className="admin-breadcrumb">
            <span>Dashboard</span>
            <span className="crumb-sep">•</span>
            <span className="crumb-active">FAQ's</span>
          </div>
        </div>

        {/* Content Card container */}
        <div className="faqs-content-card">
          {/* Tabs bar */}
          <div className="faqs-tabs-header">
            <button
              type="button"
              className={`faq-tab-btn ${activeTab === "faqs" ? "faq-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("faqs")}
            >
              <FiBookOpen className="tab-icon" /> FAQ's
            </button>
            <button
              type="button"
              className={`faq-tab-btn ${activeTab === "categories" ? "faq-tab-btn--active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              <FiList className="tab-icon" /> Categories
            </button>
          </div>

          <div className="faq-tab-panel">
            {activeTab === "faqs" ? (
              /* FAQs Panel View */
              <div className="faqs-panel-wrap">
                <div className="panel-actions-row">
                  <button type="button" className="yellow-add-faq-btn" onClick={() => setShowFaqModal(true)}>
                    <FiPlus /> FAQ's
                  </button>
                </div>

                <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                  <table className="admin-faqs-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((faq) => (
                        <tr key={faq.no}>
                          <td>{faq.no}</td>
                          <td className="faq-q-cell">{faq.question}</td>
                          <td className="faq-a-cell">{faq.answer}</td>
                          <td>
                            <div className="action-buttons-wrap">
                              <button type="button" className="btn-action-edit" title="Edit FAQ">
                                <FiEdit2 />
                              </button>
                              <button type="button" className="btn-action-delete" title="Delete FAQ" onClick={() => handleDeleteFaq(faq.no)}>
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {faqs.length === 0 && (
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
              /* Categories Panel View */
              <div className="categories-panel-wrap">
                <div className="panel-actions-row">
                  <button type="button" className="yellow-add-faq-btn" onClick={() => setShowCatModal(true)}>
                    <FiPlus /> Category
                  </button>
                </div>

                <div className="table-overflow-box" style={{ marginTop: "15px" }}>
                  <table className="admin-faqs-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Category Name</th>
                        <th>FAQs Count</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat, idx) => (
                        <tr key={cat.id}>
                          <td>{idx + 1}</td>
                          <td className="faq-q-cell">{cat.name}</td>
                          <td>{cat.count} FAQs</td>
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

        {/* Modal for adding FAQ */}
        {showFaqModal && (
          <div className="faq-modal-overlay">
            <div className="faq-modal-card">
              <h3>Add New FAQ</h3>
              <form onSubmit={handleAddFaq}>
                <div className="modal-input-group">
                  <label>Category</label>
                  <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="modal-select">
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-input-group">
                  <label>Question</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter FAQ Question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-input-group">
                  <label>Answer</label>
                  <textarea
                    required
                    placeholder="Enter FAQ Answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="modal-textarea"
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setShowFaqModal(false)}>Cancel</button>
                  <button type="submit" className="btn-modal-submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for adding Category */}
        {showCatModal && (
          <div className="faq-modal-overlay">
            <div className="faq-modal-card">
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

export default AdminFAQs;
