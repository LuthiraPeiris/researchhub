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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

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
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (type === "verification") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (type === "comment") {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }

    return "bg-gray-50 text-gray-700 border-gray-100";
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
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            View updates about your problems, solutions, and account activity.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-[#0ea5e9] hover:bg-blue-100 transition-colors disabled:opacity-60"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-2xl text-gray-900">{notifications.length}</div>
          <div className="text-sm text-gray-600">Total Notifications</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-2xl text-gray-900">{unreadCount}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-2xl text-gray-900">
            {notifications.length - unreadCount}
          </div>
          <div className="text-sm text-gray-600">Read</div>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600">
          Loading notifications...
        </div>
      )}

      <div className="space-y-3 mb-5">
        <AppAlert type="error" message={error} onClose={() => setError("")} />
        <AppAlert type="success" message={message} onClose={() => setMessage("")} />
      </div>

      {!loading && !error && notifications.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 shadow-sm text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Bell className="w-7 h-7 text-[#0ea5e9]" />
          </div>

          <h2 className="text-xl text-gray-900 mb-2">No notifications yet</h2>
          <p className="text-gray-600">
            Important updates will appear here.
          </p>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isUnread =
              notification.is_read === 0 || notification.is_read === false;

            return (
              <div
                key={notification.notification_id}
                className={`rounded-xl border p-5 shadow-sm transition-all ${
                  isUnread
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border ${getNotificationStyle(
                      notification.type
                    )}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-gray-900 mb-1">
                          {notification.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(notification.created_at)}</span>

                          <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {notification.type}
                          </span>

                          {isUnread && (
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenNotification(notification)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-[#0ea5e9] hover:bg-blue-100 transition-colors text-sm disabled:opacity-60"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteNotification(
                              notification.notification_id
                            )
                          }
                          disabled={actionLoading}
                          className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-60"
                        >
                          <Trash2 className="w-4 h-4" />
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