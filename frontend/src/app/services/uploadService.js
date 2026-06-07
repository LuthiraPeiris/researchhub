import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const uploadPostAttachments = async (postId, files) => {
  const token = getToken();

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/attachments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload files");
  }

  return data;
};

export const getPostAttachments = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/attachments`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch attachments");
  }

  return data;
};

export const deletePostAttachment = async (attachmentId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/attachments/${attachmentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete attachment");
  }

  return data;
};