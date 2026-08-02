import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  RotateCcw,
  Calendar,
  User,
  Layers,
  Archive,
} from "lucide-react";
import {
  getAdminArchive,
  restoreAdminArchivePost,
  deleteAdminPost,
} from "../../services/adminService";
import "./admin-css/AdminArchive.css";

const AdminArchive = () => {
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        setLoading(true);
        setArchivedPosts(await getAdminArchive());
      } catch (err) {
        setError(err.message || "Failed to load archive");
      } finally {
        setLoading(false);
      }
    };

    fetchArchive();
  }, []);

  const handleRestore = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to restore "${title}" back to active status?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await restoreAdminArchivePost(id);
      setSuccess(`Post "${title}" has been restored successfully.`);
      setArchivedPosts(archivedPosts.filter((p) => p.post_id !== id));
    } catch (err) {
      setError(err.message || "Failed to restore post");
    }
  };

  const handleDeletePermanently = async (id, title) => {
    if (
      !window.confirm(
        `WARNING: Are you sure you want to PERMANENTLY delete archived post "${title}"? This will delete all comments and solutions. This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdminPost(id);
      setSuccess(`Post "${title}" deleted permanently.`);
      setArchivedPosts(archivedPosts.filter((p) => p.post_id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete post permanently");
    }
  };

  const filteredArchive = archivedPosts.filter((post) => {
    const query = search.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.author_name?.toLowerCase().includes(query) ||
      post.field_name?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-archive-container">
      <div className="admin-archive-header">
        <div>
          <h1 className="admin-archive-title">Archived Knowledge Base</h1>
          <p className="admin-archive-subtitle">
            View, restore, or permanently delete research problems moved to the
            archive.
          </p>
        </div>
        <div className="admin-archive-badge">
          <Archive className="admin-archive-badge-icon" />
          <span className="admin-archive-badge-text">
            {archivedPosts.length} Archived Posts
          </span>
        </div>
      </div>

      <div className="admin-archive-filter-section">
        <div className="admin-archive-search-wrapper">
          <Search className="admin-archive-search-icon" />
          <input
            type="text"
            placeholder="Search archived posts by title, author, field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-archive-search-input"
          />
        </div>
      </div>

      <div className="admin-archive-table-container">
        {loading ? (
          <div className="admin-archive-table-info">Loading archive...</div>
        ) : filteredArchive.length === 0 ? (
          <div className="admin-archive-table-info">
            No archived posts found matching the filters.
          </div>
        ) : (
          <div className="admin-archive-table-responsive">
            <table className="admin-archive-table">
              <thead className="admin-archive-thead">
                <tr>
                  <th className="admin-archive-th">ID</th>
                  <th className="admin-archive-th">
                    Archived Post Title / Description
                  </th>
                  <th className="admin-archive-th">Original Author & Field</th>
                  <th className="admin-archive-th">Archived Date</th>
                  <th className="admin-archive-th-right">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-archive-tbody">
                {filteredArchive.map((post) => (
                  <tr key={post.post_id} className="admin-archive-tr">
                    <td className="admin-archive-td-id">#{post.post_id}</td>
                    <td className="admin-archive-td-main">
                      <div className="admin-archive-post-title">
                        {post.title}
                      </div>
                      <div className="admin-archive-post-desc">
                        {post.description}
                      </div>
                    </td>
                    <td className="admin-archive-td-meta">
                      <div className="admin-archive-meta-line">
                        <User className="admin-archive-meta-icon" />
                        {post.author_name || "Anonymous"}
                      </div>
                      <div className="admin-archive-meta-subline">
                        <Layers className="admin-archive-meta-icon" />
                        {post.field_name || "Uncategorized"}
                      </div>
                    </td>
                    <td className="admin-archive-td-date">
                      <span className="admin-archive-date-line">
                        <Calendar className="admin-archive-date-icon" />
                        {formatDate(post.created_at)}
                      </span>
                    </td>
                    <td className="admin-archive-td-actions">
                      <div className="admin-archive-actions-wrapper">
                        <button
                          onClick={() =>
                            handleRestore(post.post_id, post.title)
                          }
                          className="admin-archive-btn-restore"
                          title="Restore Post"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeletePermanently(post.post_id, post.title)
                          }
                          className="admin-archive-btn-delete"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArchive;
