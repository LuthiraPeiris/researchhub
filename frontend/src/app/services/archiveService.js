import API_BASE_URL from "./api";

export const getArchiveItems = async () => {
  const response = await fetch(`${API_BASE_URL}/archive`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch archive");
  }

  return data;
};

export const getArchiveItemById = async (archiveId) => {
  const response = await fetch(`${API_BASE_URL}/archive/${archiveId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch archive item");
  }

  return data;
};