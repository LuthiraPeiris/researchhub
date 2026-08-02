import API_BASE_URL from "../services/api";

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/default-profile.png";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

  if (imagePath.startsWith("/uploads")) {
    return `${apiOrigin}${imagePath}`;
  }

  return `${apiOrigin}/uploads/s3/${imagePath}`;
};
