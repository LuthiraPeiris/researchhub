import API_BASE_URL from "./api";
import { getToken } from "./authService";

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    message: text || "Unexpected server response",
  };
};

export const uploadPostAttachments = async (
  postId,
  files,
) => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to upload files");
  }

  if (!postId) {
    throw new Error("Post ID is required");
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("At least one file is required");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/attachments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to upload files",
    );
  }

  return data;
};

export const getPostAttachments = async (postId) => {
  if (!postId) {
    throw new Error("Post ID is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/attachments`,
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch attachments",
    );
  }

  return data;
};

export const deletePostAttachment = async (
  attachmentId,
) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "You must be logged in to delete an attachment",
    );
  }

  if (!attachmentId) {
    throw new Error("Attachment ID is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/attachments/${attachmentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete attachment",
    );
  }

  return data;
};