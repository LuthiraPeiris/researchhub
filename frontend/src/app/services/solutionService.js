import API_BASE_URL from "./api";
import { getToken } from "./authService";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getAuthOnlyHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSolutionsByPost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/solutions`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch solutions");
  }

  return data;
};

export const addSolution = async (postId, solutionText, solutionFiles = []) => {
  const formData = new FormData();

  formData.append("solution_text", solutionText);

  solutionFiles.forEach((file) => {
    formData.append("solution_files", file);
  });

  const response = await fetch(`${API_BASE_URL}/posts/${postId}/solutions`, {
    method: "POST",
    headers: getAuthOnlyHeaders(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit solution");
  }

  return data;
};

export const verifySolution = async (solutionId) => {
  const response = await fetch(
    `${API_BASE_URL}/solutions/${solutionId}/verify`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify solution");
  }

  return data;
};

export const deleteSolution = async (solutionId) => {
  const response = await fetch(`${API_BASE_URL}/solutions/${solutionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete solution");
  }

  return data;
};

export const toggleSolutionLike = async (solutionId) => {
  const response = await fetch(`${API_BASE_URL}/solutions/${solutionId}/like`, {
    method: "POST",
    headers: getAuthOnlyHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to like solution");
  }

  return data;
};

export const deleteSolutionAttachment = async (attachmentId) => {
  const response = await fetch(
    `${API_BASE_URL}/solution-attachments/${attachmentId}`,
    {
      method: "DELETE",
      headers: getAuthOnlyHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete solution attachment");
  }

  return data;
};