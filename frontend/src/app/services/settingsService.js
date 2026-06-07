import API_BASE_URL from "./api";
import { getToken } from "./authService";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const changePassword = async (passwordData) => {
  const response = await fetch(`${API_BASE_URL}/settings/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
};

export const getNotificationPreferences = async () => {
  const response = await fetch(
    `${API_BASE_URL}/settings/notification-preferences`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notification preferences");
  }

  return data;
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/notification-preferences`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update notification preferences");
  }

  return data;
};

export const getUserSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/settings/preferences`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch settings");
  }

  return data;
};

export const updateUserSettings = async (settings) => {
  const response = await fetch(`${API_BASE_URL}/settings/preferences`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update settings");
  }

  return data;
};

export const deleteAccount = async (password) => {
  const response = await fetch(`${API_BASE_URL}/settings/delete-account`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account");
  }

  return data;
};