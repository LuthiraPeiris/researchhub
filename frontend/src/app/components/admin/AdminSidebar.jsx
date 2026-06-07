import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="space-y-3">
        <Link to="/admin" className="block hover:text-blue-300">
          Dashboard
        </Link>

        <Link to="/admin/users" className="block hover:text-blue-300">
          Manage Users
        </Link>

        <Link to="/admin/posts" className="block hover:text-blue-300">
          Manage Posts
        </Link>

        <Link to="/admin/comments" className="block hover:text-blue-300">
          Manage Comments
        </Link>

        <Link to="/admin/solutions" className="block hover:text-blue-300">
          Manage Solutions
        </Link>

        <Link to="/admin/fields" className="block hover:text-blue-300">
          Manage Fields
        </Link>

        <Link to="/admin/archive" className="block hover:text-blue-300">
          Archive
        </Link>

        <Link to="/admin/notifications" className="block hover:text-blue-300">
          Notifications
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;