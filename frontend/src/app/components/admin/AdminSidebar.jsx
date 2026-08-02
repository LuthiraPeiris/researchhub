import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logoutUser } from "../../services/authService";
import "./AdminSidebar.css";
import {
  Archive,
  FileText,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path == !"/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Manage Posts", path: "/admin/posts", icon: FileText },
    { label: "Manage Comments", path: "/admin/comments", icon: MessageSquare },
    { label: "Manage Solutions", path: "/admin/solutions", icon: Lightbulb },
    { label: "Manage Fields", path: "/admin/fields", icon: Layers },
    { label: "Archive", path: "/admin/archive", icon: Archive },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-sidebar-header">
        <Link to="/admin" className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">A</div>
          {!collapsed && (
            <span className="admin-sidebar-title">Admin Portal</span>
          )}
        </Link>

        <button
          className="admin-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <Icon className="admin-sidebar-icon" />

              {!collapsed && (
                <span className="admin-sidebar-label">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/app" className="admin-sidebar-link">
          <Home className="admin-sidebar-icon" />

          {!collapsed && (
            <span className="admin-sidebar-label">Return to App</span>
          )}
        </Link>
        <button className="admin-sidebar-link logout" onClick={handleLogout}>
          <LogOut className="admin-sidebar-icon" />

          {!collapsed && <span className="admin-sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
