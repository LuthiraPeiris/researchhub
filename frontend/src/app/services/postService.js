import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const createPost = async (postData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }

  return data;
};

export const getAllPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};

export const getPostById = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data;
};

export const searchPosts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.query) {
    params.append("query", filters.query);
  }

  if (filters.field_id && filters.field_id !== "all") {
    params.append("field_id", filters.field_id);
  }

  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.difficulty_level && filters.difficulty_level !== "all") {
    params.append("difficulty_level", filters.difficulty_level);
  }

  if (filters.post_type && filters.post_type !== "all") {
    params.append("post_type", filters.post_type);
  }

  if (filters.sort) {
    params.append("sort", filters.sort);
  }

  const response = await fetch(`${API_BASE_URL}/posts/search?${params.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search posts");
  }

  return data;
};

export const updatePost = async (postId, postData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update post");
  }

  return data;
};

export const deletePost = async (postId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return data;
};

export const toggleSavePost = async (postId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save post");
  }

  return data;
};

export const getPostSaveStatus = async (postId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/save-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check save status");
  }

  return data;
};

export const getMySavedPosts = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/posts/saved/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch saved problems");
  }

  return data;
};