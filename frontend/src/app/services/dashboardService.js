import API_BASE_URL from "./api";
import { getToken } from "./authService";

export const getDashboardSummary = async () => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard summary");
  }

  return data;
};