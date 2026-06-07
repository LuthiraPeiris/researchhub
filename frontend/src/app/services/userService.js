import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }

  return data;
};

export const updateUserProfile = async (userId, profileData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

export const getUserPosts = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user posts");
  }

  return data;
};

export const updateProfilePicture = async (userId, imageFile) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("profile_picture", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/profile-picture`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile picture");
  }

  return data;
};

export const refreshCurrentUser = async (userId) => {
  const user = await getUserProfile(userId);

  const updatedUser = {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    profile_picture: user.profile_picture,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  return updatedUser;
};

export const getReceivedSolutions = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/users/me/received-solutions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch received solutions");
  }

  return data;
};

export const getMySolutions = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/users/me/solutions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch your solutions");
  }

  return data;
};

export const getUserSolutions = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/solutions`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user solutions");
  }

  return data;
};

export const getUserFields = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/fields`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user fields");
  }

  return data;
};