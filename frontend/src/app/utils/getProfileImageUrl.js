import API_BASE_URL from "../services/api";

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/default-profile.png";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${API_BASE_URL.replace("/api", "")}${imagePath}`;
};