import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const getFields = async () => {
  const response = await fetch(`${API_BASE_URL}/fields`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch fields");
  }

  return data;
};

export const createField = async (fieldData) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/fields`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fieldData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create field");
  }

  return data;
};