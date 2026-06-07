import API_BASE_URL from "./api";
import { getToken } from "./authService";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getCommentsByPost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data;
};

export const addComment = async (postId, commentText, parentCommentId = null) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      comment_text: commentText,
      parent_comment_id: parentCommentId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add comment");
  }

  return data;
};

export const deleteComment = async (commentId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete comment");
  }

  return data;
};

export const toggleCommentLike = async (commentId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to like comment");
  }

  return data;
};