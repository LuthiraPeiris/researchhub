import { useState, useEffect } from "react";
import {
  Lightbulb,
  Search,
  Trash2,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import {
  getAdminSolutions,
  deleteAdminSolution,
} from "../../services/adminService";
import "./admin-css/AdminSolutions.css";

const AdminSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setSolutions(await getAdminSolutions());
      } catch (err) {
        setError(err.message || "Failed to load solutions");
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const handleDelete = async (id, author) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete this solution attempt by ${author}? This action is irreversible.`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdminSolution(id);
      setSuccess("Solution attempt deleted successfully.");
      setSolutions(solutions.filter((s) => s.solution_id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete solution");
    }
  };

  const filteredSolutions = solutions.filter((sol) => {
    const query = search.toLowerCase();
    return (
      sol.content?.toLowerCase().includes(query) ||
      sol.author_name?.toLowerCase().includes(query) ||
      sol.post_title?.toLowerCase().includes(query) ||
      sol.solution_id?.toString().includes(query)
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
    <div className="admin-solutions-container">
      <div className="admin-solutions-header">
        <div>
          <h1 className="admin-solutions-title">Manage Solutions</h1>
          <p className="admin-solutions-subtitle">
            Review and moderate community solution proposals and experiment
            logs.
          </p>
        </div>
        <div className="admin-solutions-badge">
          <Lightbulb className="admin-solutions-badge-icon" />
          <span className="admin-solutions-badge-text">
            {solutions.length} Total Solutions
          </span>
        </div>
      </div>

      <div className="admin-solutions-filter-section">
        <div className="admin-solutions-search-wrapper">
          <Search className="admin-solutions-search-icon" />
          <input
            type="text"
            placeholder="Search by solution content, author, post title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-solutions-search-input"
          />
        </div>
      </div>

      <div className="admin-solutions-table-container">
        {loading ? (
          <div className="admin-solutions-table-info">
            Loading solutions list...
          </div>
        ) : filteredSolutions.length === 0 ? (
          <div className="admin-solutions-table-info">
            No solution submissions found matching the filters.
          </div>
        ) : (
          <div className="admin-solutions-table-responsive">
            <table className="admin-solutions-table">
              <thead className="admin-solutions-thead">
                <tr>
                  <th className="admin-solutions-th">ID</th>
                  <th className="admin-solutions-th">
                    Solution content / Proposal
                  </th>
                  <th className="admin-solutions-th">
                    Author & Associated Post
                  </th>
                  <th className="admin-solutions-th">Submitted Date</th>
                  <th className="admin-solutions-th-right">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-solutions-tbody">
                {filteredSolutions.map((sol) => (
                  <tr key={sol.solution_id} className="admin-solutions-tr">
                    <td className="admin-solutions-td-id">
                      #{sol.solution_id}
                    </td>
                    <td className="admin-solutions-td-content">
                      <p className="admin-solutions-content-text">
                        {sol.content}
                      </p>
                    </td>
                    <td className="admin-solutions-td-meta">
                      <div className="admin-solutions-meta-line">
                        <User className="admin-solutions-meta-icon" />
                        {sol.author_name || "Anonymous"}
                      </div>
                      <div
                        className="admin-solutions-meta-subline"
                        title={sol.post_title}
                      >
                        <FileText className="admin-solutions-meta-icon" />
                        {sol.post_title || "Unknown Post"}
                      </div>
                    </td>
                    <td className="admin-solutions-td-date">
                      <span className="admin-solutions-date-line">
                        <Calendar className="admin-solutions-date-icon" />
                        {formatDate(sol.created_at)}
                      </span>
                    </td>
                    <td className="admin-solutions-td-actions">
                      <button
                        onClick={() =>
                          handleDelete(
                            sol.solution_id,
                            sol.author_name || "Anonymous",
                          )
                        }
                        className="admin-solutions-btn-delete"
                        title="Delete Solution"
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

export default AdminSolutions;
