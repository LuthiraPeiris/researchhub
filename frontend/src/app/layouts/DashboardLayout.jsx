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
import { getFields } from "../services/fieldService";
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
  const [searchFields, setSearchFields] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

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
  const fetchSearchFields = async () => {
    try {
      const data = await getFields();

      const fieldList = Array.isArray(data)
        ? data
        : data.fields || [];

      setSearchFields(fieldList);
    } catch (error) {
      console.error("Failed to load search suggestions:", error);
      setSearchFields([]);
    }
  };

  fetchSearchFields();
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

    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target)
    ) {
      setShowUserMenu(false);
    }

    if (
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setShowSearchSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
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

  const handleSearchChange = (event) => {
  const value = event.target.value;

  setSearchText(value);

  const trimmedValue = value.trim().toLowerCase();

  if (!trimmedValue) {
    setSearchSuggestions([]);
    setShowSearchSuggestions(false);
    return;
  }

  const matchingFields = searchFields
    .filter((field) =>
      field.field_name
        ?.toLowerCase()
        .includes(trimmedValue)
    )
    .slice(0, 5);

  setSearchSuggestions(matchingFields);
  setShowSearchSuggestions(matchingFields.length > 0);
};

const handleSuggestionSelect = (fieldName) => {
  setSearchText(fieldName);
  setSearchSuggestions([]);
  setShowSearchSuggestions(false);

  const params = new URLSearchParams(searchParams);
  params.set("search", fieldName);

  navigate(`/app?${params.toString()}`);
};

  const handleSearchSubmit = (event) => {
  event.preventDefault();

  const trimmedSearch = searchText.trim();
  const params = new URLSearchParams(searchParams);

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  } else {
    params.delete("search");
  }

  setShowSearchSuggestions(false);
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

  const sidebarWidthClass = sidebarCollapsed ? "w-[72px]" : "w-64";

const navLinkClass = (path, exact = false) => {
  const active = exact
    ? location.pathname === path
    : isActive(path);

  return `group relative flex items-center ${
    sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
  } py-2.5 rounded-md border text-sm font-medium transition-colors duration-200 ${
    active
      ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300"
      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;
};

const sidebarLabelClass = sidebarCollapsed
  ? "hidden"
  : "inline whitespace-nowrap";

  return (
  <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
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
      <aside className={`${sidebarWidthClass} sticky top-0 flex h-screen flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900`}>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
  <div
    className={`flex items-center ${
      sidebarCollapsed ? "justify-center" : "justify-between"
    } gap-2`}
  >
    <Link
      to="/app"
      className={`flex items-center ${
        sidebarCollapsed ? "justify-center" : "gap-2"
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-800">
        <img
          src="/collabsolve-logo.png"
          alt="CollabSolve Logo"
          className="h-full w-full object-cover"
        />
      </div>

      {!sidebarCollapsed && (
        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          CollabSolve
        </span>
      )}
    </Link>

    {!sidebarCollapsed && (
      <button
        type="button"
        onClick={() => setSidebarCollapsed(true)}
        title="Collapse sidebar"
        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <PanelLeftClose className="h-4 w-4" />
      </button>
    )}
  </div>

  {sidebarCollapsed && (
    <button
      type="button"
      onClick={() => setSidebarCollapsed(false)}
      title="Expand sidebar"
      className="mt-4 flex w-full items-center justify-center rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <PanelLeftOpen className="h-4 w-4" />
    </button>
  )}
</div>

        <nav className="flex-1 overflow-y-auto p-3">
          {!sidebarCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>
          )}
          <div className="space-y-1">
         <Link
  to="/app"
  title="Dashboard"
  className={navLinkClass("/app", true)}
>
  <Home className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Dashboard</span>
</Link>

<Link
  to="/app/post-problem"
  title="Post Problem"
  className={navLinkClass("/app/post-problem")}
>
  <PlusCircle className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Post Problem</span>
</Link>

<Link
  to="/app/my-problems"
  title="My Problems"
  className={navLinkClass("/app/my-problems")}
>
  <FileText className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>My Problems</span>
</Link>

<Link
  to="/app/my-solutions"
  title="My Solutions"
  className={navLinkClass("/app/my-solutions")}
>
  <Lightbulb className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>My Solutions</span>
</Link>

<Link
  to="/app/received-solutions"
  title="Received Solutions"
  className={navLinkClass("/app/received-solutions")}
>
  <Inbox className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Received Solutions</span>
</Link>

</div>

          {!sidebarCollapsed && (
            <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Discover
            </p>
          )}
          <div className="space-y-1">
<Link
  to="/app/archive"
  title="Knowledge Base"
  className={navLinkClass("/app/archive")}
>
  <BookOpen className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Knowledge Base</span>
</Link>

<Link
  to="/app/leaderboard"
  title="Leaderboard"
  className={navLinkClass("/app/leaderboard")}
>
  <Trophy className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Leaderboard</span>
</Link>

</div>

          {!sidebarCollapsed && (
            <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Account
            </p>
          )}
          <div className="space-y-1">
<Link
  to={userProfilePath}
  title="Profile"
  className={navLinkClass("/app/profile")}
>
  <User className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Profile</span>
</Link>
          </div>
        </nav>

        <div className="flex-shrink-0 space-y-1 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
  <Link
  to="/app/settings"
  title="Settings"
  className={`group w-full flex items-center ${
  sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
} py-2.5 rounded-md border text-sm font-medium transition-colors duration-200 ${
  isActive("/app/settings")
    ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300"
    : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
}`}
>
  <Settings className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
  <span className={sidebarLabelClass}>Settings</span>
</Link>

  <button
    title="Logout"
    onClick={handleLogout}
    className={`group w-full flex items-center ${
  sidebarCollapsed ? "justify-center px-3" : "gap-3 px-4"
} rounded-md border border-transparent py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30`}
  >
    <LogOut className="h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
    <span className={sidebarLabelClass}>Logout</span>
  </button>
</div>
      </aside>

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-900/95">
          <Link to="/app" className="mr-3 flex items-center gap-2 md:hidden">
            <img src="/collabsolve-logo.png" alt="CollabSolve" className="h-8 w-8 rounded-md object-cover" />
            <span className="hidden text-sm font-semibold text-slate-900 sm:inline dark:text-slate-100">CollabSolve</span>
          </Link>
          {showTopSearch ? (
  <form
    onSubmit={handleSearchSubmit}
    className="max-w-2xl flex-1"
  >
    <div ref={searchRef} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        onFocus={() => {
          if (searchSuggestions.length > 0) {
            setShowSearchSuggestions(true);
          }
        }}
        placeholder="Search by title, description, field, or user..."
        autoComplete="off"
        className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-20 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900/40"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
      >
        Search
      </button>

      {showSearchSuggestions &&
        searchSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[9999] mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Suggested fields
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {searchSuggestions.map((field) => (
                <button
                  key={field.field_id}
                  type="button"
                  onClick={() =>
                    handleSuggestionSelect(field.field_name)
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                >
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />

                  <span>{field.field_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  </form>
) : (
  <div className="flex-1">
    <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
      CollabSolve Workspace
    </h2>
  </div>
)}

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-md p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-[9999] mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h3>

                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
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
                      <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                        No notifications yet.
                      </div>
                    )}

                    {notifications.map((notif) => (
                      <button
                        key={notif.notification_id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                          notif.is_read === 0 || notif.is_read === false
                            ? "bg-blue-50/60 dark:bg-blue-950/20"
                            : ""
                        }`}
                      >
                        <p className="mb-1 text-sm leading-5 text-slate-900 dark:text-slate-100">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>

                          <span className="text-xs capitalize text-blue-600 dark:text-blue-400">
                            {notif.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate("/app/notifications");
                      }}
                      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                    View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative border-l border-slate-200 pl-3 dark:border-slate-800"
              ref={userMenuRef}
            >
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <img
                  src={getProfileImageUrl(currentUser?.profile_picture)}
                  alt="User"
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />

                <div className="text-sm text-left">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {displayName}
                  </div>

                  <div className="text-slate-500 text-xs capitalize dark:text-slate-400">
                    {currentUser?.role || "User"}
                  </div>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform dark:text-slate-400 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 z-[9999] mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {displayName}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      @{currentUser?.email?.split("@")[0] || "user"}
                    </div>

                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                      {currentUser?.role || "User"}
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to={userProfilePath}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>

                    <Link
                      to="/app/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="relative z-0 flex-1 overflow-y-auto bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
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