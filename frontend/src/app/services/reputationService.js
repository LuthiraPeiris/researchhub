import API_BASE_URL from "./api";

export const getLeaderboard = async (timeframe = "all") => {
  const response = await fetch(
    `${API_BASE_URL}/reputation/leaderboard?timeframe=${timeframe}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch leaderboard");
  }

  return data;
};

export const getUserReputation = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/reputation/user/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user reputation");
  }

  return data;
};