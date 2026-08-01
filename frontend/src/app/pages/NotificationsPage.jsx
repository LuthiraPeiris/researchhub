import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppAlert } from "../components/AppAlert";
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Trash2,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

export function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getNotifications();
      const notificationList = Array.isArray(data)
        ? data
        : data.notifications || [];

      setNotifications(notificationList);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type) => {
    if (type === "solution") return Lightbulb;
    if (type === "verification") return CheckCircle;
    if (type === "comment") return MessageSquare;
    return Bell;
  };

  const getNotificationStyle = (type) => {
    if (type === "solution") {
      return "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300";
    }

    if (type === "verification") {
      return "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
    }

    if (type === "comment") {
      return "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300";
    }

    return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  const handleOpenNotification = async (notification) => {
    try {
      setActionLoading(true);
      setError("");

      await markNotificationAsRead(notification.notification_id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.notification_id === notification.notification_id
            ? { ...item, is_read: 1 }
            : item
        )
      );

      if (notification.target_post_id) {
        navigate(`/app/problem/${notification.target_post_id}`);
        return;
      }

      if (notification.reference_type === "post" && notification.reference_id) {
        navigate(`/app/problem/${notification.reference_id}`);
        return;
      }
    } catch (err) {
      setError(err.message || "Failed to open notification");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: 1,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to mark notifications as read");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      setActionLoading(true);
      setError("");

      await deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.notification_id !== notificationId
        )
      );
    } catch (err) {
      setError(err.message || "Failed to delete notification");
    } finally {
      setActionLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) =>
      notification.is_read === 0 || notification.is_read === false
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 lg:p-7 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View updates about your problems, solutions, and account activity.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading || unreadCount === 0}
            className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
            {notifications.length}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total Notifications
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
            {unreadCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Unread
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-semibold leading-none text-slate-900 dark:text-slate-100">
            {notifications.length - unreadCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Read
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading notifications...
        </div>
      )}

      <div className="space-y-3">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert
          type="success"
          message={message}
          onClose={() => setMessage("")}
        />
      </div>

      {!loading && !error && notifications.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <Bell className="h-6 w-6" />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            No notifications yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Important updates will appear here.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isUnread =
              notification.is_read === 0 || notification.is_read === false;

            return (
              <div
                key={notification.notification_id}
                className={`rounded-lg border p-4 shadow-sm transition-colors ${
                  isUnread
                    ? "border-l-4 border-l-blue-500 border-y-slate-200 border-r-slate-200 bg-blue-50/30 dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-blue-950/10"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border ${getNotificationStyle(
                      notification.type
                    )}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="mb-2 text-sm leading-6 text-slate-800 dark:text-slate-200">
                          {notification.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{formatDate(notification.created_at)}</span>

                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {notification.type}
                          </span>

                          {isUnread && (
                            <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                          onClick={() => handleOpenNotification(notification)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteNotification(
                              notification.notification_id
                            )
                          }
                          disabled={actionLoading}
                          className="rounded-md border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
