const configuredApiUrl = import.meta.env.VITE_API_URL;

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is not configured");
}

export const API_ORIGIN = configuredApiUrl.replace(/\/$/, "");

const API_BASE_URL = `${API_ORIGIN}/api`;

export default API_BASE_URL;
