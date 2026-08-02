import API_BASE_URL from "./api";
import { getToken } from "./authService";

const getHeaders = () => {
  const token = getToken();
  return {
    "content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// USERS
export const getAdminUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }
  return data.users || [];
};

export const deleteAdminUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }
  return data;
};

// ================= POSTS =================
export const getAdminPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/posts`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }
  return data.posts || [];
};

//post

export const deleteAdminPost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/posts/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }
  return data;
};

export const archiveAdminPost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/posts/${id}/archive`, {
    method: "PUT",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to archive post");
  }
  return data;
};

//comments
export const getAdminComments = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/comments`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch comments");
  }
  return data.comments || [];
};

export const deleteAdminComment = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete comment");
  }
  return data;
};

//solutions
export const getAdminSolutions = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/solutions`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch solutions");
  }
  return data.solutions || [];
};

export const deleteAdminSolution = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/solutions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete solution");
  }
  return data;
};

// Fields

export const getAdminFields = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/fields`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch fields");
  }
  return data.fields || [];
};

export const createAdminField = async (fieldData) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(fieldData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create field");
  }
  return data;
};

export const updateAdminField = async (id, fieldData) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(fieldData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update field");
  }
  return data;
};

export const deleteAdminField = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete field");
  }
  return data;
};

//Archive

export const getAdminArchive = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/archive`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch archive");
  }
  return data.archive || [];
};

export const restoreAdminArchivePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/archive/${id}/restore`, {
    method: "PUT",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to restore archived post");
  }
  return data;
};
