import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Archive,
  Calendar,
  User,
  Layers,
  Tag,
  FileText,
} from "lucide-react";
import {
  getAdminPosts,
  deleteAdminPost,
  archiveAdminPost,
} from "../../services/adminService";
import "./admin-css/AdminPosts.css";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setPosts(await getAdminPosts());
      } catch (err) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete post: "${title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdminPost(id);
      setSuccess(`Post "${title}" deleted successfully.`);
      setPosts(posts.filter((p) => p.post_id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete post");
    }
  };
  const handleArchive = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to move post "${title}" to the Archive?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await archiveAdminPost(id);
      setSuccess(`Post "${title}" has been archived successfully.`);
      setPosts(
        posts.map((p) => (p.post_id === id ? { ...p, is_archived: 1 } : p)),
      );
    } catch (err) {
      setError(err.message || "Failed to archive post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();
    const matchesSearch =
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.author_name?.toLowerCase().includes(query) ||
      post.field_name?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      post.is_archived !== 1 &&
      post.is_archived !== true
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
    <div className="admin-posts-container">
      <div className="admin-posts-header">
        <div>
          <h1 className="admin-posts-title">Manage Posts</h1>
          <p className="admin-posts-subtitle">
            Monitor and moderate active problem and research posts.
          </p>
        </div>
        <div className="admin-posts-badge">
          <FileText className="admin-posts-badge-icon" />
          <span className="admin-posts-badge-text">
            {posts.filter((p) => !p.is_archived).length} Active Posts
          </span>
        </div>
      </div>

      <div className="admin-posts-filter-section">
        <div className="admin-posts-search-wrapper">
          <Search className="admin-posts-search-icon" />
          <input
            type="text"
            placeholder="Search by title, author, field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-posts-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-posts-select"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="solved">Solved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="admin-posts-table-container">
        {loading ? (
          <div className="admin-posts-table-info">Loading posts list...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="admin-posts-table-info">
            No active posts found matching the filters.
          </div>
        ) : (
          <div className="admin-posts-table-responsive">
            <table className="admin-posts-table">
              <thead className="admin-posts-thead">
                <tr>
                  <th className="admin-posts-th">ID</th>
                  <th className="admin-posts-th">Post Title / Description</th>
                  <th className="admin-posts-th">Author & Field</th>
                  <th className="admin-posts-th">Status</th>
                  <th className="admin-posts-th">Created At</th>
                  <th className="admin-posts-th-right">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-posts-tbody">
                {filteredPosts.map((post) => (
                  <tr key={post.post_id} className="admin-posts-tr">
                    <td className="admin-posts-td-id">#{post.post_id}</td>
                    <td className="admin-posts-td-main">
                      <div className="admin-posts-post-title">{post.title}</div>
                      <div className="admin-posts-post-desc">
                        {post.description}
                      </div>
                    </td>
                    <td className="admin-posts-td-meta">
                      <div className="admin-posts-meta-line">
                        <User className="admin-posts-meta-icon" />
                        {post.author_name || "Anonymous"}
                      </div>
                      <div className="admin-posts-meta-subline">
                        <Layers className="admin-posts-meta-icon" />
                        {post.field_name || "Uncategorized"}
                      </div>
                    </td>
                    <td className="admin-posts-td-status">
                      <span
                        className={`admin-posts-status-badge ${
                          post.status === "solved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : post.status === "closed"
                              ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {post.status || "open"}
                      </span>
                    </td>
                    <td className="admin-posts-td-date">
                      <span className="admin-posts-date-line">
                        <Calendar className="admin-posts-date-icon" />
                        {formatDate(post.created_at)}
                      </span>
                    </td>
                    <td className="admin-posts-td-actions">
                      <div className="admin-posts-actions-wrapper">
                        <button
                          onClick={() =>
                            handleArchive(post.post_id, post.title)
                          }
                          className="admin-posts-btn-archive"
                          title="Archive Post"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.post_id, post.title)}
                          className="admin-posts-btn-delete"
                          title="Delete Post"
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

export default AdminPosts;
