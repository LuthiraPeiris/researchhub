import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  PlusCircle,
  BookOpen,
  Trophy,
  User,
  Bell,
  Search,
  LogOut,
  Settings,
  FileText,
  ChevronDown,
  Inbox,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { getCurrentUser, logoutUser } from "../services/authService";
import API_BASE_URL from "../services/api";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentUser = getCurrentUser();

  const displayName =
  currentUser?.full_name ||
  currentUser?.name ||
  currentUser?.username ||
  "Researcher";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

const notificationList = Array.isArray(data)
  ? data
  : data.notifications || [];

setNotifications(notificationList);
      } catch (err) {
        setNotificationError(err.message || "Failed to load notifications");
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === "/app" && location.pathname === "/app") return true;
    if (path !== "/app" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
  e.preventDefault();

  const trimmedSearch = searchText.trim();
  const params = new URLSearchParams(searchParams);

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  } else {
    params.delete("search");
  }

  navigate(`/app?${params.toString()}`);
};

  const handleNotificationClick = async (notification) => {
  try {
    await markNotificationAsRead(notification.notification_id);

    setNotifications((prev) =>
      prev.map((item) =>
        item.notification_id === notification.notification_id
          ? { ...item, is_read: 1 }
          : item
      )
    );

    setShowNotifications(false);

    if (notification.target_post_id) {
      navigate(`/app/problem/${notification.target_post_id}`);
      return;
    }

    if (notification.reference_type === "post" && notification.reference_id) {
      navigate(`/app/problem/${notification.reference_id}`);
      return;
    }

    navigate("/app/notifications");
  } catch (err) {
    setNotificationError(err.message || "Failed to update notification");
  }
};

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: 1,
        }))
      );
    } catch (err) {
      setNotificationError(err.message || "Failed to update notifications");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.is_read === 0 || notification.is_read === false
  ).length;

  const userProfilePath = currentUser?.username
  ? `/app/profile/${currentUser.username}`
  : currentUser?.user_id
  ? `/app/profile/${currentUser.user_id}`
  : "/app";

  const showTopSearch = location.pathname === "/app";

  const getProfileImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/default-profile.png";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_BASE_URL.replace("/api", "")}${imagePath}`;
};

  const sidebarWidthClass = sidebarCollapsed ? "w-20" : "w-64";

const navLinkClass = (path, exact = false) => {
  const active = exact
    ? location.pathname === path
    : isActive(path);

  return `group relative flex items-center ${
    sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
  } py-3 rounded-lg border transition-all duration-300 ease-in-out ${
    active
      ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-[#0ea5e9]/30 text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-[#0ea5e9]/40"
      : "border-transparent text-gray-700 hover:bg-gray-100 hover:text-[#0ea5e9] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-[#38bdf8]"
  }`;
};

const sidebarLabelClass = sidebarCollapsed
  ? "hidden"
  : "inline whitespace-nowrap";

  return (
  <div className="min-h-screen bg-gray-50 text-gray-900 flex transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
    <style>
      {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
    </style>
      <aside className={`${sidebarWidthClass} h-screen sticky top-0 border-r border-gray-200 bg-white flex flex-col shadow-sm transition-all duration-300 ease-in-out flex-shrink-0 dark:border-gray-800 dark:bg-gray-900`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
  <div
    className={`flex items-center ${
      sidebarCollapsed ? "justify-center" : "justify-between"
    } gap-2`}
  >
    <Link
      to="/"
      className={`flex items-center ${
        sidebarCollapsed ? "justify-center" : "gap-2"
      }`}
    >
      <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 bg-white dark:bg-gray-800">
        <img
          src="/researchhub-logo.png"
          alt="ResearchHub Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {!sidebarCollapsed && (
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          ResearchHub
        </span>
      )}
    </Link>

    {!sidebarCollapsed && (
      <button
        type="button"
        onClick={() => setSidebarCollapsed(true)}
        title="Collapse sidebar"
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <PanelLeftClose className="w-5 h-5" />
      </button>
    )}
  </div>

  {sidebarCollapsed && (
    <button
      type="button"
      onClick={() => setSidebarCollapsed(false)}
      title="Expand sidebar"
      className="mt-4 w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
    >
      <PanelLeftOpen className="w-5 h-5" />
    </button>
  )}
</div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
         <Link
  to="/app"
  title="Dashboard"
  className={navLinkClass("/app", true)}
>
  <Home className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Dashboard</span>
</Link>

<Link
  to="/app/post-problem"
  title="Post Problem"
  className={navLinkClass("/app/post-problem")}
>
  <PlusCircle className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Post Problem</span>
</Link>

<Link
  to="/app/my-problems"
  title="My Problems"
  className={navLinkClass("/app/my-problems")}
>
  <FileText className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>My Problems</span>
</Link>

<Link
  to="/app/my-solutions"
  title="My Solutions"
  className={navLinkClass("/app/my-solutions")}
>
  <Lightbulb className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>My Solutions</span>
</Link>

<Link
  to="/app/received-solutions"
  title="Received Solutions"
  className={navLinkClass("/app/received-solutions")}
>
  <Inbox className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Received Solutions</span>
</Link>

<Link
  to="/app/archive"
  title="Knowledge Base"
  className={navLinkClass("/app/archive")}
>
  <BookOpen className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Knowledge Base</span>
</Link>

<Link
  to="/app/leaderboard"
  title="Leaderboard"
  className={navLinkClass("/app/leaderboard")}
>
  <Trophy className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Leaderboard</span>
</Link>

<Link
  to={userProfilePath}
  title="Profile"
  className={navLinkClass("/app/profile")}
>
  <User className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Profile</span>
</Link>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0 bg-white dark:border-gray-800 dark:bg-gray-900">
  <Link
  to="/app/settings"
  title="Settings"
  className={`group w-full flex items-center ${
  sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
} py-3 rounded-lg border transition-all duration-300 ease-in-out ${
  isActive("/app/settings")
    ? "bg-gradient-to-r from-[#0ea5e9]/10 to-[#a855f7]/10 border-[#0ea5e9]/30 text-[#0ea5e9] shadow-sm dark:from-[#0ea5e9]/20 dark:to-[#a855f7]/20 dark:border-[#0ea5e9]/40"
    : "border-transparent text-gray-700 hover:bg-gray-100 hover:text-[#0ea5e9] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-[#38bdf8]"
}`}
>
  <Settings className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
  <span className={sidebarLabelClass}>Settings</span>
</Link>

  <button
    title="Logout"
    onClick={handleLogout}
    className={`group w-full flex items-center ${
  sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
} py-3 rounded-lg border border-transparent hover:bg-red-50 transition-all duration-300 ease-in-out text-red-500 dark:hover:bg-red-950/40`}
  >
    <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
    <span className={sidebarLabelClass}>Logout</span>
  </button>
</div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="relative z-50 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
          {showTopSearch ? (
  <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by title, description, field, or user..."
        className="w-full pl-11 pr-20 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0ea5e9] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-900/40"
      />

      {searchText && (
        <button
          type="button"
          onClick={() => {
            setSearchText("");

            const params = new URLSearchParams(searchParams);
            params.delete("search");

            navigate(`/app?${params.toString()}`);
          }}
          className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      )}

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-[#0ea5e9] text-white text-xs hover:bg-[#0284c7] transition-colors"
      >
        Search
      </button>
    </div>
  </form>
) : (
  <div className="flex-1">
    <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
      ResearchHub Workspace
    </h2>
  </div>
)}

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#0ea5e9] rounded-full text-white text-xs flex items-center justify-center shadow-lg shadow-blue-500/50">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white backdrop-blur-xl shadow-xl overflow-hidden z-[9999] dark:border-gray-800 dark:bg-gray-900">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Notifications
                    </h3>

                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-[#0ea5e9] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notificationError && (
                      <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400">
                        {notificationError}
                      </div>
                    )}

                    {!notificationError && notifications.length === 0 && (
                      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet.
                      </div>
                    )}

                    {notifications.map((notif) => (
                      <button
                        key={notif.notification_id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800 ${
                          notif.is_read === 0 || notif.is_read === false
                            ? "bg-blue-50/50 dark:bg-blue-950/30"
                            : ""
                        }`}
                      >
                        <p className="text-sm mb-1 text-gray-900 dark:text-gray-100">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>

                          <span className="text-xs text-[#0ea5e9] capitalize">
                            {notif.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-200 text-center bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/app/notifications");
                      }}
                      className="text-sm text-[#0ea5e9] hover:underline font-medium"
                    >
                    View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative pl-4 border-l border-gray-200 dark:border-gray-800"
              ref={userMenuRef}
            >
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-lg hover:bg-gray-100 transition-colors pr-2 py-1 dark:hover:bg-gray-800"
              >
                <img
                  src={getProfileImageUrl(currentUser?.profile_picture)}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />

                <div className="text-sm text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {displayName}
                  </div>

                  <div className="text-gray-500 text-xs capitalize dark:text-gray-400">
                    {currentUser?.role || "User"}
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform dark:text-gray-400 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white backdrop-blur-xl shadow-xl overflow-hidden z-[9999] dark:border-gray-800 dark:bg-gray-900">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:border-gray-800 dark:from-gray-800 dark:to-gray-900">
                    <div className="font-medium text-gray-900">
                      {displayName}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      @{currentUser?.email?.split("@")[0] || "user"}
                    </div>

                    <div className="mt-2 text-xs text-[#0ea5e9] font-medium capitalize">
                      {currentUser?.role || "User"}
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to={userProfilePath}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </Link>

                    <Link
                      to="/app/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-500 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="relative z-0 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
  <div
    key={location.pathname}
    className="animate-[fadeIn_0.25s_ease-in-out]"
  >
    <Outlet />
  </div>
</main>
      </div>
    </div>
  );
}