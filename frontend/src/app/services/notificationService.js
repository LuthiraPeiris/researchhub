import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const getNotifications = async (limit = 20) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/notifications?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
};

export const markNotificationAsRead = async (notificationId) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark notification as read");
  }

  return data;
};

export const markAllNotificationsAsRead = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark all notifications as read");
  }

  return data;
};

export const deleteNotification = async (notificationId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete notification");
  }

  return data;
};