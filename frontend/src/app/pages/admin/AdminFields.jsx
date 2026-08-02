import { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  getAdminFields,
  createAdminField,
  updateAdminField,
  deleteAdminField,
} from "../../services/adminService";
import "./admin-css/AdminFields.css";

const AdminFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setFields(await getAdminFields());
    } catch (err) {
      setError(err.message || "Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleOpenAddModal = () => {
    setEditingField(null);
    setFormData({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleOpenEditModal = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name || field.field_name || "",
      description: field.description || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the field "${name}"? Problems and posts tagged with this field may lose their category.`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdminField(id);
      setSuccess(`Field "${name}" deleted successfully.`);
      setFields(fields.filter((f) => f.field_id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete field");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Name and description are required.");
      return;
    }

    try {
      setFormSubmitLoading(true);
      setError("");
      setSuccess("");

      if (editingField) {
        // Edit mode
        await updateAdminField(editingField.field_id, formData);
        setSuccess(`Field "${formData.name}" updated successfully.`);
      } else {
        // Create mode
        await createAdminField(formData);
        setSuccess(`Field "${formData.name}" created successfully.`);
      }

      setModalOpen(false);
      fetchFields(); // Reload list
    } catch (err) {
      setError(err.message || "Failed to save field details");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-fields-container">
      <div className="admin-fields-header">
        <div>
          <h1 className="admin-fields-title">Manage Fields</h1>
          <p className="admin-fields-subtitle">
            Define and edit the academic or engineering research areas of the
            platform.
          </p>
        </div>
        <button onClick={handleOpenAddModal} className="admin-fields-btn-add">
          <Plus className="w-4 h-4" />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Grid Layout of Fields */}
      {loading ? (
        <div className="admin-fields-loading">Loading fields...</div>
      ) : fields.length === 0 ? (
        <div className="admin-fields-empty">
          No research fields defined yet. Click "Add New Field" to create one.
        </div>
      ) : (
        <div className="admin-fields-grid">
          {fields.map((field) => {
            const name = field.name || field.field_name;
            return (
              <div key={field.field_id} className="admin-fields-card">
                <div>
                  <div className="admin-fields-card-header">
                    <div className="admin-fields-icon-wrapper">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="admin-fields-card-title">{name}</h3>
                      <span className="admin-fields-card-id">
                        ID: #{field.field_id}
                      </span>
                    </div>
                  </div>
                  <p className="admin-fields-card-desc">{field.description}</p>
                </div>

                <div className="admin-fields-card-footer">
                  <div className="admin-fields-date">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(field.created_at)}</span>
                  </div>
                  <div className="admin-fields-actions">
                    <button
                      onClick={() => handleOpenEditModal(field)}
                      className="admin-fields-btn-edit"
                      title="Edit Field"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(field.field_id, name)}
                      className="admin-fields-btn-delete"
                      title="Delete Field"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="admin-fields-overlay">
          <div className="admin-fields-modal">
            <div className="admin-fields-modal-header">
              <h3 className="admin-fields-modal-title">
                {editingField ? "Edit Field Details" : "Create New Field"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="admin-fields-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="admin-fields-modal-form"
            >
              <div className="admin-fields-form-group">
                <label className="admin-fields-label">Field Name</label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="admin-fields-input"
                />
              </div>

              <div className="admin-fields-form-group">
                <label className="admin-fields-label">Description</label>
                <textarea
                  required
                  rows="4"
                  placeholder=""
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="admin-fields-textarea"
                />
              </div>

              {editingField && (
                <div className="admin-fields-warning">
                  <AlertTriangle className="admin-fields-warning-icon" />
                  <p className="admin-fields-warning-text">
                    Editing a field will update its categorizations site-wide
                    for all posts immediately.
                  </p>
                </div>
              )}

              <div className="admin-fields-modal-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-fields-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="admin-fields-btn-save"
                >
                  {formSubmitLoading ? "Saving..." : "Save Field"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFields;
