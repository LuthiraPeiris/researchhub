import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  getAdminComments,
  deleteAdminComment,
} from "../../services/adminService";
import "./admin-css/AdminComments.css";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setComments(await getAdminComments());
      } catch (err) {
        setError(err.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const filteredComments = comments.filter((comment) => {
    const query = search.toLowerCase();
    return (
      comment.content?.toLowerCase().includes(query) ||
      comment.author_name?.toLowerCase().includes(query) ||
      comment.post_title?.toLowerCase().includes(query)
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

  const handleDelete = async (id, author) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete this comment by ${author}?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdminComment(id);
      setSuccess("Comment deleted successfully.");
      setComments(comments.filter((c) => c.comment_id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
  };

  return (
    <div className="admin-comments-container">
      <div className="admin-comments-header">
        <div>
          <h1 className="admin-comments-title">Manage Comments</h1>
          <p className="admin-comments-subtitle">
            Review and moderate community discussions on problem listings.
          </p>
        </div>
        <div className="admin-comments-badge">
          <MessageSquare className="admin-comments-badge-icon" />
          <span className="admin-comments-badge-text">
            {comments.length} Total Comments
          </span>
        </div>
      </div>

      <div className="admin-comments-filter-section">
        <div className="admin-comments-search-wrapper">
          <Search className="admin-comments-search-icon" />
          <input
            type="text"
            placeholder="Search by comment text, author, post title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-comments-search-input"
          />
        </div>
      </div>

      <div className="admin-comments-table-container">
        {loading ? (
          <div className="admin-comments-table-info">
            Loading comments list...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="admin-comments-table-info">
            No comments found matching the search criteria.
          </div>
        ) : (
          <div className="admin-comments-table-responsive">
            <table className="admin-comments-table">
              <thead className="admin-comments-thead">
                <tr>
                  <th className="admin-comments-th">ID</th>
                  <th className="admin-comments-th">Comment Content</th>
                  <th className="admin-comments-th">
                    Author & Associated Post
                  </th>
                  <th className="admin-comments-th">Created At</th>
                  <th className="admin-comments-th-right">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-comments-tbody">
                {filteredComments.map((comment) => (
                  <tr key={comment.comment_id} className="admin-comments-tr">
                    <td className="admin-comments-td-id">
                      #{comment.comment_id}
                    </td>
                    <td className="admin-comments-td-content">
                      <p className="admin-comments-content-text">
                        {comment.content}
                      </p>
                    </td>
                    <td className="admin-comments-td-meta">
                      <div className="admin-comments-meta-line">
                        <User className="admin-comments-meta-icon" />
                        {comment.author_name || "Anonymous"}
                      </div>
                      <div
                        className="admin-comments-meta-subline"
                        title={comment.post_title}
                      >
                        <FileText className="admin-comments-meta-icon" />
                        {comment.post_title || "Unknown Post"}
                      </div>
                    </td>
                    <td className="admin-comments-td-date">
                      <span className="admin-comments-date-line">
                        <Calendar className="admin-comments-date-icon" />
                        {formatDate(comment.created_at)}
                      </span>
                    </td>
                    <td className="admin-comments-td-actions">
                      <button
                        onClick={() =>
                          handleDelete(
                            comment.comment_id,
                            comment.author_name || "Anonymous",
                          )
                        }
                        className="admin-comments-btn-delete"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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

export default AdminComments;
